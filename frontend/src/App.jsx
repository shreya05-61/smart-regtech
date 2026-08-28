import { useEffect, useRef, useState } from "react";
import "./App.css";
import AdminAnalytics from "./AdminAnalytics";
import "./SmartRegTech_OTP_Popup.css";
import "./new_digilocker.css";
import "./SmartRegTech_mobile_responsive.css";

const API_BASE = "https://smart-regtech.onrender.com";
const DEMO_IDENTITY = "999988887777"; // Change to your 12-digit demo number
const DEMO_OTP = "123456";

// ============================================================
// DYNAMIC PRESET WORKFLOWS (CONFIGURABLE SEQUENCES)
// ============================================================
const PRESET_FLOWS = {
  standard: {
    name: "Standard Flow (Identity First)",
    description: "DigiLocker verification happens before form completion.",
    steps: [
      { id: "identity", label: "Identity", showInProgress: true },
      { id: "verified", label: "Verified", showInProgress: false },
      { id: "form",     label: "Details",  showInProgress: true },
      { id: "review",   label: "Review",   showInProgress: true },
      { id: "payment",  label: "Payment",  showInProgress: true },
      { id: "success",  label: "Complete", showInProgress: true },
    ],
  },
  detailsFirst: {
    name: "Enterprise Client A (Details First)",
    description: "Applicant enters details and course first, then confirms identity.",
    steps: [
      { id: "form",     label: "Details",  showInProgress: true },
      { id: "identity", label: "Identity", showInProgress: true },
      { id: "verified", label: "Verified", showInProgress: false },
      { id: "review",   label: "Review",   showInProgress: true },
      { id: "payment",  label: "Payment",  showInProgress: true },
      { id: "success",  label: "Complete", showInProgress: true },
    ],
  },
  expressPay: {
    name: "Express Client B (Fast Track Payment)",
    description: "Applicant fills details, reviews, pays, and completes identity last.",
    steps: [
      { id: "form",     label: "Details",  showInProgress: true },
      { id: "review",   label: "Review",   showInProgress: true },
      { id: "payment",  label: "Payment",  showInProgress: true },
      { id: "identity", label: "Identity", showInProgress: true },
      { id: "verified", label: "Verified", showInProgress: false },
      { id: "success",  label: "Complete", showInProgress: true },
    ],
  },
};

const MOCK_DIGILOCKER_PROFILE = {
  source: "DigiLocker Sandbox / Mock Connector",
  document: "Aadhaar Profile",
  verifiedAt: "2026-08-16T10:30:00Z",
  name: "Rohan Verma",
  dob: "15/06/2004",
  gender: "Male",
  address: "Chennai, Tamil Nadu",
  photo: "RV",
  board: "CBSE",
  qualification: "Class XII",
  documentStatus: "Digitally verified",
};

const fetchMockDigiLockerProfile = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1800));
  return { ...MOCK_DIGILOCKER_PROFILE };
};

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

function getCopilotAnswer(question) {
  const q = question.toLowerCase();

  if (q.includes("digilocker") || q.includes("verification")) {
    return "The prototype now follows a realistic DigiLocker-style flow: enter the demo 12-digit identity number, verify a demo OTP, provide consent, and then simulate a secure connector response that retrieves profile and education details. No real Aadhaar or DigiLocker account is used.";
  }
  if (q.includes("login") || q.includes("password") || q.includes("uid")) {
    return "Once your identity is verified, the system automatically generates an Application ID (UID) and Password, sending them to your registered email and WhatsApp. You can use these to log out and resume your application at any time.";
  }
  if (q.includes("cart") || q.includes("courses") || q.includes("multiple")) {
    return "You can now select one or more programs. All selected items are added to your cart, and the total fee is dynamically calculated. You can also remove items from your cart on the payment screen.";
  }
  if (q.includes("payment") || q.includes("fee") || q.includes("amount")) {
    return "Payment is handled through a sandbox environment in this prototype. The registration fee is calculated based on the items in your cart. No real money is charged.";
  }
  if (q.includes("process") || q.includes("registration") || q.includes("complete")) {
    return "The registration process is: 1. Verify your identity (UID generated). 2. Add details & select courses for your cart. 3. Review application. 4. Manage cart and complete sandbox payment. 5. Download receipt.";
  }

  return "I can help you with registration, DigiLocker verification, cart management, payment, application status, login, and receipt download. Try asking about one of these topics.";
}

function AICopilot({ onClose }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! 👋 I'm the SmartRegTech Copilot. I can help with registration, identity verification, documents, payment, application status and receipt download.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (customQuestion = null) => {
    const trimmed = (customQuestion ?? input).trim();
    if (!trimmed || loading) return;

    setMessages((previous) => [...previous, { role: "user", text: trimmed }]);
    setInput("");
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 350));
    const answer = getCopilotAnswer(trimmed);

    setMessages((previous) => [...previous, { role: "assistant", text: answer }]);
    setLoading(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") sendMessage();
  };

  return (
    <div className="copilot-overlay">
      <div className="copilot-panel">
        <div className="copilot-header">
          <div className="copilot-brand">
            <div className="copilot-avatar">AI</div>
            <div>
              <div className="copilot-title">SmartRegTech Copilot</div>
              <div className="copilot-subtitle">Registration Assistant</div>
            </div>
          </div>
          <button className="copilot-close" onClick={onClose}>×</button>
        </div>
        <div className="copilot-messages">
          {messages.map((message, index) => (
            <div key={index} className={`copilot-message ${message.role === "user" ? "copilot-user" : "copilot-assistant"}`}>
              {message.text}
            </div>
          ))}
          {loading && <div className="copilot-message copilot-assistant">Thinking...</div>}
        </div>
        <div className="copilot-suggestions">
          <button onClick={() => sendMessage("How does the cart work?")}>Cart</button>
          <button onClick={() => sendMessage("How do I log in or resume?")}>Login</button>
          <button onClick={() => sendMessage("What is DigiLocker verification?")}>DigiLocker</button>
          <button onClick={() => sendMessage("What is the registration process?")}>Process</button>
        </div>
        <div className="copilot-input-row">
          <input type="text" placeholder="Ask SmartRegTech Copilot..." value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={handleKeyDown} disabled={loading} />
          <button onClick={() => sendMessage()} disabled={loading || !input.trim()}>{loading ? "..." : "Send"}</button>
        </div>
        <div className="copilot-note">SmartRegTech Copilot provides guidance for this prototype.</div>
      </div>
    </div>
  );
}

