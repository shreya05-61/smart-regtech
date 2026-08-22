import { useState } from "react";
import "./DigiLockerSandbox.css";

const MOCK_PROFILE = {
  name: "Rohan Verma",
  dob: "15/06/2004",
  gender: "Male",
  address: "Chennai, Tamil Nadu",
  board: "CBSE",
  qualification: "Class XII",
};

function DigiLockerSandbox() {
  const [consent, setConsent] = useState(false);
  const [processing, setProcessing] = useState(false);

  const approve = () => {
    if (!consent) {
      alert("Please provide consent to continue.");
      return;
    }

    setProcessing(true);

    setTimeout(() => {
      const result = {
        type: "DIGILOCKER_SANDBOX_SUCCESS",
        profile: {
          source: "DigiLocker Sandbox / Mock Connector",
          document: "Aadhaar Profile",
          verifiedAt: new Date().toISOString(),
          ...MOCK_PROFILE,
          photo: "RV",
          documentStatus: "Digitally verified",
        },
      };

      if (window.opener && !window.opener.closed) {
        window.opener.postMessage(result, window.location.origin);
        setTimeout(() => window.close(), 700);
      } else {
        localStorage.setItem(
          "DIGILOCKER_SANDBOX_RESULT",
          JSON.stringify(result)
        );
        window.location.hash = "";
      }
    }, 1600);
  };

  return (
    <div className="dl-sandbox-page">
      <div className="dl-topbar">
        <div className="dl-government">
          <span className="dl-emblem">भारत</span>
          <span>Government of India</span>
        </div>
        <div className="dl-top-right">Sandbox Environment</div>
      </div>

      <header className="dl-header">
        <div className="dl-logo-area">
          <div className="dl-logo-icon">☁</div>
          <div>
            <div className="dl-logo-text">DigiLocker</div>
            <div className="dl-logo-subtitle">
              Document Wallet to Empower Citizens
            </div>
          </div>
        </div>
        <div className="dl-security">🔒 Secure Connection</div>
      </header>

      <main className="dl-main">
        <div className="dl-breadcrumb">
          DigiLocker Sandbox &nbsp; / &nbsp; Authorization
        </div>

        <div className="dl-card">
          <div className="dl-card-header">
            <div className="dl-provider-icon">SR</div>
            <div>
              <div className="dl-request-label">AUTHORIZATION REQUEST</div>
              <h1>SmartRegTech</h1>
              <p>Digital Registration &amp; Compliance Portal</p>
            </div>
            <div className="dl-demo-badge">SANDBOX</div>
          </div>

          <div className="dl-divider" />

          <section className="dl-request-section">
            <div className="dl-lock-icon">🔐</div>
            <h2>Allow SmartRegTech to access your documents?</h2>
            <p className="dl-description">
              SmartRegTech is requesting permission to retrieve verified
              information from the DigiLocker Sandbox for registration.
            </p>
          </section>

          <div className="dl-user-card">
            <div className="dl-user-avatar">RV</div>
            <div>
              <span className="dl-user-label">VERIFIED IDENTITY</span>
              <strong>Rohan Verma</strong>
              <small>Aadhaar identity verified</small>
            </div>
            <div className="dl-verified">✓ VERIFIED</div>
          </div>

          <section className="dl-information">
            <h3>Information SmartRegTech wants to access</h3>
            <div className="dl-info-grid">
              <InfoItem label="Full Name" value={MOCK_PROFILE.name} />
              <InfoItem label="Date of Birth" value={MOCK_PROFILE.dob} />
              <InfoItem label="Gender" value={MOCK_PROFILE.gender} />
              <InfoItem label="Address" value={MOCK_PROFILE.address} />
              <InfoItem label="Education" value={MOCK_PROFILE.qualification} />
              <InfoItem label="Board" value={MOCK_PROFILE.board} />
            </div>
          </section>

          <label className="dl-consent">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />
            <span>
              I consent to share the above information with SmartRegTech for
              registration purposes.
            </span>
          </label>

          <div className="dl-actions">
            <button
              className="dl-cancel"
              onClick={() => window.close()}
              disabled={processing}
            >
              Cancel
            </button>
            <button
              className="dl-continue"
              onClick={approve}
              disabled={processing}
            >
              {processing ? "Authorizing..." : "Allow & Continue"}
              {!processing && <span>→</span>}
            </button>
          </div>

          <div className="dl-footer-note">
            🔒 Your information is shared securely.
            <br />
            <span>
              DigiLocker Sandbox / Prototype — no real government account or
              Aadhaar data is accessed.
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="dl-info-item">
      <span>✓</span>
      <div>
        <strong>{label}</strong>
        <small>{value}</small>
      </div>
    </div>
  );
}

export default DigiLockerSandbox;