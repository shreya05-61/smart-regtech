import { useEffect, useRef, useState } from "react";
import "./App.css";
import AdminAnalytics from "./AdminAnalytics";
import "./SmartRegTech_OTP_Popup.css";
import "./new_digilocker.css";
import "./SmartRegTech_mobile_responsive.css";

const API_BASE = "https://smart-regtech.onrender.com";
const DEMO_IDENTITY = "999988887777";
const DEMO_OTP = "123456";

// ============================================================
// DYNAMIC PRESET WORKFLOWS
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
      { id: "success",  label: "Dashboard", showInProgress: true },
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
      { id: "success",  label: "Dashboard", showInProgress: true },
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
      { id: "success",  label: "Dashboard", showInProgress: true },
    ],
  },
};

const MOCK_DIGILOCKER_PROFILE = {
  source: "DigiLocker Sandbox / Mock Connector",
  document: "Identity & Education Profile",
  verifiedAt: "2026-08-16T10:30:00Z",
  name: "Rohan Verma",
  dob: "15/06/2004",
  gender: "Male",
  address: "Chennai, Tamil Nadu",
  email: "rohan.v@example.com",
  phone: "9876543210",
  photo: "RV",
  board: "CBSE",
  qualification: "Class X & Class XII",
  documentStatus: "Digitally verified",
};

const fetchMockDigiLockerProfile = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1800));
  return { ...MOCK_DIGILOCKER_PROFILE };
};

// ============================================================
// RELATIONAL DATA MODEL: EXPANDED COLLEGE & COURSE CATALOG
// ============================================================
const COURSE_CATALOG = {
  // Symbiosis
  "SIU-BTECH-CS": { university: "Symbiosis International University (Pune)", name: "B.Tech (Computer Science & Engineering)", exam: "SITEEE 2026", fee: 1500, eligibilityType: "PCM: 91.3%" },
  "SIU-BBA": { university: "Symbiosis International University (Pune)", name: "BBA (Honours)", exam: "SET 2026", fee: 1200, eligibilityType: "Aggregate: 92.8%" },
  "SIU-BALLB": { university: "Symbiosis International University (Pune)", name: "B.A. LL.B (Honours)", exam: "SLAT 2026", fee: 1500, eligibilityType: "Aggregate: 92.8%" },
  
  // VIT
  "VIT-BTECH-CS": { university: "Vellore Institute of Technology (VIT)", name: "B.Tech (Computer Science)", exam: "VITEEE 2026", fee: 1350, eligibilityType: "PCM: 91.3%" },
  "VIT-BTECH-EC": { university: "Vellore Institute of Technology (VIT)", name: "B.Tech (Electronics & Communication)", exam: "VITEEE 2026", fee: 1350, eligibilityType: "PCM: 91.3%" },
  "VIT-BCA": { university: "Vellore Institute of Technology (VIT)", name: "BCA (Data Analytics)", exam: "Merit Based Admission", fee: 800, eligibilityType: "Aggregate: 92.8%" },

  // BITS Pilani
  "BITS-BE-CS": { university: "Birla Institute of Technology and Science (BITS)", name: "B.E. (Computer Science)", exam: "BITSAT 2026", fee: 2000, eligibilityType: "PCM: 91.3%" },
  "BITS-BE-MECH": { university: "Birla Institute of Technology and Science (BITS)", name: "B.E. (Mechanical Engineering)", exam: "BITSAT 2026", fee: 2000, eligibilityType: "PCM: 91.3%" },
  "BITS-BPHARM": { university: "Birla Institute of Technology and Science (BITS)", name: "B.Pharm (Honours)", exam: "BITSAT 2026", fee: 1800, eligibilityType: "PCB/PCM: 91.3%" },

  // Delhi University
  "DU-BCOM": { university: "Delhi University (DU)", name: "B.Com (Honours)", exam: "CUET UG 2026", fee: 500, eligibilityType: "Aggregate: 92.8%" },
  "DU-BA-ECO": { university: "Delhi University (DU)", name: "B.A. (Honours) Economics", exam: "CUET UG 2026", fee: 500, eligibilityType: "Aggregate: 92.8%" },
  "DU-BSC-MATH": { university: "Delhi University (DU)", name: "B.Sc. (Honours) Mathematics", exam: "CUET UG 2026", fee: 500, eligibilityType: "PCM: 91.3%" },

  // IIM Rohtak
  "IIM-IPM": { university: "Indian Institute of Management (IIM) Rohtak", name: "Five Year Integrated Programme in Management (IPM)", exam: "IPMAT 2026", fee: 2500, eligibilityType: "Aggregate: 92.8%" },

  // IIT Bombay
  "IITB-BTECH-CS": { university: "Indian Institute of Technology (IIT) Bombay", name: "B.Tech in Computer Science and Engineering", exam: "JEE Advanced 2026", fee: 3000, eligibilityType: "JEE Adv Top Ranks" },
  "IITB-BTECH-EE": { university: "Indian Institute of Technology (IIT) Bombay", name: "B.Tech in Electrical Engineering", exam: "JEE Advanced 2026", fee: 3000, eligibilityType: "JEE Adv Top Ranks" },

  // Anna University
  "ANNA-BTECH-IT": { university: "Anna University (CEG Campus, Chennai)", name: "B.Tech (Information Technology)", exam: "TNEA Counseling 2026", fee: 1000, eligibilityType: "PCM Cutoff: 195+" },
  "ANNA-BE-CIVIL": { university: "Anna University (CEG Campus, Chennai)", name: "B.E. (Civil Engineering)", exam: "TNEA Counseling 2026", fee: 1000, eligibilityType: "PCM Cutoff: 180+" },

  // Manipal Academy of Higher Education (MAHE)
  "MAHE-BTECH-AI": { university: "Manipal Academy of Higher Education (MAHE)", name: "B.Tech (Artificial Intelligence & Machine Learning)", exam: "MET 2026", fee: 1600, eligibilityType: "PCM: 85%+" },
  "MAHE-BBA": { university: "Manipal Academy of Higher Education (MAHE)", name: "BBA (FinTech)", exam: "Merit Based Admission", fee: 1200, eligibilityType: "Aggregate: 80%+" },

  // SRM Institute of Science and Technology
  "SRM-BTECH-IOT": { university: "SRM Institute of Science and Technology", name: "B.Tech (Cloud Computing & IoT)", exam: "SRMJEE 2026", fee: 1200, eligibilityType: "PCM: 75%+" },
  "SRM-BARCH": { university: "SRM Institute of Science and Technology", name: "Bachelor of Architecture (B.Arch)", exam: "NATA 2026", fee: 1500, eligibilityType: "NATA Qualified + PCM" }
};

const EXAM_SCHEDULE_OPTIONS = {
  "SITEEE 2026": ["May 05, 2026 | Afternoon Shift"],
  "SET 2026": ["May 05, 2026 | Morning Shift"],
  "SLAT 2026": ["May 05, 2026 | Morning Shift"],
  "VITEEE 2026": ["Apr 21, 2026 | Slot 1", "Apr 22, 2026 | Slot 2", "Apr 23, 2026 | Slot 3"],
  "BITSAT 2026": ["May 20, 2026 | Morning", "May 21, 2026 | Afternoon", "May 22, 2026 | Morning"],
  "CUET UG 2026": ["May 15, 2026 | Slot 1", "May 16, 2026 | Slot 2", "May 17, 2026 | Slot 3"],
  "IPMAT 2026": ["May 18, 2026 | Morning", "May 19, 2026 | Afternoon"],
  "JEE Advanced 2026": ["Jun 04, 2026 | Shift 1 (9 AM)", "Jun 04, 2026 | Shift 2 (2 PM)"],
  "TNEA Counseling 2026": ["Online Document Verification Slot (Flexible)"],
  "MET 2026": ["May 10, 2026 | Slot 1", "May 11, 2026 | Slot 2"],
  "SRMJEE 2026": ["Apr 25, 2026 | Remote Proctored Slot 1", "Apr 26, 2026 | Remote Proctored Slot 2"],
  "NATA 2026": ["May 30, 2026 | Morning Session"]
};

const CITIES = ["Pune", "Bengaluru", "Delhi NCR", "Chennai", "Hyderabad", "Mumbai", "Kolkata", "Ahmedabad", "Kochi", "Jaipur"];

const getRequiredExams = (cart) => {
  const exams = new Set();
  if (Array.isArray(cart)) {
    cart.forEach(program => {
      if (COURSE_CATALOG[program]?.exam && COURSE_CATALOG[program].exam !== "Merit Based Admission") {
        exams.add(COURSE_CATALOG[program].exam);
      }
    });
  }
  return Array.from(exams);
};

// Helper to check if any selected exam actually requires a physical test center
const requiresTestCenter = (examsList) => {
  return examsList.some(exam => !exam.includes("Online Document Verification") && !exam.includes("Remote Proctored"));
};

function getCopilotAnswer(question) {
  const q = question.toLowerCase();
  if (q.includes("digilocker") || q.includes("verification")) return "The prototype follows a realistic identity verification flow: enter the demo 12-digit identity number, verify a demo OTP, and provide consent to securely fetch profile details.";
  if (q.includes("login") || q.includes("password") || q.includes("uid") || q.includes("resume")) return "Once your identity is verified, the system automatically generates an Application ID (UID) and Password. You can use these on the Login page to resume your application anytime.";
  if (q.includes("cart") || q.includes("courses") || q.includes("program") || q.includes("exam")) return "You can select multiple programs. The system looks up each program in our academic database and automatically assigns the exact entrance exams required for those specific universities.";
  if (q.includes("payment") || q.includes("fee") || q.includes("upi")) return "Payment is handled through a sandbox environment. We support simulated UPI, Card, and Netbanking. No real money is charged during this prototype phase.";
  if (q.includes("process") || q.includes("registration") || q.includes("steps")) return "The workflow is: 1. Verify Identity 2. Select Programs & Test Preferences 3. Review Application 4. Complete Payment 5. Dashboard.";
  return `I am currently in prototype fallback mode. Once connected to a live LLM via the FastAPI backend, I will be able to fully answer: "${question}"`;
}