function App() {
  // GLOBAL MOCK DB FOR SESSION MANAGEMENT (UPGRADED TO LOCAL STORAGE)
  const [mockUsersDB, setMockUsersDB] = useState(() => {
    try {
      const saved = localStorage.getItem("smartRegUsers");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Save changes to localStorage automatically
  useEffect(() => {
    localStorage.setItem("smartRegUsers", JSON.stringify(mockUsersDB));
  }, [mockUsersDB]);

  const [currentUserUid, setCurrentUserUid] = useState(null);

  const [currentView, setCurrentView] = useState("home"); // "home", "admin", "flow", "login", "forgotPwd", "changePwd"
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const [selectedPreset, setSelectedPreset] = useState("standard");
  const [activeFlow, setActiveFlow] = useState(PRESET_FLOWS.standard.steps);

  const [showCopilot, setShowCopilot] = useState(false);
  
  // Show/Hide Password State
  const [showLoginPwd, setShowLoginPwd] = useState(false);

  const [registrationId, setRegistrationId] = useState("");
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("idle");
  const [paymentId, setPaymentId] = useState("");
  
  const [identityPhase, setIdentityPhase] = useState("aadhaar");
  const [otp, setOtp] = useState("");
  const otpInputRefs = useRef([]);
  const [otpSeconds, setOtpSeconds] = useState(30);
  const [consentGiven, setConsentGiven] = useState(false);
  const [fetchStatus, setFetchStatus] = useState("idle");
  const [verifiedProfile, setVerifiedProfile] = useState(null);

  const [formData, setFormData] = useState({
    identity: "",
    mobile: "",
    email: "",
  });
  const [cart, setCart] = useState([]);

  const currentTotalFee = cart.reduce((sum, program) => sum + (PROGRAM_FEES[program] || 500), 0);
  const activeStepId = currentView === "flow" ? activeFlow[currentStepIndex].id : currentView;

  // AUTO-SAVE PROGRESS HOOK
  useEffect(() => {
    if (currentUserUid) {
      setMockUsersDB(prev => prev.map(user => 
        user.uid === currentUserUid 
          ? { ...user, cart, formData, currentStepIndex, verifiedProfile, activeFlowKey: selectedPreset } 
          : user
      ));
    }
  }, [cart, formData, currentStepIndex, verifiedProfile, selectedPreset, currentUserUid]);

  const handlePresetChange = (presetKey) => {
    setSelectedPreset(presetKey);
    setActiveFlow(PRESET_FLOWS[presetKey].steps);
  };

  const goToNextStep = () => {
    if (currentStepIndex < activeFlow.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const goHome = () => setCurrentView("home");
  const openAdmin = () => setCurrentView("admin");

  const goToPrevStep = () => {
    if (currentStepIndex === 0) {
      goHome();
      return;
    }

    let targetIndex = currentStepIndex - 1;
    if (activeFlow[targetIndex]?.id === "verified") {
      targetIndex = targetIndex - 1;
    }

    if (targetIndex >= 0) {
      setCurrentStepIndex(targetIndex);
    } else {
      goHome();
    }
  };

  // Generate Application Credentials (UPGRADED TO GENERAL PASSWORD)
  const generateCredentials = () => {
    const uid = "APP-" + Math.floor(100000 + Math.random() * 900000);
    const pwd = "demo123"; // Standardized general password
    return { uid, pwd };
  };

  const handleLogout = () => {
    setCurrentUserUid(null);
    setCart([]);
    setFormData({ identity: "", mobile: "", email: "" });
    setVerifiedProfile(null);
    setCurrentStepIndex(0);
    setIdentityPhase("aadhaar");
    setCurrentView("home");
    alert("You have successfully logged out. Your progress has been securely saved.");
  };

  useEffect(() => {
    if (identityPhase !== "otp" || otpSeconds <= 0) return;
    const timer = setInterval(() => {
      setOtpSeconds((seconds) => Math.max(0, seconds - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [identityPhase, otpSeconds]);

  useEffect(() => {
    const handleDigiLockerMessage = async (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type !== "DIGILOCKER_APPROVED") return;

      setIdentityPhase("fetching");
      setFetchStatus("connecting");

      try {
        const profile = await fetchMockDigiLockerProfile();
        setFetchStatus("success");
        setVerifiedProfile(profile);

        if (!currentUserUid) {
          const { uid, pwd } = generateCredentials();
          const newUser = {
            uid,
            password: pwd,
            cart: [],
            formData: { identity: formData.identity, mobile: "", email: "" },
            currentStepIndex: currentStepIndex + 1,
            verifiedProfile: profile,
            activeFlowKey: selectedPreset
          };
          setMockUsersDB(prev => [...prev, newUser]);
          setCurrentUserUid(uid);
          
          alert(`✅ IDENTITY VERIFIED!\n\nYour Registration Account has been created.\n\nApplication ID (UID): ${uid}\nPassword: ${pwd}\n\n*These credentials have been simulated as sent to your registered Email and WhatsApp. You may log out and use them to resume later.*`);
        }

        setTimeout(() => goToNextStep(), 700);
      } catch (error) {
        console.error(error);
        setFetchStatus("error");
        setIdentityPhase("otp");
        alert("The DigiLocker sandbox could not retrieve the profile.");
      }
    };

    window.addEventListener("message", handleDigiLockerMessage);
    return () => window.removeEventListener("message", handleDigiLockerMessage);
  }, [currentStepIndex, activeFlow, currentUserUid, formData, selectedPreset]);

  const updateField = (field, value) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
  };

  const toggleCartItem = (program) => {
    if (cart.includes(program)) {
      setCart(cart.filter(item => item !== program));
    } else {
      setCart([...cart, program]);
    }
  };

  const startRegistration = () => {
    if (!currentUserUid) {
      setIdentityPhase("aadhaar");
      setOtp("");
      setConsentGiven(false);
      setFetchStatus("idle");
      setVerifiedProfile(null);
      setCart([]);
      setFormData({ identity: "", mobile: "", email: "" });
      setActiveFlow(PRESET_FLOWS[selectedPreset].steps);
      setCurrentStepIndex(0);
    }
    setCurrentView("flow");
  };

  const verifyIdentity = () => {
    if (!/^\d{12}$/.test(formData.identity) && formData.identity !== DEMO_IDENTITY) {
      alert("Please enter a valid 12-digit demo Aadhaar/identity number.");
      return;
    }
    if (formData.identity !== DEMO_IDENTITY) {
      alert(`For this prototype, use the demo identity number:\n${DEMO_IDENTITY}`);
      return;
    }

    setOtp("");
    setOtpSeconds(30);
    setIdentityPhase("otp");

    setTimeout(() => {
      otpInputRefs.current[0]?.focus();
    }, 100);
  };

  const verifyOtp = () => {
    if (otp !== DEMO_OTP) {
      alert(`Invalid demo OTP. Use ${DEMO_OTP} for this prototype.`);
      return;
    }

    const digiLockerWindow = window.open("", "_blank", "width=560,height=820,resizable=yes,scrollbars=yes");

    if (!digiLockerWindow) {
      alert("The DigiLocker Sandbox window was blocked. Please allow pop-ups for this website and try again.");
      return;
    }

    const digiLockerHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>DigiLocker Sandbox</title>
<style>
  *{box-sizing:border-box} body{margin:0;background:#f5f7fb;color:#172033;font-family:Arial,Helvetica,sans-serif}
  .top{height:70px;background:#fff;border-bottom:1px solid #e2e6ee;display:flex;align-items:center;justify-content:space-between;padding:0 24px}
  .brand{display:flex;align-items:center;gap:11px} .logo{width:42px;height:42px;border-radius:10px;background:#673de6;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800}
  .brand strong{display:block;color:#42229e;font-size:19px} .brand span{display:block;color:#7a8494;font-size:9px;margin-top:2px}
  .badge{padding:7px 11px;border-radius:20px;background:#fff3dc;color:#986300;font-size:9px;font-weight:800;letter-spacing:1px}
  .page{width:calc(100% - 30px);max-width:620px;margin:30px auto} .hero{text-align:center;margin-bottom:20px}
  .lock{width:58px;height:58px;margin:auto;border-radius:50%;background:#eee8ff;display:flex;align-items:center;justify-content:center;font-size:26px}
  .hero h1{margin:14px 0 6px;font-size:24px} .hero p{margin:0;color:#6e7889;font-size:12px;line-height:1.6}
  .card{background:#fff;border:1px solid #e0e4eb;border-radius:17px;padding:25px;box-shadow:0 15px 45px rgba(50,35,100,.10)}
  .label{color:#6740d5;font-size:10px;font-weight:800;letter-spacing:1px;margin-bottom:12px}
  .app{display:flex;align-items:center;gap:12px;padding:15px;border:1px solid #e2e5ec;border-radius:12px;background:#faf9ff}
  .appLogo{width:44px;height:44px;border-radius:11px;background:#7044df;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800}
  .app strong{display:block;font-size:15px} .app small{display:block;margin-top:3px;color:#7c8492;font-size:10px}
  .secure{margin-left:auto;color:#16804c;font-size:9px;font-weight:800} .request{margin-top:22px} .request h2{margin:0;font-size:18px}
  .request p{margin:8px 0 0;color:#6f7889;font-size:12px;line-height:1.6}
  .info{margin-top:20px;padding:17px;border-radius:12px;background:#f7f5ff} .infoTitle{color:#5932c9;font-size:11px;font-weight:800;margin-bottom:13px}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:11px} .item{font-size:11px;color:#4f596b}.item::before{content:'✓';color:#16804c;font-weight:900;margin-right:7px}
  .consent{display:flex;gap:9px;align-items:flex-start;margin-top:21px;color:#4d586b;font-size:11px;line-height:1.6;cursor:pointer}.consent input{width:16px;height:16px;accent-color:#673de6}
  .allow,.cancel{width:100%;padding:13px;border-radius:9px;font-weight:800;font-size:12px;cursor:pointer}
  .allow{margin-top:21px;border:0;background:#673de6;color:#fff}.allow:disabled{opacity:.45;cursor:not-allowed}
  .cancel{margin-top:9px;border:1px solid #d9dce4;background:#fff;color:#667084}
  .footer{text-align:center;margin-top:18px;color:#89919f;font-size:9px;line-height:1.7}
  .loading,.success{text-align:center;padding:35px 0}.spinner{width:40px;height:40px;margin:0 auto 15px;border:4px solid #e8e1ff;border-top-color:#673de6;border-radius:50%;animation:spin .8s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}
  .successIcon{width:58px;height:58px;margin:0 auto 14px;border-radius:50%;background:#e6f8ee;color:#16804c;display:flex;align-items:center;justify-content:center;font-size:27px}.success h2{margin:0;font-size:20px}.success p{color:#6c7587;font-size:12px;line-height:1.6}
  @media(max-width:600px){.top{padding:0 15px}.badge{display:none}.card{padding:20px}.grid{grid-template-columns:1fr}}
</style>
</head>
<body>
<header class="top">
  <div class="brand"><div class="logo">DL</div><div><strong>DigiLocker</strong><span>Document Wallet to Empower Citizens</span></div></div>
  <div class="badge">SANDBOX</div>
</header>
<main class="page">
  <div class="hero"><div class="lock">🔐</div><h1>Secure Authorization</h1><p>Review the information requested by SmartRegTech before continuing.</p></div>
  <div class="card" id="card">
    <div class="label">APPLICATION REQUESTING ACCESS</div>
    <div class="app"><div class="appLogo">SR</div><div><strong>SmartRegTech</strong><small>Digital Registration &amp; Compliance Portal</small></div><div class="secure">✓ SECURE</div></div>
    <div class="request"><h2>Allow SmartRegTech to access your information?</h2><p>SmartRegTech is requesting permission to retrieve verified information for completing your registration.</p></div>
    <div class="info"><div class="infoTitle">INFORMATION REQUESTED</div><div class="grid"><div class="item">Full Name</div><div class="item">Date of Birth</div><div class="item">Gender</div><div class="item">Address</div><div class="item">Education Details</div><div class="item">Board / Qualification</div></div></div>
    <label class="consent"><input type="checkbox" id="consent" /><span>I authorize SmartRegTech to access the requested information for registration purposes.</span></label>
    <button class="allow" id="allow" disabled>Allow &amp; Continue →</button>
    <button class="cancel" onclick="window.close()">Cancel</button>
    <div class="footer">🔒 Secure sandbox environment<br/>Prototype only — no real DigiLocker account or government documents are accessed.</div>
  </div>
</main>
<script>
const consent=document.getElementById('consent');
const allow=document.getElementById('allow');
const card=document.getElementById('card');
consent.addEventListener('change',()=>{allow.disabled=!consent.checked});
allow.addEventListener('click',()=>{
  allow.disabled=true;
  card.innerHTML='<div class="loading"><div class="spinner"></div><h2>Authorizing...</h2><p>Securely processing your consent and retrieving your verified information.</p></div>';
  setTimeout(()=>{
    card.innerHTML='<div class="success"><div class="successIcon">✓</div><h2>Authorization Successful</h2><p>Your consent has been recorded successfully.</p><p>Returning to SmartRegTech...</p></div>';
    if(window.opener&&!window.opener.closed){window.opener.postMessage({type:'DIGILOCKER_APPROVED'},window.location.origin);}
    setTimeout(()=>window.close(),1200);
  },1800);
});
</script>
</body>
</html>`;

    digiLockerWindow.document.open();
    digiLockerWindow.document.write(digiLockerHTML);
    digiLockerWindow.document.close();
    digiLockerWindow.focus();
  };

  const approveDigiLockerConsent = async () => {
    if (!consentGiven) {
      alert("Please provide consent to continue.");
      return;
    }

    setIdentityPhase("fetching");
    setFetchStatus("connecting");

    try {
      const profile = await fetchMockDigiLockerProfile();
      setFetchStatus("success");
      setVerifiedProfile(profile);

      if (!currentUserUid) {
        const { uid, pwd } = generateCredentials();
        const newUser = {
          uid,
          password: pwd,
          cart: [],
          formData: { identity: formData.identity, mobile: "", email: "" },
          currentStepIndex: currentStepIndex + 1,
          verifiedProfile: profile,
          activeFlowKey: selectedPreset
        };
        setMockUsersDB(prev => [...prev, newUser]);
        setCurrentUserUid(uid);
        
        alert(`✅ IDENTITY VERIFIED!\n\nYour Registration Account has been created.\n\nApplication ID (UID): ${uid}\nPassword: ${pwd}\n\n*These credentials have been simulated as sent to your registered Email and WhatsApp. You may log out and use them to resume later.*`);
      }

      setTimeout(() => goToNextStep(), 700);
    } catch (error) {
      console.error(error);
      setFetchStatus("error");
      setIdentityPhase("consent");
      alert("The DigiLocker mock connector could not retrieve the profile.");
    }
  };

  const continueFromForm = () => {
    if (!/^[0-9]{10}$/.test(formData.mobile)) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!formData.email || !formData.email.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }
    if (cart.length === 0) {
      alert("Please select at least one program to add to your cart.");
      return;
    }

    goToNextStep();
  };

  const completePayment = async () => {
    if (processingPayment) return;

    if (cart.length === 0) {
      alert("Your cart is empty! Please go back and add courses before paying.");
      return;
    }

    if (paymentMethod === "upi") {
      if (!upiId.trim() || !upiId.includes("@")) {
        alert("Please enter a valid demo UPI ID, for example demo@upi.");
        return;
      }
    }

    setProcessingPayment(true);
    setPaymentStatus("processing");

    try {
      let currentRegistrationId = registrationId;

      if (!currentRegistrationId) {
        const registerResponse = await fetch(`${API_BASE}/api/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: verifiedProfile?.name || "Rohan Verma",
            email: formData.email,
            phone: formData.mobile,
            program: cart.join(", "),
          }),
        });

        if (!registerResponse.ok) {
          throw new Error("Registration request failed.");
        }

        const registerData = await registerResponse.json();

        if (!registerData.success) {
          throw new Error(registerData.message || "Registration failed.");
        }

        currentRegistrationId = registerData.registration_id;
        setRegistrationId(currentRegistrationId);
      }

      await new Promise((resolve) => setTimeout(resolve, 1800));

      const paymentResponse = await fetch(`${API_BASE}/api/payment/${currentRegistrationId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: currentTotalFee,
          program: cart.join(", "),
        }),
      });

      if (!paymentResponse.ok) {
        throw new Error("Payment request failed.");
      }

      const paymentData = await paymentResponse.json();

      if (!paymentData.success) {
        throw new Error(paymentData.message || "Payment failed.");
      }

      const generatedPaymentId = paymentData.payment_id || `PAY-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      setPaymentId(generatedPaymentId);
      setPaymentStatus("success");

      await new Promise((resolve) => setTimeout(resolve, 700));
      goToNextStep();
    } catch (error) {
      console.error(error);
      setPaymentStatus("failed");
      alert("Payment could not be completed.\n\n" + error.message + "\n\nPlease make sure the FastAPI backend is reachable.");
    } finally {
      setProcessingPayment(false);
    }
  };

  const downloadReceipt = () => {
    const receiptHTML = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>SmartRegTech Registration Receipt</title>
<style>
body { font-family: Arial, sans-serif; background: #f4f5fb; margin: 0; padding: 40px; color: #182033; }
.receipt { max-width: 700px; margin: auto; background: white; padding: 40px; border-radius: 16px; box-shadow: 0 8px 30px rgba(0,0,0,0.12); }
.header { text-align: center; border-bottom: 2px solid #6c4cff; padding-bottom: 20px; margin-bottom: 25px; }
.logo { font-size: 30px; font-weight: bold; color: #6c4cff; }
.subtitle { color: #666; margin-top: 5px; }
.success { text-align: center; color: #159957; font-size: 20px; font-weight: bold; margin: 20px 0; }
.registration-id { text-align: center; background: #f0edff; padding: 18px; border-radius: 10px; margin: 25px 0; }
.registration-id strong { display: block; font-size: 24px; color: #6c4cff; margin-top: 8px; }
.row { display: flex; justify-content: space-between; gap: 30px; padding: 14px 0; border-bottom: 1px solid #e5e5e5; }
.label { color: #666; }
.value { font-weight: bold; text-align: right; }
.footer { margin-top: 30px; text-align: center; font-size: 13px; color: #777; }
</style>
</head>
<body>
<div class="receipt">
  <div class="header">
    <div class="logo">SmartRegTech</div>
    <div class="subtitle">Zero-Friction Registration Portal</div>
  </div>
  <div class="success">✓ REGISTRATION SUCCESSFUL</div>
  <div class="registration-id">Registration ID<strong>${registrationId}</strong></div>
  <div class="row"><span class="label">Applicant Name</span><span class="value">${verifiedProfile?.name || "Verified Applicant"}</span></div>
  <div class="row"><span class="label">Identity Verification</span><span class="value">DigiLocker Sandbox — Consent + Mock JSON</span></div>
  <div class="row"><span class="label">Mobile Number</span><span class="value">${formData.mobile}</span></div>
  <div class="row"><span class="label">Email</span><span class="value">${formData.email}</span></div>
  <div class="row"><span class="label">Programs Enrolled</span><span class="value">${cart.join(", ")}</span></div>
  <div class="row"><span class="label">Total Registration Fee</span><span class="value">₹${currentTotalFee.toLocaleString("en-IN")}</span></div>
  <div class="row"><span class="label">Payment Status</span><span class="value">Paid — Sandbox</span></div>
  <div class="row"><span class="label">Application Status</span><span class="value">Registration Successful</span></div>
  <div class="row"><span class="label">Date</span><span class="value">${new Date().toLocaleDateString()}</span></div>
  <div class="footer">This receipt was generated by the SmartRegTech prototype.<br />DigiLocker and payment integrations are simulated for demonstration purposes.</div>
</div>
</body>
</html>`;

    const blob = new Blob([receiptHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "SmartRegTech_Registration_Receipt.html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };


  /* ============================================================
     AUTHENTICATION PAGES (LOGIN, FORGOT PWD, CHANGE PWD)
  ============================================================ */
  if (currentView === "login") {
    return (
      <div className="app">
        <header className="navbar">
          <div className="brand" onClick={goHome}>
            <div className="brand-mark">SR</div><div><h2>SmartRegTech</h2><p>Digital Registration & Compliance</p></div>
          </div>
        </header>
        <main className="page-container" style={{ maxWidth: "500px", margin: "50px auto" }}>
          <section className="content-card form-panel">
            <h2>Login to Resume Registration</h2>
            <p className="description">Enter the Application ID (UID) and password generated during your identity verification.</p>
            
            <div className="form-group" style={{ marginTop: "20px" }}>
              <label>APPLICATION ID (UID)</label>
              <input type="text" id="loginUid" placeholder="e.g. APP-123456" />
            </div>
            
            <div className="form-group">
              <label>PASSWORD</label>
              <div style={{ position: "relative" }}>
                <input 
                  type={showLoginPwd ? "text" : "password"} 
                  id="loginPwd" 
                  placeholder="Enter your password" 
                  style={{ width: "100%", paddingRight: "50px", boxSizing: "border-box" }} 
                />
                <button 
                  type="button" 
                  onClick={() => setShowLoginPwd(!showLoginPwd)} 
                  style={{ 
                    position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", 
                    background: "none", border: "none", cursor: "pointer", fontSize: "12px", fontWeight: "bold", color: "#a5b4fc", padding: 0 
                  }}
                  title={showLoginPwd ? "Hide Password" : "Show Password"}
                >
                  {showLoginPwd ? "HIDE" : "SHOW"}
                </button>
              </div>
            </div>

            <button type="button" className="primary-button full" onClick={() => {
              const uid = document.getElementById("loginUid").value.trim();
              const pwd = document.getElementById("loginPwd").value.trim();
              const user = mockUsersDB.find(u => u.uid === uid && u.password === pwd);
              
              if (user) {
                setCurrentUserUid(uid);
                setCart(user.cart || []);
                setFormData(user.formData);
                setVerifiedProfile(user.verifiedProfile);
                setSelectedPreset(user.activeFlowKey);
                setActiveFlow(PRESET_FLOWS[user.activeFlowKey].steps);
                setCurrentStepIndex(user.currentStepIndex);
                setCurrentView("flow");
              } else {
                alert("Invalid UID or Password. Please check your credentials and try again.");
              }
            }}>
              Login & Resume <span>→</span>
            </button>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "15px" }}>
              <button type="button" className="nav-button" onClick={() => setCurrentView("forgotPwd")}>Forgot Password?</button>
              <button type="button" className="nav-button" onClick={goHome}>Cancel</button>
            </div>
          </section>
        </main>
      </div>
    );
  }

  if (currentView === "forgotPwd") {
    return (
      <div className="app">
        <header className="navbar">
          <div className="brand" onClick={goHome}>
            <div className="brand-mark">SR</div><div><h2>SmartRegTech</h2><p>Digital Registration & Compliance</p></div>
          </div>
        </header>
        <main className="page-container" style={{ maxWidth: "500px", margin: "50px auto" }}>
          <section className="content-card form-panel">
            <h2>Forgot Password</h2>
            <p className="description">Enter your Application ID (UID) to receive a password reset link.</p>
            
            <div className="form-group" style={{ marginTop: "20px" }}>
              <label>APPLICATION ID (UID)</label>
              <input type="text" id="resetUid" placeholder="APP-XXXXXX" />
            </div>

            <button type="button" className="primary-button full" onClick={() => {
              const uid = document.getElementById("resetUid").value.trim();
              const user = mockUsersDB.find(u => u.uid === uid);
              if (user) {
                alert(`✅ SIMULATION SUCCESS: An email has been sent to the registered address with the recovered password: ${user.password}`);
              } else {
                alert("UID not found in the system.");
              }
              setCurrentView("login");
            }}>
              Send Reset Link
            </button>

            <button type="button" className="back-button" onClick={() => setCurrentView("login")} style={{ marginTop: "15px" }}>
              ← Back to Login
            </button>
          </section>
        </main>
      </div>
    );
  }

  if (currentView === "changePwd") {
    return (
      <div className="app">
        <header className="navbar">
          <div className="brand" onClick={goHome}>
            <div className="brand-mark">SR</div><div><h2>SmartRegTech</h2><p>Digital Registration & Compliance</p></div>
          </div>
        </header>
        <main className="page-container" style={{ maxWidth: "500px", margin: "50px auto" }}>
          <section className="content-card form-panel">
            <h2>Change Password</h2>
            <p className="description">Update your password to something secure of your choice.</p>
            
            <div className="form-group" style={{ marginTop: "20px" }}>
              <label>OLD PASSWORD</label>
              <input type="password" id="oldPwd" placeholder="Enter current password" />
            </div>

            <div className="form-group">
              <label>NEW PASSWORD</label>
              <input type="password" id="newPwd" placeholder="Enter new password" />
            </div>

            <button type="button" className="primary-button full" onClick={() => {
              const old = document.getElementById("oldPwd").value.trim();
              const newP = document.getElementById("newPwd").value.trim();
              const userIndex = mockUsersDB.findIndex(u => u.uid === currentUserUid);
              
              if (mockUsersDB[userIndex].password === old) {
                if (newP.length < 4) {
                  alert("New password must be at least 4 characters.");
                  return;
                }
                const updatedDB = [...mockUsersDB];
                updatedDB[userIndex].password = newP;
                setMockUsersDB(updatedDB);
                alert("Password changed successfully!");
                setCurrentView("home");
              } else {
                alert("Old password incorrect.");
              }
            }}>
              Update Password
            </button>

            <button type="button" className="back-button" onClick={goHome} style={{ marginTop: "15px" }}>
              ← Cancel
            </button>
          </section>
        </main>
      </div>
    );
  }


  /* ============================================================
     ADMIN
  ============================================================ */
  if (activeStepId === "admin") {
    return (
      <div>
        <AdminAnalytics />
        <div className="admin-return">
          <button type="button" className="back-button" onClick={goHome}>
            ← Return to Registration Portal
          </button>
        </div>
      </div>
    );
  }

  /* ============================================================
     HOME
  ============================================================ */
  if (activeStepId === "home") {
    return (
      <div className="app">
        <header className="navbar">
          <div className="brand" onClick={goHome}>
            <div className="brand-mark">SR</div>
            <div><h2>SmartRegTech</h2><p>Digital Registration & Compliance</p></div>
          </div>
          <div className="nav-buttons">
            <button type="button" className="nav-button secondary" onClick={() => setShowCopilot(true)}>
              <span>✦</span> AI Copilot
            </button>
            <button type="button" className="nav-button" onClick={openAdmin}>
              <span>▦</span> Admin Analytics
            </button>
            {currentUserUid ? (
              <>
                <button type="button" className="nav-button" onClick={() => setCurrentView("changePwd")}>
                  Change Password
                </button>
                <button type="button" className="nav-button secondary" onClick={handleLogout}>
                  Logout ({currentUserUid})
                </button>
              </>
            ) : (
              <button type="button" className="nav-button secondary" onClick={() => setCurrentView("login")}>
                Login / Resume
              </button>
            )}
          </div>
        </header>

        <main className="home-main">
          <section className="hero-section">
            <div className="hero-content">
              <div className="hero-badge"><span className="live-dot"></span> Digital Registration Platform</div>
              <h1>Register smarter.<br /><span>Skip the paperwork.</span></h1>
              <p className="hero-description">A secure digital registration platform that verifies identity, reduces repetitive form filling and streamlines the complete registration journey.</p>
              
              {!currentUserUid && (
                <div style={{ margin: "24px 0", padding: "16px 20px", background: "rgba(108, 76, 255, 0.08)", borderRadius: "14px", border: "1px solid rgba(108, 76, 255, 0.3)" }}>
                  <label style={{ display: "block", fontSize: "12px", color: "#b99cff", fontWeight: 800, marginBottom: "8px", letterSpacing: "0.5px" }}>
                    ⚙️ SELECT CUSTOMER WORKFLOW CONFIGURATION
                  </label>
                  <select value={selectedPreset} onChange={(e) => handlePresetChange(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "10px", background: "#0e172a", color: "#fff", border: "1px solid #3b486d", fontSize: "14px", outline: "none", cursor: "pointer" }}>
                    {Object.entries(PRESET_FLOWS).map(([key, config]) => (
                      <option key={key} value={key}>{config.name}</option>
                    ))}
                  </select>
                  <small style={{ display: "block", marginTop: "8px", color: "#8a9fc2", fontSize: "12px" }}>
                    {PRESET_FLOWS[selectedPreset].description}
                  </small>
                </div>
              )}

              <div className="hero-actions">
                <button type="button" className="primary-button" onClick={startRegistration}>
                  {currentUserUid ? "Resume Registration" : "Start Registration"} <span>→</span>
                </button>
                <button type="button" className="outline-button" onClick={() => setShowCopilot(true)}>Ask AI Copilot</button>
              </div>
              <div className="trust-row">
                <div><span className="trust-icon">✓</span> Identity verification</div>
                <div><span className="trust-icon">✓</span> Smart forms</div>
                <div><span className="trust-icon">✓</span> Digital receipt</div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="visual-glow"></div>
              <div className="registration-preview">
                <div className="preview-top">
                  <div className="preview-brand"><div className="mini-mark">SR</div><span>SmartRegTech</span></div>
                  <span className="secure-label">SECURE</span>
                </div>
                <div className="preview-title">Registration Status</div>
                <div className="preview-status">
                  <div className="status-check">✓</div>
                  <div><strong>Identity Verified</strong><span>DigiLocker verification complete</span></div>
                </div>
                <div className="preview-lines">
                  <div><span>Application</span><strong>Ready</strong></div>
                  <div><span>Program</span><strong>B.Tech</strong></div>
                  <div><span>Payment</span><strong className="green-text">Verified</strong></div>
                </div>
                <div className="preview-progress">
                  <div className="preview-progress-label"><span>Registration progress</span><strong>80%</strong></div>
                  <div className="preview-track"><div className="preview-fill"></div></div>
                </div>
              </div>
            </div>
          </section>

          <section className="feature-section">
            <div className="section-heading">
              <span>PLATFORM CAPABILITIES</span>
              <h2>Everything you need for<br />a smoother registration experience.</h2>
            </div>
            <div className="feature-grid">
              <FeatureCard icon="◈" title="Secure Verification" text="Verify applicant identity through a controlled DigiLocker mock workflow." />
              <FeatureCard icon="✦" title="AI Copilot Assist" text="Get contextual guidance throughout the registration process." />
              <FeatureCard icon="⌁" title="Smart Forms" text="Automatically reduce repetitive information entry after verification." />
              <FeatureCard icon="▦" title="Admin Analytics" text="Monitor applications, verification, payments and program activity." />
            </div>
          </section>

          <section className="how-section">
            <div className="section-heading centered">
              <span>SIMPLE WORKFLOW</span>
              <h2>From verification to registration<br />in a few simple steps.</h2>
            </div>
            <div className="workflow-grid">
              <WorkflowStep number="01" title="Verify Identity" text="Complete the demo DigiLocker identity verification." />
              <WorkflowStep number="02" title="Complete Details" text="Enter only the information that is still required." />
              <WorkflowStep number="03" title="Review & Pay" text="Review your application and complete the sandbox payment." />
              <WorkflowStep number="04" title="Get Registration ID" text="Receive your registration ID and download the receipt." />
            </div>
          </section>
        </main>

        <footer className="home-footer">
          <div>© 2026 SmartRegTech Prototype</div>
          <div>Digital Registration • Compliance • Analytics</div>
        </footer>

        {showCopilot && <AICopilot onClose={() => setShowCopilot(false)} />}
      </div>
    );
  }

  /* ============================================================
     IDENTITY / DIGILOCKER-STYLE VERIFICATION
  ============================================================ */
  if (activeStepId === "identity") {
    return (
      <Page currentStep={activeStepId} onHome={goHome} onCopilot={() => setShowCopilot(true)} flowConfig={activeFlow} currentIndex={currentStepIndex} currentUserUid={currentUserUid} handleLogout={handleLogout} openAdmin={openAdmin}>
        <div className="form-layout">
          <div className="form-intro">
            <div className="step-label">STEP / IDENTITY</div>
            <h1>Verify once.<br />Reuse your details.</h1>
            <p className="description">A realistic DigiLocker-style verification flow for this prototype. Your identity is checked first, then a consented mock connector fetches verified details.</p>
            <div className="security-points">
              <div><span>✓</span> 12-digit identity validation</div>
              <div><span>✓</span> One-time OTP verification</div>
              <div><span>✓</span> Explicit DigiLocker consent</div>
              <div><span>✓</span> Automatic profile retrieval</div>
            </div>
          </div>

          <div className="form-panel digilocker-flow-panel">
            <div className="dl-brand-row">
              <div className="dl-logo-mark">▣</div>
              <div><strong>DigiLocker-style verification</strong><span>SmartRegTech sandbox connector</span></div>
              <span className="sandbox-pill">DEMO</span>
            </div>

            <div className="dl-flow-steps">
              <span className={identityPhase === "aadhaar" ? "active" : "done"}>1 Identity</span>
              <span className={identityPhase === "otp" ? "active" : identityPhase === "consent" || identityPhase === "fetching" ? "done" : ""}>2 OTP</span>
              <span className={identityPhase === "consent" ? "active" : identityPhase === "fetching" ? "done" : ""}>3 Consent</span>
              <span className={identityPhase === "fetching" ? "active" : ""}>4 Fetch</span>
            </div>

            {identityPhase === "aadhaar" && (
              <>
                <div className="panel-heading">
                  <div className="panel-icon">◈</div>
                  <div><h2>Identity verification</h2><p>Start with your 12-digit identity number</p></div>
                </div>

                <div className="warning">
                  <span>!</span>
                  <div><strong>Prototype / sandbox</strong><p>Do not enter a real Aadhaar number. Use the demo identity shown below.</p></div>
                </div>

                <div className="form-group">
                  <label>AADHAAR / IDENTITY NUMBER</label>
                  <input type="text" inputMode="numeric" autoComplete="off" placeholder="XXXX XXXX XXXX" maxLength="12" value={formData.identity} onChange={(event) => updateField("identity", event.target.value.replace(/\D/g, ""))} />
                </div>

                <div className="demo-number">
                  <span>Demo identity</span>
                  <strong>{DEMO_IDENTITY}</strong>
                  <button type="button" onClick={() => updateField("identity", DEMO_IDENTITY)}>Use demo</button>
                </div>
                <button type="button" className="primary-button full" onClick={verifyIdentity}>Continue to OTP <span>→</span></button>
              </>
            )}

            {identityPhase === "otp" && (
              <>
                <div className="otp-background-card">
                  <div className="panel-heading"><div className="panel-icon">✉</div><div><h2>Verification required</h2><p>Enter the one-time code to continue.</p></div></div>
                  <div className="otp-window-hint">A secure OTP verification window has been opened.</div>
                </div>

                <div className="otp-modal-overlay">
                  <div className="otp-modal" role="dialog" aria-modal="true" aria-labelledby="otp-modal-title">
                    <button type="button" className="otp-modal-close" onClick={() => { setOtp(""); setIdentityPhase("aadhaar"); }}>×</button>
                    <div className="otp-modal-brand"><div className="otp-modal-logo">SR</div><div><strong>SmartRegTech</strong><span>Secure identity verification</span></div></div>
                    <div className="otp-modal-icon">✉</div>
                    <div className="success-badge">OTP SENT</div>
                    <h2 id="otp-modal-title">Verify your identity</h2>
                    <p className="otp-modal-description">Enter the 6-digit verification code sent to your registered mobile number.</p>
                    <div className="otp-destination-modal"><span>OTP sent to</span><strong>+91 ••••••5312</strong><small>Demo verification channel</small></div>
                    <div className="otp-boxes" onClick={() => otpInputRefs.current[0]?.focus()}>
                      {Array.from({ length: 6 }).map((_, index) => (
                        <input key={index} ref={(element) => { otpInputRefs.current[index] = element; }} className="otp-box" inputMode="numeric" maxLength={1} value={otp[index] || ""}
                          onChange={(event) => {
                            const digit = event.target.value.replace(/\D/g, "").slice(-1);
                            const digits = otp.split("");
                            digits[index] = digit;
                            const nextOtp = digits.join("").slice(0, 6);
                            setOtp(nextOtp);
                            if (digit && index < 5) otpInputRefs.current[index + 1]?.focus();
                          }}
                          onKeyDown={(event) => {
                            if (event.key === "Backspace" && !otp[index] && index > 0) otpInputRefs.current[index - 1]?.focus();
                            if (event.key === "ArrowLeft" && index > 0) otpInputRefs.current[index - 1]?.focus();
                            if (event.key === "ArrowRight" && index < 5) otpInputRefs.current[index + 1]?.focus();
                          }}
                        />
                      ))}
                    </div>
                    <div className="demo-otp-modal">Demo OTP: <strong>{DEMO_OTP}</strong></div>
                    <div className="otp-resend-row">
                      {otpSeconds > 0 ? (
                        <span>Resend code in {otpSeconds}s</span>
                      ) : (
                        <button type="button" onClick={() => { setOtp(""); setOtpSeconds(30); otpInputRefs.current[0]?.focus(); }}>Resend OTP</button>
                      )}
                    </div>
                    <button type="button" className="primary-button full otp-verify-button" onClick={verifyOtp}>Verify OTP <span>→</span></button>
                    <div className="otp-security-note">🔒 Demo sandbox · No real OTP is sent</div>
                  </div>
                </div>
              </>
            )}

            {identityPhase === "redirect" && (
              <div className="digilocker-redirect-card">
                <div className="redirect-connection-line">
                  <div className="redirect-node smartregtech-node">SR</div><div className="redirect-line"><span /></div><div className="redirect-node digilocker-node">DL</div>
                </div>
                <div className="redirect-badge">IDENTITY VERIFIED</div>
                <div className="redirect-icon">↗</div>
                <h2>Continue to DigiLocker</h2>
                <p className="redirect-description">Your identity has been verified. You will now be redirected to the DigiLocker sandbox to give consent for retrieving your verified registration details.</p>
                <div className="redirect-flow">
                  <div><span className="redirect-check">✓</span><span>Identity verified</span></div>
                  <div><span className="redirect-check">✓</span><span>Secure connection ready</span></div>
                  <div><span className="redirect-next">3</span><span>DigiLocker consent</span></div>
                </div>
                <div className="redirect-loading"><span className="redirect-spinner"></span><span>Connecting securely to DigiLocker Sandbox...</span></div>
                <div className="redirect-sandbox-note">🧪 DigiLocker Sandbox / Demo<small>This prototype does not redirect to the real DigiLocker service or access real Aadhaar data.</small></div>
              </div>
            )}

            {identityPhase === "consent" && (
              <div className="dl-stage-card consent-card">
                <div className="dl-stage-icon">🔐</div>
                <div className="success-badge">CONSENT REQUIRED</div>
                <h2>Allow SmartRegTech to fetch your details</h2>
                <p>This screen simulates the consent step you would see before an approved DigiLocker connector shares information.</p>
                <div className="consent-provider">
                  <div className="consent-provider-icon">SR</div>
                  <div><strong>SmartRegTech</strong><span>Registration &amp; Compliance Portal</span></div>
                  <span className="secure-label">SECURE</span>
                </div>
                <div className="consent-data-list">
                  <strong>Information requested</strong>
                  <span>✓ Full name</span><span>✓ Date of birth</span><span>✓ Gender &amp; address</span><span>✓ Education / board details</span>
                </div>
                <label className="consent-checkbox">
                  <input type="checkbox" checked={consentGiven} onChange={(event) => setConsentGiven(event.target.checked)} />
                  <span>I consent to share these details for registration.</span>
                </label>
                <button type="button" className="primary-button full" onClick={approveDigiLockerConsent}>Continue &amp; Fetch Details <span>→</span></button>
              </div>
            )}

            {identityPhase === "fetching" && (
              <div className="dl-stage-card fetching-card">
                <div className="fetch-spinner"></div>
                <div className="success-badge">{fetchStatus === "success" ? "FETCH COMPLETE" : "CONNECTING"}</div>
                <h2>{fetchStatus === "success" ? "Verified profile received" : "Connecting to DigiLocker"}</h2>
                <p>{fetchStatus === "success" ? "The simulated JSON payload has been received and validated." : "Establishing a secure sandbox connection and requesting the consented profile payload..."}</p>
                <div className="fetch-log">
                  <div><span className="fetch-dot done"></span> Identity verified</div>
                  <div><span className="fetch-dot done"></span> Consent recorded</div>
                  <div><span className="fetch-dot"></span> Fetching profile JSON</div>
                  <div><span className="fetch-dot"></span> Mapping fields to registration form</div>
                </div>
              </div>
            )}

            {identityPhase !== "fetching" && (
              <button type="button" className="back-button" onClick={goToPrevStep}>← Back</button>
            )}
          </div>
        </div>
        {showCopilot && <AICopilot onClose={() => setShowCopilot(false)} />}
      </Page>
    );
  }

  /* ============================================================
     VERIFIED
  ============================================================ */
  if (activeStepId === "verified") {
    return (
      <Page currentStep={activeStepId} onHome={goHome} flowConfig={activeFlow} currentIndex={currentStepIndex} currentUserUid={currentUserUid} handleLogout={handleLogout} openAdmin={openAdmin}>
        <div className="verification-result">
          <div className="verified-icon">✓</div>
          <div className="success-badge">IDENTITY VERIFIED</div>
          <h1>We found your details.</h1>
          <p className="description center-text">Retrieved from a simulated DigiLocker JSON payload <span className="mock-label">SANDBOX CONNECTOR</span></p>

          <div className="verified-card">
            <div className="verified-card-header">
              <div><span>VERIFIED PROFILE</span><h3>Applicant Information</h3></div>
              <div className="verified-pill">✓ Verified</div>
            </div>
            <div className="verified-profile-top">
              <div className="profile-photo">{verifiedProfile?.photo || "RV"}</div>
              <div><span>DOCUMENT SOURCE</span><strong>{verifiedProfile?.source || "DigiLocker Sandbox"}</strong><small>Document: {verifiedProfile?.document || "Aadhaar Profile"}</small></div>
            </div>
            <div className="json-payload-preview">
              <div><span>MOCK API RESPONSE</span><strong>200 OK • application/json</strong></div>
              <code>{JSON.stringify(verifiedProfile || MOCK_DIGILOCKER_PROFILE, null, 2)}</code>
            </div>
            <div className="verified-grid">
              <VerifiedField label="Full Name" value={verifiedProfile?.name || "—"} />
              <VerifiedField label="Date of Birth" value={verifiedProfile?.dob || "—"} />
              <VerifiedField label="Gender" value={verifiedProfile?.gender || "—"} />
              <VerifiedField label="Address" value={verifiedProfile?.address || "—"} />
              <VerifiedField label="Board" value={verifiedProfile?.board || "—"} />
              <VerifiedField label="Qualification" value={verifiedProfile?.qualification || "—"} />
            </div>
          </div>

          <div className="info-box">
            <span>✦</span>
            <div><strong>Smart form activated</strong><p>Your verified details have been automatically carried forward.</p></div>
          </div>
          <button type="button" className="primary-button" onClick={goToNextStep}>Continue to Registration <span>→</span></button>
        </div>
      </Page>
    );
  }

  /* ============================================================
     FORM
  ============================================================ */
  if (activeStepId === "form") {
    return (
      <Page currentStep={activeStepId} onHome={goHome} flowConfig={activeFlow} currentIndex={currentStepIndex} currentUserUid={currentUserUid} handleLogout={handleLogout} openAdmin={openAdmin}>
        <div className="form-layout">
          <div className="form-intro">
            <div className="step-label">STEP / DETAILS</div>
            <h1>Only the essentials remain.</h1>
            <p className="description">Your verified identity details are already available. Complete the remaining information below.</p>
            <div className="verified-summary">
              <div className="mini-verified">✓</div>
              <div><strong>{verifiedProfile?.name || "Verified Applicant"}</strong><span>Identity verified</span></div>
            </div>
          </div>

          <div className="form-panel">
            <div className="panel-heading"><div className="panel-icon">✦</div><div><h2>Registration Details</h2><p>Complete the required fields.</p></div></div>
            
            <div className="form-group">
              <label>MOBILE NUMBER</label>
              <input type="tel" maxLength="10" placeholder="Enter 10-digit mobile number" value={formData.mobile} onChange={(event) => updateField("mobile", event.target.value.replace(/\D/g, ""))} />
            </div>
            
            <div className="form-group">
              <label>EMAIL ADDRESS</label>
              <input type="email" placeholder="yourname@example.com" value={formData.email} onChange={(event) => updateField("email", event.target.value)} />
            </div>

            <div className="form-group" style={{ marginTop: "24px" }}>
              <label>PROGRAM / COURSE <span style={{ textTransform: "none", color: "#8a9fc2", fontWeight: "normal" }}>(Select one or more items to add to cart)</span></label>
              <div style={{ display: "grid", gap: "12px", maxHeight: "250px", overflowY: "auto", background: "#0a1124", padding: "16px", borderRadius: "10px", border: "1px solid #3b486d" }}>
                {programs.map((program) => (
                  <label key={program} style={{ display: "flex", alignItems: "center", gap: "12px", color: "#fff", cursor: "pointer", fontSize: "14px" }}>
                    <input
                      type="checkbox"
                      checked={cart.includes(program)}
                      onChange={() => toggleCartItem(program)}
                      style={{ width: "20px", height: "20px", accentColor: "#6c4cff", cursor: "pointer" }}
                    />
                    <span>{program} <strong style={{ color: "#a5b4fc", marginLeft: "6px" }}>(₹{PROGRAM_FEES[program] || 500})</strong></span>
                  </label>
                ))}
              </div>

              {cart.length > 0 && (
                <div style={{ marginTop: "16px", padding: "14px", background: "rgba(21,153,87,0.1)", borderRadius: "10px", border: "1px solid rgba(21,153,87,0.3)", color: "#159957", fontWeight: "bold", fontSize: "15px", display: "flex", justifyContent: "space-between" }}>
                  <span>Cart Items: {cart.length}</span>
                  <span>Total Fee: ₹{currentTotalFee.toLocaleString("en-IN")}</span>
                </div>
              )}
            </div>
            
            {(() => {
              const currentFlowSteps = activeFlow && activeFlow.length > 0 ? activeFlow : PRESET_FLOWS[selectedPreset].steps;
              const nextStep = currentFlowSteps[currentStepIndex + 1];
              let nextLabel = "Review Application";
              
              if (nextStep?.id === "identity") {
                nextLabel = "Continue to Identity Verification";
              } else if (nextStep?.id === "payment") {
                nextLabel = "Continue to Payment";
              } else if (nextStep?.id === "review") {
                nextLabel = "Review Application";
              }

              return (
                <button type="button" className="primary-button full" onClick={continueFromForm}>
                  {nextLabel} <span>→</span>
                </button>
              );
            })()}

            <button type="button" className="back-button" onClick={goToPrevStep}>← Back</button>
          </div>
        </div>
      </Page>
    );
  }

  /* ============================================================
     REVIEW
  ============================================================ */
  if (activeStepId === "review") {
    return (
      <Page currentStep={activeStepId} onHome={goHome} flowConfig={activeFlow} currentIndex={currentStepIndex} currentUserUid={currentUserUid} handleLogout={handleLogout} openAdmin={openAdmin}>
        <div className="review-page">
          <div className="step-label">STEP / REVIEW</div>
          <h1>Review your application.</h1>
          <p className="description">Everything looks ready. Check the details below before proceeding to payment.</p>

          <div className="review-grid">
            <div className="review-card">
              <div className="review-card-title">
                <span className="review-icon">✓</span>
                <div><h2>Verified Information</h2><span>Retrieved through DigiLocker</span></div>
              </div>
              <ReviewRow label="Applicant Name" value={verifiedProfile?.name || "Verified Applicant"} verified />
              <ReviewRow label="Identity" value={currentUserUid ? `UID: ${currentUserUid}` : "Verified"} verified />
              <ReviewRow label="Date of Birth" value={verifiedProfile?.dob || "—"} verified />
            </div>
            <div className="review-card">
              <div className="review-card-title">
                <span className="review-icon purple">+</span>
                <div><h2>Registration Details</h2><span>Information provided by applicant</span></div>
              </div>
              <ReviewRow label="Mobile" value={formData.mobile} />
              <ReviewRow label="Email" value={formData.email} />
              
              <div style={{ marginTop: "15px", paddingTop: "15px", borderTop: "1px dashed #3b486d" }}>
                <span style={{ fontSize: "12px", color: "#8a9fc2", fontWeight: 700 }}>COURSES SELECTED IN CART ({cart.length})</span>
                {cart.map((item, idx) => (
                  <div key={idx} style={{ color: "#fff", fontSize: "14px", marginTop: "8px", fontWeight: "bold" }}>
                    • {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="ready-banner">
            <div className="ready-icon">✓</div>
            <div><strong>Ready for payment</strong><p>Your application is complete and ready to be submitted.</p></div>
          </div>

          <div className="review-actions">
            <button type="button" className="back-button" onClick={goToPrevStep}>← Edit Details</button>
            <button type="button" className="primary-button" onClick={goToNextStep}>Continue to Payment <span>→</span></button>
          </div>
        </div>
      </Page>
    );
  }

  /* ============================================================
     PAYMENT
  ============================================================ */
  if (activeStepId === "payment") {
    return (
      <Page currentStep={activeStepId} onHome={goHome} flowConfig={activeFlow} currentIndex={currentStepIndex} currentUserUid={currentUserUid} handleLogout={handleLogout} openAdmin={openAdmin}>
        <div className="payment-page">
          <div className="step-label">STEP / PAYMENT</div>
          <h1>Complete your payment.</h1>
          <p className="description">Manage your cart and complete the sandbox transaction.</p>

          <div className="payment-layout" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.5fr) minmax(280px, .7fr)", gap: "24px", alignItems: "start" }}>
            <div className="payment-card" style={{ padding: "28px" }}>
              <div className="payment-card-top">
                <div><span>TOTAL CART FEE</span><h2>₹{currentTotalFee.toLocaleString("en-IN")}</h2></div>
                <div className="sandbox-pill">SANDBOX</div>
              </div>

              <div className="payment-divider" />

              <div className="payment-detail"><span>Applicant</span><strong>{verifiedProfile?.name || "Verified Applicant"}</strong></div>
              <div className="payment-detail"><span>Identity UID</span><strong className="green-text">✓ {currentUserUid || "Verified"}</strong></div>

              <div style={{ marginTop: "24px", marginBottom: "24px" }}>
                <h3 style={{ marginBottom: "12px", fontSize: "14px", color: "#a5b4fc" }}>Manage Cart Items</h3>
                <div style={{ display: "grid", gap: "10px" }}>
                  {cart.map((item, idx) => (
                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px", background: "#0a1124", border: "1px solid #3b486d", borderRadius: "10px" }}>
                      <div>
                        <strong style={{ display: "block", color: "#fff", fontSize: "13px" }}>{item}</strong>
                        <span style={{ color: "#159957", fontSize: "12px", fontWeight: "bold" }}>₹{PROGRAM_FEES[item] || 500}</span>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => toggleCartItem(item)} 
                        disabled={processingPayment}
                        style={{ background: "rgba(255, 77, 79, 0.1)", color: "#ff4d4f", border: "1px solid rgba(255, 77, 79, 0.3)", padding: "6px 12px", borderRadius: "6px", cursor: processingPayment ? "not-allowed" : "pointer", fontSize: "12px", fontWeight: "bold" }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  {cart.length === 0 && (
                    <div style={{ padding: "15px", background: "rgba(255, 77, 79, 0.1)", border: "1px solid rgba(255, 77, 79, 0.3)", borderRadius: "10px", color: "#ff4d4f", fontSize: "14px" }}>
                      Your cart is currently empty. Please go back to add courses to your cart before proceeding.
                    </div>
                  )}
                </div>
              </div>

              <div style={{ marginTop: "24px" }}>
                <h3 style={{ marginBottom: "12px" }}>Select payment method</h3>
                <div style={{ display: "grid", gap: "10px" }}>
                  {[
                    ["upi", "UPI", "Google Pay / PhonePe / BHIM", "U"],
                    ["card", "Card", "Credit / Debit Card", "💳"],
                    ["netbanking", "Net Banking", "All major banks", "🏦"],
                  ].map(([id, title, subtitle, icon]) => (
                    <button key={id} type="button" onClick={() => setPaymentMethod(id)} disabled={processingPayment || cart.length === 0}
                      style={{ display: "grid", gridTemplateColumns: "42px 1fr auto", alignItems: "center", gap: "12px", width: "100%", padding: "14px", borderRadius: "12px", border: paymentMethod === id ? "1px solid #7556ff" : "1px solid #293c5c", background: paymentMethod === id ? "#151f3c" : "#101c30", color: "#fff", textAlign: "left", cursor: processingPayment || cart.length === 0 ? "not-allowed" : "pointer" }}>
                      <span style={{ width: "42px", height: "42px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "11px", background: "#211d49", color: "#b99cff", fontWeight: 800 }}>{icon}</span>
                      <span><strong style={{ display: "block" }}>{title}</strong><small style={{ color: "#7890b2" }}>{subtitle}</small></span>
                      <span style={{ color: "#a47bff", fontSize: "18px" }}>{paymentMethod === id ? "●" : "○"}</span>
                    </button>
                  ))}
                </div>
              </div>

              {paymentMethod === "upi" && cart.length > 0 && (
                <div style={{ marginTop: "18px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: 700 }}>UPI ID</label>
                  <input value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="demo@upi" disabled={processingPayment} style={{ width: "100%", boxSizing: "border-box", padding: "14px", borderRadius: "11px", border: "1px solid #33496d", background: "#081222", color: "#fff" }} />
                  <small style={{ display: "block", marginTop: "7px", color: "#7288aa" }}>🔒 Demo UPI only — no real money will be charged.</small>
                </div>
              )}

              {paymentMethod !== "upi" && cart.length > 0 && (
                <div style={{ marginTop: "18px", padding: "16px", borderRadius: "12px", border: "1px dashed #40577c", background: "#0a1527", color: "#9aadd0", fontSize: "13px" }}>
                  🧪 This prototype simulates {paymentMethod === "card" ? "card" : "net banking"} payment. No real financial credentials are required.
                </div>
              )}

              <div className="payment-total" style={{ marginTop: "24px" }}>
                <span>Total payable</span>
                <strong>₹{currentTotalFee.toLocaleString("en-IN")}</strong>
              </div>

              {paymentStatus === "processing" && (
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "18px", padding: "14px", borderRadius: "12px", background: "#151d38", border: "1px solid #4a3b7f" }}>
                  <span style={{ fontSize: "28px", color: "#a981ff" }}>◌</span>
                  <span><strong style={{ display: "block" }}>Processing payment...</strong><small style={{ color: "#8298ba" }}>Verifying transaction securely</small></span>
                </div>
              )}

              <div className="payment-actions">
                <button type="button" className="back-button" onClick={goToPrevStep} disabled={processingPayment}>← Back</button>
                <button type="button" className="primary-button" onClick={completePayment} disabled={processingPayment || cart.length === 0}>
                  {processingPayment ? "Processing..." : `Pay ₹${currentTotalFee.toLocaleString("en-IN")}`}
                  {!processingPayment && <span>→</span>}
                </button>
              </div>
            </div>

            <div className="payment-info">
              <div className="payment-info-icon">⚡</div>
              <h3>Fast & simple</h3>
              <p>Complete your registration payment in seconds.</p>

              <div className="sandbox-warning">
                <strong>Items in Cart</strong><span>{cart.length}</span>
              </div>
              <div className="sandbox-warning">
                <strong>Total Fee</strong><span>₹{currentTotalFee.toLocaleString("en-IN")}</span>
              </div>
              <div className="sandbox-warning">
                <strong>Identity</strong><span className="green-text">✓ DigiLocker Verified</span>
              </div>
              <div className="sandbox-warning">
                <strong>Demo Environment</strong><span>No real money will be charged.</span>
              </div>
            </div>
          </div>
        </div>
      </Page>
    );
  }

  /* ============================================================
     SUCCESS
  ============================================================ */
  if (activeStepId === "success") {
    return (
      <Page currentStep={activeStepId} onHome={goHome} flowConfig={activeFlow} currentIndex={currentStepIndex} currentUserUid={currentUserUid} handleLogout={handleLogout} openAdmin={openAdmin}>
        <div className="success-page">
          <div className="success-large-icon">✓</div>
          <div className="success-badge">REGISTRATION SUCCESSFUL</div>
          <h1>You're all set.</h1>
          <p className="description">Your registration has been successfully completed and recorded.</p>

          <div className="registration-id-card">
            <span>YOUR REGISTRATION ID</span><strong>{registrationId}</strong><small>Keep this ID for future reference.</small>
          </div>

          <div className="success-summary">
            <div><span>Applicant</span><strong>{verifiedProfile?.name || "Verified Applicant"}</strong></div>
            <div><span>UID</span><strong>{currentUserUid || "Verified"}</strong></div>
            <div><span>Verification</span><strong className="green-text">✓ Verified</strong></div>
            <div><span>Payment</span><strong className="green-text">✓ Paid — ₹{currentTotalFee.toLocaleString("en-IN")}</strong></div>
            <div><span>Payment ID</span><strong>{paymentId || "Sandbox transaction"}</strong></div>
            <div><span>Status</span><strong className="green-text">✓ Successful</strong></div>
          </div>

          <div className="success-actions">
            <button type="button" className="primary-button" onClick={downloadReceipt}>Download Receipt <span>↓</span></button>
            <button type="button" className="back-button" onClick={goHome}>Return to Home</button>
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
function Page({ children, currentStep, onHome, onCopilot, flowConfig, currentIndex, currentUserUid, handleLogout, openAdmin }) {
  const visibleSteps = flowConfig.filter((step) => step.showInProgress);

  return (
    <div className="app">
      <header className="navbar">
        <div className="brand" onClick={onHome}>
          <div className="brand-mark">SR</div>
          <div><h2>SmartRegTech</h2><p>Digital Registration & Compliance</p></div>
        </div>
        <div className="nav-buttons">
          {onCopilot && (
            <button type="button" className="nav-button secondary" onClick={onCopilot}><span>✦</span> AI Copilot</button>
          )}
          {openAdmin && (
            <button type="button" className="nav-button" onClick={openAdmin}><span>▦</span> Admin Analytics</button>
          )}
          {currentUserUid ? (
            <button type="button" className="nav-button secondary" onClick={handleLogout}>Logout ({currentUserUid})</button>
          ) : (
            <div className="secure-nav"><span>●</span> Secure Session</div>
          )}
        </div>
      </header>

      <div className="progress-container">
        <div className="progress-steps">
          {visibleSteps.map((item) => {
            const originalIndex = flowConfig.findIndex((f) => f.id === item.id);
            const completed = currentIndex > originalIndex;
            const active = currentStep === item.id;

            return (
              <div className={`progress-step ${active ? "active" : ""} ${completed ? "completed" : ""}`} key={item.id}>
                <div className="progress-circle">{completed ? "✓" : visibleSteps.indexOf(item) + 1}</div>
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <main className="page-container">
        <section className="content-card">{children}</section>
      </main>
      <footer className="app-footer">SmartRegTech Prototype <span>•</span> Secure Digital Registration</footer>
    </div>
  );
}

/* ============================================================
   HELPER COMPONENTS
============================================================ */
function FeatureCard({ icon, title, text }) {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
      <div className="feature-arrow">→</div>
    </div>
  );
}

function WorkflowStep({ number, title, text }) {
  return (
    <div className="workflow-step">
      <div className="workflow-number">{number}</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

function VerifiedField({ label, value }) {
  return (
    <div className="verified-field">
      <span>{label}</span><strong>{value}</strong><small>✓ Verified</small>
    </div>
  );
}

function ReviewRow({ label, value, verified = false }) {
  return (
    <div className="review-row">
      <span>{label}</span>
      <strong>{verified && <span className="tiny-check">✓</span>}{value}</strong>
    </div>
  );
}

function getShortProgramName(program) {
  if (program.startsWith("B.A. LL.B")) return "B.A. LL.B (Honours)";
  if (program.startsWith("B.B.A. LL.B")) return "B.B.A. LL.B";
  if (program.startsWith("BBA")) return "BBA";
  if (program.startsWith("BCA")) return "BCA";
  if (program.startsWith("MCA")) return "MCA";
  if (program.startsWith("MBA")) return "MBA";
  if (program.startsWith("B.Com")) return "B.Com";
  if (program.startsWith("B.Sc")) return "B.Sc Computer Science";
  if (program.startsWith("B.Tech (Computer Science")) return "B.Tech CS & AI";
  if (program.startsWith("B.Tech")) return program.split(" – ")[1] || "B.Tech";
  return program;
}

export default App;