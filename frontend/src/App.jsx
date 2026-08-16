import { useState } from "react";
import "./App.css";
import AdminAnalytics from "./AdminAnalytics";

const API_URL = "https://smart-regtech.onrender.com";

const DEMO_IDENTITY = "999988887777";

const programs = [
  "B.A. LL.B (Honours) – Law Admissions (SLAT 2026)",
  "B.B.A. LL.B (Honours) – Corporate Law Track",
  "BBA (Bachelor of Business Administration)",
  "B.Tech (Computer Science & AI Engineering)",
  "B.Tech – Information Technology",
  "B.Tech – Cyber Security",
  "B.Tech – Data Science",
  "B.Tech – Electronics & Communication Engineering",
  "B.Tech – Mechanical Engineering",
  "B.Tech – Artificial Intelligence & Machine Learning",
  "BCA – Bachelor of Computer Applications",
  "MCA – Master of Computer Applications",
  "MBA – Master of Business Administration",
  "B.Com – Bachelor of Commerce",
  "B.Sc – Computer Science",
];

/* ============================================================
   PROGRAM FEES
   ============================================================ */

const PROGRAM_FEES = {
  "B.A. LL.B (Honours) – Law Admissions (SLAT 2026)": 500,
  "B.B.A. LL.B (Honours) – Corporate Law Track": 750,
  "BBA (Bachelor of Business Administration)": 600,
  "B.Tech (Computer Science & AI Engineering)": 1000,
  "B.Tech – Information Technology": 900,
  "B.Tech – Cyber Security": 950,
  "B.Tech – Data Science": 950,
  "B.Tech – Electronics & Communication Engineering": 850,
  "B.Tech – Mechanical Engineering": 800,
  "B.Tech – Artificial Intelligence & Machine Learning": 1000,
  "BCA – Bachelor of Computer Applications": 550,
  "MCA – Master of Computer Applications": 800,
  "MBA – Master of Business Administration": 1200,
  "B.Com – Bachelor of Commerce": 500,
  "B.Sc – Computer Science": 550,
};

/* ============================================================
   AI COPILOT
============================================================ */

function getCopilotAnswer(question) {
  const q = question.toLowerCase();

  if (
    q.includes("digilocker") ||
    q.includes("verification")
  ) {
    return "Identity verification is performed through the DigiLocker mock service in this prototype. Use the demo identity number shown on the verification page. After successful verification, the system retrieves the demo name, date of birth, gender and address.";
  }

  if (q.includes("document")) {
    return "For this prototype, verified identity details are retrieved automatically. You only need to provide the remaining mandatory information such as mobile number, email and program.";
  }

  if (q.includes("payment") || q.includes("fee") || q.includes("amount")) {
    return "Payment is handled through a sandbox environment in this prototype. The registration fee is automatically selected based on the program you choose. No real money is charged. After registration is submitted, the sandbox payment updates your application to Paid and Successful.";
  }

  if (
    q.includes("process") ||
    q.includes("registration") ||
    q.includes("complete")
  ) {
    return "The registration process is: 1. Verify your identity using the demo DigiLocker verification. 2. Complete the missing mandatory details. 3. Review your application. 4. Complete the sandbox payment. 5. Receive your registration ID and download the receipt.";
  }

  if (
    q.includes("receipt") ||
    q.includes("download")
  ) {
    return "After successful payment, your registration ID is displayed on the success page. Click Download Receipt to save your SmartRegTech registration receipt.";
  }

  if (
    q.includes("status") ||
    q.includes("application")
  ) {
    return "Your application status can be viewed through the Admin Analytics dashboard. The dashboard retrieves registration records directly from the SmartRegTech FastAPI backend.";
  }

  return "I can help you with registration, DigiLocker verification, documents, payment, application status and receipt download. Try asking about one of these topics.";
}


/* ============================================================
   AI COPILOT
============================================================ */