function AICopilot({ onClose }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! 👋 I'm the SmartRegTech Copilot. Ask me anything about your registration, courses, payments, or general queries!",
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

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000); 
      const response = await fetch(`${API_BASE}/api/copilot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (!response.ok) throw new Error("Backend AI not connected yet");
      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", text: data.answer || data.reply }]);
    } catch (error) {
      await new Promise((resolve) => setTimeout(resolve, 600)); 
      const fallbackAnswer = getCopilotAnswer(trimmed);
      setMessages((prev) => [...prev, { role: "assistant", text: fallbackAnswer }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") sendMessage();
  };

  return (
    <div className="copilot-overlay" style={{ zIndex: 9999 }}>
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
          <button onClick={() => sendMessage("What is the registration process?")}>Process</button>
        </div>
        <div className="copilot-input-row">
          <input type="text" placeholder="Ask any question..." value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={handleKeyDown} disabled={loading} />
          <button onClick={() => sendMessage()} disabled={loading || !input.trim()}>{loading ? "..." : "Send"}</button>
        </div>
        <div className="copilot-note">SmartRegTech Copilot • Connects to FastAPI Backend</div>
      </div>
    </div>
  );
}

function App() {
  const [mockUsersDB, setMockUsersDB] = useState(() => {
    try {
      const saved = localStorage.getItem("smartRegUsers");
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("smartRegUsers", JSON.stringify(mockUsersDB));
  }, [mockUsersDB]);

  const [currentUserUid, setCurrentUserUid] = useState(null);
  const [currentView, setCurrentView] = useState("home");
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [highestStepIndex, setHighestStepIndex] = useState(0); 
  
  const [selectedPreset, setSelectedPreset] = useState("standard");
  const [activeFlow, setActiveFlow] = useState(PRESET_FLOWS.standard.steps);
  const [showCopilot, setShowCopilot] = useState(false);
  const [showLoginPwd, setShowLoginPwd] = useState(false);
  const [registrationId, setRegistrationId] = useState("");
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  
  // Card input states for realistic sandbox payment
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const [paymentStatus, setPaymentStatus] = useState("idle");
  const [paymentId, setPaymentId] = useState("");
  const [identityPhase, setIdentityPhase] = useState("aadhaar");
  const [otp, setOtp] = useState("");
  const otpInputRefs = useRef([]);
  const [otpSeconds, setOtpSeconds] = useState(30);
  const [consentGiven, setConsentGiven] = useState(false);
  const [fetchStatus, setFetchStatus] = useState("idle");
  const [verifiedProfile, setVerifiedProfile] = useState(null);
  
  const [cityPreferences, setCityPreferences] = useState({ pref1: "Chennai", pref2: "Bengaluru", pref3: "Hyderabad" });
  const [selectedExamSlots, setSelectedExamSlots] = useState({});

  const [activeDocument, setActiveDocument] = useState(null);
  
  const [showWhatsAppAlert, setShowWhatsAppAlert] = useState(false);
  const [alertDismissed, setAlertDismissed] = useState(false);

  const [newAccountDetails, setnewAccountDetails] = useState(null); 

  const [formData, setFormData] = useState({ identity: "" });
  const [cart, setCart] = useState([]);

  const currentTotalFee = (Array.isArray(cart) ? cart : []).reduce((sum, program) => sum + (COURSE_CATALOG[program]?.fee || 500), 0);
  
  const activeStepId = currentView === "flow" ? (activeFlow[currentStepIndex]?.id || "home") : currentView;
  const requiredExamsList = getRequiredExams(cart);
  const showCenterPreferences = requiredExamsList.length > 0 && requiresTestCenter(requiredExamsList);

  useEffect(() => {
    if (currentStepIndex > highestStepIndex) {
      setHighestStepIndex(currentStepIndex);
    }
    
    if (activeFlow[currentStepIndex]?.id === "success" && !alertDismissed && !showWhatsAppAlert) {
      const timer = setTimeout(() => {
        if (!alertDismissed) setShowWhatsAppAlert(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentStepIndex, highestStepIndex, activeFlow, alertDismissed, showWhatsAppAlert]);

  useEffect(() => {
    if (currentUserUid) {
      setMockUsersDB(prev => {
        if (!Array.isArray(prev)) return [];
        return prev.map(user => 
          user.uid === currentUserUid 
            ? { ...user, cart, formData, currentStepIndex, highestStepIndex, verifiedProfile, activeFlowKey: selectedPreset, cityPreferences, selectedExamSlots } 
            : user
        );
      });
    }
  }, [cart, formData, currentStepIndex, highestStepIndex, verifiedProfile, selectedPreset, currentUserUid, cityPreferences, selectedExamSlots]);

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

  const generateCredentials = () => {
    const year = new Date().getFullYear();
    const randomNumbers = Math.floor(10000 + Math.random() * 90000);
    const uid = `${year}${randomNumbers}`;
    const pwd = "demo123";
    return { uid, pwd };
  };

  const handleLogout = () => {
    setCurrentUserUid(null);
    setCart([]);
    setFormData({ identity: "" });
    setCityPreferences({ pref1: "Chennai", pref2: "Bengaluru", pref3: "Hyderabad" });
    setSelectedExamSlots({});
    setVerifiedProfile(null);
    setCurrentStepIndex(0);
    setHighestStepIndex(0);
    setIdentityPhase("aadhaar");
    setActiveDocument(null);
    setShowWhatsAppAlert(false);
    setAlertDismissed(false);
    setnewAccountDetails(null);
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
            formData: { identity: formData.identity },
            currentStepIndex: currentStepIndex + 1,
            highestStepIndex: currentStepIndex + 1,
            verifiedProfile: profile,
            activeFlowKey: selectedPreset,
            cityPreferences: { pref1: "Chennai", pref2: "Bengaluru", pref3: "Hyderabad" },
            selectedExamSlots: {}
          };
          setMockUsersDB(prev => Array.isArray(prev) ? [...prev, newUser] : [newUser]);
          setCurrentUserUid(uid);
          setnewAccountDetails({ uid, pwd });
        } else {
          setTimeout(() => goToNextStep(), 700);
        }
      } catch (error) {
        console.error(error);
        setFetchStatus("error");
        setIdentityPhase("otp");
        alert("The sandbox could not retrieve the profile.");
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
      setFormData({ identity: "" });
      setCityPreferences({ pref1: "Chennai", pref2: "Bengaluru", pref3: "Hyderabad" });
      setSelectedExamSlots({});
      setActiveFlow(PRESET_FLOWS[selectedPreset].steps);
      setCurrentStepIndex(0);
      setHighestStepIndex(0);
      setActiveDocument(null);
      setShowWhatsAppAlert(false);
      setAlertDismissed(false);
      setnewAccountDetails(null);
    }
    setCurrentView("flow");
  };

  const verifyIdentity = () => {
    if (!/^\d{12}$/.test(formData.identity) && formData.identity !== DEMO_IDENTITY) {
      alert("Please enter a valid 12-digit demo identity number.");
      return;
    }
    if (formData.identity !== DEMO_IDENTITY) {
      alert(`For this prototype, use the demo identity number.`);
      return;
    }
    setOtp("");
    setOtpSeconds(30);
    setIdentityPhase("otp");
    setTimeout(() => { otpInputRefs.current[0]?.focus(); }, 100);
  };

  const verifyOtp = () => {
    if (otp !== DEMO_OTP) {
      alert(`Invalid demo OTP. Use ${DEMO_OTP} for this prototype.`);
      return;
    }
    const digiLockerWindow = window.open("", "_blank", "width=560,height=820,resizable=yes,scrollbars=yes");
    if (!digiLockerWindow) {
      alert("The Sandbox window was blocked. Please allow pop-ups for this website and try again.");
      return;
    }

    const digiLockerHTML = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>DigiLocker Sandbox</title><style>*{box-sizing:border-box} body{margin:0;background:#f5f7fb;color:#172033;font-family:Arial,Helvetica,sans-serif}.top{height:70px;background:#fff;border-bottom:1px solid #e2e6ee;display:flex;align-items:center;justify-content:space-between;padding:0 24px}.brand{display:flex;align-items:center;gap:11px} .logo{width:42px;height:42px;border-radius:10px;background:#673de6;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800}.brand strong{display:block;color:#42229e;font-size:19px} .brand span{display:block;color:#7a8494;font-size:9px;margin-top:2px}.badge{padding:7px 11px;border-radius:20px;background:#fff3dc;color:#986300;font-size:9px;font-weight:800;letter-spacing:1px}.page{width:calc(100% - 30px);max-width:620px;margin:30px auto} .hero{text-align:center;margin-bottom:20px}.lock{width:58px;height:58px;margin:auto;border-radius:50%;background:#eee8ff;display:flex;align-items:center;justify-content:center;font-size:26px}.hero h1{margin:14px 0 6px;font-size:24px} .hero p{margin:0;color:#6e7889;font-size:12px;line-height:1.6}.card{background:#fff;border:1px solid #e0e4eb;border-radius:17px;padding:25px;box-shadow:0 15px 45px rgba(50,35,100,.10)}.label{color:#6740d5;font-size:10px;font-weight:800;letter-spacing:1px;margin-bottom:12px}.app{display:flex;align-items:center;gap:12px;padding:15px;border:1px solid #e2e5ec;border-radius:12px;background:#faf9ff}.appLogo{width:44px;height:44px;border-radius:11px;background:#7044df;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800}.app strong{display:block;font-size:15px} .app small{display:block;margin-top:3px;color:#7c8492;font-size:10px}.secure{margin-left:auto;color:#16804c;font-size:9px;font-weight:800} .request{margin-top:22px} .request h2{margin:0;font-size:18px}.request p{margin:8px 0 0;color:#6f7889;font-size:12px;line-height:1.6}.info{margin-top:20px;padding:17px;border-radius:12px;background:#f7f5ff} .infoTitle{color:#5932c9;font-size:11px;font-weight:800;margin-bottom:13px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:11px} .item{font-size:11px;color:#4f596b}.item::before{content:'✓';color:#16804c;font-weight:900;margin-right:7px}.consent{display:flex;gap:9px;align-items:flex-start;margin-top:21px;color:#4d586b;font-size:11px;line-height:1.6;cursor:pointer}.consent input{width:16px;height:16px;accent-color:#673de6}.allow,.cancel{width:100%;padding:13px;border-radius:9px;font-weight:800;font-size:12px;cursor:pointer}.allow{margin-top:21px;border:0;background:#673de6;color:#fff}.allow:disabled{opacity:.45;cursor:not-allowed}.cancel{margin-top:9px;border:1px solid #d9dce4;background:#fff;color:#667084}.footer{text-align:center;margin-top:18px;color:#89919f;font-size:9px;line-height:1.7}.loading,.success{text-align:center;padding:35px 0}.spinner{width:40px;height:40px;margin:0 auto 15px;border:4px solid #e8e1ff;border-top-color:#673de6;border-radius:50%;animation:spin .8s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}.successIcon{width:58px;height:58px;margin:0 auto 14px;border-radius:50%;background:#e6f8ee;color:#16804c;display:flex;align-items:center;justify-content:center;font-size:27px}.success h2{margin:0;font-size:20px}.success p{color:#6c7587;font-size:12px;line-height:1.6}@media(max-width:600px){.top{padding:0 15px}.badge{display:none}.card{padding:20px}.grid{grid-template-columns:1fr}}</style></head><body><header class="top"> <div class="brand"><div class="logo">DL</div><div><strong>DigiLocker</strong><span>Document Wallet to Empower Citizens</span></div></div> <div class="badge">SANDBOX</div></header><main class="page"> <div class="hero"><div class="lock">🔐</div><h1>Secure Authorization</h1><p>Review the information requested by SmartRegTech before continuing.</p></div> <div class="card" id="card"> <div class="label">APPLICATION REQUESTING ACCESS</div> <div class="app"><div class="appLogo">SR</div><div><strong>SmartRegTech</strong><small>Digital Registration &amp; Compliance Portal</small></div><div class="secure">✓ SECURE</div></div> <div class="request"><h2>Allow SmartRegTech to access your information?</h2><p>SmartRegTech is requesting permission to retrieve verified information for completing your registration.</p></div> <div class="info"><div class="infoTitle">INFORMATION REQUESTED</div><div class="grid"><div class="item">Full Name</div><div class="item">Date of Birth</div><div class="item">Gender</div><div class="item">Address</div><div class="item">Education Details</div><div class="item">Board / Qualification</div></div></div> <label class="consent"><input type="checkbox" id="consent" /><span>I authorize SmartRegTech to access the requested information for registration purposes.</span></label> <button class="allow" id="allow" disabled>Allow &amp; Continue →</button> <button class="cancel" onclick="window.close()">Cancel</button> <div class="footer">🔒 Secure sandbox environment<br/>Prototype only — no real account or government documents are accessed.</div> </div></main><script>const consent=document.getElementById('consent');const allow=document.getElementById('allow');const card=document.getElementById('card');consent.addEventListener('change',()=>{allow.disabled=!consent.checked});allow.addEventListener('click',()=>{ allow.disabled=true; card.innerHTML='<div class="loading"><div class="spinner"></div><h2>Authorizing...</h2><p>Securely processing your consent and retrieving your verified information.</p></div>'; setTimeout(()=>{ card.innerHTML='<div class="success"><div class="successIcon">✓</div><h2>Authorization Successful</h2><p>Your consent has been recorded successfully.</p><p>Returning to SmartRegTech...</p></div>'; if(window.opener&&!window.opener.closed){window.opener.postMessage({type:'DIGILOCKER_APPROVED'},window.location.origin);} setTimeout(()=>window.close(),1200); },1800);});</script></body></html>`;
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
          formData: { identity: formData.identity },
          currentStepIndex: currentStepIndex + 1,
          highestStepIndex: currentStepIndex + 1,
          verifiedProfile: profile,
          activeFlowKey: selectedPreset,
          cityPreferences: { pref1: "Chennai", pref2: "Bengaluru", pref3: "Hyderabad" },
          selectedExamSlots: {}
        };
        setMockUsersDB(prev => Array.isArray(prev) ? [...prev, newUser] : [newUser]);
        setCurrentUserUid(uid);
        setnewAccountDetails({ uid, pwd });
      } else {
        setTimeout(() => goToNextStep(), 700);
      }
    } catch (error) {
      console.error(error);
      setFetchStatus("error");
      setIdentityPhase("consent");
      alert("The mock connector could not retrieve the profile.");
    }
  };

  const continueFromForm = () => {
    if (cart.length === 0) {
      alert("Please select at least one program to add to your cart.");
      return;
    }
    const missingSlots = requiredExamsList.filter(exam => !selectedExamSlots[exam]);
    if (missingSlots.length > 0) {
      alert(`Please select your preferred Date & Shift for: ${missingSlots.join(", ")}`);
      return;
    }
    if (showCenterPreferences && (!cityPreferences.pref1 || !cityPreferences.pref2 || !cityPreferences.pref3)) {
      alert("Please select all 3 City Preferences for the entrance examination center.");
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
    if (paymentMethod === "upi" && (!upiId.trim() || !upiId.includes("@"))) {
      alert("Please enter a valid demo UPI ID, for example demo@upi.");
      return;
    }
    if (paymentMethod === "card" && (cardNumber.replace(/\s/g, "").length < 16 || !cardExpiry || !cardCvv)) {
      alert("Please enter valid sandbox card details (16-digit card number, expiry, and CVV).");
      return;
    }

    setProcessingPayment(true);
    setPaymentStatus("processing");
    try {
      let currentRegistrationId = registrationId;
      if (!currentRegistrationId) {
        const registerResponse = await fetch(`${API_BASE}/api/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: verifiedProfile?.name || "Rohan Verma",
            email: verifiedProfile?.email || "rohan.v@example.com",
            phone: verifiedProfile?.phone || "9876543210",
            program: cart.join(", "),
          }),
        });
        if (!registerResponse.ok) throw new Error("Registration request failed.");
        const registerData = await registerResponse.json();
        if (!registerData.success) throw new Error(registerData.message || "Registration failed.");
        currentRegistrationId = registerData.registration_id;
        setRegistrationId(currentRegistrationId);
      }

      await new Promise((resolve) => setTimeout(resolve, 1800));

      const paymentResponse = await fetch(`${API_BASE}/api/payment/${currentRegistrationId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: currentTotalFee, program: cart.join(", ") }),
      });
      if (!paymentResponse.ok) throw new Error("Payment request failed.");
      const paymentData = await paymentResponse.json();
      if (!paymentData.success) throw new Error(paymentData.message || "Payment failed.");
      
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
    const examsSummaryHTML = requiredExamsList.map(e => `• ${e} (${selectedExamSlots[e]})`).join("<br/>");
    const receiptHTML = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>SmartRegTech Registration Receipt</title><style>body { font-family: Arial, sans-serif; background: #f4f5fb; margin: 0; padding: 40px; color: #182033; }.receipt { max-width: 700px; margin: auto; background: white; padding: 40px; border-radius: 16px; box-shadow: 0 8px 30px rgba(0,0,0,0.12); }.header { text-align: center; border-bottom: 2px solid #6c4cff; padding-bottom: 20px; margin-bottom: 25px; }.logo { font-size: 30px; font-weight: bold; color: #6c4cff; }.subtitle { color: #666; margin-top: 5px; }.success { text-align: center; color: #159957; font-size: 20px; font-weight: bold; margin: 20px 0; }.registration-id { text-align: center; background: #f0edff; padding: 18px; border-radius: 10px; margin: 25px 0; }.registration-id strong { display: block; font-size: 24px; color: #6c4cff; margin-top: 8px; }.row { display: flex; justify-content: space-between; gap: 30px; padding: 14px 0; border-bottom: 1px solid #e5e5e5; }.label { color: #666; }.value { font-weight: bold; text-align: right; }.footer { margin-top: 30px; text-align: center; font-size: 13px; color: #777; }</style></head><body><div class="receipt"> <div class="header"> <div class="logo">SmartRegTech</div> <div class="subtitle">Zero-Friction Registration Portal</div> </div> <div class="success">✓ REGISTRATION SUCCESSFUL</div> <div class="registration-id">Registration ID<strong>${registrationId}</strong></div> <div class="row"><span class="label">Applicant Name</span><span class="value">${verifiedProfile?.name || "Verified Applicant"}</span></div> <div class="row"><span class="label">Identity Verification</span><span class="value">Sandbox — Consent + Mock JSON</span></div> <div class="row"><span class="label">Mobile Number</span><span class="value">${verifiedProfile?.phone || "9876543210"}</span></div> <div class="row"><span class="label">Email</span><span class="value">${verifiedProfile?.email || "rohan.v@example.com"}</span></div> <div class="row"><span class="label">Programs Enrolled</span><span class="value">${cart.map(id => COURSE_CATALOG[id]?.name).join(", ")}</span></div> <div class="row"><span class="label">Assigned Entrance Exams</span><span class="value">${examsSummaryHTML || "Merit Based (No Exam)"}</span></div> <div class="row"><span class="label">Test Center Preferences</span><span class="value">${showCenterPreferences ? `${cityPreferences.pref1}, ${cityPreferences.pref2}, ${cityPreferences.pref3}` : "Online / Direct Counseling"}</span></div> <div class="row"><span class="label">Total Registration Fee</span><span class="value">₹${currentTotalFee.toLocaleString("en-IN")}</span></div> <div class="row"><span class="label">Payment Status</span><span class="value">Paid — Sandbox</span></div> <div class="row"><span class="label">Application Status</span><span class="value">Registration Successful</span></div> <div class="row"><span class="label">Date</span><span class="value">${new Date().toLocaleDateString()}</span></div> <div class="footer">This receipt was generated by the SmartRegTech prototype.<br />Payment integrations are simulated for demonstration purposes.</div></div></body></html>`;
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

  const downloadAdmitCard = (item, catalogEntry) => {
    const examName = catalogEntry.exam || "Merit Based Admission";
    const slotInfo = selectedExamSlots[examName] || "Direct Counseling Slot";
    const centerInfo = showCenterPreferences ? (cityPreferences?.pref1 || "Chennai") : "Online / Remote Verification";
    
    const admitCardHTML = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>SmartRegTech Admit Card</title><style>body { font-family: Arial, sans-serif; background: #f4f5fb; margin: 0; padding: 40px; color: #182033; }.card { max-width: 650px; margin: auto; background: white; padding: 40px; border-radius: 16px; box-shadow: 0 8px 30px rgba(0,0,0,0.12); border-top: 6px solid #6c4cff; }.header { text-align: center; border-bottom: 2px solid #e5e5e5; padding-bottom: 20px; margin-bottom: 25px; }.logo { font-size: 26px; font-weight: bold; color: #6c4cff; }.title { font-size: 18px; font-weight: bold; color: #333; margin-top: 5px; }.badge { background: #e6f8ee; color: #16804c; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; display: inline-block; margin-top: 10px; }.row { display: flex; justify-content: space-between; gap: 20px; padding: 12px 0; border-bottom: 1px solid #f0f0f0; }.label { color: #666; font-size: 14px; }.value { font-weight: bold; text-align: right; font-size: 14px; }.instructions { margin-top: 30px; background: #f8fafc; padding: 15px; border-radius: 8px; font-size: 12px; color: #555; line-height: 1.5; }</style></head><body><div class="card"><div class="header"><div class="logo">SmartRegTech</div><div class="title">OFFICIAL ENTRANCE EXAMINATION ADMIT CARD</div><div class="badge">VERIFIED & APPROVED</div></div><div class="row"><span class="label">Applicant Name</span><span class="value">${verifiedProfile?.name || "Verified Applicant"}</span></div><div class="row"><span class="label">Application ID (UID)</span><span class="value">${currentUserUid}</span></div><div class="row"><span class="label">Enrolled Program</span><span class="value">${catalogEntry.name || item}</span></div><div class="row"><span class="label">University / Institution</span><span class="value">${catalogEntry.university}</span></div><div class="row"><span class="label">Assigned Examination</span><span class="value">${examName}</span></div><div class="row"><span class="label">Test Slot & Date</span><span class="value">${slotInfo}</span></div><div class="row"><span class="label">Allocated Test Center</span><span class="value">${centerInfo}</span></div><div class="instructions"><strong>Important Instructions:</strong><br>1. Please carry a hard copy of this admit card along with a valid government-issued photo ID.<br>2. Reach the test center at least 45 minutes prior to the scheduled shift time.<br>3. Electronic devices and calculators are strictly prohibited inside the examination hall.</div></div></body></html>`;
    
    const blob = new Blob([admitCardHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `AdmitCard_${examName.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (currentView === "login") {
    return (
      <div className="app">
        <header className="navbar"><div className="brand" onClick={goHome}><div className="brand-mark">SR</div><div><h2>SmartRegTech</h2><p>Digital Registration & Compliance</p></div></div><div className="nav-buttons"><button type="button" className="nav-button secondary" onClick={() => setShowCopilot(true)}><span>✦</span> AI Copilot</button></div></header>
        <main className="page-container" style={{ maxWidth: "500px", margin: "50px auto" }}>
          <section className="content-card form-panel">
            <h2>Login to Resume Registration</h2>
            <p className="description">Enter the Application ID (UID) and password generated during your identity verification.</p>
            <div className="form-group" style={{ marginTop: "20px" }}><label>APPLICATION ID (UID)</label><input type="text" id="loginUid" placeholder="e.g. 202612345" /></div>
            <div className="form-group">
              <label>PASSWORD</label>
              <div style={{ position: "relative" }}>
                <input type={showLoginPwd ? "text" : "password"} id="loginPwd" placeholder="Enter your password" style={{ width: "100%", paddingRight: "50px", boxSizing: "border-box" }} />
                <button type="button" onClick={() => setShowLoginPwd(!showLoginPwd)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "12px", fontWeight: "bold", color: "#a5b4fc", padding: 0 }} title={showLoginPwd ? "Hide Password" : "Show Password"}>{showLoginPwd ? "HIDE" : "SHOW"}</button>
              </div>
            </div>
            <button type="button" className="primary-button full" onClick={() => {
              const uid = document.getElementById("loginUid").value.trim();
              const pwd = document.getElementById("loginPwd").value.trim();
              const user = (Array.isArray(mockUsersDB) ? mockUsersDB : []).find(u => u.uid === uid && u.password === pwd);
              if (user) {
                setCurrentUserUid(uid); setCart(user.cart || []); setFormData(user.formData); setVerifiedProfile(user.verifiedProfile); setSelectedPreset(user.activeFlowKey); setCityPreferences(user.cityPreferences || { pref1: "Chennai", pref2: "Bengaluru", pref3: "Hyderabad" }); setSelectedExamSlots(user.selectedExamSlots || {}); setActiveFlow(PRESET_FLOWS[user.activeFlowKey].steps); setCurrentStepIndex(user.currentStepIndex); setHighestStepIndex(user.highestStepIndex || user.currentStepIndex); setCurrentView("flow");
              } else {
                alert("Invalid UID or Password. Please check your credentials and try again.");
              }
            }}>Login & Resume <span>→</span></button>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "15px" }}><button type="button" className="nav-button" onClick={() => setCurrentView("forgotPwd")}>Forgot Password?</button><button type="button" className="nav-button" onClick={goHome}>Cancel</button></div>
          </section>
        </main>
        {showCopilot && <AICopilot onClose={() => setShowCopilot(false)} />}
      </div>
    );
  }

  if (currentView === "forgotPwd") {
    return (
      <div className="app">
        <header className="navbar"><div className="brand" onClick={goHome}><div className="brand-mark">SR</div><div><h2>SmartRegTech</h2><p>Digital Registration & Compliance</p></div></div><div className="nav-buttons"><button type="button" className="nav-button secondary" onClick={() => setShowCopilot(true)}><span>✦</span> AI Copilot</button></div></header>
        <main className="page-container" style={{ maxWidth: "500px", margin: "50px auto" }}>
          <section className="content-card form-panel">
            <h2>Forgot Password</h2>
            <p className="description">Enter your Application ID (UID) to receive a password reset link.</p>
            <div className="form-group" style={{ marginTop: "20px" }}><label>APPLICATION ID (UID)</label><input type="text" id="resetUid" placeholder="2026XXXXX" /></div>
            <button type="button" className="primary-button full" onClick={() => {
              const uid = document.getElementById("resetUid").value.trim();
              const user = (Array.isArray(mockUsersDB) ? mockUsersDB : []).find(u => u.uid === uid);
              if (user) { alert(`✅ SIMULATION SUCCESS: An email has been sent to the registered address with the recovered password: ${user.password}`); } else { alert("UID not found in the system."); }
              setCurrentView("login");
            }}>Send Reset Link</button>
            <button type="button" className="back-button" onClick={() => setCurrentView("login")} style={{ marginTop: "15px" }}>← Back to Login</button>
          </section>
        </main>
        {showCopilot && <AICopilot onClose={() => setShowCopilot(false)} />}
      </div>
    );
  }

  if (currentView === "changePwd") {
    return (
      <div className="app">
        <header className="navbar"><div className="brand" onClick={goHome}><div className="brand-mark">SR</div><div><h2>SmartRegTech</h2><p>Digital Registration & Compliance</p></div></div><div className="nav-buttons"><button type="button" className="nav-button secondary" onClick={() => setShowCopilot(true)}><span>✦</span> AI Copilot</button></div></header>
        <main className="page-container" style={{ maxWidth: "500px", margin: "50px auto" }}>
          <section className="content-card form-panel">
            <h2>Change Password</h2>
            <p className="description">Update your password to something secure of your choice.</p>
            <div className="form-group" style={{ marginTop: "20px" }}><label>OLD PASSWORD</label><input type="password" id="oldPwd" placeholder="Enter current password" /></div>
            <div className="form-group"><label>NEW PASSWORD</label><input type="password" id="newPwd" placeholder="Enter new password" /></div>
            <button type="button" className="primary-button full" onClick={() => {
              const old = document.getElementById("oldPwd").value.trim();
              const newP = document.getElementById("newPwd").value.trim();
              const safeDB = Array.isArray(mockUsersDB) ? mockUsersDB : [];
              const userIndex = safeDB.findIndex(u => u.uid === currentUserUid);
              if (safeDB[userIndex].password === old) {
                if (newP.length < 4) { alert("New password must be at least 4 characters."); return; }
                const updatedDB = [...safeDB]; updatedDB[userIndex].password = newP; setMockUsersDB(updatedDB); alert("Password changed successfully!"); setCurrentView("home");
              } else {
                alert("Old password incorrect.");
              }
            }}>Update Password</button>
            <button type="button" className="back-button" onClick={goHome} style={{ marginTop: "15px" }}>← Cancel</button>
          </section>
        </main>
        {showCopilot && <AICopilot onClose={() => setShowCopilot(false)} />}
      </div>
    );
  }

  if (activeStepId === "admin") {
    return (
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", top: "15px", right: "20px", zIndex: 100 }}><button type="button" className="nav-button secondary" onClick={() => setShowCopilot(true)}><span>✦</span> AI Copilot</button></div>
        <AdminAnalytics />
        <div className="admin-return"><button type="button" className="back-button" onClick={goHome}>← Return to Registration Portal</button></div>
        {showCopilot && <AICopilot onClose={() => setShowCopilot(false)} />}
      </div>
    );
  }

  if (activeStepId === "home") {
    return (
      <div className="app">
        <header className="navbar">
          <div className="brand" onClick={goHome}><div className="brand-mark">SR</div><div><h2>SmartRegTech</h2><p>Digital Registration & Compliance</p></div></div>
          <div className="nav-buttons">
            <button type="button" className="nav-button secondary" onClick={() => setShowCopilot(true)}><span>✦</span> AI Copilot</button>
            <button type="button" className="nav-button" onClick={openAdmin}><span>▦</span> Admin Analytics</button>
            {currentUserUid ? (
              <><button type="button" className="nav-button" onClick={() => setCurrentView("changePwd")}>Change Password</button><button type="button" className="nav-button secondary" onClick={handleLogout}>Logout ({currentUserUid})</button></>
            ) : (
              <button type="button" className="nav-button secondary" onClick={() => setCurrentView("login")}>Login / Resume</button>
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
                  <label style={{ display: "block", fontSize: "12px", color: "#b99cff", fontWeight: 800, marginBottom: "8px", letterSpacing: "0.5px" }}>⚙️ SELECT CUSTOMER WORKFLOW CONFIGURATION</label>
                  <select value={selectedPreset} onChange={(e) => handlePresetChange(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "10px", background: "#0e172a", color: "#fff", border: "1px solid #3b486d", fontSize: "14px", outline: "none", cursor: "pointer" }}>
                    {Object.entries(PRESET_FLOWS).map(([key, config]) => (<option key={key} value={key}>{config.name}</option>))}
                  </select>
                  <small style={{ display: "block", marginTop: "8px", color: "#8a9fc2", fontSize: "12px" }}>{PRESET_FLOWS[selectedPreset].description}</small>
                </div>
              )}
              <div className="hero-actions">
                <button type="button" className="primary-button" onClick={startRegistration}>{currentUserUid ? "Resume Registration" : "Start Registration"} <span>→</span></button>
                <button type="button" className="outline-button" onClick={() => setShowCopilot(true)}>Ask AI Copilot</button>
              </div>
              <div className="trust-row"><div><span className="trust-icon">✓</span> Identity verification</div><div><span className="trust-icon">✓</span> Smart forms</div><div><span className="trust-icon">✓</span> Digital receipt</div></div>
            </div>
            <div className="hero-visual">
              <div className="visual-glow"></div>
              <div className="registration-preview">
                <div className="preview-top"><div className="preview-brand"><div className="mini-mark">SR</div><span>SmartRegTech</span></div><span className="secure-label">SECURE</span></div>
                <div className="preview-title">Registration Status</div>
                <div className="preview-status"><div className="status-check">✓</div><div><strong>Identity Verified</strong><span>Verification complete</span></div></div>
                <div className="preview-lines"><div><span>Application</span><strong>Ready</strong></div><div><span>Program</span><strong>B.Tech</strong></div><div><span>Payment</span><strong className="green-text">Verified</strong></div></div>
                <div className="preview-progress"><div className="preview-progress-label"><span>Registration progress</span><strong>80%</strong></div><div className="preview-track"><div className="preview-fill"></div></div></div>
              </div>
            </div>
          </section>

          <section className="feature-section">
            <div className="section-heading"><span>PLATFORM CAPABILITIES</span><h2>Everything you need for<br />a smoother registration experience.</h2></div>
            <div className="feature-grid">
              <FeatureCard icon="◈" title="Secure Verification" text="Verify applicant identity through a controlled mock workflow." />
              <FeatureCard icon="✦" title="AI Copilot Assist" text="Get contextual guidance throughout the registration process." />
              <FeatureCard icon="⌁" title="Smart Forms" text="Automatically reduce repetitive information entry after verification." />
              <FeatureCard icon="▦" title="Admin Analytics" text="Monitor applications, verification, payments and program activity." />
            </div>
          </section>

          <section className="how-section">
            <div className="section-heading centered"><span>SIMPLE WORKFLOW</span><h2>From verification to registration<br />in a few simple steps.</h2></div>
            <div className="workflow-grid">
              <WorkflowStep number="01" title="Verify Identity" text="Complete the demo identity verification." />
              <WorkflowStep number="02" title="Complete Details" text="Enter only the information that is still required." />
              <WorkflowStep number="03" title="Review & Pay" text="Review your application and complete the sandbox payment." />
              <WorkflowStep number="04" title="Get Registration ID" text="Receive your registration ID and download the receipt." />
            </div>
          </section>
        </main>
        <footer className="home-footer"><div>© 2026 SmartRegTech Prototype</div><div>Digital Registration • Compliance • Analytics</div></footer>
        {showCopilot && <AICopilot onClose={() => setShowCopilot(false)} />}
      </div>
    );
  }

  if (activeStepId === "identity") {
    return (
      <Page currentStep={activeStepId} onHome={goHome} showCopilot={showCopilot} setShowCopilot={setShowCopilot} flowConfig={activeFlow} currentIndex={currentStepIndex} currentUserUid={currentUserUid} handleLogout={handleLogout} openAdmin={openAdmin} onStepClick={(idx) => setCurrentStepIndex(idx)}>
        
        {newAccountDetails && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.85)", zIndex: 999999, display: "flex", justifyContent: "center", alignItems: "center", padding: "20px", backdropFilter: "blur(5px)" }}>
            <div style={{ background: "#0a1124", width: "100%", maxWidth: "450px", borderRadius: "16px", padding: "40px 30px", border: "1px solid #3b486d", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.7)", textAlign: "center", animation: "slideIn 0.3s ease-out" }}>
              <div style={{ width: "64px", height: "64px", background: "#22c55e", color: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", margin: "0 auto 20px", boxShadow: "0 0 20px rgba(34, 197, 94, 0.4)" }}>✓</div>
              <h2 style={{ color: "#fff", margin: "0 0 10px 0", fontSize: "24px" }}>Identity Verified</h2>
              <p style={{ color: "#8a9fc2", fontSize: "14px", marginBottom: "30px", lineHeight: "1.5" }}>Your secure registration account has been successfully generated.</p>

              <div style={{ background: "#060d1a", border: "1px dashed #3b486d", borderRadius: "12px", padding: "20px", marginBottom: "24px", textAlign: "left" }}>
                <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ color: "#64748b", fontSize: "10px", fontWeight: "bold", letterSpacing: "1.5px" }}>APPLICATION ID (UID)</span>
                    <div style={{ color: "#fff", fontSize: "20px", fontWeight: "bold", fontFamily: "monospace", letterSpacing: "1px", marginTop: "4px" }}>{newAccountDetails.uid}</div>
                  </div>
                  <button onClick={() => navigator.clipboard.writeText(newAccountDetails.uid)} style={{ background: "rgba(108,76,255,0.15)", color: "#b99cff", border: "none", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>Copy</button>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ color: "#64748b", fontSize: "10px", fontWeight: "bold", letterSpacing: "1.5px" }}>TEMPORARY PASSWORD</span>
                    <div style={{ color: "#b99cff", fontSize: "20px", fontWeight: "bold", fontFamily: "monospace", letterSpacing: "1px", marginTop: "4px" }}>{newAccountDetails.pwd}</div>
                  </div>
                  <button onClick={() => navigator.clipboard.writeText(newAccountDetails.pwd)} style={{ background: "rgba(108,76,255,0.15)", color: "#b99cff", border: "none", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>Copy</button>
                </div>
              </div>

              <div style={{ background: "rgba(108, 76, 255, 0.1)", color: "#b99cff", padding: "12px 16px", borderRadius: "8px", fontSize: "12px", marginBottom: "30px", lineHeight: "1.5", border: "1px solid rgba(108, 76, 255, 0.2)" }}>
                📱 Credentials have been automatically dispatched to your verified Email and WhatsApp.
              </div>

              <button type="button" className="primary-button full" onClick={() => { setnewAccountDetails(null); goToNextStep(); }} style={{ boxShadow: "0 0 15px rgba(108, 76, 255, 0.4)" }}>
                Continue Application <span>→</span>
              </button>
            </div>
          </div>
        )}

        <div className="form-layout">
          <div className="form-intro">
            <div className="step-label">STEP / IDENTITY</div>
            <h1>Verify once.<br />Reuse your details.</h1>
            <p className="description">A realistic verification flow for this prototype. Your identity is checked first, then a consented mock connector fetches verified details.</p>
            <div className="security-points"><div><span>✓</span> 12-digit identity validation</div><div><span>✓</span> One-time OTP verification</div><div><span>✓</span> Explicit consent</div><div><span>✓</span> Automatic profile retrieval</div></div>
          </div>

          <div className="form-panel digilocker-flow-panel">
            <div className="dl-brand-row"><div className="dl-logo-mark">▣</div><div><strong>Verification</strong><span>SmartRegTech sandbox connector</span></div><span className="sandbox-pill">DEMO</span></div>

            <div className="dl-flow-steps">
              <span className={identityPhase === "aadhaar" ? "active" : "done"}>1 Identity</span>
              <span className={identityPhase === "otp" ? "active" : identityPhase === "consent" || identityPhase === "fetching" ? "done" : ""}>2 OTP</span>
              <span className={identityPhase === "consent" ? "active" : identityPhase === "fetching" ? "done" : ""}>3 Consent</span>
              <span className={identityPhase === "fetching" ? "active" : ""}>4 Fetch</span>
            </div>

            {identityPhase === "aadhaar" && (
              <>
                <div className="panel-heading"><div className="panel-icon">◈</div><div><h2>Identity verification</h2><p>Start with your 12-digit identity number</p></div></div>
                <div className="warning"><span>!</span><div><strong>Prototype / sandbox</strong><p>Use the demo identity shown below.</p></div></div>
                <div className="form-group"><label>IDENTITY NUMBER</label><input type="text" inputMode="numeric" autoComplete="off" placeholder="XXXX XXXX XXXX" maxLength="12" value={formData.identity} onChange={(event) => updateField("identity", event.target.value.replace(/\D/g, ""))} /></div>
                <div className="demo-number"><span>Demo identity</span><strong>{DEMO_IDENTITY}</strong><button type="button" onClick={() => updateField("identity", DEMO_IDENTITY)}>Use demo</button></div>
                <button type="button" className="primary-button full" onClick={verifyIdentity}>Continue to OTP <span>→</span></button>
              </>
            )}

            {identityPhase === "otp" && (
              <>
                <div className="otp-background-card"><div className="panel-heading"><div className="panel-icon">✉</div><div><h2>Verification required</h2><p>Enter the one-time code to continue.</p></div></div><div className="otp-window-hint">A secure OTP verification window has been opened.</div></div>
                <div className="otp-modal-overlay">
                  <div className="otp-modal" role="dialog" aria-modal="true" aria-labelledby="otp-modal-title">
                    <button type="button" className="otp-modal-close" onClick={() => { setOtp(""); setIdentityPhase("aadhaar"); }}>×</button>
                    <div className="otp-modal-brand"><div className="otp-modal-logo">SR</div><div><strong>SmartRegTech</strong><span>Secure identity verification</span></div></div>
                    <div className="otp-modal-icon">✉</div><div className="success-badge">OTP SENT</div><h2 id="otp-modal-title">Verify your identity</h2><p className="otp-modal-description">Enter the 6-digit verification code sent to your registered mobile number.</p>
                    <div className="otp-destination-modal"><span>OTP sent to</span><strong>+91 ••••••5312</strong><small>Demo verification channel</small></div>
                    <div className="otp-boxes" onClick={() => otpInputRefs.current[0]?.focus()}>
                      {Array.from({ length: 6 }).map((_, index) => (
                        <input key={index} ref={(element) => { otpInputRefs.current[index] = element; }} className="otp-box" inputMode="numeric" maxLength={1} value={otp[index] || ""}
                          onChange={(event) => {
                            const digit = event.target.value.replace(/\D/g, "").slice(-1);
                            const digits = otp.split(""); digits[index] = digit; setOtp(digits.join("").slice(0, 6));
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
                    <div className="otp-resend-row">{otpSeconds > 0 ? (<span>Resend code in {otpSeconds}s</span>) : (<button type="button" onClick={() => { setOtp(""); setOtpSeconds(30); otpInputRefs.current[0]?.focus(); }}>Resend OTP</button>)}</div>
                    <button type="button" className="primary-button full otp-verify-button" onClick={verifyOtp}>Verify OTP <span>→</span></button><div className="otp-security-note">🔒 Demo sandbox · No real OTP is sent</div>
                  </div>
                </div>
              </>
            )}

            {identityPhase === "redirect" && (
              <div className="digilocker-redirect-card">
                <div className="redirect-connection-line"><div className="redirect-node smartregtech-node">SR</div><div className="redirect-line"><span /></div><div className="redirect-node digilocker-node">DL</div></div>
                <div className="redirect-badge">IDENTITY VERIFIED</div><div className="redirect-icon">↗</div><h2>Continue to Connector</h2><p className="redirect-description">Your identity has been verified. You will now be redirected to the sandbox to give consent for retrieving your verified registration details.</p>
                <div className="redirect-flow"><div><span className="redirect-check">✓</span><span>Identity verified</span></div><div><span className="redirect-check">✓</span><span>Secure connection ready</span></div><div><span className="redirect-next">3</span><span>Consent</span></div></div>
                <div className="redirect-loading"><span className="redirect-spinner"></span><span>Connecting securely to Sandbox...</span></div><div className="redirect-sandbox-note">🧪 Sandbox / Demo<small>This prototype does not redirect to real services.</small></div>
              </div>
            )}

            {identityPhase === "consent" && (
              <div className="dl-stage-card consent-card">
                <div className="dl-stage-icon">🔐</div><div className="success-badge">CONSENT REQUIRED</div><h2>Allow SmartRegTech to fetch your details</h2><p>This screen simulates the consent step you would see before an approved connector shares information.</p>
                <div className="consent-provider"><div className="consent-provider-icon">SR</div><div><strong>SmartRegTech</strong><span>Registration &amp; Compliance Portal</span></div><span className="secure-label">SECURE</span></div>
                <div className="consent-data-list"><strong>Information requested</strong><span>✓ Full name</span><span>✓ Date of birth</span><span>✓ Gender &amp; address</span><span>✓ Education / board details</span></div>
                <label className="consent-checkbox"><input type="checkbox" checked={consentGiven} onChange={(event) => setConsentGiven(event.target.checked)} /><span>I consent to share these details for registration.</span></label>
                <button type="button" className="primary-button full" onClick={approveDigiLockerConsent}>Continue &amp; Fetch Details <span>→</span></button>
              </div>
            )}

            {identityPhase === "fetching" && (
              <div className="dl-stage-card fetching-card">
                <div className="fetch-spinner"></div><div className="success-badge">{fetchStatus === "success" ? "FETCH COMPLETE" : "CONNECTING"}</div><h2>{fetchStatus === "success" ? "Verified profile received" : "Connecting..."}</h2><p>{fetchStatus === "success" ? "The simulated JSON payload has been received and validated." : "Establishing a secure sandbox connection and requesting the consented profile payload..."}</p>
                <div className="fetch-log"><div><span className="fetch-dot done"></span> Identity verified</div><div><span className="fetch-dot done"></span> Consent recorded</div><div><span className="fetch-dot"></span> Fetching profile JSON</div><div><span className="fetch-dot"></span> Mapping fields to registration form</div></div>
              </div>
            )}
            {identityPhase !== "fetching" && (
              <button type="button" className="back-button" onClick={goToPrevStep}>← Back</button>
            )}
          </div>
        </div>
      </Page>
    );
  }

  /* ============================================================
     VERIFIED
  ============================================================ */
  if (activeStepId === "verified") {
    const classXMarks = [
      { subject: "English Lang & Lit", marks: 88 },
      { subject: "Hindi Course-A", marks: 91 },
      { subject: "Mathematics Standard", marks: 95 },
      { subject: "Science", marks: 89 },
      { subject: "Social Science", marks: 94 }
    ];
    const classXIIMarks = [
      { subject: "English Core", marks: 92 },
      { subject: "Mathematics", marks: 95 },
      { subject: "Physics", marks: 88 },
      { subject: "Chemistry", marks: 91 },
      { subject: "Computer Science", marks: 98 }
    ];
    const currentMarks = activeDocument === "Class X Marksheet" ? classXMarks : classXIIMarks;
    const academicSession = activeDocument === "Class X Marksheet" ? "2021-2022" : "2023-2024";

    return (
      <Page currentStep={activeStepId} onHome={goHome} showCopilot={showCopilot} setShowCopilot={setShowCopilot} flowConfig={activeFlow} currentIndex={currentStepIndex} currentUserUid={currentUserUid} handleLogout={handleLogout} openAdmin={openAdmin} onStepClick={(idx) => setCurrentStepIndex(idx)}>
        <div className="verification-result">
          <div className="verified-icon">✓</div><div className="success-badge">IDENTITY VERIFIED</div><h1>We found your details.</h1><p className="description center-text">Retrieved from a simulated JSON payload <span className="mock-label">SANDBOX CONNECTOR</span></p>

          <div className="verified-card">
            <div className="verified-card-header"><div><span>VERIFIED PROFILE</span><h3>Applicant Information</h3></div><div className="verified-pill">✓ Verified</div></div>
            <div className="verified-profile-top">
              <div className="profile-photo">{verifiedProfile?.photo || "RV"}</div>
              <div><span>DOCUMENT SOURCE</span><strong>{verifiedProfile?.source || "Sandbox"}</strong><small>Document: {verifiedProfile?.document || "Profile"}</small></div>
            </div>
            <div className="verified-grid">
              <VerifiedField label="Full Name" value={verifiedProfile?.name || "—"} />
              <VerifiedField label="Date of Birth" value={verifiedProfile?.dob || "—"} />
              <VerifiedField label="Gender" value={verifiedProfile?.gender || "—"} />
              <VerifiedField label="Address" value={verifiedProfile?.address || "—"} />
              <VerifiedField label="Board" value={verifiedProfile?.board || "—"} />
              <VerifiedField label="Qualification" value={verifiedProfile?.qualification || "—"} />
              <VerifiedField label="Mobile Number" value={verifiedProfile?.phone || "—"} />
              <VerifiedField label="Registered Email" value={verifiedProfile?.email || "—"} />
            </div>

            <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px dashed #3b486d" }}>
              <h4 style={{ color: "#8a9fc2", marginBottom: "12px", fontSize: "12px", fontWeight: 700, letterSpacing: "1px" }}>VERIFIED DOCUMENTS ATTACHED</h4>
              <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                <button type="button" onClick={() => setActiveDocument("Class X Marksheet")} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px", background: "rgba(108, 76, 255, 0.1)", border: "1px solid rgba(108, 76, 255, 0.4)", borderRadius: "8px", color: "#b99cff", cursor: "pointer", fontWeight: "bold", fontSize: "13px" }}>📄 Class X Marksheet</button>
                <button type="button" onClick={() => setActiveDocument("Class XII Marksheet")} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px", background: "rgba(108, 76, 255, 0.1)", border: "1px solid rgba(108, 76, 255, 0.4)", borderRadius: "8px", color: "#b99cff", cursor: "pointer", fontWeight: "bold", fontSize: "13px" }}>📄 Class XII Marksheet</button>
              </div>
            </div>

            <div style={{ marginTop: "20px", padding: "14px 18px", background: "rgba(21, 153, 87, 0.1)", border: "1px solid rgba(21, 153, 87, 0.3)", borderRadius: "10px", color: "#159957", fontSize: "13px", display: "flex", alignItems: "flex-start", gap: "12px", lineHeight: "1.5" }}>
              <span style={{ fontSize: "18px" }}>✉️</span><div><strong style={{ display: "block", marginBottom: "4px" }}>Account Credentials Dispatched</strong>Your Application ID and secure password have been successfully sent to <strong>{verifiedProfile?.email || "your registered email"}</strong>.</div>
            </div>
          </div>
          <div className="info-box"><span>✦</span><div><strong>Smart form activated</strong><p>Your verified details have been automatically carried forward.</p></div></div>
          <button type="button" className="primary-button" onClick={goToNextStep}>Continue to Select Course <span>→</span></button>
        </div>

        {activeDocument && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.85)", zIndex: 99999, display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }} onClick={() => setActiveDocument(null)}>
            <div style={{ background: "#fff", width: "100%", maxWidth: "550px", boxSizing: "border-box", borderRadius: "12px", padding: "35px 30px", color: "#2c3e50", position: "relative", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }} onClick={e => e.stopPropagation()}>
              <button style={{ position: "absolute", top: "15px", right: "20px", background: "none", border: "none", fontSize: "28px", cursor: "pointer", color: "#888" }} onClick={() => setActiveDocument(null)}>×</button>
              <div style={{ textAlign: "center", borderBottom: "2px solid #34495e", paddingBottom: "15px", marginBottom: "25px" }}><h2 style={{ margin: 0, color: "#1abc9c", fontSize: "22px", letterSpacing: "1px" }}>CENTRAL BOARD OF SECONDARY EDUCATION</h2><h3 style={{ margin: "10px 0 5px", color: "#34495e", fontSize: "16px" }}>{activeDocument === "Class X Marksheet" ? "SECONDARY SCHOOL EXAMINATION (CLASS X)" : "SENIOR SECONDARY CERTIFICATE (CLASS XII)"}</h3><p style={{ margin: 0, fontSize: "13px", color: "#7f8c8d" }}>Academic Session {academicSession}</p></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "25px", fontSize: "14px", lineHeight: "1.6", color: "#0f172a" }}><div><strong>Candidate Name:</strong> Rohan Verma</div><div><strong>Roll No:</strong> 12345678</div><div><strong>DOB:</strong> 15/06/2004</div><div><strong>School:</strong> Delhi Public School</div></div>
              <div style={{ width: "100%", border: "1px solid #e2e8f0", borderRadius: "8px", overflow: "hidden", marginBottom: "25px", boxSizing: "border-box" }}>
                <div style={{ display: "grid", gridTemplateColumns: "70% 30%", background: "#f8fafc", borderBottom: "2px solid #cbd5e1", color: "#334155", fontWeight: "bold", fontSize: "14px" }}><div style={{ padding: "12px 15px", borderRight: "1px solid #e2e8f0", boxSizing: "border-box" }}>Subject</div><div style={{ padding: "12px 15px", boxSizing: "border-box" }}>Marks</div></div>
                {currentMarks.map((row, idx) => (<div key={idx} style={{ display: "grid", gridTemplateColumns: "70% 30%", borderBottom: idx === currentMarks.length - 1 ? "none" : "1px solid #e2e8f0", fontSize: "14px", color: "#0f172a" }}><div style={{ padding: "12px 15px", borderRight: "1px solid #e2e8f0", fontWeight: "500", boxSizing: "border-box", overflow: "hidden", textOverflow: "ellipsis" }}>{row.subject}</div><div style={{ padding: "12px 15px", fontWeight: "bold", boxSizing: "border-box" }}>{row.marks}</div></div>))}
              </div>
              <div style={{ textAlign: "right", marginTop: "10px", fontSize: "12px", color: "#7f8c8d" }}><div style={{ fontStyle: "italic", marginBottom: "5px", color: "#16a085", fontWeight: "bold" }}>✓ Digitally Signed & Verified</div><strong>Controller of Examinations</strong></div>
            </div>
          </div>
        )}
      </Page>
    );
  }

  /* ============================================================
     FORM / PROGRAM SELECTION + TEST DETAILS WITH SLOT BOOKING
  ============================================================ */
  if (activeStepId === "form") {
    const groupedCourses = Object.entries(COURSE_CATALOG).reduce((acc, [id, data]) => {
      if (!acc[data.university]) acc[data.university] = [];
      acc[data.university].push({ id, ...data });
      return acc;
    }, {});

    return (
      <Page currentStep={activeStepId} onHome={goHome} showCopilot={showCopilot} setShowCopilot={setShowCopilot} flowConfig={activeFlow} currentIndex={currentStepIndex} currentUserUid={currentUserUid} handleLogout={handleLogout} openAdmin={openAdmin} onStepClick={(idx) => setCurrentStepIndex(idx)}>
        <div className="form-layout">
          <div className="form-intro">
            <div className="step-label">STEP / PROGRAM & EXAM DETAILS</div>
            <h1>Select Your Programs</h1>
            <p className="description">Choose academic programs. Entrance exams and test schedules are automatically assigned based on your selection.</p>
            <div className="verified-summary"><div className="mini-verified">✓</div><div><strong>{verifiedProfile?.name || "Verified Applicant"}</strong><span style={{ display: "block", fontSize: "12px", color: "#8a9fc2", marginTop: "2px" }}>📱 Contact & Documents Verified</span></div></div>
          </div>

          <div className="form-panel">
            <div className="panel-heading"><div className="panel-icon">✦</div><div><h2>Academic Program Selection</h2><p>Select one or more programs to include in your application cart.</p></div></div>
            
            <div className="form-group" style={{ marginTop: "16px" }}>
              <label>AVAILABLE PROGRAMS <span style={{ textTransform: "none", color: "#8a9fc2", fontWeight: "normal" }}>(Check to add to cart)</span></label>
              <div style={{ maxHeight: "350px", overflowY: "auto", background: "#0a1124", padding: "14px", borderRadius: "10px", border: "1px solid #3b486d", display: "flex", flexDirection: "column", gap: "16px" }}>
                {Object.entries(groupedCourses).map(([uniName, courses]) => (
                  <div key={uniName} style={{ background: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <h3 style={{ color: "#a5b4fc", fontSize: "13px", marginTop: 0, marginBottom: "12px", borderBottom: "1px solid rgba(165, 180, 252, 0.2)", paddingBottom: "6px", textTransform: "uppercase", letterSpacing: "1px" }}>
                      🏛️ {uniName}
                    </h3>
                    <div style={{ display: "grid", gap: "10px" }}>
                      {courses.map(course => (
                        <label key={course.id} style={{ display: "flex", alignItems: "flex-start", gap: "12px", color: "#fff", cursor: "pointer", fontSize: "14px", padding: "4px 0" }}>
                          <input type="checkbox" checked={cart.includes(course.id)} onChange={() => toggleCartItem(course.id)} style={{ width: "18px", height: "18px", accentColor: "#6c4cff", cursor: "pointer", marginTop: "2px" }} />
                          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                            <span>{course.name} <strong style={{ color: "#a5b4fc", marginLeft: "4px" }}>(₹{course.fee})</strong></span>
                            <div>
                              <span style={{ background: "rgba(34, 197, 94, 0.15)", color: "#22c55e", padding: "2px 6px", borderRadius: "4px", fontSize: "10px", fontWeight: "bold", border: "1px solid rgba(34, 197, 94, 0.3)", display: "inline-block" }}>
                                ✓ Auto-Eligible ({course.eligibilityType})
                              </span>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {cart.length > 0 && (
                <div style={{ marginTop: "12px", padding: "10px 14px", background: "rgba(34, 197, 94, 0.1)", borderRadius: "8px", border: "1px solid rgba(34, 197, 94, 0.3)", color: "#159957", fontWeight: "bold", fontSize: "14px", display: "flex", justifyContent: "space-between" }}>
                  <span>Programs Selected: {cart.length}</span><span>Total Fee: ₹{currentTotalFee.toLocaleString("en-IN")}</span>
                </div>
              )}
            </div>

            <div style={{ marginTop: "24px", paddingTop: "18px", borderTop: "1px solid #293c5c" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <span style={{ fontSize: "20px" }}>📍</span><div><h3 style={{ margin: 0, fontSize: "16px", color: "#fff" }}>Exam Slot Booking & Centers</h3><small style={{ color: "#8a9fc2", fontSize: "12px" }}>Select preferred dates for assigned exams and test center cities.</small></div>
              </div>
              <div style={{ background: "#0a1124", padding: "16px", borderRadius: "10px", border: "1px solid #3b486d" }}>
                <div className="form-group" style={{ marginBottom: "20px" }}>
                  <label style={{ fontSize: "12px", color: "#b99cff", fontWeight: 700 }}>REQUIRED EXAMS (SELECT PREFERRED SLOT)</label>
                  {cart.length === 0 ? (
                    <div style={{ color: "#7890b2", fontSize: "13px", marginTop: "8px", fontStyle: "italic" }}>Select academic programs above to view and book required entrance exams.</div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "8px" }}>
                      {requiredExamsList.map(exam => (
                        <div key={exam} style={{ background: "#130e2b", border: "1px solid #3b486d", padding: "12px 14px", borderRadius: "8px" }}>
                          <div style={{ color: "#fff", fontSize: "14px", fontWeight: "bold", marginBottom: "8px" }}>📝 {exam}</div>
                          <select value={selectedExamSlots[exam] || ""} onChange={(e) => setSelectedExamSlots({...selectedExamSlots, [exam]: e.target.value})} style={{ width: "100%", padding: "8px", borderRadius: "6px", background: "#081222", color: "#fff", border: "1px solid #3b486d", fontSize: "13px" }}>
                            <option value="">Choose Preferred Date & Shift...</option>
                            {EXAM_SCHEDULE_OPTIONS[exam]?.map(slot => <option key={slot} value={slot}>{slot}</option>)}
                          </select>
                        </div>
                      ))}
                      {requiredExamsList.length === 0 && (
                        <div style={{ color: "#159957", fontSize: "13px", marginTop: "8px", fontWeight: "bold" }}>✓ Direct Merit Based Admission (No Entrance Exam Required)</div>
                      )}
                    </div>
                  )}
                </div>

                {showCenterPreferences && (
                  <div>
                    <label style={{ display: "block", fontSize: "12px", color: "#b99cff", fontWeight: 700, marginBottom: "8px" }}>TEST CITY PREFERENCES</label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "12px" }}>
                      <div className="form-group" style={{ margin: 0 }}><label style={{ fontSize: "11px", color: "#8a9fc2" }}>PREFERENCE 1</label><select value={cityPreferences.pref1} onChange={(e) => setCityPreferences({...cityPreferences, pref1: e.target.value})} style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", background: "#081222", color: "#fff", border: "1px solid #3b486d", fontSize: "13px" }}><option value="">Choose City</option>{CITIES.map(c => <option key={c} value={c} disabled={c === cityPreferences.pref2 || c === cityPreferences.pref3}>{c}</option>)}</select></div>
                      <div className="form-group" style={{ margin: 0 }}><label style={{ fontSize: "11px", color: "#8a9fc2" }}>PREFERENCE 2</label><select value={cityPreferences.pref2} onChange={(e) => setCityPreferences({...cityPreferences, pref2: e.target.value})} style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", background: "#081222", color: "#fff", border: "1px solid #3b486d", fontSize: "13px" }}><option value="">Choose City</option>{CITIES.map(c => <option key={c} value={c} disabled={c === cityPreferences.pref1 || c === cityPreferences.pref3}>{c}</option>)}</select></div>
                      <div className="form-group" style={{ margin: 0 }}><label style={{ fontSize: "11px", color: "#8a9fc2" }}>PREFERENCE 3</label><select value={cityPreferences.pref3} onChange={(e) => setCityPreferences({...cityPreferences, pref3: e.target.value})} style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", background: "#081222", color: "#fff", border: "1px solid #3b486d", fontSize: "13px" }}><option value="">Choose City</option>{CITIES.map(c => <option key={c} value={c} disabled={c === cityPreferences.pref1 || c === cityPreferences.pref2}>{c}</option>)}</select></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {(() => {
              const currentFlowSteps = activeFlow && activeFlow.length > 0 ? activeFlow : PRESET_FLOWS[selectedPreset].steps;
              const nextStep = currentFlowSteps[currentStepIndex + 1];
              let nextLabel = "Add to Cart & Continue";
              if (nextStep?.id === "identity") nextLabel = "Continue to Identity Verification";
              else if (nextStep?.id === "payment") nextLabel = "Continue to Payment";
              return (<button type="button" className="primary-button full" onClick={continueFromForm} style={{ marginTop: "22px" }}>{nextLabel} <span>→</span></button>);
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
      <Page currentStep={activeStepId} onHome={goHome} showCopilot={showCopilot} setShowCopilot={setShowCopilot} flowConfig={activeFlow} currentIndex={currentStepIndex} currentUserUid={currentUserUid} handleLogout={handleLogout} openAdmin={openAdmin} onStepClick={(idx) => setCurrentStepIndex(idx)}>
        <div className="review-page">
          <div className="step-label">STEP / REVIEW</div>
          <h1>Review your application.</h1>
          <p className="description">Everything looks ready. Check your verified credentials and booked exam slots before proceeding to payment.</p>
          <div className="review-grid">
            <div className="review-card">
              <div className="review-card-title"><span className="review-icon">✓</span><div><h2>Verified Information</h2><span>Retrieved Securely</span></div></div>
              <ReviewRow label="Applicant Name" value={verifiedProfile?.name || "Verified Applicant"} verified />
              <ReviewRow label="Identity" value={currentUserUid ? `UID: ${currentUserUid}` : "Verified"} verified />
              <ReviewRow label="Date of Birth" value={verifiedProfile?.dob || "—"} verified />
              <ReviewRow label="Mobile" value={verifiedProfile?.phone || "9876543210"} verified />
              <ReviewRow label="Email" value={verifiedProfile?.email || "rohan.v@example.com"} verified />
            </div>

            <div className="review-card">
              <div className="review-card-title"><span className="review-icon purple">📍</span><div><h2>Exam Booking</h2><span>Assigned Exams & Slots</span></div></div>
              <div style={{ marginBottom: "12px" }}>
                {requiredExamsList.length === 0 ? (
                  <div style={{ color: "#159957", fontSize: "13px", fontWeight: "bold" }}>Merit Based Admission (No Exam)</div>
                ) : (
                  requiredExamsList.map(e => (
                    <div key={e} style={{ background: "#0a1124", padding: "8px 12px", borderRadius: "6px", marginBottom: "6px", border: "1px solid #3b486d" }}>
                      <div style={{ color: "#fff", fontWeight: "bold", fontSize: "13px" }}>{e}</div>
                      <div style={{ color: "#a5b4fc", fontSize: "11px", marginTop: "2px" }}>📅 {selectedExamSlots[e] || "Slot not selected"}</div>
                    </div>
                  ))
                )}
              </div>
              {showCenterPreferences && (
                <><ReviewRow label="City Preference 1" value={cityPreferences.pref1 || "—"} /><ReviewRow label="City Preference 2" value={cityPreferences.pref2 || "—"} /><ReviewRow label="City Preference 3" value={cityPreferences.pref3 || "—"} /></>
              )}
            </div>

            <div className="review-card" style={{ gridColumn: "1 / -1" }}>
              <div className="review-card-title"><span className="review-icon purple">+</span><div><h2>Registration Details</h2><span>Information provided by applicant</span></div></div>
              <div style={{ paddingTop: "5px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontSize: "12px", color: "#8a9fc2", fontWeight: 700 }}>COURSES SELECTED IN CART ({(Array.isArray(cart) ? cart : []).length})</span>
                  <button type="button" onClick={goToPrevStep} style={{ background: "transparent", border: "1px solid #6c4cff", color: "#b99cff", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>✏️ Edit / Add Courses</button>
                </div>
                {(Array.isArray(cart) ? cart : []).map((item, idx) => (
                  <div key={idx} style={{ marginTop: "10px", paddingBottom: "10px", borderBottom: idx !== cart.length - 1 ? "1px solid #3b486d" : "none" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ color: "#fff", fontSize: "14px", fontWeight: "bold", flex: 1 }}>• {COURSE_CATALOG[item]?.name}</div>
                      <div style={{ color: "#a5b4fc", fontSize: "14px", fontWeight: "bold", marginLeft: "15px" }}>₹{COURSE_CATALOG[item]?.fee?.toLocaleString("en-IN") || 500}</div>
                    </div>
                    <div style={{ color: "#22c55e", fontSize: "12px", paddingLeft: "12px", marginTop: "3px", fontWeight: 700 }}>🎓 {COURSE_CATALOG[item]?.university}</div>
                  </div>
                ))}
                
                {cart.length > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px", paddingTop: "12px", borderTop: "1px dashed #3b486d" }}>
                    <span style={{ fontSize: "13px", color: "#8a9fc2", fontWeight: 700 }}>TOTAL REGISTRATION FEE</span>
                    <strong style={{ color: "#22c55e", fontSize: "16px" }}>₹{currentTotalFee.toLocaleString("en-IN")}</strong>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="ready-banner"><div className="ready-icon">✓</div><div><strong>Ready for payment</strong><p>Your application is complete and ready to be submitted.</p></div></div>
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
      <Page currentStep={activeStepId} onHome={goHome} showCopilot={showCopilot} setShowCopilot={setShowCopilot} flowConfig={activeFlow} currentIndex={currentStepIndex} currentUserUid={currentUserUid} handleLogout={handleLogout} openAdmin={openAdmin} onStepClick={(idx) => setCurrentStepIndex(idx)}>
        <div className="payment-page">
          <div className="step-label">STEP / PAYMENT</div>
          <h1>Complete your payment.</h1>
          <p className="description">Manage your cart and complete the sandbox transaction.</p>
          <div className="payment-layout" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.5fr) minmax(280px, .7fr)", gap: "24px", alignItems: "start" }}>
            <div className="payment-card" style={{ padding: "28px" }}>
              <div className="payment-card-top"><div><span>TOTAL CART FEE</span><h2>₹{currentTotalFee.toLocaleString("en-IN")}</h2></div><div className="sandbox-pill">SANDBOX</div></div>
              <div className="payment-divider" />
              <div className="payment-detail"><span>Applicant</span><strong>{verifiedProfile?.name || "Verified Applicant"}</strong></div>
              <div className="payment-detail"><span>Identity UID</span><strong className="green-text">✓ {currentUserUid || "Verified"}</strong></div>

              <div style={{ marginTop: "24px", marginBottom: "24px" }}>
                <h3 style={{ marginBottom: "12px", fontSize: "14px", color: "#a5b4fc" }}>Manage Cart Items</h3>
                <div style={{ display: "grid", gap: "10px" }}>
                  {(Array.isArray(cart) ? cart : []).map((item, idx) => (
                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px", background: "#0a1124", border: "1px solid #3b486d", borderRadius: "10px" }}>
                      <div>
                        <strong style={{ display: "block", color: "#fff", fontSize: "13px" }}>{COURSE_CATALOG[item]?.name}</strong>
                        <span style={{ color: "#22c55e", fontSize: "11px", fontWeight: "bold", display: "block", marginTop: "4px" }}>🎓 {COURSE_CATALOG[item]?.university}</span>
                        <span style={{ color: "#159957", fontSize: "12px", fontWeight: "bold", display: "block", marginTop: "4px" }}>₹{COURSE_CATALOG[item]?.fee || 500}</span>
                      </div>
                      <button type="button" onClick={() => toggleCartItem(item)} disabled={processingPayment} style={{ background: "rgba(255, 77, 79, 0.1)", color: "#ff4d4f", border: "1px solid rgba(255, 77, 79, 0.3)", padding: "6px 12px", borderRadius: "6px", cursor: processingPayment ? "not-allowed" : "pointer", fontSize: "12px", fontWeight: "bold" }}>Remove</button>
                    </div>
                  ))}
                  {(!cart || cart.length === 0) && (
                    <div style={{ padding: "15px", background: "rgba(255, 77, 79, 0.1)", border: "1px solid rgba(255, 77, 79, 0.3)", borderRadius: "10px", color: "#ff4d4f", fontSize: "14px" }}>Your cart is currently empty. Please go back to add courses to your cart before proceeding.</div>
                  )}
                </div>
              </div>

              <div style={{ marginTop: "24px" }}>
                <h3 style={{ marginBottom: "12px" }}>Select payment method</h3>
                <div style={{ display: "grid", gap: "10px" }}>
                  {[["upi", "UPI", "Google Pay / PhonePe / BHIM", "U"], ["card", "Card", "Credit / Debit Card", "💳"], ["netbanking", "Net Banking", "All major banks", "🏦"]].map(([id, title, subtitle, icon]) => (
                    <button key={id} type="button" onClick={() => setPaymentMethod(id)} disabled={processingPayment || !cart || cart.length === 0} style={{ display: "grid", gridTemplateColumns: "42px 1fr auto", alignItems: "center", gap: "12px", width: "100%", padding: "14px", borderRadius: "12px", border: paymentMethod === id ? "1px solid #7556ff" : "1px solid #293c5c", background: paymentMethod === id ? "#151f3c" : "#101c30", color: "#fff", textAlign: "left", cursor: processingPayment || !cart || cart.length === 0 ? "not-allowed" : "pointer" }}>
                      <span style={{ width: "42px", height: "42px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "11px", background: "#211d49", color: "#b99cff", fontWeight: 800 }}>{icon}</span>
                      <span><strong style={{ display: "block" }}>{title}</strong><small style={{ color: "#7890b2" }}>{subtitle}</small></span>
                      <span style={{ color: "#a47bff", fontSize: "18px" }}>{paymentMethod === id ? "●" : "○"}</span>
                    </button>
                  ))}
                </div>
              </div>

              {paymentMethod === "upi" && cart?.length > 0 && (
                <div style={{ marginTop: "18px" }}><label style={{ display: "block", marginBottom: "8px", fontWeight: 700 }}>UPI ID</label><input value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="demo@upi" disabled={processingPayment} style={{ width: "100%", boxSizing: "border-box", padding: "14px", borderRadius: "11px", border: "1px solid #33496d", background: "#081222", color: "#fff" }} /><small style={{ display: "block", marginTop: "7px", color: "#7288aa" }}>🔒 Demo UPI only — no real money will be charged.</small></div>
              )}

              {paymentMethod === "card" && cart?.length > 0 && (
                <div style={{ marginTop: "18px", padding: "16px", borderRadius: "12px", border: "1px solid #3b486d", background: "#0a1124", display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "6px", fontWeight: "bold", fontSize: "12px", color: "#b99cff" }}>CARD NUMBER</label>
                    <input type="text" placeholder="4111 2222 3333 4444" maxLength="19" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} disabled={processingPayment} style={{ width: "100%", boxSizing: "border-box", padding: "12px", borderRadius: "8px", border: "1px solid #33496d", background: "#081222", color: "#fff", fontFamily: "monospace" }} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label style={{ display: "block", marginBottom: "6px", fontWeight: "bold", fontSize: "12px", color: "#b99cff" }}>EXPIRY DATE</label>
                      <input type="text" placeholder="MM/YY" maxLength="5" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} disabled={processingPayment} style={{ width: "100%", boxSizing: "border-box", padding: "12px", borderRadius: "8px", border: "1px solid #33496d", background: "#081222", color: "#fff" }} />
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: "6px", fontWeight: "bold", fontSize: "12px", color: "#b99cff" }}>CVV</label>
                      <input type="password" placeholder="123" maxLength="4" value={cardCvv} onChange={(e) => setCardCvv(e.target.value)} disabled={processingPayment} style={{ width: "100%", boxSizing: "border-box", padding: "12px", borderRadius: "8px", border: "1px solid #33496d", background: "#081222", color: "#fff" }} />
                    </div>
                  </div>
                  <small style={{ color: "#7288aa" }}>🔒 Sandbox Card Simulator · Enter any test card numbers.</small>
                </div>
              )}

              {paymentMethod === "netbanking" && cart?.length > 0 && (
                <div style={{ marginTop: "18px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: 700, fontSize: "12px", color: "#b99cff" }}>SELECT BANK</label>
                  <select disabled={processingPayment} style={{ width: "100%", boxSizing: "border-box", padding: "14px", borderRadius: "11px", border: "1px solid #33496d", background: "#081222", color: "#fff" }}>
                    <option>State Bank of India (SBI)</option>
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>Axis Bank</option>
                  </select>
                </div>
              )}

              <div className="payment-total" style={{ marginTop: "24px" }}><span>Total payable</span><strong>₹{currentTotalFee.toLocaleString("en-IN")}</strong></div>

              {paymentStatus === "processing" && (
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "18px", padding: "14px", borderRadius: "12px", background: "#151d38", border: "1px solid #4a3b7f" }}><span style={{ fontSize: "28px", color: "#a981ff" }}>◌</span><span><strong style={{ display: "block" }}>Processing payment...</strong><small style={{ color: "#8298ba" }}>Verifying transaction securely</small></span></div>
              )}

              <div className="payment-actions">
                <button type="button" className="back-button" onClick={goToPrevStep} disabled={processingPayment}>← Back</button>
                <button type="button" className="primary-button" onClick={completePayment} disabled={processingPayment || !cart || cart.length === 0}>{processingPayment ? "Processing..." : `Pay ₹${currentTotalFee.toLocaleString("en-IN")}`}{!processingPayment && <span>→</span>}</button>
              </div>
            </div>

            <div className="payment-info">
              <div className="payment-info-icon">⚡</div><h3>Fast & simple</h3><p>Complete your registration payment in seconds.</p>
              <div className="sandbox-warning"><strong>Items in Cart</strong><span>{(Array.isArray(cart) ? cart : []).length}</span></div>
              <div className="sandbox-warning"><strong>Total Fee</strong><span>₹{currentTotalFee.toLocaleString("en-IN")}</span></div>
              <div className="sandbox-warning"><strong>Identity</strong><span className="green-text">✓ Verified</span></div>
              <div className="sandbox-warning"><strong>Demo Environment</strong><span>No real money will be charged.</span></div>
            </div>
          </div>
        </div>
      </Page>
    );
  }

  /* ============================================================
     SUCCESS -> APPLICANT DASHBOARD (POLISHED FOR PRESENTATION)
  ============================================================ */
  if (activeStepId === "success") {
    return (
      <Page currentStep={activeStepId} onHome={goHome} showCopilot={showCopilot} setShowCopilot={setShowCopilot} flowConfig={activeFlow} currentIndex={currentStepIndex} currentUserUid={currentUserUid} handleLogout={handleLogout} openAdmin={openAdmin} onStepClick={(idx) => setCurrentStepIndex(idx)}>
        
        {showWhatsAppAlert && (
          <div style={{ position: "fixed", top: "90px", right: "20px", background: "#128C7E", color: "white", padding: "16px 20px", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.4)", zIndex: 99999, display: "flex", alignItems: "flex-start", gap: "14px", width: "340px", animation: "slideIn 0.5s ease-out forwards", border: "1px solid rgba(255,255,255,0.2)" }}>
            <span style={{ fontSize: "26px" }}>💬</span>
            <div style={{ flex: 1 }}>
              <strong style={{ display: "block", fontSize: "14px", marginBottom: "4px" }}>SmartRegTech Admissions</strong>
              <p style={{ margin: 0, fontSize: "13px", lineHeight: "1.4" }}>Dear {verifiedProfile?.name?.split(" ")[0] || "Applicant"}, your registration for ID <strong>{registrationId}</strong> is successful! Log in anytime to track your admission status.</p>
            </div>
            <button onClick={() => { setShowWhatsAppAlert(false); setAlertDismissed(true); }} style={{ background: "none", border: "none", color: "white", fontSize: "18px", cursor: "pointer", padding: 0 }}>×</button>
          </div>
        )}

        <div className="dashboard-page" style={{ textAlign: "left" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "1px solid #293c5c", paddingBottom: "24px", marginBottom: "35px", flexWrap: "wrap", gap: "20px" }}>
            <div>
              <div className="step-label" style={{ marginBottom: "8px", color: "#818cf8", fontWeight: "700", letterSpacing: "1px" }}>APPLICANT DASHBOARD</div>
              <h1 style={{ margin: 0, fontSize: "32px", fontWeight: "800", color: "#fff" }}>Welcome, {verifiedProfile?.name || "Applicant"}</h1>
              <p style={{ margin: "6px 0 0 0", color: "#8a9fc2", fontSize: "14px" }}>UID: <span style={{ fontFamily: "monospace", color: "#818cf8" }}>{currentUserUid}</span> • Registration &amp; Examination Configured</p>
            </div>
            <button 
              type="button" 
              onClick={downloadReceipt} 
              style={{ background: "#159957", color: "white", border: "none", padding: "12px 22px", borderRadius: "10px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", boxShadow: "0 4px 15px rgba(21, 153, 87, 0.4)", transition: "transform 0.2s" }}
            >
              <span>↓</span> Download Fee Receipt (PDF)
            </button>
          </div>

          <h3 style={{ color: "#a5b4fc", fontSize: "14px", marginBottom: "18px", textTransform: "uppercase", letterSpacing: "1.2px", fontWeight: "700" }}>Active Program Applications</h3>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
            {(Array.isArray(cart) ? cart : []).map((item, idx) => {
              const catalogEntry = COURSE_CATALOG[item] || {};
              return (
              <div key={idx} style={{ background: "#0a1124", border: "1px solid #3b486d", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 10px 25px rgba(0,0,0,0.3)" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px", gap: "12px" }}>
                    <h4 style={{ color: "#fff", margin: 0, fontSize: "16px", fontWeight: "700", lineHeight: "1.4" }}>{catalogEntry.name}</h4>
                    <span style={{ background: "rgba(34, 197, 94, 0.15)", color: "#4ade80", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "bold", border: "1px solid rgba(34, 197, 94, 0.3)", whiteSpace: "nowrap" }}>✓ Confirmed</span>
                  </div>
                  <div style={{ color: "#a5b4fc", fontSize: "13px", marginBottom: "22px", fontWeight: "500" }}>🎓 {catalogEntry.university}</div>
                  
                  <div style={{ display: "grid", gap: "10px", borderTop: "1px solid #293c5c", paddingTop: "16px", fontSize: "13px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#7890b2" }}>Application ID:</span><strong style={{ color: "#fff", fontFamily: "monospace" }}>{registrationId}-{idx + 1}</strong></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#7890b2" }}>Assigned Exam:</span><strong style={{ color: "#fff", textAlign: "right" }}>{catalogEntry.exam || "Merit Based"}</strong></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#7890b2" }}>Test Slot:</span><strong style={{ color: "#a5b4fc", textAlign: "right", maxWidth: "180px" }}>{selectedExamSlots[catalogEntry.exam] || "Direct Counseling"}</strong></div>
                    {catalogEntry.exam !== "Merit Based Admission" && (
                      <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#7890b2" }}>Allocated Center:</span><strong style={{ color: "#fff" }}>{showCenterPreferences ? (cityPreferences?.pref1 || "Chennai") : "Online Verification"}</strong></div>
                    )}
                  </div>
                </div>

                <button 
                  type="button"
                  onClick={() => downloadAdmitCard(item, catalogEntry)}
                  style={{ width: "100%", marginTop: "24px", padding: "12px", background: "rgba(108, 76, 255, 0.15)", color: "#b99cff", border: "1px solid rgba(108, 76, 255, 0.4)", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                >
                  <span>↓</span> Download Admit Card (PDF)
                </button>
              </div>
            )})}
          </div>
        </div>
      </Page>
    );
  }

  return null;
}

function Page({ children, currentStep, onHome, onCopilot, flowConfig, currentIndex, currentUserUid, handleLogout, openAdmin, onStepClick, showCopilot, setShowCopilot }) {
  const visibleSteps = flowConfig.filter((step) => step.showInProgress);
  return (
    <div className="app">
      <header className="navbar">
        <div className="brand" onClick={onHome}><div className="brand-mark">SR</div><div><h2>SmartRegTech</h2><p>Digital Registration & Compliance</p></div></div>
        <div className="nav-buttons">
          <button type="button" className="nav-button secondary" onClick={() => setShowCopilot(true)}><span>✦</span> AI Copilot</button>
          {openAdmin && (<button type="button" className="nav-button" onClick={openAdmin}><span>▦</span> Admin Analytics</button>)}
          {currentUserUid ? (<button type="button" className="nav-button secondary" onClick={handleLogout}>Logout ({currentUserUid})</button>) : (<div className="secure-nav"><span>●</span> Secure Session</div>)}
        </div>
      </header>
      <div className="progress-container">
        <div className="progress-steps">
          {visibleSteps.map((item) => {
            const originalIndex = flowConfig.findIndex((f) => f.id === item.id);
            const active = currentStep === item.id;
            const visuallyCompleted = originalIndex < currentIndex;
            return (
              <div className={`progress-step ${active ? "active" : ""} ${visuallyCompleted ? "completed" : ""}`} key={item.id} onClick={() => { if (onStepClick && !active) onStepClick(originalIndex); }} style={{ cursor: "pointer", pointerEvents: "auto", position: "relative", zIndex: 50 }} title={`Jump to ${item.label}`}>
                <div className="progress-circle" style={{ pointerEvents: "none" }}>{visuallyCompleted ? "✓" : visibleSteps.indexOf(item) + 1}</div>
                <span style={{ pointerEvents: "none", userSelect: "none" }}>{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
      <main className="page-container"><section className="content-card">{children}</section></main>
      <footer className="app-footer">SmartRegTech Prototype <span>•</span> Secure Digital Registration</footer>
      {showCopilot && <AICopilot onClose={() => setShowCopilot(false)} />}
    </div>
  );
}

function FeatureCard({ icon, title, text }) {
  return (<div className="feature-card"><div className="feature-icon">{icon}</div><h3>{title}</h3><p>{text}</p><div className="feature-arrow">→</div></div>);
}

function WorkflowStep({ number, title, text }) {
  return (<div className="workflow-step"><div className="workflow-number">{number}</div><h3>{title}</h3><p>{text}</p></div>);
}

function VerifiedField({ label, value }) {
  return (<div className="verified-field"><span>{label}</span><strong>{value}</strong><small>✓ Verified</small></div>);
}

function ReviewRow({ label, value, verified = false }) {
  return (<div className="review-row"><span>{label}</span><strong>{verified && <span className="tiny-check">✓</span>}{value}</strong></div>);
}

export default App;