function AICopilot({ onClose }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text:
        "Hi! 👋 I'm the SmartRegTech Copilot. I can help with registration, identity verification, documents, payment, application status and receipt download.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (customQuestion = null) => {
    const trimmed = (
      customQuestion ?? input
    ).trim();

    if (!trimmed || loading) return;

    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        text: trimmed,
      },
    ]);

    setInput("");
    setLoading(true);

    await new Promise((resolve) =>
      setTimeout(resolve, 350)
    );

    const answer = getCopilotAnswer(trimmed);

    setMessages((previous) => [
      ...previous,
      {
        role: "assistant",
        text: answer,
      },
    ]);

    setLoading(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="copilot-overlay">
      <div className="copilot-panel">

        <div className="copilot-header">

          <div className="copilot-brand">
            <div className="copilot-avatar">
              AI
            </div>

            <div>
              <div className="copilot-title">
                SmartRegTech Copilot
              </div>

              <div className="copilot-subtitle">
                Registration Assistant
              </div>
            </div>
          </div>

          <button
            className="copilot-close"
            onClick={onClose}
          >
            ×
          </button>

        </div>


        <div className="copilot-messages">

          {messages.map((message, index) => (
            <div
              key={index}
              className={`copilot-message ${
                message.role === "user"
                  ? "copilot-user"
                  : "copilot-assistant"
              }`}
            >
              {message.text}
            </div>
          ))}

          {loading && (
            <div className="copilot-message copilot-assistant">
              Thinking...
            </div>
          )}

        </div>


        <div className="copilot-suggestions">

          <button
            onClick={() =>
              sendMessage(
                "What is DigiLocker verification?"
              )
            }
          >
            DigiLocker
          </button>

          <button
            onClick={() =>
              sendMessage(
                "What documents do I need?"
              )
            }
          >
            Documents
          </button>

          <button
            onClick={() =>
              sendMessage(
                "How does payment work?"
              )
            }
          >
            Payment
          </button>

          <button
            onClick={() =>
              sendMessage(
                "What is the registration process?"
              )
            }
          >
            Process
          </button>

        </div>


        <div className="copilot-input-row">

          <input
            type="text"
            placeholder="Ask SmartRegTech Copilot..."
            value={input}
            onChange={(event) =>
              setInput(event.target.value)
            }
            onKeyDown={handleKeyDown}
            disabled={loading}
          />

          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
          >
            {loading ? "..." : "Send"}
          </button>

        </div>


        <div className="copilot-note">
          SmartRegTech Copilot provides guidance for this prototype.
        </div>

      </div>
    </div>
  );
}


/* ============================================================
   MAIN APP
============================================================ */

function App() {
  const [step, setStep] = useState("home");

  const [showCopilot, setShowCopilot] =
    useState(false);

  const [registrationId, setRegistrationId] =
    useState("");

  const [processingPayment, setProcessingPayment] =
    useState(false);

  const [formData, setFormData] = useState({
    identity: "",
    mobile: "",
    email: "",
    program: programs[0],
  });

  // Fee automatically changes when the selected program changes.
  const currentFee = PROGRAM_FEES[formData.program] || 500;


  /* ============================================================
     HELPERS
  ============================================================ */

  const updateField = (field, value) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };


  const startRegistration = () => {
    setStep("identity");
  };


  const openAdmin = () => {
    setStep("admin");
  };


  const goHome = () => {
    setStep("home");
  };


  /* ============================================================
     IDENTITY VERIFICATION
  ============================================================ */

  const verifyIdentity = () => {
    if (formData.identity !== DEMO_IDENTITY) {
      alert(
        `Please use the demo identity number shown on the page:\n${DEMO_IDENTITY}`
      );

      return;
    }

    setStep("verified");
  };


  const continueToForm = () => {
    setStep("form");
  };


  /* ============================================================
     FORM VALIDATION
  ============================================================ */

  const continueToReview = () => {
    if (!/^[0-9]{10}$/.test(formData.mobile)) {
      alert(
        "Please enter a valid 10-digit mobile number."
      );

      return;
    }

    if (
      !formData.email ||
      !formData.email.includes("@")
    ) {
      alert(
        "Please enter a valid email address."
      );

      return;
    }

    setStep("review");
  };


  const continueToPayment = () => {
    setStep("payment");
  };


  /* ============================================================
     REGISTER + PAYMENT
  ============================================================ */

  const completePayment = async () => {
    if (processingPayment) return;

    setProcessingPayment(true);

    try {
      let currentRegistrationId =
        registrationId;


      if (!currentRegistrationId) {
        const registerResponse =
          await fetch(
            `${API_URL}/api/register`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                name: "Rohan Verma",
                email: formData.email,
                phone: formData.mobile,
                program:
                  getShortProgramName(
                    formData.program
                  ),
              }),
            }
          );


        if (!registerResponse.ok) {
          throw new Error(
            "Registration request failed."
          );
        }


        const registerData =
          await registerResponse.json();


        if (!registerData.success) {
          throw new Error(
            registerData.message ||
            "Registration failed."
          );
        }


        currentRegistrationId =
          registerData.registration_id;


        setRegistrationId(
          currentRegistrationId
        );
      }


      const paymentResponse =
        await fetch(
          `${API_URL}/api/payment/${currentRegistrationId}`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              amount: currentFee,
              program: getShortProgramName(formData.program),
            }),
          }
        );


      if (!paymentResponse.ok) {
        throw new Error(
          "Payment request failed."
        );
      }


      const paymentData =
        await paymentResponse.json();


      if (!paymentData.success) {
        throw new Error(
          paymentData.message ||
          "Payment failed."
        );
      }


      setStep("success");

    } catch (error) {

      console.error(error);

      alert(
        "Something went wrong while connecting to the backend.\n\n" +
        "Please make sure the FastAPI server is running on port 8000."
      );

    } finally {

      setProcessingPayment(false);

    }
  };


  /* ============================================================
     RECEIPT
  ============================================================ */

  const downloadReceipt = () => {

    const receiptHTML = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>SmartRegTech Registration Receipt</title>

<style>

body {
  font-family: Arial, sans-serif;
  background: #f4f5fb;
  margin: 0;
  padding: 40px;
  color: #182033;
}

.receipt {
  max-width: 700px;
  margin: auto;
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
}

.header {
  text-align: center;
  border-bottom: 2px solid #6c4cff;
  padding-bottom: 20px;
  margin-bottom: 25px;
}

.logo {
  font-size: 30px;
  font-weight: bold;
  color: #6c4cff;
}

.subtitle {
  color: #666;
  margin-top: 5px;
}

.success {
  text-align: center;
  color: #159957;
  font-size: 20px;
  font-weight: bold;
  margin: 20px 0;
}

.registration-id {
  text-align: center;
  background: #f0edff;
  padding: 18px;
  border-radius: 10px;
  margin: 25px 0;
}

.registration-id strong {
  display: block;
  font-size: 24px;
  color: #6c4cff;
  margin-top: 8px;
}

.row {
  display: flex;
  justify-content: space-between;
  gap: 30px;
  padding: 14px 0;
  border-bottom: 1px solid #e5e5e5;
}

.label {
  color: #666;
}

.value {
  font-weight: bold;
  text-align: right;
}

.footer {
  margin-top: 30px;
  text-align: center;
  font-size: 13px;
  color: #777;
}

</style>
</head>

<body>

<div class="receipt">

  <div class="header">
    <div class="logo">
      SmartRegTech
    </div>

    <div class="subtitle">
      Zero-Friction Registration Portal
    </div>
  </div>


  <div class="success">
    ✓ REGISTRATION SUCCESSFUL
  </div>


  <div class="registration-id">

    Registration ID

    <strong>
      ${registrationId}
    </strong>

  </div>


  <div class="row">

    <span class="label">
      Applicant Name
    </span>

    <span class="value">
      Rohan Verma
    </span>

  </div>


  <div class="row">

    <span class="label">
      Identity Verification
    </span>

    <span class="value">
      DigiLocker Verified (Mock)
    </span>

  </div>


  <div class="row">

    <span class="label">
      Mobile Number
    </span>

    <span class="value">
      ${formData.mobile}
    </span>

  </div>


  <div class="row">

    <span class="label">
      Email
    </span>

    <span class="value">
      ${formData.email}
    </span>

  </div>


  <div class="row">

    <span class="label">
      Program
    </span>

    <span class="value">
      ${formData.program}
    </span>

  </div>


  <div class="row">

    <span class="label">
      Registration Fee
    </span>

    <span class="value">
      ₹${currentFee.toLocaleString("en-IN")}
    </span>

  </div>


  <div class="row">

    <span class="label">
      Payment Status
    </span>

    <span class="value">
      Paid — Sandbox
    </span>

  </div>


  <div class="row">

    <span class="label">
      Application Status
    </span>

    <span class="value">
      Registration Successful
    </span>

  </div>


  <div class="row">

    <span class="label">
      Date
    </span>

    <span class="value">
      ${new Date().toLocaleDateString()}
    </span>

  </div>


  <div class="footer">

    This receipt was generated by the SmartRegTech prototype.

    <br />

    DigiLocker and payment integrations are simulated
    for demonstration purposes.

  </div>

</div>

</body>
</html>
`;

    const blob = new Blob(
      [receiptHTML],
      {
        type: "text/html",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      "SmartRegTech_Registration_Receipt.html";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };


  /* ============================================================
     ADMIN
  ============================================================ */

  if (step === "admin") {

    return (
      <div>

        <AdminAnalytics />

        <div className="admin-return">

          <button
            className="back-button"
            onClick={goHome}
          >
            ← Return to Registration Portal
          </button>

        </div>

      </div>
    );
  }


  /* ============================================================
     HOME
  ============================================================ */

  if (step === "home") {

    return (

      <div className="app">

        <header className="navbar">

          <div
            className="brand"
            onClick={goHome}
          >

            <div className="brand-mark">
              SR
            </div>

            <div>

              <h2>
                SmartRegTech
              </h2>

              <p>
                Digital Registration & Compliance
              </p>

            </div>

          </div>


          <div className="nav-buttons">

            <button
              className="nav-button secondary"
              onClick={() =>
                setShowCopilot(true)
              }
            >
              <span>✦</span>
              AI Copilot
            </button>


            <button
              className="nav-button"
              onClick={openAdmin}
            >
              <span>▦</span>
              Admin Analytics
            </button>

          </div>

        </header>


        <main className="home-main">

          <section className="hero-section">

            <div className="hero-content">

              <div className="hero-badge">
                <span className="live-dot"></span>
                Digital Registration Platform
              </div>


              <h1>
                Register smarter.
                <br />

                <span>
                  Skip the paperwork.
                </span>
              </h1>


              <p className="hero-description">

                A secure digital registration platform
                that verifies identity, reduces repetitive
                form filling and streamlines the complete
                registration journey.

              </p>


              <div className="hero-actions">

                <button
                  className="primary-button"
                  onClick={startRegistration}
                >
                  Start Registration
                  <span>→</span>
                </button>


                <button
                  className="outline-button"
                  onClick={() =>
                    setShowCopilot(true)
                  }
                >
                  Ask AI Copilot
                </button>

              </div>


              <div className="trust-row">

                <div>
                  <span className="trust-icon">
                    ✓
                  </span>
                  Identity verification
                </div>

                <div>
                  <span className="trust-icon">
                    ✓
                  </span>
                  Smart forms
                </div>

                <div>
                  <span className="trust-icon">
                    ✓
                  </span>
                  Digital receipt
                </div>

              </div>

            </div>


            <div className="hero-visual">

              <div className="visual-glow"></div>

              <div className="registration-preview">

                <div className="preview-top">

                  <div className="preview-brand">
                    <div className="mini-mark">
                      SR
                    </div>

                    <span>
                      SmartRegTech
                    </span>
                  </div>

                  <span className="secure-label">
                    SECURE
                  </span>

                </div>


                <div className="preview-title">
                  Registration Status
                </div>


                <div className="preview-status">
                  <div className="status-check">
                    ✓
                  </div>

                  <div>
                    <strong>
                      Identity Verified
                    </strong>

                    <span>
                      DigiLocker verification complete
                    </span>
                  </div>
                </div>


                <div className="preview-lines">

                  <div>
                    <span>
                      Application
                    </span>

                    <strong>
                      Ready
                    </strong>
                  </div>

                  <div>
                    <span>
                      Program
                    </span>

                    <strong>
                      B.Tech
                    </strong>
                  </div>

                  <div>
                    <span>
                      Payment
                    </span>

                    <strong className="green-text">
                      Verified
                    </strong>
                  </div>

                </div>


                <div className="preview-progress">

                  <div className="preview-progress-label">
                    <span>
                      Registration progress
                    </span>

                    <strong>
                      80%
                    </strong>
                  </div>

                  <div className="preview-track">
                    <div className="preview-fill"></div>
                  </div>

                </div>

              </div>

            </div>

          </section>


          <section className="feature-section">

            <div className="section-heading">

              <span>
                PLATFORM CAPABILITIES
              </span>

              <h2>
                Everything you need for
                <br />
                a smoother registration experience.
              </h2>

            </div>


            <div className="feature-grid">

              <FeatureCard
                icon="◈"
                title="Secure Verification"
                text="Verify applicant identity through a controlled DigiLocker mock workflow."
              />

              <FeatureCard
                icon="✦"
                title="AI Copilot Assist"
                text="Get contextual guidance throughout the registration process."
              />

              <FeatureCard
                icon="⌁"
                title="Smart Forms"
                text="Automatically reduce repetitive information entry after verification."
              />

              <FeatureCard
                icon="▦"
                title="Admin Analytics"
                text="Monitor applications, verification, payments and program activity."
              />

            </div>

          </section>


          <section className="how-section">

            <div className="section-heading centered">

              <span>
                SIMPLE WORKFLOW
              </span>

              <h2>
                From verification to registration
                <br />
                in a few simple steps.
              </h2>

            </div>


            <div className="workflow-grid">

              <WorkflowStep
                number="01"
                title="Verify Identity"
                text="Complete the demo DigiLocker identity verification."
              />

              <WorkflowStep
                number="02"
                title="Complete Details"
                text="Enter only the information that is still required."
              />

              <WorkflowStep
                number="03"
                title="Review & Pay"
                text="Review your application and complete the sandbox payment."
              />

              <WorkflowStep
                number="04"
                title="Get Registration ID"
                text="Receive your registration ID and download the receipt."
              />

            </div>

          </section>

        </main>


        <footer className="home-footer">

          <div>
            © 2026 SmartRegTech Prototype
          </div>

          <div>
            Digital Registration • Compliance • Analytics
          </div>

        </footer>


        {showCopilot && (

          <AICopilot
            onClose={() =>
              setShowCopilot(false)
            }
          />

        )}

      </div>
    );
  }


  /* ============================================================
     IDENTITY
  ============================================================ */

  if (step === "identity") {

    return (

      <Page
        currentStep="identity"
        onHome={goHome}
        onCopilot={() =>
          setShowCopilot(true)
        }
      >

        <div className="form-layout">

          <div className="form-intro">

            <div className="step-label">
              STEP 01 / IDENTITY
            </div>

            <h1>
              Let's verify your identity.
            </h1>

            <p className="description">
              Enter the demo identity number to
              retrieve your verified profile details.
            </p>


            <div className="security-points">

              <div>
                <span>✓</span>
                Secure verification workflow
              </div>

              <div>
                <span>✓</span>
                Automatic profile retrieval
              </div>

              <div>
                <span>✓</span>
                Reduced repetitive data entry
              </div>

            </div>

          </div>


          <div className="form-panel">

            <div className="panel-heading">

              <div className="panel-icon">
                ◈
              </div>

              <div>

                <h2>
                  Identity Verification
                </h2>

                <p>
                  DigiLocker / UIDAI mock service
                </p>

              </div>

            </div>


            <div className="warning">

              <span>!</span>

              <div>

                <strong>
                  Prototype Demo
                </strong>

                <p>
                  Do not enter real Aadhaar details.
                  Use the demo identity number below.
                </p>

              </div>

            </div>


            <div className="form-group">

              <label>
                AADHAAR / IDENTITY NUMBER
              </label>

              <input
                type="text"
                placeholder="XXXX XXXX XXXX"
                maxLength="12"
                value={formData.identity}
                onChange={(event) =>
                  updateField(
                    "identity",
                    event.target.value.replace(
                      /\D/g,
                      ""
                    )
                  )
                }
              />

            </div>


            <div className="demo-number">

              <span>
                Demo identity
              </span>

              <strong>
                {DEMO_IDENTITY}
              </strong>

              <button
                type="button"
                onClick={() =>
                  updateField(
                    "identity",
                    DEMO_IDENTITY
                  )
                }
              >
                Use demo
              </button>

            </div>


            <button
              className="primary-button full"
              onClick={verifyIdentity}
            >
              Verify Identity
              <span>→</span>
            </button>


            <button
              className="back-button"
              onClick={goHome}
            >
              ← Back to Home
            </button>

          </div>

        </div>


        {showCopilot && (
          <AICopilot
            onClose={() =>
              setShowCopilot(false)
            }
          />
        )}

      </Page>
    );
  }


  /* ============================================================
     VERIFIED
  ============================================================ */

  if (step === "verified") {

    return (

      <Page
        currentStep="identity"
        onHome={goHome}
      >

        <div className="verification-result">

          <div className="verified-icon">
            ✓
          </div>


          <div className="success-badge">
            IDENTITY VERIFIED
          </div>


          <h1>
            We found your details.
          </h1>


          <p className="description center-text">

            Retrieved securely through

            <strong>
              {" "}DigiLocker Verified
              {" "}
            </strong>

            <span className="mock-label">
              UIDAI MOCK
            </span>

          </p>


          <div className="verified-card">

            <div className="verified-card-header">

              <div>

                <span>
                  VERIFIED PROFILE
                </span>

                <h3>
                  Applicant Information
                </h3>

              </div>

              <div className="verified-pill">
                ✓ Verified
              </div>

            </div>


            <div className="verified-grid">

              <VerifiedField
                label="Full Name"
                value="Rohan Verma"
              />

              <VerifiedField
                label="Date of Birth"
                value="15/06/2004"
              />

              <VerifiedField
                label="Gender"
                value="Male"
              />

              <VerifiedField
                label="Address"
                value="Chennai, Tamil Nadu"
              />

            </div>

          </div>


          <div className="info-box">

            <span>✦</span>

            <div>

              <strong>
                Smart form activated
              </strong>

              <p>
                Your verified details have been
                automatically carried forward.
              </p>

            </div>

          </div>


          <button
            className="primary-button"
            onClick={continueToForm}
          >
            Continue to Registration
            <span>→</span>
          </button>

        </div>

      </Page>
    );
  }


  /* ============================================================
     FORM
  ============================================================ */

  if (step === "form") {

    return (

      <Page
        currentStep="details"
        onHome={goHome}
      >

        <div className="form-layout">

          <div className="form-intro">

            <div className="step-label">
              STEP 02 / DETAILS
            </div>

            <h1>
              Only the essentials remain.
            </h1>

            <p className="description">
              Your verified identity details are
              already available. Complete the remaining
              information below.
            </p>


            <div className="verified-summary">

              <div className="mini-verified">
                ✓
              </div>

              <div>

                <strong>
                  Rohan Verma
                </strong>

                <span>
                  Identity verified
                </span>

              </div>

            </div>

          </div>


          <div className="form-panel">

            <div className="panel-heading">

              <div className="panel-icon">
                ✦
              </div>

              <div>

                <h2>
                  Registration Details
                </h2>

                <p>
                  Complete the required fields.
                </p>

              </div>

            </div>


            <div className="form-group">

              <label>
                MOBILE NUMBER
              </label>

              <input
                type="tel"
                maxLength="10"
                placeholder="Enter 10-digit mobile number"
                value={formData.mobile}
                onChange={(event) =>
                  updateField(
                    "mobile",
                    event.target.value.replace(
                      /\D/g,
                      ""
                    )
                  )
                }
              />

            </div>


            <div className="form-group">

              <label>
                EMAIL ADDRESS
              </label>

              <input
                type="email"
                placeholder="yourname@example.com"
                value={formData.email}
                onChange={(event) =>
                  updateField(
                    "email",
                    event.target.value
                  )
                }
              />

            </div>


            <div className="form-group">

              <label>
                PROGRAM / COURSE
              </label>

              <select
                value={formData.program}
                onChange={(event) =>
                  updateField(
                    "program",
                    event.target.value
                  )
                }
              >

                {programs.map((program) => (

                  <option
                    key={program}
                    value={program}
                  >
                    {program}
                  </option>

                ))}

              </select>

            </div>


            <button
              className="primary-button full"
              onClick={continueToReview}
            >
              Review Application
              <span>→</span>
            </button>


            <button
              className="back-button"
              onClick={() =>
                setStep("verified")
              }
            >
              ← Back
            </button>

          </div>

        </div>

      </Page>
    );
  }


  /* ============================================================
     REVIEW
  ============================================================ */

  if (step === "review") {

    return (

      <Page
        currentStep="review"
        onHome={goHome}
      >

        <div className="review-page">

          <div className="step-label">
            STEP 03 / REVIEW
          </div>

          <h1>
            Review your application.
          </h1>

          <p className="description">
            Everything looks ready. Check the details
            below before proceeding to payment.
          </p>


          <div className="review-grid">

            <div className="review-card">

              <div className="review-card-title">

                <span className="review-icon">
                  ✓
                </span>

                <div>

                  <h2>
                    Verified Information
                  </h2>

                  <span>
                    Retrieved through DigiLocker
                  </span>

                </div>

              </div>


              <ReviewRow
                label="Applicant Name"
                value="Rohan Verma"
                verified
              />

              <ReviewRow
                label="Identity"
                value="Verified"
                verified
              />

              <ReviewRow
                label="Date of Birth"
                value="15/06/2004"
                verified
              />

            </div>


            <div className="review-card">

              <div className="review-card-title">

                <span className="review-icon purple">
                  +
                </span>

                <div>

                  <h2>
                    Registration Details
                  </h2>

                  <span>
                    Information provided by applicant
                  </span>

                </div>

              </div>


              <ReviewRow
                label="Mobile"
                value={formData.mobile}
              />

              <ReviewRow
                label="Email"
                value={formData.email}
              />

              <ReviewRow
                label="Program"
                value={formData.program}
              />

            </div>

          </div>


          <div className="ready-banner">

            <div className="ready-icon">
              ✓
            </div>

            <div>

              <strong>
                Ready for payment
              </strong>

              <p>
                Your application is complete and
                ready to be submitted.
              </p>

            </div>

          </div>


          <div className="review-actions">

            <button
              className="back-button"
              onClick={() =>
                setStep("form")
              }
            >
              ← Edit Details
            </button>

            <button
              className="primary-button"
              onClick={continueToPayment}
            >
              Continue to Payment
              <span>→</span>
            </button>

          </div>

        </div>

      </Page>
    );
  }


  /* ============================================================
     PAYMENT
  ============================================================ */

  if (step === "payment") {

    return (

      <Page
        currentStep="payment"
        onHome={goHome}
      >

        <div className="payment-page">

          <div className="step-label">
            STEP 04 / PAYMENT
          </div>

          <h1>
            Complete your payment.
          </h1>

          <p className="description">
            This is a simulated payment environment
            for the SmartRegTech prototype.
          </p>


          <div className="payment-layout">

            <div className="payment-card">

              <div className="payment-card-top">

                <div>

                  <span>
                    REGISTRATION FEE
                  </span>

                  <h2>
                    ₹{currentFee.toLocaleString("en-IN")}
                  </h2>

                </div>

                <div className="sandbox-pill">
                  SANDBOX
                </div>

              </div>


              <div className="payment-divider"></div>


              <div className="payment-detail">

                <span>
                  Applicant
                </span>

                <strong>
                  Rohan Verma
                </strong>

              </div>


              <div className="payment-detail">

                <span>
                  Program
                </span>

                <strong>
                  {getShortProgramName(
                    formData.program
                  )}
                </strong>

              </div>


              <div className="payment-detail">

                <span>
                  Identity
                </span>

                <strong className="green-text">
                  ✓ Verified
                </strong>

              </div>


              <div className="payment-total">

                <span>
                  Total payable
                </span>

                <strong>
                  ₹{currentFee.toLocaleString("en-IN")}
                </strong>

              </div>

            </div>


            <div className="payment-info">

              <div className="payment-info-icon">
                ⚡
              </div>

              <h3>
                Fast & simple
              </h3>

              <p>
                Complete the sandbox transaction to
                submit your registration.
              </p>

              <div className="sandbox-warning">
                <strong>
                  Selected Program
                </strong>

                <span>
                  {getShortProgramName(formData.program)}
                </span>
              </div>

              <div className="sandbox-warning">
                <strong>
                  Registration Fee
                </strong>

                <span>
                  ₹{currentFee.toLocaleString("en-IN")}
                </span>
              </div>


              <div className="sandbox-warning">

                <strong>
                  Demo Environment
                </strong>

                <span>
                  No real money will be charged.
                </span>

              </div>

            </div>

          </div>


          <div className="payment-actions">

            <button
              className="back-button"
              onClick={() =>
                setStep("review")
              }
              disabled={processingPayment}
            >
              ← Back
            </button>


            <button
              className="primary-button"
              onClick={completePayment}
              disabled={processingPayment}
            >
              {processingPayment
                ? "Processing..."
                : `Pay ₹${currentFee.toLocaleString("en-IN")} (Sandbox)`}

              {!processingPayment && (
                <span>→</span>
              )}

            </button>

          </div>

        </div>

      </Page>
    );
  }


  /* ============================================================
     SUCCESS
  ============================================================ */

  if (step === "success") {

    return (

      <Page
        currentStep="complete"
        onHome={goHome}
      >

        <div className="success-page">

          <div className="success-large-icon">
            ✓
          </div>


          <div className="success-badge">
            REGISTRATION SUCCESSFUL
          </div>


          <h1>
            You're all set.
          </h1>


          <p className="description">
            Your registration has been successfully
            completed and recorded.
          </p>


          <div className="registration-id-card">

            <span>
              YOUR REGISTRATION ID
            </span>

            <strong>
              {registrationId}
            </strong>

            <small>
              Keep this ID for future reference.
            </small>

          </div>


          <div className="success-summary">

            <div>
              <span>Applicant</span>
              <strong>Rohan Verma</strong>
            </div>

            <div>
              <span>Verification</span>
              <strong className="green-text">
                ✓ Verified
              </strong>
            </div>

            <div>
              <span>Payment</span>
              <strong className="green-text">
                ✓ Paid — ₹{currentFee.toLocaleString("en-IN")}
              </strong>
            </div>

            <div>
              <span>Status</span>
              <strong className="green-text">
                ✓ Successful
              </strong>
            </div>

          </div>


          <div className="success-actions">

            <button
              className="primary-button"
              onClick={downloadReceipt}
            >
              Download Receipt
              <span>↓</span>
            </button>


            <button
              className="back-button"
              onClick={goHome}
            >
              Return to Home
            </button>

          </div>

        </div>

      </Page>
    );
  }


  return null;
}


/* ============================================================
   PAGE WRAPPER
============================================================ */

function Page({
  children,
  currentStep,
  onHome,
  onCopilot,
}) {

  const steps = [
    {
      id: "identity",
      label: "Identity",
    },
    {
      id: "details",
      label: "Details",
    },
    {
      id: "review",
      label: "Review",
    },
    {
      id: "payment",
      label: "Payment",
    },
    {
      id: "complete",
      label: "Complete",
    },
  ];

  const currentIndex = steps.findIndex(
    (item) => item.id === currentStep
  );

  return (

    <div className="app">

      <header className="navbar">

        <div
          className="brand"
          onClick={onHome}
        >

          <div className="brand-mark">
            SR
          </div>

          <div>

            <h2>
              SmartRegTech
            </h2>

            <p>
              Digital Registration & Compliance
            </p>

          </div>

        </div>


        <div className="nav-buttons">

          {onCopilot && (
            <button
              className="nav-button secondary"
              onClick={onCopilot}
            >
              <span>✦</span>
              AI Copilot
            </button>
          )}

          <div className="secure-nav">
            <span>●</span>
            Secure Session
          </div>

        </div>

      </header>


      <div className="progress-container">

        <div className="progress-steps">

          {steps.map((item, index) => {

            const completed =
              currentIndex >= 0 &&
              index < currentIndex;

            const active =
              index === currentIndex;

            return (
              <div
                className={`progress-step ${
                  active ? "active" : ""
                } ${
                  completed ? "completed" : ""
                }`}
                key={item.id}
              >

                <div className="progress-circle">

                  {completed
                    ? "✓"
                    : index + 1}

                </div>

                <span>
                  {item.label}
                </span>

              </div>
            );

          })}

        </div>

      </div>


      <main className="page-container">

        <section className="content-card">

          {children}

        </section>

      </main>


      <footer className="app-footer">

        SmartRegTech Prototype
        <span>•</span>
        Secure Digital Registration

      </footer>

    </div>
  );
}


/* ============================================================
   FEATURE CARD
============================================================ */

function FeatureCard({
  icon,
  title,
  text,
}) {
  return (

    <div className="feature-card">

      <div className="feature-icon">
        {icon}
      </div>

      <h3>
        {title}
      </h3>

      <p>
        {text}
      </p>

      <div className="feature-arrow">
        →
      </div>

    </div>
  );
}


/* ============================================================
   WORKFLOW STEP
============================================================ */

function WorkflowStep({
  number,
  title,
  text,
}) {
  return (

    <div className="workflow-step">

      <div className="workflow-number">
        {number}
      </div>

      <h3>
        {title}
      </h3>

      <p>
        {text}
      </p>

    </div>
  );
}


/* ============================================================
   VERIFIED FIELD
============================================================ */

function VerifiedField({
  label,
  value,
}) {
  return (

    <div className="verified-field">

      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>

      <small>
        ✓ Verified
      </small>

    </div>
  );
}


/* ============================================================
   REVIEW ROW
============================================================ */

function ReviewRow({
  label,
  value,
  verified = false,
}) {
  return (

    <div className="review-row">

      <span>
        {label}
      </span>

      <strong>

        {verified && (
          <span className="tiny-check">
            ✓
          </span>
        )}

        {value}

      </strong>

    </div>
  );
}


/* ============================================================
   PROGRAM NAME HELPER
============================================================ */

function getShortProgramName(program) {

  if (program.startsWith("B.A. LL.B")) {
    return "B.A. LL.B (Honours)";
  }

  if (program.startsWith("B.B.A. LL.B")) {
    return "B.B.A. LL.B";
  }

  if (program.startsWith("BBA")) {
    return "BBA";
  }

  if (program.startsWith("BCA")) {
    return "BCA";
  }

  if (program.startsWith("MCA")) {
    return "MCA";
  }

  if (program.startsWith("MBA")) {
    return "MBA";
  }

  if (program.startsWith("B.Com")) {
    return "B.Com";
  }

  if (program.startsWith("B.Sc")) {
    return "B.Sc Computer Science";
  }

  if (
    program.startsWith(
      "B.Tech (Computer Science"
    )
  ) {
    return "B.Tech CS & AI";
  }

  if (program.startsWith("B.Tech")) {
    return program.split(" – ")[1] || "B.Tech";
  }

  return program;
}


export default App;