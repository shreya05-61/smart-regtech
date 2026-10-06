import { useEffect, useRef, useState, useCallback } from "react";
import "./App.css";
import AdminAnalytics from "./AdminAnalytics";
import "./SmartRegTech_OTP_Popup.css";
import "./new_digilocker.css";
import "./SmartRegTech_mobile_responsive.css";

const API_BASE = "https://smart-regtech.onrender.com";
const DEMO_IDENTITY = "999988887777";
const DEMO_OTP = "123456";

// ============================================================
// CLIENT CONFIGURATION (WHITE-LABELING)
// ============================================================
const TARGET_COLLEGE = null; 

// ============================================================
// COMPREHENSIVE NATIONALITIES LIST
// ============================================================
const NATIONALITIES_LIST = [
  "Indian", "Afghan", "Albanian", "Algerian", "American", "Andorran", "Angolan", "Argentine", "Armenian", 
  "Australian", "Austrian", "Azerbaijani", "Bahamian", "Bahraini", "Bangladeshi", "Barbadian", "Belarusian", 
  "Belgian", "Belizean", "Beninese", "Bhutanese", "Bolivian", "Bosnian", "Botswanan", "Brazilian", "Bruneian", 
  "Bulgarian", "Burkinabe", "Burundian", "Cambodian", "Cameroonian", "Canadian", "Cape Verdean", "Chadian", 
  "Chilean", "Chinese", "Colombian", "Comoran", "Congolese", "Costa Rican", "Croatian", "Cuban", "Cypriot", 
  "Czech", "Danish", "Djiboutian", "Dominican", "Dutch", "Ecuadorian", "Egyptian", "Emirati", "Equatorial Guinean", 
  "Eritrean", "Estonian", "Eswatini", "Ethiopian", "Fijian", "Finnish", "French", "Gabonese", "Gambian", "Georgian", 
  "German", "Ghanaian", "Greek", "Grenadian", "Guatemalan", "Guinean", "Guyanese", "Haitian", "Honduran", "Hungarian", 
  "Icelander", "Indonesian", "Iranian", "Iraqi", "Irish", "Israeli", "Italian", "Ivorian", "Jamaican", "Japanese", 
  "Jordanian", "Kazakh", "Kenyan", "Kittitian", "Kuwaiti", "Kyrgyz", "Laotian", "Latvian", "Lebanese", "Basotho", 
  "Liberian", "Libyan", "Liechtensteiner", "Lithuanian", "Luxembourger", "Malagasy", "Malawian", "Malaysian", 
  "Maldivian", "Malian", "Maltese", "Marshallese", "Mauritanian", "Mauritian", "Mexican", "Micronesian", "Moldovan", 
  "Monacan", "Mongolian", "Montenegrin", "Moroccan", "Mozambican", "Myanmar", "Namibian", "Nauruan", "Nepalese", 
  "New Zealander", "Nicaraguan", "Nigerien", "Nigerian", "North Korean", "Macedonian", "Norwegian", "Omani", 
  "Pakistani", "Palauan", "Panamanian", "Papua New Guinean", "Paraguayan", "Peruvian", "Filipino", "Polish", 
  "Portuguese", "Qatari", "Romanian", "Russian", "Rwandan", "Saint Lucian", "Salvadoran", "Samoan", "San Marinese", 
  "Sao Tomean", "Saudi", "Senegalese", "Serbian", "Seychellois", "Sierra Leonean", "Singaporean", "Slovak", 
  "Slovenian", "Solomon Islander", "Somali", "South African", "South Korean", "Spanish", "Sri Lankan", "Sudanese", 
  "Surinamese", "Swedish", "Swiss", "Syrian", "Taiwanese", "Tajik", "Tanzanian", "Thai", "Togolese", "Tongan", 
  "Trinidadian", "Tunisian", "Turkish", "Turkmen", "Tuvaluan", "Ugandan", "Ukrainian", "Uruguayan", "Uzbek", 
  "Vanuatuan", "Vatican", "Venezuelan", "Vietnamese", "Yemeni", "Zambian", "Zimbabwean"
];

// ============================================================
// EDUCATIONAL BACKGROUND OPTIONS
// ============================================================
const EDUCATIONAL_BACKGROUNDS = [
  "Science (PCM - Physics, Chemistry, Mathematics)",
  "Science (PCB - Physics, Chemistry, Biology)",
  "Science (PCMB - Physics, Chemistry, Math, Biology)",
  "Commerce with Mathematics",
  "Commerce without Mathematics (Business Studies, Accountancy, Economics)",
  "Arts / Humanities (History, Political Science, Geography, Sociology)",
  "Arts / Humanities with Economics & Mathematics",
  "Computer Science / Information Technology Vocational",
  "Undergraduate Degree (B.Tech / B.E. / B.Sc / B.Com / B.A.)",
  "Diploma / Polytechnic",
  "Other Professional / Academic Stream"
];

// ============================================================
// DYNAMIC PRESET WORKFLOWS BY METHOD
// ============================================================
const METHOD_FLOWS = {
  identity: [
    { id: "identity", label: "Aadhaar Verification", showInProgress: true },
    { id: "verified", label: "Verified Profile", showInProgress: false },
    { id: "form", label: "Program Details", showInProgress: true },
    { id: "review", label: "Application Review", showInProgress: true },
    { id: "payment", label: "Payment", showInProgress: true },
    { id: "success", label: "Dashboard", showInProgress: true }
  ],
  manual: [
    { id: "manualRegister", label: "Contact Details", showInProgress: true },
    { id: "manualBasicDetails", label: "Basic Details", showInProgress: true },
    { id: "manualPhotoCapture", label: "Photo Upload", showInProgress: true },
    { id: "manualDocumentUpload", label: "Document Upload", showInProgress: true },
    { id: "manualReviewProfile", label: "Profile Review", showInProgress: true },
    { id: "form", label: "Program Details", showInProgress: true },
    { id: "review", label: "Application Review", showInProgress: true },
    { id: "payment", label: "Payment", showInProgress: true },
    { id: "success", label: "Dashboard", showInProgress: true }
  ],
  google: [
    { id: "manualRegister", label: "Google Verification", showInProgress: true },
    { id: "manualBasicDetails", label: "Basic Details", showInProgress: true },
    { id: "manualPhotoCapture", label: "Photo Upload", showInProgress: true },
    { id: "manualDocumentUpload", label: "Document Upload", showInProgress: true },
    { id: "manualReviewProfile", label: "Profile Review", showInProgress: true },
    { id: "form", label: "Program Details", showInProgress: true },
    { id: "review", label: "Application Review", showInProgress: true },
    { id: "payment", label: "Payment", showInProgress: true },
    { id: "success", label: "Dashboard", showInProgress: true }
  ]
};

const MOCK_DIGILOCKER_PROFILE = {
  source: "DigiLocker Sandbox / Mock Connector",
  document: "Aadhaar & Education Profile",
  verifiedAt: "2026-08-16T10:30:00Z",
  name: "Priya Sharma",
  dob: "15/06/2004",
  gender: "Female",
  address: "Chennai, Tamil Nadu",
  email: "priya.sharma@example.com",
  phone: "9876543210",
  photo: "PS",
  board: "CBSE",
  qualification: "Science (PCM - Physics, Chemistry, Mathematics)",
  documentStatus: "Digitally verified",
};

const fetchMockDigiLockerProfile = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1800));
  return { ...MOCK_DIGILOCKER_PROFILE };
};

// ============================================================
// CATALOG DATA: EXAM FEES & PROGRAM FEES
// ============================================================
const COURSE_CATALOG = {
  "SIU-BTECH-CS": { university: "Symbiosis International University (Pune)", name: "B.Tech (Computer Science & Engineering)", exam: "SITEEE 2026", programFee: 4500, examFee: 1500, eligibilityType: "PCM: 91.3%" },
  "SIU-BBA": { university: "Symbiosis International University (Pune)", name: "BBA (Honours)", exam: "SET 2026", programFee: 3800, examFee: 1200, eligibilityType: "Aggregate: 92.8%" },
  "SIU-BALLB": { university: "Symbiosis International University (Pune)", name: "B.A. LL.B (Honours)", exam: "SLAT 2026", programFee: 4200, examFee: 1400, eligibilityType: "Aggregate: 92.8%" },
  
  "VIT-BTECH-CS": { university: "Vellore Institute of Technology (VIT)", name: "B.Tech (Computer Science)", exam: "VITEEE 2026", programFee: 5000, examFee: 1600, eligibilityType: "PCM: 91.3%" },
  "VIT-BTECH-EC": { university: "Vellore Institute of Technology (VIT)", name: "B.Tech (Electronics & Communication)", exam: "VITEEE 2026", programFee: 4800, examFee: 1600, eligibilityType: "PCM: 91.3%" },
  "VIT-BCA": { university: "Vellore Institute of Technology (VIT)", name: "BCA (Data Analytics)", exam: "Merit Based Admission", programFee: 3500, examFee: 0, eligibilityType: "Aggregate: 92.8%" },

  "BITS-BE-CS": { university: "Birla Institute of Technology and Science (BITS)", name: "B.E. (Computer Science)", exam: "BITSAT 2026", programFee: 6000, examFee: 2000, eligibilityType: "PCM: 91.3%" },
  "BITS-BE-MECH": { university: "Birla Institute of Technology and Science (BITS)", name: "B.E. (Mechanical Engineering)", exam: "BITSAT 2026", programFee: 5500, examFee: 2000, eligibilityType: "PCM: 91.3%" },
  "BITS-BPHARM": { university: "Birla Institute of Technology and Science (BITS)", name: "B.Pharm (Honours)", exam: "BITSAT 2026", programFee: 4500, examFee: 2000, eligibilityType: "PCB/PCM: 91.3%" },

  "DU-BCOM": { university: "Delhi University (DU)", name: "B.Com (Honours)", exam: "CUET UG 2026", programFee: 3000, examFee: 1000, eligibilityType: "Aggregate: 92.8%" },
  "DU-BA-ECO": { university: "Delhi University (DU)", name: "B.A. (Honours) Economics", exam: "CUET UG 2026", programFee: 3200, examFee: 1000, eligibilityType: "Aggregate: 92.8%" },
  "DU-BSC-MATH": { university: "Delhi University (DU)", name: "B.Sc. (Honours) Mathematics", exam: "CUET UG 2026", programFee: 3400, examFee: 1000, eligibilityType: "PCM: 91.3%" },

  "IIM-IPM": { university: "Indian Institute of Management (IIM) Rohtak", name: "Five Year Integrated Programme in Management (IPM)", exam: "IPMAT 2026", programFee: 7500, examFee: 2000, eligibilityType: "Aggregate: 92.8%" },

  "IITB-BTECH-CS": { university: "Indian Institute of Technology (IIT) Bombay", name: "B.Tech in Computer Science and Engineering", exam: "JEE Advanced 2026", programFee: 6500, examFee: 1900, eligibilityType: "JEE Adv Top Ranks" },
  "IITB-BTECH-EE": { university: "Indian Institute of Technology (IIT) Bombay", name: "B.Tech in Electrical Engineering", exam: "JEE Advanced 2026", programFee: 6200, examFee: 1900, eligibilityType: "JEE Adv Top Ranks" },

  "ANNA-BTECH-IT": { university: "Anna University (CEG Campus, Chennai)", name: "B.Tech (Information Technology)", exam: "TNEA Counseling 2026", programFee: 3500, examFee: 1000, eligibilityType: "PCM Cutoff: 195+" },
  "ANNA-BE-CIVIL": { university: "Anna University (CEG Campus, Chennai)", name: "B.E. (Civil Engineering)", exam: "TNEA Counseling 2026", programFee: 3200, examFee: 1000, eligibilityType: "PCM Cutoff: 180+" },

  "MAHE-BTECH-AI": { university: "Manipal Academy of Higher Education (MAHE)", name: "B.Tech (Artificial Intelligence & Machine Learning)", exam: "MET 2026", programFee: 4600, examFee: 1400, eligibilityType: "PCM: 85%+" },
  "MAHE-BBA": { university: "Manipal Academy of Higher Education (MAHE)", name: "BBA (FinTech)", exam: "Merit Based Admission", programFee: 3800, examFee: 0, eligibilityType: "Aggregate: 80%+" },

  "SRM-BTECH-IOT": { university: "SRM Institute of Science and Technology", name: "B.Tech (Cloud Computing & IoT)", exam: "SRMJEE 2026", programFee: 4200, examFee: 1300, eligibilityType: "PCM: 75%+" },
  "SRM-BARCH": { university: "SRM Institute of Science and Technology", name: "Bachelor of Architecture (B.Arch)", exam: "NATA 2026", programFee: 4900, examFee: 1700, eligibilityType: "NATA Qualified + PCM" }
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
const INDIAN_STATES = ["Andhra Pradesh", "Delhi", "Karnataka", "Kerala", "Maharashtra", "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal"];

// ============================================================
// SECURE PASSWORD HASHING UTILITY
// ============================================================
const hashPassword = async (password) => {
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const generateCredentials = () => {
  const year = new Date().getFullYear();
  const randomNumbers = Math.floor(10000 + Math.random() * 90000);
  const uid = `${year}${randomNumbers}`;
  const pwd = Math.random().toString(36).substring(2, 10);
  return { uid, pwd };
};

// ============================================================
// DUAL-MODE UNIFIED PHOTO CAPTURE COMPONENT
// ============================================================
const AadhaarPhotoCapture = ({ onCaptureSuccess, onRetake }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [activeTab, setActiveTab] = useState("webcam"); 
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [matchScore, setMatchScore] = useState(null);
  const [cameraError, setCameraError] = useState(null);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 400, height: 400, facingMode: 'user' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setCameraError("Unable to access camera. Please allow camera permissions in your browser.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (video && canvas) {
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth || 400;
      canvas.height = video.videoHeight || 400;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageSrc = canvas.toDataURL('image/png');
      setCapturedImage(imageSrc);

      stopCamera();

      const mockScore = (96 + Math.random() * 3.5).toFixed(1);
      setMatchScore(mockScore);

      if (onCaptureSuccess) {
        onCaptureSuccess(imageSrc, mockScore);
      }
    }
  }, [onCaptureSuccess]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File size exceeds 2 MB limit. Please upload a smaller photo.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageSrc = reader.result;
        setCapturedImage(imageSrc);
        const mockScore = (96 + Math.random() * 3.5).toFixed(1);
        setMatchScore(mockScore);
        if (onCaptureSuccess) {
          onCaptureSuccess(imageSrc, mockScore);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setMatchScore(null);
    if (onRetake) {
      onRetake();
    }
    if (activeTab === "webcam") {
      startCamera();
    }
  };

  useEffect(() => {
    if (activeTab === "webcam" && !capturedImage) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [activeTab]);

  return (
    <div className="photo-capture-card" style={{ background: "#0a1124", border: "1px solid #3b486d", borderRadius: "16px", padding: "28px" }}>
      <h3 style={{ color: '#ffffff', margin: '0 0 6px', fontSize: '20px', fontWeight: 800 }}>
        Upload Your Profile Photo *
      </h3>
      <p style={{ color: '#cbd5e1', fontSize: '13px', margin: '0 0 20px', lineHeight: 1.5 }}>
        Upload a recent passport-sized photograph or capture one live.
      </p>

      {/* Mode Switcher Tabs */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px", background: "#040812", padding: "4px", borderRadius: "10px", border: "1px solid #3b486d" }}>
        <button 
          type="button" 
          onClick={() => {
            setActiveTab("upload");
            stopCamera();
          }}
          style={{ padding: "10px", borderRadius: "8px", fontWeight: "bold", fontSize: "13px", cursor: "pointer", border: "none", background: activeTab === "upload" ? "#1e1b4b" : "transparent", color: activeTab === "upload" ? "#818cf8" : "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
        >
          <span>📁</span> Upload File
        </button>
        <button 
          type="button" 
          onClick={() => setActiveTab("webcam")}
          style={{ padding: "10px", borderRadius: "8px", fontWeight: "bold", fontSize: "13px", cursor: "pointer", border: "none", background: activeTab === "webcam" ? "#1e1b4b" : "transparent", color: activeTab === "webcam" ? "#818cf8" : "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
        >
          <span>📷</span> Use Webcam
        </button>
      </div>

      <div className="camera-preview-container" style={{ border: "2px dashed #3b486d", borderRadius: "12px", background: "#040812", minHeight: "260px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        {!capturedImage ? (
          activeTab === "webcam" ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{
                width: '100%',
                height: '260px',
                objectFit: 'cover',
                display: isCameraActive ? 'block' : 'none'
              }}
            />
          ) : (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <div style={{ width: "90px", height: "90px", borderRadius: "50%", background: "#0a1124", border: "2px solid #3b486d", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", color: "#818cf8", fontSize: "28px", fontWeight: "bold" }}>
                P
              </div>
              <label style={{ display: "inline-block", background: "#1e1b4b", color: "#818cf8", border: "1px solid #312e81", padding: "10px 20px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", fontSize: "13px" }}>
                Browse Image File
                <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: "none" }} />
              </label>
            </div>
          )
        ) : (
          <img
            src={capturedImage}
            alt="Captured Selfie"
            style={{ width: '100%', height: '260px', objectFit: 'cover' }}
          />
        )}

        {activeTab === "webcam" && !isCameraActive && !capturedImage && (
          <div style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600 }}>
            Initializing Live Camera...
          </div>
        )}
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {cameraError && activeTab === "webcam" && (
        <p style={{ color: '#f87171', fontSize: '12px', margin: '10px 0 0' }}>
          {cameraError}
        </p>
      )}

      {activeTab === "webcam" && isCameraActive && !capturedImage && (
        <button className="primary-button" onClick={capturePhoto} style={{ marginTop: "16px", width: "100%" }}>
          Capture Photo
        </button>
      )}

      {capturedImage && (
        <div style={{ marginTop: "16px", textAlign: "center" }}>
          <div className="match-badge" style={{ background: "rgba(34, 197, 94, 0.15)", color: "#4ade80", border: "1px solid rgba(34, 197, 94, 0.3)", padding: "8px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: "bold", display: "inline-block" }}>
            ✓ {matchScore}% Identity Match Confirmed
          </div>
          <div style={{ marginTop: '12px' }}>
            <button
              className="outline-button"
              style={{ minHeight: '36px', fontSize: '12px', padding: '0 16px' }}
              onClick={handleRetake}
            >
              Retake Photo
            </button>
          </div>
        </div>
      )}

      <div style={{ textAlign: "center", color: "#64748b", fontSize: "11px", marginTop: "16px" }}>
        Supported formats: JPG, JPEG, PNG • Max size: 2 MB
      </div>
    </div>
  );
};

// ============================================================
// ENHANCED DYNAMIC COPILOT KNOWLEDGE FALLBACK
// ============================================================
function getCopilotAnswer(question) {
  const q = question.toLowerCase();

  if (q.includes("program") || q.includes("course") || q.includes("available") || q.includes("offer") || q.includes("what and all")) {
    const courses = Object.values(COURSE_CATALOG).map(c => `• ${c.name} (${c.university}) — Program Fee: ₹${c.programFee} | Exam: ${c.exam}`).join("\n");
    return `Here are all the academic programs currently available on the SmartRegTech platform:\n\n${courses}`;
  }

  if (q.includes("exam") || q.includes("slot") || q.includes("date") || q.includes("schedule")) {
    const exams = Object.entries(EXAM_SCHEDULE_OPTIONS).map(([exam, slots]) => `• ${exam}: ${slots.join(", ")}`).join("\n");
    return `Here are the entrance exam schedules and available slots:\n\n${exams}`;
  }

  if (q.includes("digilocker") || q.includes("aadhaar") || q.includes("verification") || q.includes("identity") || q.includes("method")) {
    return "Our portal supports 3 registration modes:\n1. Aadhaar Verification (Demo Aadhaar ID & OTP 123456)\n2. Manual Registration (Email OTP 123456)\n3. Google SSO Verification";
  }

  if (q.includes("login") || q.includes("password") || q.includes("uid") || q.includes("resume")) {
    return "Upon completing profile verification, an Application ID (UID) and temporary password are generated automatically. You can use them on the 'Login / Resume' page anytime to continue your application.";
  }

  if (q.includes("payment") || q.includes("fee") || q.includes("upi") || q.includes("card") || q.includes("pay")) {
    return "We support simulated Sandbox payments via UPI (e.g. demo@upi), Credit/Debit Cards, and Net Banking. No real money is charged during this prototype phase.";
  }

  if (q.includes("process") || q.includes("registration") || q.includes("step") || q.includes("how to") || q.includes("workflow")) {
    return "The registration flow works as follows:\n1. Verify Contact / Aadhaar\n2. Fill Basic Details & Address\n3. Upload Photo & Documents\n4. Select Programs & Optional Entrance Exams\n5. Review Application\n6. Complete Payment & Download Admit Card / Receipt";
  }

  if (q.includes("city") || q.includes("center") || q.includes("location") || q.includes("preference")) {
    return `Available test center cities for offline entrance exams include: ${CITIES.join(", ")}. You can select 3 preferred cities during registration.`;
  }

  return `I can assist with all questions regarding the SmartRegTech website—such as available programs, fee structures, exam schedules, registration methods, test centers, and login recovery—as well as general academic queries. What specific details would you like to know?`;
}

function AICopilot({ onClose }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! 👋 I'm the SmartRegTech Copilot. Ask me anything about our available programs, fee structures, exam schedules, or registration process!",
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
            <div key={index} className={`copilot-message ${message.role === "user" ? "copilot-user" : "copilot-assistant"}`} style={{ whiteSpace: "pre-line" }}>
              {message.text}
            </div>
          ))}
          {loading && <div className="copilot-message copilot-assistant">Thinking...</div>}
        </div>
        <div className="copilot-suggestions">
          <button onClick={() => sendMessage("What programs are available?")}>Programs</button>
          <button onClick={() => sendMessage("What are the exam schedules?")}>Exams</button>
          <button onClick={() => sendMessage("How do I log in or resume?")}>Login</button>
          <button onClick={() => sendMessage("What is the registration process?")}>Process</button>
        </div>
        <div className="copilot-input-row">
          <input type="text" placeholder="Ask any question about programs, exams, or general queries..." value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={handleKeyDown} disabled={loading} />
          <button onClick={() => sendMessage()} disabled={loading || !input.trim()}>{loading ? "..." : "Send"}</button>
        </div>
        <div className="copilot-note">SmartRegTech Copilot • Full Knowledge Base Active</div>
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
  
  const [activeMethod, setActiveMethod] = useState("identity"); 
  const [activeFlow, setActiveFlow] = useState(METHOD_FLOWS.identity);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [highestStepIndex, setHighestStepIndex] = useState(0); 

  const [showCopilot, setShowCopilot] = useState(false);
  const [showLoginPwd, setShowLoginPwd] = useState(false);
  const [registrationId, setRegistrationId] = useState("");
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const [paymentStatus, setPaymentStatus] = useState("idle");
  const [identityPhase, setIdentityPhase] = useState("aadhaar");
  const [otp, setOtp] = useState("");
  const otpInputRefs = useRef([]);
  const [otpSeconds, setOtpSeconds] = useState(30);
  const [consentGiven, setConsentGiven] = useState(false);
  const [fetchStatus, setFetchStatus] = useState("idle");
  const [verifiedProfile, setVerifiedProfile] = useState(null);

  const [aadhaarCapturedPhoto, setAadhaarCapturedPhoto] = useState(null);
  const [aadhaarMatchScore, setAadhaarMatchScore] = useState(null);

  const [showTempPwd, setShowTempPwd] = useState(false);
  
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");

  const [manualFullName, setManualFullName] = useState("");
  const [manualEmail, setManualEmail] = useState("");
  const [manualPhone, setManualPhone] = useState("");
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [emailTimer, setEmailTimer] = useState(30);

  const [manualDob, setManualDob] = useState("");
  const [manualGender, setManualGender] = useState("Male");
  const [manualAddress1, setManualAddress1] = useState("");
  const [manualAddress2, setManualAddress2] = useState("");
  const [manualCity, setManualCity] = useState("");
  const [manualState, setManualState] = useState("");
  const [manualPinCode, setManualPinCode] = useState("");
  
  const [manualNationality, setManualNationality] = useState("Indian");
  const [nationalitySearch, setNationalitySearch] = useState("");
  const [showNationalityDropdown, setShowNationalityDropdown] = useState(false);
  const nationalityDropdownRef = useRef(null);

  const [manualEducationalBackground, setManualEducationalBackground] = useState("");

  const [photoTab, setPhotoTab] = useState("upload");
  const webcamVideoRef = useRef(null);
  const webcamStreamRef = useRef(null);
  const [webcamActive, setWebcamActive] = useState(false);

  const [manualSignature, setManualSignature] = useState(null);
  const [manualMarksheet, setManualMarksheet] = useState(null);
  const [manualGovtIdType, setManualGovtIdType] = useState("Aadhaar Card");
  const [manualGovtIdFile, setManualGovtIdFile] = useState(null);
  const [manualDeclaration, setManualDeclaration] = useState(false);

  const [cityPreferences, setCityPreferences] = useState({ pref1: "Chennai", pref2: "Bengaluru", pref3: "Hyderabad" });
  const [selectedExamSlots, setSelectedExamSlots] = useState({});
  const [selectedExamsCart, setSelectedExamsCart] = useState([]);

  const [activeDocument, setActiveDocument] = useState(null);
  
  const [showWhatsAppAlert, setShowWhatsAppAlert] = useState(false);
  const [alertDismissed, setAlertDismissed] = useState(false);

  const [newAccountDetails, setnewAccountDetails] = useState(null); 

  const [formData, setFormData] = useState({ identity: "", name: "", email: "", phone: "" });
  const [cart, setCart] = useState([]);

  const totalProgramsFee = (Array.isArray(cart) ? cart : []).reduce((sum, progKey) => sum + (COURSE_CATALOG[progKey]?.programFee || 0), 0);
  const totalExamsFee = (Array.isArray(selectedExamsCart) ? selectedExamsCart : []).reduce((sum, examName) => {
    const matchingProgKey = Object.keys(COURSE_CATALOG).find(k => COURSE_CATALOG[k].exam === examName);
    const examFee = matchingProgKey ? COURSE_CATALOG[matchingProgKey].examFee : 0;
    return sum + examFee;
  }, 0);
  const currentTotalFee = totalProgramsFee + totalExamsFee;

  const calculateCompletionPercentage = (stepIdx, flow) => {
    if (!flow || flow.length <= 1) return 0;
    return Math.min(100, Math.max(0, Math.round((stepIdx / (flow.length - 1)) * 100)));
  };

  const currentCompletionPercentage = calculateCompletionPercentage(currentStepIndex, activeFlow);

  const activeStepId = currentView === "flow" ? (activeFlow[currentStepIndex]?.id || "home") : currentView;
  const showCenterPreferences = selectedExamsCart.length > 0 && selectedExamsCart.some(e => e !== "Merit Based Admission");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (nationalityDropdownRef.current && !nationalityDropdownRef.current.contains(event.target)) {
        setShowNationalityDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (activeStepId !== "manualPhotoCapture" && webcamStreamRef.current) {
      webcamStreamRef.current.getTracks().forEach(track => track.stop());
      webcamStreamRef.current = null;
      setWebcamActive(false);
    }
  }, [activeStepId]);

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
            ? { ...user, cart, selectedExamsCart, formData, currentStepIndex, highestStepIndex, verifiedProfile, activeMethod, cityPreferences, selectedExamSlots, completionPercentage: currentCompletionPercentage } 
            : user
        );
      });
    }
  }, [cart, selectedExamsCart, formData, currentStepIndex, highestStepIndex, verifiedProfile, activeMethod, currentUserUid, cityPreferences, selectedExamSlots, currentCompletionPercentage]);

  const switchMethodFlow = (methodKey) => {
    setActiveMethod(methodKey);
    const newFlow = METHOD_FLOWS[methodKey];
    setActiveFlow(newFlow);
    setCurrentStepIndex(0);
    setHighestStepIndex(0);
  };

  const goToNextStep = () => {
    if (currentStepIndex < activeFlow.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const goHome = () => setCurrentView("home");
  const openAdmin = () => setCurrentView("admin");

  const goToPrevStep = () => {
    if (webcamStreamRef.current) {
      webcamStreamRef.current.getTracks().forEach(track => track.stop());
      webcamStreamRef.current = null;
      setWebcamActive(false);
    }
    
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

  const handleLogout = () => {
    if (webcamStreamRef.current) {
      webcamStreamRef.current.getTracks().forEach(track => track.stop());
      webcamStreamRef.current = null;
      setWebcamActive(false);
    }
    setCurrentUserUid(null);
    setCart([]);
    setSelectedExamsCart([]);
    setFormData({ identity: "", name: "", email: "", phone: "" });
    setCityPreferences({ pref1: "Chennai", pref2: "Bengaluru", pref3: "Hyderabad" });
    setSelectedExamSlots({});
    setVerifiedProfile(null);
    setAadhaarCapturedPhoto(null);
    setAadhaarMatchScore(null);
    setCurrentStepIndex(0);
    setHighestStepIndex(0);
    setIdentityPhase("aadhaar");
    setActiveDocument(null);
    setShowWhatsAppAlert(false);
    setAlertDismissed(false);
    setnewAccountDetails(null);
    setShowTempPwd(false); 
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
    if (!emailVerificationSent || emailVerified || emailTimer <= 0) return;
    const timer = setInterval(() => {
      setEmailTimer((seconds) => Math.max(0, seconds - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [emailVerificationSent, emailVerified, emailTimer]);

  useEffect(() => {
    const handleMessage = async (event) => {
      if (event.origin !== window.location.origin) return;
      
      if (event.data?.type === "DIGILOCKER_APPROVED") {
        setIdentityPhase("fetching");
        setFetchStatus("connecting");
        try {
          const profile = await fetchMockDigiLockerProfile();
          setFetchStatus("success");
          if (aadhaarCapturedPhoto) {
            profile.customPhoto = aadhaarCapturedPhoto;
          }
          setVerifiedProfile(profile);

          const verifiedStepIdx = activeFlow.findIndex(s => s.id === "verified");
          if (verifiedStepIdx >= 0) {
            setCurrentStepIndex(verifiedStepIdx);
          } else {
            goToNextStep();
          }
        } catch (error) {
          console.error(error);
          setFetchStatus("error");
          setIdentityPhase("otp");
          alert("The sandbox could not retrieve the profile.");
        }
      }

      if (event.data?.type === "GOOGLE_SSO_APPROVED") {
        const email = event.data.email;
        setManualEmail(email);
        setManualFullName("");
        setEmailVerified(true);
        setCurrentView("flow");
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [currentStepIndex, activeFlow, currentUserUid, formData, aadhaarCapturedPhoto]);

  const updateField = (field, value) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
  };

  const toggleCartItem = (programKey) => {
    const courseData = COURSE_CATALOG[programKey];
    const associatedExam = courseData?.exam;

    if (cart.includes(programKey)) {
      const updatedCart = cart.filter((item) => item !== programKey);
      setCart(updatedCart);

      const isExamStillRequired = updatedCart.some(
        (item) => COURSE_CATALOG[item]?.exam === associatedExam
      );

      if (!isExamStillRequired && associatedExam && associatedExam !== "Merit Based Admission") {
        setSelectedExamsCart((prevExams) => prevExams.filter((exam) => exam !== associatedExam));
        setSelectedExamSlots((prevSlots) => {
          const updatedSlots = { ...prevSlots };
          delete updatedSlots[associatedExam];
          return updatedSlots;
        });
      }
    } else {
      setCart([...cart, programKey]);
      if (associatedExam && associatedExam !== "Merit Based Admission" && !selectedExamsCart.includes(associatedExam)) {
        setSelectedExamsCart((prevExams) => [...prevExams, associatedExam]);
      }
    }
  };

  const toggleExamSelection = (examName) => {
    if (selectedExamsCart.includes(examName)) {
      setSelectedExamsCart(selectedExamsCart.filter(e => e !== examName));
    } else {
      setSelectedExamsCart([...selectedExamsCart, examName]);
    }
  };

  const startRegistration = () => {
    setCurrentView("methodSelect");
  };

  const handleSelectAadhaar = () => {
    switchMethodFlow("identity");
    if (!currentUserUid) {
      setIdentityPhase("aadhaar");
      setOtp("");
      setConsentGiven(false);
      setFetchStatus("idle");
      setVerifiedProfile(null);
      setAadhaarCapturedPhoto(null);
      setAadhaarMatchScore(null);
      setCart([]);
      setSelectedExamsCart([]);
      setFormData({ identity: "", name: "", email: "", phone: "" });
      setCityPreferences({ pref1: "Chennai", pref2: "Bengaluru", pref3: "Hyderabad" });
      setSelectedExamSlots({});
      setActiveDocument(null);
      setShowWhatsAppAlert(false);
      setAlertDismissed(false);
      setnewAccountDetails(null);
      setShowTempPwd(false);
    }
    setCurrentView("flow");
  };

  const handleSelectManual = () => {
    switchMethodFlow("manual");
    setManualFullName("");
    setManualEmail("");
    setManualPhone("");
    setEmailVerificationSent(false);
    setEmailVerified(false);
    setEmailOtp("");
    setEmailTimer(30);
    setCurrentView("flow");
  };

  const handleSelectGoogle = () => {
    switchMethodFlow("google");
    setManualFullName("");
    const googleWindow = window.open("", "_blank", "width=450,height=600,resizable=yes,scrollbars=yes");
    if (!googleWindow) {
      alert("The Google Sign-in window was blocked. Please allow pop-ups and try again.");
      return;
    }

    const googleHTML = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Sign in - Google Accounts</title>
      <style>
        body { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #fff; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
        .box { border: 1px solid #dadce0; border-radius: 8px; width: 100%; max-width: 450px; padding: 40px; box-sizing: border-box; text-align: center; }
        .logo { width: 75px; margin-bottom: 10px; }
        h1 { font-size: 24px; font-weight: 400; margin: 0 0 10px; color: #202124; }
        p { font-size: 16px; color: #202124; margin: 0 0 30px; }
        input { width: 100%; padding: 13px 15px; border: 1px solid #dadce0; border-radius: 4px; font-size: 16px; margin-bottom: 20px; box-sizing: border-box; outline: none; }
        input:focus { border: 2px solid #1a73e8; padding: 12px 14px; }
        .btn-row { display: flex; justify-content: space-between; align-items: center; margin-top: 20px; }
        button.next { background: #1a73e8; color: white; border: none; padding: 10px 24px; border-radius: 4px; font-size: 14px; font-weight: 500; cursor: pointer; }
        button.next:hover { background: #1557b0; }
        button.cancel { background: none; border: none; color: #1a73e8; font-size: 14px; font-weight: 500; cursor: pointer; padding: 10px 8px; }
        button.cancel:hover { background: #f1f3f4; border-radius: 4px; }
        .hidden { display: none; }
        .profile-badge { border: 1px solid #dadce0; border-radius: 16px; padding: 6px 12px; font-size: 14px; font-weight: 500; color: #3c4043; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 25px; }
        .consent-text { text-align: left; font-size: 14px; color: #5f6368; line-height: 1.5; margin-bottom: 20px; }
        .spinner { border: 3px solid #f3f3f3; border-top: 3px solid #1a73e8; border-radius: 50%; width: 24px; height: 24px; animation: spin 1s linear infinite; margin: 0 auto 10px; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      </style>
    </head>
    <body>
      <div class="box">
        <svg class="logo" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
        
        <div id="step1">
          <h1>Sign in</h1>
          <p>to continue to SmartRegTech</p>
          <input type="email" id="email" placeholder="Email or phone" autofocus />
          <div class="btn-row">
            <button class="cancel" onclick="window.close()">Cancel</button>
            <button class="next" onclick="nextStep(2)">Next</button>
          </div>
        </div>

        <div id="step2" class="hidden">
          <h1>Welcome</h1>
          <div class="profile-badge">👤&nbsp;&nbsp;<span id="display-email"></span></div>
          <input type="password" id="password" placeholder="Enter your password" />
          <div class="btn-row">
            <button class="cancel" onclick="nextStep(1)">Back</button>
            <button class="next" onclick="nextStep(3)">Next</button>
          </div>
        </div>

        <div id="step3" class="hidden">
          <h1>Consent Request</h1>
          <div class="profile-badge">👤&nbsp;&nbsp;<span id="display-email-2"></span></div>
          <p class="consent-text"><strong>SmartRegTech</strong> wants to access your Google Account. This will allow SmartRegTech to:<br><br>
          • See your primary Google Account email address<br>
          • See your personal info, including any personal info you've made publicly available</p>
          <div class="btn-row">
            <button class="cancel" onclick="window.close()">Cancel</button>
            <button class="next" onclick="finish()">Allow</button>
          </div>
        </div>

        <div id="step4" class="hidden" style="padding: 40px 0;">
          <div class="spinner"></div>
          <p>Authenticating...</p>
        </div>

      </div>
      <script>
        let userEmail = '';
        function nextStep(step) {
          if(step === 2) {
            userEmail = document.getElementById('email').value.trim();
            if(!userEmail.includes('@')) { alert('Enter a valid email address.'); return; }
            document.getElementById('display-email').innerText = userEmail;
            document.getElementById('display-email-2').innerText = userEmail;
          }
          if(step === 3) {
             const pwd = document.getElementById('password').value;
             if(!pwd) { alert('Enter your password.'); return; }
          }
          document.getElementById('step1').classList.add('hidden');
          document.getElementById('step2').classList.add('hidden');
          document.getElementById('step3').classList.add('hidden');
          document.getElementById('step' + step).classList.remove('hidden');
          
          if(step === 2) document.getElementById('password').focus();
        }
        function finish() {
          document.getElementById('step3').classList.add('hidden');
          document.getElementById('step4').classList.remove('hidden');
          setTimeout(() => {
            if(window.opener) {
              window.opener.postMessage({ type: 'GOOGLE_SSO_APPROVED', email: userEmail }, '*');
            }
            window.close();
          }, 1500);
        }
        
        document.getElementById('email').addEventListener('keypress', function(e) { if(e.key === 'Enter') nextStep(2); });
        document.getElementById('password').addEventListener('keypress', function(e) { if(e.key === 'Enter') nextStep(3); });
      </script>
    </body>
    </html>`;
    
    googleWindow.document.open();
    googleWindow.document.write(googleHTML);
    googleWindow.document.close();
    googleWindow.focus();
  };

  const handleProceedToBasicDetails = () => {
    if (!manualFullName.trim()) {
      alert("Please enter your full name as per official records.");
      return;
    }
    if (!manualEmail.trim() || !manualEmail.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }
    if (!emailVerified) {
      alert("Please verify your email address before proceeding.");
      return;
    }
    if (!manualPhone.trim() || manualPhone.replace(/\D/g, "").length < 10) {
      alert("Please enter a valid phone number.");
      return;
    }
    goToNextStep();
  };

  const proceedToPhotoCapture = () => {
    if (!manualDob.trim()) {
      alert("Please select your Date of Birth.");
      return;
    }
    if (!manualAddress1.trim() || !manualCity.trim() || !manualState.trim() || !manualPinCode.trim()) {
      alert("Please fill in your complete address details (Address line 1, City, State, Pin code).");
      return;
    }
    if (!manualEducationalBackground) {
      alert("Please select your educational background stream.");
      return;
    }

    const fullAddress = [manualAddress1, manualAddress2, manualCity, manualState, manualPinCode].filter(Boolean).join(", ");
    const profile = {
      source: activeMethod === "google" ? "Google Account SSO" : "Manual Registration Form",
      document: "Self-Entered Profile",
      verifiedAt: new Date().toISOString(),
      name: manualFullName,
      dob: manualDob,
      gender: manualGender,
      address: fullAddress,
      email: manualEmail,
      phone: manualPhone,
      photo: manualFullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "ME",
      board: manualEducationalBackground,
      qualification: manualEducationalBackground,
      documentStatus: activeMethod === "google" ? "Google Verified Email + Manual Entry" : "Manual Entry with Verified Email",
      customPhoto: null
    };

    setVerifiedProfile(profile);
    setPhotoTab("upload");
    goToNextStep();
  };

  const generateAppIdFinal = async () => {
    const { uid, pwd } = generateCredentials();
    const hashedPwd = await hashPassword(pwd);

    const formStepIndex = activeFlow.findIndex(s => s.id === "form");
    const targetStepIndex = formStepIndex >= 0 ? formStepIndex : 0;
    const initialCompletion = calculateCompletionPercentage(targetStepIndex, activeFlow);

    const newUser = {
      uid,
      password: hashedPwd,
      cart: [],
      selectedExamsCart: [],
      formData: { identity: activeMethod === "google" ? "Google SSO" : "Manual", name: manualFullName, email: manualEmail, phone: manualPhone, govtIdType: manualGovtIdType },
      currentStepIndex: targetStepIndex,
      highestStepIndex: targetStepIndex,
      verifiedProfile,
      activeMethod,
      cityPreferences: { pref1: "Chennai", pref2: "Bengaluru", pref3: "Hyderabad" },
      selectedExamSlots: {},
      completionPercentage: initialCompletion
    };

    setMockUsersDB(prev => Array.isArray(prev) ? [...prev, newUser] : [newUser]);
    setCurrentUserUid(uid);
    setnewAccountDetails({ uid, pwd });
    setShowTempPwd(false);
    
    setCurrentStepIndex(targetStepIndex);
    setHighestStepIndex(targetStepIndex);
  };

  const verifyIdentity = () => {
    if (!/^\d{12}$/.test(formData.identity) && formData.identity !== DEMO_IDENTITY) {
      alert("Please enter a valid 12-digit demo Aadhaar number.");
      return;
    }
    if (formData.identity !== DEMO_IDENTITY) {
      alert(`For this prototype, use the demo Aadhaar number.`);
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
    setIdentityPhase("photoCapture");
  };

  const proceedFromAadhaarPhoto = () => {
    if (!aadhaarCapturedPhoto) {
      alert("Please capture or upload your photo to complete identity liveness verification.");
      return;
    }

    const digiLockerWindow = window.open("", "_blank", "width=560,height=820,resizable=yes,scrollbars=yes");
    if (!digiLockerWindow) {
      alert("The Sandbox window was blocked. Please allow pop-ups for this website and try again.");
      return;
    }

    const digiLockerHTML = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>DigiLocker Sandbox</title><style>*{box-sizing:border-box} body{margin:0;background:#f5f7fb;color:#172033;font-family:Arial,Helvetica,sans-serif}.top{height:70px;background:#fff;border-bottom:1px solid #e2e6ee;display:flex;align-items:center;justify-content:space-between;padding:0 24px}.brand{display:flex;align-items:center;gap:11px} .logo{width:42px;height:42px;border-radius:10px;background:#673de6;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800}.brand strong{display:block;color:#42229e;font-size:19px} .brand span{display:block;color:#7a8494;font-size:9px;margin-top:2px}.badge{padding:7px 11px;border-radius:20px;background:#fff3dc;color:#986300;font-size:9px;font-weight:800;letter-spacing:1px}.page{width:calc(100% - 30px);max-width:620px;margin:30px auto} .hero{text-align:center;margin-bottom:20px}.lock{width:58px;height:58px;margin:auto;border-radius:50%;background:#eee8ff;display:flex;align-items:center;justify-content:center;font-size:26px}.hero h1{margin:14px 0 6px;font-size:24px} .hero p{margin:0;color:#6e7889;font-size:12px;line-height:1.6}.card{background:#fff;border:1px solid #e0e4eb;border-radius:17px;padding:25px;box-shadow:0 15px 45px rgba(50,35,100,.10)}.label{color:#6740d5;font-size:10px;font-weight:800;letter-spacing:1px;margin-bottom:12px}.app{display:flex;align-items:center;gap:12px;padding:15px;border:1px solid #e2e5ec;border-radius:12px;background:#faf9ff}.appLogo{width:44px;height:44px;border-radius:11px;background:#7044df;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800}.app strong{display:block;font-size:15px} .app small{display:block;margin-top:3px;color:#7c8492;font-size:10px}.secure{margin-left:auto;color:#16804c;font-size:9px;font-weight:800} .request{margin-top:22px} .request h2{margin:0;font-size:18px}.request p{margin:8px 0 0;color:#6f7889;font-size:12px;line-height:1.6}.info{margin-top:20px;padding:17px;border-radius:12px;background:#f7f5ff} .infoTitle{color:#5932c9;font-size:11px;font-weight:800;margin-bottom:13px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:11px} .item{font-size:11px;color:#4f596b}.item::before{content:'✓';color:#16804c;font-weight:900;margin-right:7px}.consent{display:flex;gap:9px;align-items:flex-start;margin-top:21px;color:#4d586b;font-size:11px;line-height:1.6;cursor:pointer}.consent input{width:16px;height:16px;accent-color:#673de6}.allow,.cancel{width:100%;padding:13px;border-radius:9px;font-weight:800;font-size:12px;cursor:pointer}.allow{margin-top:21px;border:0;background:#673de6;color:#fff}.allow:disabled{opacity:.45;cursor:not-allowed}.cancel{margin-top:9px;border:1px solid #d9dce4;background:#fff;color:#667084}.footer{text-align:center;margin-top:18px;color:#89919f;font-size:9px;line-height:1.7}.loading,.success{text-align:center;padding:35px 0}.spinner{width:40px;height:40px;margin:0 auto 15px;border:4px solid #e8e1ff;border-top-color:#673de6;border-radius:50%;animation:spin .8s linear infinite}@keyframes spin{to{transform:rotate(0deg)}}.successIcon{width:58px;height:58px;margin:0 auto 14px;border-radius:50%;background:#e6f8ee;color:#16804c;display:flex;align-items:center;justify-content:center;font-size:27px}.success h2{margin:0;font-size:20px}.success p{color:#6c7587;font-size:12px;line-height:1.6}@media(max-width:600px){.top{padding:0 15px}.badge{display:none}.card{padding:20px}.grid{grid-template-columns:1fr}}</style></head><body><header class="top"> <div class="brand"><div class="logo">DL</div><div><strong>DigiLocker</strong><span>Document Wallet to Empower Citizens</span></div></div> <div class="badge">SANDBOX</div></header><main class="page"> <div class="hero"><div class="lock">🔐</div><h1>Secure Authorization</h1><p>Review the information requested by SmartRegTech before continuing.</p></div> <div class="card" id="card"> <div class="label">APPLICATION REQUESTING ACCESS</div> <div class="app"><div class="appLogo">SR</div><div><strong>SmartRegTech</strong><small>Digital Registration &amp; Compliance Portal</small></div><div class="secure">✓ SECURE</div></div> <div class="request"><h2>Allow SmartRegTech to access your information?</h2><p>SmartRegTech is requesting permission to retrieve verified information for completing your registration.</p></div> <div class="info"><div class="infoTitle">INFORMATION REQUESTED</div><div class="grid"><div class="item">Full Name</div><div class="item">Date of Birth</div><div class="item">Gender</div><div class="item">Address</div><div class="item">Education Details</div><div class="item">Board / Qualification</div></div></div> <label class="consent"><input type="checkbox" id="consent" /><span>I authorize SmartRegTech to access the requested information for registration purposes.</span></label> <button class="allow" id="allow" disabled>Allow &amp; Continue →</button> <button class="cancel" onclick="window.close()">Cancel</button> <div class="footer">🔒 Secure sandbox environment<br/>Prototype only — no real account or government documents are accessed.</div> </div></main><script>const consent=document.getElementById('consent');const allow=document.getElementById('allow');const card=document.getElementById('card');consent.addEventListener('change',()=>{allow.disabled=!consent.checked});allow.addEventListener('click',()=>{ allow.disabled=true; card.innerHTML='<div class="loading"><div class="spinner"></div><h2>Authorizing...</h2><p>Securely processing your consent and retrieving your verified information.</p></div>'; setTimeout(()=>{ card.innerHTML='<div class="success"><div class="successIcon">✓</div><h2>Authorization Successful</h2><p>Your consent has been recorded successfully.</p><p>Returning to SmartRegTech...</p></div>'; if(window.opener&&!window.opener.closed){window.opener.postMessage({type:'DIGILOCKER_APPROVED'},window.location.origin);} setTimeout(()=>window.close(),1200); },1800);});</script></body></html>`;
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
      if (aadhaarCapturedPhoto) {
        profile.customPhoto = aadhaarCapturedPhoto;
      }
      setVerifiedProfile(profile);

      const verifiedStepIdx = activeFlow.findIndex(s => s.id === "verified");
      if (verifiedStepIdx >= 0) {
        setCurrentStepIndex(verifiedStepIdx);
      } else {
        goToNextStep();
      }
    } catch (error) {
      console.error(error);
      setFetchStatus("error");
      setIdentityPhase("consent");
      alert("The mock connector could not retrieve the profile.");
    }
  };

  const handleProceedFromVerifiedProfile = async () => {
    if (!currentUserUid) {
      const { uid, pwd } = generateCredentials();
      const hashedPwd = await hashPassword(pwd);
      const nextIdx = currentStepIndex + 1;
      const newUser = {
        uid,
        password: hashedPwd,
        cart: [],
        selectedExamsCart: [],
        formData: { identity: formData.identity },
        currentStepIndex: nextIdx,
        highestStepIndex: nextIdx,
        verifiedProfile,
        activeMethod,
        cityPreferences: { pref1: "Chennai", pref2: "Bengaluru", pref3: "Hyderabad" },
        selectedExamSlots: {},
        completionPercentage: calculateCompletionPercentage(nextIdx, activeFlow)
      };
      setMockUsersDB(prev => Array.isArray(prev) ? [...prev, newUser] : [newUser]);
      setCurrentUserUid(uid);
      setnewAccountDetails({ uid, pwd });
      setShowTempPwd(false);
    } else {
      goToNextStep();
    }
  };

  const continueFromForm = () => {
    if (cart.length === 0) {
      alert("Please select at least one program to add to your cart.");
      return;
    }
    const missingSlots = selectedExamsCart.filter(examName => !selectedExamSlots[examName]);
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
            name: verifiedProfile?.name || "Priya Sharma",
            email: verifiedProfile?.email || "priya.sharma@example.com",
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
    const programsSummaryHTML = cart.map(id => {
      const entry = COURSE_CATALOG[id] || {};
      return `• ${entry.name} (${entry.university}) — Program: ₹${entry.programFee || 3000}`;
    }).join("<br/>");

    const examsSummaryHTML = selectedExamsCart.map(e => {
      const matchingProgKey = Object.keys(COURSE_CATALOG).find(k => COURSE_CATALOG[k].exam === e);
      const examFee = matchingProgKey ? COURSE_CATALOG[matchingProgKey].examFee : 1200;
      return `• ${e} (${selectedExamSlots[e] || "Slot Selected"}) — Exam Fee: ₹${examFee}`;
    }).join("<br/>");
    
    const receiptHTML = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>SmartRegTech Registration Receipt</title><style>body { font-family: Arial, sans-serif; background: #f4f5fb; margin: 0; padding: 40px; color: #182033; }.receipt { max-width: 700px; margin: auto; background: white; padding: 40px; border-radius: 16px; box-shadow: 0 8px 30px rgba(0,0,0,0.12); }.header { text-align: center; border-bottom: 2px solid #6c4cff; padding-bottom: 20px; margin-bottom: 25px; }.logo { font-size: 30px; font-weight: bold; color: #6c4cff; }.subtitle { color: #666; margin-top: 5px; }.success { text-align: center; color: #159957; font-size: 20px; font-weight: bold; margin: 20px 0; }.registration-id { text-align: center; background: #f0edff; padding: 18px; border-radius: 10px; margin: 25px 0; }.registration-id strong { display: block; font-size: 24px; color: #6c4cff; margin-top: 8px; }.row { display: flex; justify-content: space-between; gap: 30px; padding: 14px 0; border-bottom: 1px solid #e5e5e5; }.label { color: #666; }.value { font-weight: bold; text-align: right; }.footer { margin-top: 30px; text-align: center; font-size: 13px; color: #777; }</style></head><body><div class="receipt"> <div class="header"> <div class="logo">SmartRegTech</div> <div class="subtitle">Zero-Friction Registration Portal</div> </div> <div class="success">✓ REGISTRATION SUCCESSFUL</div> <div class="registration-id">Registration ID<strong>${registrationId}</strong></div> <div class="row"><span class="label">Applicant Name</span><span class="value">${verifiedProfile?.name || "Priya Sharma"}</span></div> <div class="row"><span class="label">Aadhaar Verification</span><span class="value">Sandbox — Consent + Mock JSON</span></div> <div class="row"><span class="label">Mobile Number</span><span class="value">${verifiedProfile?.phone || "9876543210"}</span></div> <div class="row"><span class="label">Email</span><span class="value">${verifiedProfile?.email || "priya.sharma@example.com"}</span></div> <div class="row"><span class="label">Enrolled Programs</span><span class="value">${programsSummaryHTML}</span></div> <div class="row"><span class="label">Opted Entrance Exams</span><span class="value">${examsSummaryHTML || "None Opted"}</span></div> <div class="row"><span class="label">Test Center Preferences</span><span class="value">${showCenterPreferences ? `${cityPreferences.pref1}, ${cityPreferences.pref2}, ${cityPreferences.pref3}` : "Online / Remote"}</span></div> <div class="row"><span class="label">Total Consolidated Fee</span><span class="value">₹${currentTotalFee.toLocaleString("en-IN")}</span></div> <div class="row"><span class="label">Payment Status</span><span class="value">Paid — Sandbox</span></div> <div class="row"><span class="label">Application Status</span><span class="value">Registration Successful</span></div> <div class="row"><span class="label">Date</span><span class="value">${new Date().toLocaleDateString()}</span></div> <div class="footer">This receipt was generated by the SmartRegTech prototype.<br />Payment integrations are simulated for demonstration purposes.</div></div></body></html>`;
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

  const downloadAdmitCard = (examName) => {
    const slotInfo = selectedExamSlots[examName] || "Direct Slot / Verified";
    const centerInfo = showCenterPreferences ? (cityPreferences?.pref1 || "Chennai") : "Online / Remote Verification";
    
    const admitCardHTML = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>SmartRegTech Admit Card</title><style>body { font-family: Arial, sans-serif; background: #f4f5fb; margin: 0; padding: 40px; color: #182033; }.card { max-width: 650px; margin: auto; background: white; padding: 40px; border-radius: 16px; box-shadow: 0 8px 30px rgba(0,0,0,0.12); border-top: 6px solid #6c4cff; }.header { text-align: center; border-bottom: 2px solid #e5e5e5; padding-bottom: 20px; margin-bottom: 25px; }.logo { font-size: 26px; font-weight: bold; color: #6c4cff; }.title { font-size: 18px; font-weight: bold; color: #333; margin-top: 5px; }.badge { background: #e6f8ee; color: #16804c; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; display: inline-block; margin-top: 10px; }.row { display: flex; justify-content: space-between; gap: 20px; padding: 12px 0; border-bottom: 1px solid #f0f0f0; }.label { color: #666; font-size: 14px; }.value { font-weight: bold; text-align: right; font-size: 14px; }.instructions { margin-top: 30px; background: #f8fafc; padding: 15px; border-radius: 8px; font-size: 12px; color: #555; line-height: 1.5; }</style></head><body><div class="card"><div class="header"><div class="logo">SmartRegTech</div><div class="title">OFFICIAL ENTRANCE EXAMINATION ADMIT CARD</div><div class="badge">VERIFIED & APPROVED</div></div><div class="row"><span class="label">Applicant Name</span><span class="value">${verifiedProfile?.name || "Priya Sharma"}</span></div><div class="row"><span class="label">Application ID (UID)</span><span class="value">${currentUserUid}</span></div><div class="row"><span class="label">Assigned Examination</span><span class="value">${examName}</span></div><div class="row"><span class="label">Test Slot & Date</span><span class="value">${slotInfo}</span></div><div class="row"><span class="label">Allocated Test Center</span><span class="value">${centerInfo}</span></div><div class="instructions"><strong>Important Instructions:</strong><br>1. Please carry a hard copy of this admit card along with a valid government-issued photo ID.<br>2. Reach the test center at least 45 minutes prior to the scheduled shift time.<br>3. Electronic devices and calculators are strictly prohibited inside the examination hall.</div></div></body></html>`;
    
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
            <p className="description">Enter the Application ID (UID) and password generated during your registration.</p>
            <div className="form-group" style={{ marginTop: "20px" }}><label>APPLICATION ID (UID)</label><input type="text" id="loginUid" placeholder="e.g. 202612345" /></div>
            <div className="form-group">
              <label>PASSWORD</label>
              <div style={{ position: "relative" }}>
                <input type={showLoginPwd ? "text" : "password"} id="loginPwd" placeholder="Enter your password" style={{ width: "100%", paddingRight: "50px", boxSizing: "border-box" }} />
                <button type="button" onClick={() => setShowLoginPwd(!showLoginPwd)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "12px", fontWeight: "bold", color: "#a5b4fc", padding: 0 }} title={showLoginPwd ? "Hide Password" : "Show Password"}>{showLoginPwd ? "HIDE" : "SHOW"}</button>
              </div>
            </div>
            <button type="button" className="primary-button full" onClick={async () => {
              const uid = document.getElementById("loginUid").value.trim();
              const pwd = document.getElementById("loginPwd").value.trim();
              const hashedPwd = await hashPassword(pwd);
              const user = (Array.isArray(mockUsersDB) ? mockUsersDB : []).find(u => u.uid === uid && u.password === hashedPwd);
              if (user) {
                setCurrentUserUid(uid); 
                setCart(user.cart || []); 
                setSelectedExamsCart(user.selectedExamsCart || []); 
                setFormData(user.formData); 
                setVerifiedProfile(user.verifiedProfile); 
                setActiveMethod(user.activeMethod || "identity"); 
                setActiveFlow(METHOD_FLOWS[user.activeMethod || "identity"]); 
                setCityPreferences(user.cityPreferences || { pref1: "Chennai", pref2: "Bengaluru", pref3: "Hyderabad" }); 
                setSelectedExamSlots(user.selectedExamSlots || {}); 
                
                const savedStep = user.currentStepIndex || 0;
                setCurrentStepIndex(savedStep); 
                setHighestStepIndex(user.highestStepIndex || savedStep); 
                setCurrentView("flow");
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
            <button type="button" className="primary-button full" onClick={async () => {
              const uid = document.getElementById("resetUid").value.trim();
              const safeDB = Array.isArray(mockUsersDB) ? mockUsersDB : [];
              const userIndex = safeDB.findIndex(u => u.uid === uid);
              if (userIndex !== -1) { 
                const newPwd = Math.random().toString(36).substring(2, 10);
                const hashedNew = await hashPassword(newPwd);
                const updatedDB = [...safeDB];
                updatedDB[userIndex].password = hashedNew;
                setMockUsersDB(updatedDB);
                alert(`✅ SIMULATION SUCCESS: An email has been sent to the registered address with your NEW password: ${newPwd}`); 
              } else { 
                alert("UID not found in the system."); 
              }
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
            <button type="button" className="primary-button full" onClick={async () => {
              const old = document.getElementById("oldPwd").value.trim();
              const newP = document.getElementById("newPwd").value.trim();
              const safeDB = Array.isArray(mockUsersDB) ? mockUsersDB : [];
              const userIndex = safeDB.findIndex(u => u.uid === currentUserUid);
              const hashedOld = await hashPassword(old);
              if (safeDB[userIndex].password === hashedOld) {
                if (newP.length < 4) { alert("New password must be at least 4 characters."); return; }
                const hashedNew = await hashPassword(newP);
                const updatedDB = [...safeDB]; updatedDB[userIndex].password = hashedNew; setMockUsersDB(updatedDB); alert("Password changed successfully!"); setCurrentView("home");
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

  if (activeStepId === "manualRegister") {
    const isGoogle = activeMethod === "google";
    return (
      <Page currentStep={activeStepId} completionPercentage={currentCompletionPercentage} onHome={goHome} showCopilot={showCopilot} setShowCopilot={setShowCopilot} flowConfig={activeFlow} currentIndex={currentStepIndex} currentUserUid={currentUserUid} handleLogout={handleLogout} openAdmin={openAdmin} onStepClick={(idx) => setCurrentStepIndex(idx)}>
        <main className="page-container" style={{ maxWidth: "560px", margin: "20px auto 0" }}>
          <section className="content-card form-panel" style={{ background: "#0a1124", border: "1px solid #3b486d", borderRadius: "16px", padding: "35px" }}>
            
            {isGoogle && (
              <div style={{ background: "rgba(66, 133, 244, 0.1)", border: "1px solid rgba(66, 133, 244, 0.3)", padding: "12px", borderRadius: "8px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "20px" }}>🛡</span>
                <p style={{ margin: 0, color: "#a5b4fc", fontSize: "13px", lineHeight: "1.4" }}>
                  <strong>Google Email Verified!</strong> We have securely verified your email address. Please enter your Full Name as per official records and phone number to continue.
                </p>
              </div>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <div style={{ width: "42px", height: "42px", background: "rgba(34, 197, 94, 0.15)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>📝</div>
              <div>
                <h2 style={{ color: "#fff", margin: 0, fontSize: "22px" }}>{isGoogle ? "Complete Contact Details" : "Register Yourself Manually"}</h2>
                <p style={{ color: "#94a3b8", fontSize: "13px", margin: "4px 0 0 0" }}>Enter your contact details and verify your email.</p>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: "20px" }}>
              <label style={{ color: "#a5b4fc", fontSize: "12px", fontWeight: "700", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span>FULL NAME (As per Official Records)</span>
              </label>
              <input 
                type="text" 
                placeholder="Enter your official full name" 
                value={manualFullName} 
                onChange={(e) => setManualFullName(e.target.value)} 
                style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", background: "#080e1a", color: "#fff", border: "1px solid #3b486d", fontSize: "14px", boxSizing: "border-box", outline: "none" }} 
              />
            </div>

            <div className="form-group" style={{ marginBottom: "20px" }}>
              <label style={{ color: "#a5b4fc", fontSize: "12px", fontWeight: "700", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span>EMAIL ADDRESS</span>
                {emailVerified && <span style={{ color: "#22c55e", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}>{isGoogle ? "✓ Google Verified" : "✓ Verified"}</span>}
              </label>
              
              <div style={{ display: "flex", gap: "10px" }}>
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  value={manualEmail} 
                  onChange={(e) => { setManualEmail(e.target.value); if(emailVerified) setEmailVerified(false); }} 
                  disabled={emailVerified}
                  style={{ flex: 1, padding: "12px 14px", borderRadius: "10px", background: emailVerified ? "#061a14" : "#080e1a", color: "#fff", border: emailVerified ? "1px solid #16a34a" : "1px solid #3b486d", fontSize: "14px", boxSizing: "border-box" }} 
                />
                {!emailVerified && (
                  <button 
                    type="button" 
                    onClick={() => {
                      if (!manualEmail.trim() || !manualEmail.includes("@")) {
                        alert("Please enter a valid email address first.");
                        return;
                      }
                      setEmailVerificationSent(true);
                      setEmailTimer(30);
                      alert(`✅ Verification email dispatched to ${manualEmail}.\n\n(For this prototype, enter verification code: 123456)`);
                    }}
                    style={{ background: "#6c4cff", color: "#fff", border: "none", padding: "0 18px", borderRadius: "10px", fontWeight: "bold", cursor: "pointer", fontSize: "13px", whiteSpace: "nowrap" }}
                  >
                    {emailVerificationSent ? "Resend OTP" : "Verify Email"}
                  </button>
                )}
              </div>

              {emailVerificationSent && !emailVerified && !isGoogle && (
                <div style={{ marginTop: "12px", background: "#080e1a", padding: "14px", borderRadius: "10px", border: "1px dashed #3b486d" }}>
                  <label style={{ color: "#94a3b8", fontSize: "11px", display: "block", marginBottom: "6px" }}>ENTER 6-DIGIT VERIFICATION CODE SENT TO EMAIL</label>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input 
                      type="text" 
                      maxLength="6" 
                      placeholder="123456" 
                      value={emailOtp} 
                      onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, ""))} 
                      style={{ flex: 1, padding: "10px 12px", borderRadius: "8px", background: "#040812", color: "#fff", border: "1px solid #3b486d", fontSize: "14px", letterSpacing: "2px", textAlign: "center", fontWeight: "bold" }} 
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        if (emailOtp === "123456") {
                          setEmailVerified(true);
                          setEmailVerificationSent(false);
                        } else {
                          alert("Invalid verification code. Use demo code: 123456");
                        }
                      }}
                      style={{ background: "#22c55e", color: "#fff", border: "none", padding: "0 16px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", fontSize: "13px" }}
                    >
                      Confirm
                    </button>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px", fontSize: "11px", color: "#64748b" }}>
                    <span>Demo Code: <strong>123456</strong></span>
                    {emailTimer > 0 ? <span>Resend in {emailTimer}s</span> : <button type="button" onClick={() => setEmailTimer(30)} style={{ background: "none", border: "none", color: "#a5b4fc", cursor: "pointer", padding: 0, fontSize: "11px" }}>Resend Code</button>}
                  </div>
                </div>
              )}
            </div>

            <div className="form-group" style={{ marginBottom: "30px" }}>
              <label style={{ color: "#a5b4fc", fontSize: "12px", fontWeight: "700", display: "block", marginBottom: "8px" }}>PHONE NUMBER</label>
              <input 
                type="tel" 
                placeholder="9876543210" 
                maxLength="10"
                value={manualPhone} 
                onChange={(e) => setManualPhone(e.target.value.replace(/\D/g, ""))} 
                style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", background: "#080e1a", color: "#fff", border: "1px solid #3b486d", fontSize: "14px", boxSizing: "border-box" }} 
              />
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button type="button" className="back-button" onClick={() => setCurrentView("methodSelect")} style={{ flex: 1, margin: 0 }}>← Back</button>
              <button 
                type="button" 
                className="primary-button" 
                onClick={handleProceedToBasicDetails}
                style={{ flex: 2, padding: "14px", fontWeight: "bold", borderRadius: "10px" }}
              >
                Continue to Basic Details <span>→</span>
              </button>
            </div>
          </section>
        </main>
      </Page>
    );
  }

  if (activeStepId === "manualBasicDetails") {
    const filteredNationalities = NATIONALITIES_LIST.filter(nat => 
      nat.toLowerCase().includes(nationalitySearch.toLowerCase())
    );

    return (
      <Page currentStep={activeStepId} completionPercentage={currentCompletionPercentage} onHome={goHome} showCopilot={showCopilot} setShowCopilot={setShowCopilot} flowConfig={activeFlow} currentIndex={currentStepIndex} currentUserUid={currentUserUid} handleLogout={handleLogout} openAdmin={openAdmin} onStepClick={(idx) => setCurrentStepIndex(idx)}>
        <main className="page-container" style={{ maxWidth: "640px", margin: "20px auto 0" }}>
          <section className="content-card form-panel" style={{ background: "#0a1124", border: "1px solid #3b486d", borderRadius: "16px", padding: "35px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "25px" }}>
              <div style={{ width: "42px", height: "42px", background: "rgba(108, 76, 255, 0.15)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>🏠</div>
              <div>
                <h2 style={{ color: "#fff", margin: 0, fontSize: "22px" }}>Fill Basic Details &amp; Address</h2>
                <p style={{ color: "#94a3b8", fontSize: "13px", margin: "4px 0 0 0" }}>Provide your personal information and location details.</p>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: "20px" }}>
              <label style={{ color: "#a5b4fc", fontSize: "12px", fontWeight: "700", display: "block", marginBottom: "8px" }}>DATE OF BIRTH</label>
              <input 
                type="date" 
                value={manualDob} 
                onChange={(e) => setManualDob(e.target.value)} 
                style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", background: "#080e1a", color: "#fff", border: "1px solid #3b486d", fontSize: "14px", boxSizing: "border-box", colorScheme: "dark", cursor: "pointer" }} 
              />
            </div>

            <div className="form-group" style={{ marginBottom: "20px" }}>
              <label style={{ color: "#a5b4fc", fontSize: "12px", fontWeight: "700", display: "block", marginBottom: "8px" }}>GENDER</label>
              <div style={{ display: "flex", gap: "20px", color: "#fff", fontSize: "14px", padding: "4px 0" }}>
                {["Male", "Female", "Other"].map(g => (
                  <label key={g} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                    <input type="radio" name="manualGender" checked={manualGender === g} onChange={() => setManualGender(g)} style={{ accentColor: "#6c4cff" }} />
                    {g}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: "20px" }}>
              <label style={{ color: "#a5b4fc", fontSize: "12px", fontWeight: "700", display: "block", marginBottom: "8px" }}>ADDRESS LINE 1</label>
              <input 
                type="text" 
                placeholder="House No, Street, Area" 
                value={manualAddress1} 
                onChange={(e) => setManualAddress1(e.target.value)} 
                style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", background: "#080e1a", color: "#fff", border: "1px solid #3b486d", fontSize: "14px", boxSizing: "border-box" }} 
              />
            </div>

            <div className="form-group" style={{ marginBottom: "20px" }}>
              <label style={{ color: "#a5b4fc", fontSize: "12px", fontWeight: "700", display: "block", marginBottom: "8px" }}>ADDRESS LINE 2 (OPTIONAL)</label>
              <input 
                type="text" 
                placeholder="Apartment, Landmark, Suite" 
                value={manualAddress2} 
                onChange={(e) => setManualAddress2(e.target.value)} 
                style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", background: "#080e1a", color: "#fff", border: "1px solid #3b486d", fontSize: "14px", boxSizing: "border-box" }} 
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "20px" }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ color: "#a5b4fc", fontSize: "12px", fontWeight: "700", display: "block", marginBottom: "8px" }}>CITY</label>
                <input 
                  type="text" 
                  placeholder="City" 
                  value={manualCity} 
                  onChange={(e) => setManualCity(e.target.value)} 
                  style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", background: "#080e1a", color: "#fff", border: "1px solid #3b486d", fontSize: "14px", boxSizing: "border-box" }} 
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ color: "#a5b4fc", fontSize: "12px", fontWeight: "700", display: "block", marginBottom: "8px" }}>STATE</label>
                <select 
                  value={manualState} 
                  onChange={(e) => setManualState(e.target.value)} 
                  style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", background: "#080e1a", color: "#fff", border: "1px solid #3b486d", fontSize: "14px", boxSizing: "border-box", cursor: "pointer" }}
                >
                  <option value="">Select state</option>
                  {INDIAN_STATES.map(st => <option key={st} value={st}>{st}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: "20px" }}>
              <label style={{ color: "#a5b4fc", fontSize: "12px", fontWeight: "700", display: "block", marginBottom: "8px" }}>PIN CODE</label>
              <input 
                type="text" 
                maxLength="6" 
                placeholder="600001" 
                value={manualPinCode} 
                onChange={(e) => setManualPinCode(e.target.value.replace(/\D/g, ""))} 
                style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", background: "#080e1a", color: "#fff", border: "1px solid #3b486d", fontSize: "14px", boxSizing: "border-box" }} 
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "30px" }}>
              <div className="form-group" style={{ margin: 0, position: "relative" }} ref={nationalityDropdownRef}>
                <label style={{ color: "#a5b4fc", fontSize: "12px", fontWeight: "700", display: "block", marginBottom: "8px" }}>NATIONALITY *</label>
                <div 
                  onClick={() => setShowNationalityDropdown(!showNationalityDropdown)}
                  style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", background: "#080e1a", color: "#fff", border: "1px solid #3b486d", fontSize: "14px", boxSizing: "border-box", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  <span>{manualNationality}</span>
                  <span style={{ fontSize: "10px", color: "#94a3b8" }}>▼</span>
                </div>

                {showNationalityDropdown && (
                  <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "#0d152b", border: "1px solid #3b486d", borderRadius: "10px", boxShadow: "0 10px 25px rgba(0,0,0,0.5)", zIndex: 1000, overflow: "hidden" }}>
                    <div style={{ padding: "10px", borderBottom: "1px solid #3b486d", background: "#080e1a" }}>
                      <input 
                        type="text" 
                        placeholder="Search..." 
                        value={nationalitySearch} 
                        onChange={(e) => setNationalitySearch(e.target.value)} 
                        autoFocus
                        style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", background: "#040812", color: "#fff", border: "1px solid #3b486d", fontSize: "13px", boxSizing: "border-box", outline: "none" }} 
                      />
                    </div>
                    <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                      {filteredNationalities.length === 0 ? (
                        <div style={{ padding: "12px", color: "#94a3b8", fontSize: "13px", textAlign: "center" }}>No matches found</div>
                      ) : (
                        filteredNationalities.map(nat => (
                          <div 
                            key={nat}
                            onClick={() => {
                              setManualNationality(nat);
                              setShowNationalityDropdown(false);
                              setNationalitySearch("");
                            }}
                            style={{ padding: "10px 14px", fontSize: "13px", color: manualNationality === nat ? "#b99cff" : "#fff", background: manualNationality === nat ? "rgba(108,76,255,0.2)" : "transparent", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(59,72,109,0.3)" }}
                            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(108,76,255,0.15)"}
                            onMouseLeave={(e) => e.currentTarget.style.background = manualNationality === nat ? "rgba(108,76,255,0.2)" : "transparent"}
                          >
                            <span>{nat}</span>
                            {manualNationality === nat && <span style={{ color: "#b99cff", fontWeight: "bold" }}>✓</span>}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ color: "#a5b4fc", fontSize: "12px", fontWeight: "700", display: "block", marginBottom: "8px" }}>EDUCATIONAL STREAM *</label>
                <select 
                  value={manualEducationalBackground} 
                  onChange={(e) => setManualEducationalBackground(e.target.value)} 
                  style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", background: "#080e1a", color: "#fff", border: "1px solid #3b486d", fontSize: "14px", boxSizing: "border-box", cursor: "pointer" }}
                >
                  <option value="">Select educational stream</option>
                  {EDUCATIONAL_BACKGROUNDS.map(stream => <option key={stream} value={stream}>{stream}</option>)}
                </select>
              </div>

            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button type="button" className="back-button" onClick={goToPrevStep} style={{ flex: 1, margin: 0 }}>← Back</button>
              <button 
                type="button" 
                className="primary-button" 
                onClick={proceedToPhotoCapture}
                style={{ flex: 2, padding: "14px", fontWeight: "bold", borderRadius: "10px" }}
              >
                Continue to Photo Capture <span>→</span>
              </button>
            </div>
          </section>
        </main>
      </Page>
    );
  }

  if (activeStepId === "manualPhotoCapture") {
    return (
      <Page currentStep={activeStepId} completionPercentage={currentCompletionPercentage} onHome={goHome} showCopilot={showCopilot} setShowCopilot={setShowCopilot} flowConfig={activeFlow} currentIndex={currentStepIndex} currentUserUid={currentUserUid} handleLogout={handleLogout} openAdmin={openAdmin} onStepClick={(idx) => setCurrentStepIndex(idx)}>
        <main className="page-container" style={{ maxWidth: "560px", margin: "20px auto 0" }}>
          <section className="content-card form-panel" style={{ background: "#0a1124", border: "1px solid #3b486d", borderRadius: "16px", padding: "35px" }}>
            
            <AadhaarPhotoCapture 
              onCaptureSuccess={(imageSrc) => {
                setVerifiedProfile(prev => ({ ...prev, customPhoto: imageSrc }));
              }}
              onRetake={() => {
                setVerifiedProfile(prev => ({ ...prev, customPhoto: null }));
              }}
            />

            <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
              <button 
                type="button" 
                className="back-button" 
                onClick={goToPrevStep} 
                style={{ flex: 1, margin: 0, padding: "12px" }}
              >
                ← Back
              </button>
              <button 
                type="button" 
                className="primary-button" 
                onClick={() => {
                  if (!verifiedProfile?.customPhoto) {
                    alert("Please upload or capture a profile photo before continuing.");
                    return;
                  }
                  goToNextStep();
                }}
                style={{ flex: 2, padding: "12px", fontWeight: "bold", borderRadius: "10px" }}
              >
                Continue to Documents <span>→</span>
              </button>
            </div>

          </section>
        </main>
      </Page>
    );
  }

  if (activeStepId === "manualDocumentUpload") {
    const validateDocumentRelevance = (file, expectedDocCategory) => {
      if (!file) return false;
      const fileName = file.name.toLowerCase();
      
      const blockedExtensions = [".mp3", ".mp4", ".wav", ".avi", ".exe", ".zip", ".rar", ".dmg", ".iso"];
      if (blockedExtensions.some(ext => fileName.endsWith(ext))) {
        alert(`❌ Invalid File Type: "${file.name}" is a media or executable file. Please upload a valid document format (PDF, JPG, PNG).`);
        return false;
      }

      const fakeKeywords = ["song", "music", "audio", "video", "movie", "game", "meme", "wallpaper", "invoice", "bill", "receipt", "random", "test", "fake", "sample_wrong"];
      if (fakeKeywords.some(keyword => fileName.includes(keyword))) {
        alert(`❌ Document Verification Failed: Please upload relevant document. "${file.name}" does not appear to be a genuine ${expectedDocCategory}. Please ensure you are uploading the correct document.`);
        return false;
      }

      if (expectedDocCategory === "Class XII Marksheet") {
        const marksheetKeywords = ["mark", "sheet", "board", "cbse", "hsc", "result", "grade", "certificate", "exam", "12", "xii", "intermediate", "doc", "pdf", "scan", "image"];
        const matches = marksheetKeywords.some(kw => fileName.includes(kw));
        if (!matches && file.size < 50 * 1024) {
          alert(`❌ Verification Warning: Please upload relevant document. The file "${file.name}" does not match the formatting expected for a Class XII Marksheet.`);
          return false;
        }
      }

      return true;
    };

    return (
      <Page currentStep={activeStepId} completionPercentage={currentCompletionPercentage} onHome={goHome} showCopilot={showCopilot} setShowCopilot={setShowCopilot} flowConfig={activeFlow} currentIndex={currentStepIndex} currentUserUid={currentUserUid} handleLogout={handleLogout} openAdmin={openAdmin} onStepClick={(idx) => setCurrentStepIndex(idx)}>
        <main className="page-container" style={{ maxWidth: "600px", margin: "20px auto 0" }}>
          <section className="content-card form-panel" style={{ background: "#0a1124", border: "1px solid #3b486d", borderRadius: "16px", padding: "35px" }}>
            
            <div style={{ textAlign: "center", marginBottom: "30px" }}>
              <div style={{ width: "48px", height: "48px", background: "rgba(108, 76, 255, 0.15)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", margin: "0 auto 16px" }}>📄</div>
              <h2 style={{ color: "#fff", margin: "0 0 8px 0", fontSize: "22px" }}>Upload Mandated Documents</h2>
              <p style={{ color: "#94a3b8", fontSize: "13px", margin: 0 }}>Provide your signature, Class XII marksheet, and government ID proof.</p>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <label style={{ color: "#a5b4fc", fontSize: "12px", fontWeight: "700" }}>1. SCANNED SIGNATURE *</label>
                <span style={{ color: "#64748b", fontSize: "11px" }}>Max size: 500 KB (JPG, PNG)</span>
              </div>
              <div style={{ border: "1px dashed #3b486d", borderRadius: "10px", padding: "14px", textAlign: "center", background: "#040812" }}>
                {manualSignature ? (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#4ade80", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px" }}><span>✓</span> Signature Uploaded</span>
                    <button onClick={() => setManualSignature(null)} style={{ background: "none", border: "none", color: "#ff4d4f", cursor: "pointer", fontSize: "12px" }}>Remove</button>
                  </div>
                ) : (
                  <label style={{ cursor: "pointer", color: "#818cf8", fontSize: "13px", fontWeight: "bold" }}>
                    + Browse Signature Image
                    <input type="file" accept="image/*" onChange={(e) => { 
                      const file = e.target.files[0];
                      if(file) {
                        if(file.size > 500 * 1024) {
                          alert("Signature file size must be less than 500 KB.");
                          return;
                        }
                        if(!validateDocumentRelevance(file, "Scanned Signature")) return;
                        setManualSignature(URL.createObjectURL(file));
                      }
                    }} style={{ display: "none" }} />
                  </label>
                )}
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <label style={{ color: "#a5b4fc", fontSize: "12px", fontWeight: "700" }}>2. CLASS XII MARKSHEET *</label>
                <span style={{ color: "#64748b", fontSize: "11px" }}>Max size: 2 MB (PDF, JPG, PNG)</span>
              </div>
              <div style={{ border: "1px dashed #3b486d", borderRadius: "10px", padding: "14px", textAlign: "center", background: "#040812" }}>
                {manualMarksheet ? (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#4ade80", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px" }}><span>✓</span> Class XII Marksheet Uploaded</span>
                    <button onClick={() => setManualMarksheet(null)} style={{ background: "none", border: "none", color: "#ff4d4f", cursor: "pointer", fontSize: "12px" }}>Remove</button>
                  </div>
                ) : (
                  <label style={{ cursor: "pointer", color: "#818cf8", fontSize: "13px", fontWeight: "bold" }}>
                    + Browse Marksheet (PDF or Image)
                    <input type="file" accept="image/*,.pdf" onChange={(e) => { 
                      const file = e.target.files[0];
                      if(file) {
                        if(file.size > 2 * 1024 * 1024) {
                          alert("Marksheet file size must be less than 2 MB.");
                          return;
                        }
                        if(!validateDocumentRelevance(file, "Class XII Marksheet")) return;
                        setManualMarksheet({ name: file.name, url: URL.createObjectURL(file) }); 
                      }
                    }} style={{ display: "none" }} />
                  </label>
                )}
              </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <label style={{ color: "#a5b4fc", fontSize: "12px", fontWeight: "700" }}>3. GOVERNMENT ID PROOF *</label>
                <span style={{ color: "#64748b", fontSize: "11px" }}>Max size: 2 MB (PDF, JPG, PNG)</span>
              </div>

              <div style={{ marginBottom: "10px" }}>
                <select 
                  value={manualGovtIdType} 
                  onChange={(e) => setManualGovtIdType(e.target.value)}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", background: "#040812", color: "#fff", border: "1px solid #3b486d", fontSize: "13px", boxSizing: "border-box", cursor: "pointer" }}
                >
                  <option value="Aadhaar Card">Aadhaar Card</option>
                  <option value="PAN Card">PAN Card</option>
                  <option value="Voter ID Card">Voter ID Card</option>
                  <option value="Passport">Passport</option>
                </select>
              </div>

              <div style={{ border: "1px dashed #3b486d", borderRadius: "10px", padding: "14px", textAlign: "center", background: "#040812" }}>
                {manualGovtIdFile ? (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#4ade80", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px" }}><span>✓</span> [{manualGovtIdType}] Uploaded</span>
                    <button onClick={() => setManualGovtIdFile(null)} style={{ background: "none", border: "none", color: "#ff4d4f", cursor: "pointer", fontSize: "12px" }}>Remove</button>
                  </div>
                ) : (
                  <label style={{ cursor: "pointer", color: "#818cf8", fontSize: "13px", fontWeight: "bold" }}>
                    + Browse {manualGovtIdType} (PDF or Image)
                    <input type="file" accept="image/*,.pdf" onChange={(e) => { 
                      const file = e.target.files[0];
                      if(file) {
                        if(file.size > 2 * 1024 * 1024) {
                          alert("Government ID file size must be less than 2 MB.");
                          return;
                        }
                        if(!validateDocumentRelevance(file, manualGovtIdType)) return;
                        setManualGovtIdFile({ name: file.name, url: URL.createObjectURL(file) }); 
                      }
                    }} style={{ display: "none" }} />
                  </label>
                )}
              </div>
            </div>

            <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", background: "rgba(255,255,255,0.02)", padding: "14px", borderRadius: "8px", border: "1px solid #1e293b", cursor: "pointer", marginBottom: "25px" }}>
              <input type="checkbox" checked={manualDeclaration} onChange={(e) => setManualDeclaration(e.target.checked)} style={{ marginTop: "2px", accentColor: "#6c4cff" }} />
              <span style={{ color: "#94a3b8", fontSize: "12px", lineHeight: "1.5" }}>I hereby declare that all information and documents provided are true and correct. I understand my application may be rejected if any details are found false.</span>
            </label>

            <div style={{ display: "flex", gap: "12px" }}>
              <button type="button" className="back-button" onClick={goToPrevStep} style={{ flex: 1, margin: 0, padding: "14px" }}>← Back</button>
              <button 
                type="button" 
                className="primary-button" 
                onClick={() => {
                  if (!manualSignature || !manualMarksheet || !manualGovtIdFile) {
                    alert("Please upload your signature, Class XII Marksheet, and Government ID proof to proceed.");
                    return;
                  }
                  if (!manualDeclaration) {
                    alert("Please accept the declaration to proceed.");
                    return;
                  }
                  goToNextStep();
                }}
                style={{ flex: 2, padding: "14px", fontWeight: "bold", borderRadius: "10px", background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)" }}
              >
                Review Application <span>→</span>
              </button>
            </div>

          </section>
        </main>
      </Page>
    );
  }

  if (activeStepId === "manualReviewProfile") {
    const fullAddress = [manualAddress1, manualAddress2, manualCity, manualState, manualPinCode].filter(Boolean).join(", ");
    
    return (
      <Page currentStep={activeStepId} completionPercentage={currentCompletionPercentage} onHome={goHome} showCopilot={showCopilot} setShowCopilot={setShowCopilot} flowConfig={activeFlow} currentIndex={currentStepIndex} currentUserUid={currentUserUid} handleLogout={handleLogout} openAdmin={openAdmin} onStepClick={(idx) => setCurrentStepIndex(idx)}>
        <main className="page-container" style={{ maxWidth: "1000px", margin: "20px auto 0" }}>
          
          <div style={{ marginBottom: "30px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <h2 style={{ color: "#fff", margin: 0, fontSize: "28px", fontWeight: "800", letterSpacing: "-0.5px" }}>Review Your Profile</h2>
              <p style={{ color: "#94a3b8", fontSize: "14px", margin: "6px 0 0 0" }}>Inspect your registration profile details. Make any necessary corrections on the right.</p>
            </div>
            <div style={{ background: "rgba(34, 197, 94, 0.15)", color: "#4ade80", border: "1px solid rgba(34, 197, 94, 0.3)", padding: "6px 16px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "6px" }}>
              <span>✓</span> Live Preview Active
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "30px", alignItems: "start" }}>
            
            <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)", borderRadius: "20px", padding: "30px", border: "1px solid #312e81", boxShadow: "0 20px 40px rgba(0,0,0,0.5)", position: "sticky", top: "20px" }}>
              
              <div style={{ display: "flex", alignItems: "center", gap: "18px", marginBottom: "24px", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "20px" }}>
                <div style={{ width: "85px", height: "85px", background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", fontWeight: "800", color: "#fff", boxShadow: "0 0 20px rgba(99, 102, 241, 0.4)", overflow: "hidden" }}>
                  {verifiedProfile?.customPhoto ? (
                    <img src={verifiedProfile.customPhoto} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    manualFullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "SR"
                  )}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "24px", fontWeight: "800", color: "#fff" }}>{manualFullName || "Applicant Name"}</h3>
                  <span style={{ color: "#38bdf8", fontSize: "13px", fontWeight: "600" }}>Verified Candidate Profile</span>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "12px" }}>
                  <span style={{ color: "#94a3b8", fontSize: "13px", fontWeight: "600" }}>Date of Birth</span>
                  <span style={{ color: "#f8fafc", fontSize: "14px", fontWeight: "700" }}>{manualDob || "—"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "12px" }}>
                  <span style={{ color: "#94a3b8", fontSize: "13px", fontWeight: "600" }}>Gender</span>
                  <span style={{ color: "#f8fafc", fontSize: "14px", fontWeight: "700" }}>{manualGender}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "12px" }}>
                  <span style={{ color: "#94a3b8", fontSize: "13px", fontWeight: "600" }}>Email</span>
                  <span style={{ color: "#f8fafc", fontSize: "14px", fontWeight: "700" }}>{manualEmail || "—"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "12px" }}>
                  <span style={{ color: "#94a3b8", fontSize: "13px", fontWeight: "600" }}>Phone</span>
                  <span style={{ color: "#f8fafc", fontSize: "14px", fontWeight: "700" }}>{manualPhone || "—"}</span>
                </div>
                <div style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "12px" }}>
                  <span style={{ color: "#94a3b8", fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "6px" }}>Residential Address</span>
                  <span style={{ color: "#f8fafc", fontSize: "14px", lineHeight: "1.5" }}>{fullAddress || "—"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "12px" }}>
                  <span style={{ color: "#94a3b8", fontSize: "13px", fontWeight: "600" }}>Nationality</span>
                  <span style={{ color: "#f8fafc", fontSize: "14px", fontWeight: "700" }}>{manualNationality}</span>
                </div>
                <div>
                  <span style={{ color: "#94a3b8", fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "6px" }}>Educational Stream</span>
                  <span style={{ color: "#38bdf8", fontSize: "14px", fontWeight: "700", lineHeight: "1.4" }}>{manualEducationalBackground || "—"}</span>
                </div>
                
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "20px", marginTop: "16px" }}>
                  <span style={{ color: "#a5b4fc", fontSize: "14px", fontWeight: "700", display: "block", marginBottom: "12px", letterSpacing: "0.5px" }}>Uploaded Documents</span>
                  <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                    {manualSignature && (
                      <button type="button" onClick={() => window.open(manualSignature, '_blank')} style={{ background: "rgba(108,76,255,0.15)", color: "#b99cff", border: "1px solid rgba(108,76,255,0.4)", padding: "10px 16px", borderRadius: "8px", fontSize: "13px", cursor: "pointer", fontWeight: "bold", display: "flex", alignItems: "center", gap: "6px", transition: "all 0.2s" }}>
                        <span style={{ fontSize: "16px" }}>👁</span> Signature
                      </button>
                    )}
                    {manualMarksheet && (
                      <button type="button" onClick={() => window.open(manualMarksheet.url, '_blank')} style={{ background: "rgba(108,76,255,0.15)", color: "#b99cff", border: "1px solid rgba(108,76,255,0.4)", padding: "10px 16px", borderRadius: "8px", fontSize: "13px", cursor: "pointer", fontWeight: "bold", display: "flex", alignItems: "center", gap: "6px", transition: "all 0.2s" }}>
                        <span style={{ fontSize: "16px" }}>👁️</span> Marksheet
                      </button>
                    )}
                    {manualGovtIdFile && (
                      <button type="button" onClick={() => window.open(manualGovtIdFile.url, '_blank')} style={{ background: "rgba(108,76,255,0.15)", color: "#b99cff", border: "1px solid rgba(108,76,255,0.4)", padding: "10px 16px", borderRadius: "8px", fontSize: "13px", cursor: "pointer", fontWeight: "bold", display: "flex", alignItems: "center", gap: "6px", transition: "all 0.2s" }}>
                        <span style={{ fontSize: "16px" }}>👁</span> {manualGovtIdType}
                      </button>
                    )}
                  </div>
                </div>

              </div>
            </div>

            <div style={{ background: "#0a1124", border: "1px solid #1e293b", borderRadius: "20px", padding: "30px", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
              
              <h3 style={{ color: "#fff", fontSize: "18px", margin: "0 0 20px 0", fontWeight: "700", borderBottom: "1px solid #1e293b", paddingBottom: "12px" }}>
                Modify Profile Information
              </h3>

              <div className="form-group" style={{ marginBottom: "16px" }}>
                <label style={{ color: "#94a3b8", fontSize: "11px", fontWeight: "700", display: "block", marginBottom: "6px" }}>FULL NAME</label>
                <input 
                  type="text" 
                  value={manualFullName} 
                  onChange={(e) => setManualFullName(e.target.value)} 
                  style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", background: "#040812", color: "#fff", border: "1px solid #334155", fontSize: "14px", boxSizing: "border-box", outline: "none" }} 
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "16px" }}>
                <div style={{ margin: 0 }}>
                  <label style={{ color: "#94a3b8", fontSize: "11px", fontWeight: "700", display: "block", marginBottom: "6px" }}>EMAIL</label>
                  <input 
                    type="email" 
                    value={manualEmail} 
                    onChange={(e) => setManualEmail(e.target.value)} 
                    style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", background: "#040812", color: "#fff", border: "1px solid #334155", fontSize: "14px", boxSizing: "border-box", outline: "none" }} 
                  />
                </div>
                <div style={{ margin: 0 }}>
                  <label style={{ color: "#94a3b8", fontSize: "11px", fontWeight: "700", display: "block", marginBottom: "6px" }}>PHONE</label>
                  <input 
                    type="tel" 
                    maxLength="10"
                    value={manualPhone} 
                    onChange={(e) => setManualPhone(e.target.value.replace(/\D/g, ""))} 
                    style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", background: "#040812", color: "#fff", border: "1px solid #334155", fontSize: "14px", boxSizing: "border-box", outline: "none" }} 
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "16px" }}>
                <div style={{ margin: 0 }}>
                  <label style={{ color: "#94a3b8", fontSize: "11px", fontWeight: "700", display: "block", marginBottom: "6px" }}>DATE OF BIRTH</label>
                  <input 
                    type="date" 
                    value={manualDob} 
                    onChange={(e) => setManualDob(e.target.value)} 
                    style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", background: "#040812", color: "#fff", border: "1px solid #334155", fontSize: "14px", boxSizing: "border-box", colorScheme: "dark", outline: "none" }} 
                  />
                </div>
                <div style={{ margin: 0 }}>
                  <label style={{ color: "#94a3b8", fontSize: "11px", fontWeight: "700", display: "block", marginBottom: "6px" }}>GENDER</label>
                  <select 
                    value={manualGender} 
                    onChange={(e) => setManualGender(e.target.value)}
                    style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", background: "#040812", color: "#fff", border: "1px solid #334155", fontSize: "14px", boxSizing: "border-box", outline: "none" }}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: "16px" }}>
                <label style={{ color: "#94a3b8", fontSize: "11px", fontWeight: "700", display: "block", marginBottom: "6px" }}>ADDRESS</label>
                <input 
                  type="text" 
                  value={manualAddress1} 
                  onChange={(e) => setManualAddress1(e.target.value)} 
                  style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", background: "#040812", color: "#fff", border: "1px solid #334155", fontSize: "14px", boxSizing: "border-box", outline: "none" }} 
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "24px" }}>
                <div style={{ margin: 0 }}>
                  <label style={{ color: "#94a3b8", fontSize: "11px", fontWeight: "700", display: "block", marginBottom: "6px" }}>CITY</label>
                  <input 
                    type="text" 
                    value={manualCity} 
                    onChange={(e) => setManualCity(e.target.value)} 
                    style={{ width: "100%", padding: "12px 12px", borderRadius: "10px", background: "#040812", color: "#fff", border: "1px solid #334155", fontSize: "13px", boxSizing: "border-box", outline: "none" }} 
                  />
                </div>
                <div style={{ margin: 0 }}>
                  <label style={{ color: "#94a3b8", fontSize: "11px", fontWeight: "700", display: "block", marginBottom: "6px" }}>STATE</label>
                  <select 
                    value={manualState} 
                    onChange={(e) => setManualState(e.target.value)} 
                    style={{ width: "100%", padding: "12px 12px", borderRadius: "10px", background: "#040812", color: "#fff", border: "1px solid #334155", fontSize: "13px", boxSizing: "border-box", outline: "none" }}
                  >
                    <option value="">Select state</option>
                    {INDIAN_STATES.map(st => <option key={st} value={st}>{st}</option>)}
                  </select>
                </div>
                <div style={{ margin: 0 }}>
                  <label style={{ color: "#94a3b8", fontSize: "11px", fontWeight: "700", display: "block", marginBottom: "6px" }}>PIN CODE</label>
                  <input 
                    type="text" 
                    maxLength="6"
                    value={manualPinCode} 
                    onChange={(e) => setManualPinCode(e.target.value.replace(/\D/g, ""))} 
                    style={{ width: "100%", padding: "12px 12px", borderRadius: "10px", background: "#040812", color: "#fff", border: "1px solid #334155", fontSize: "13px", boxSizing: "border-box", outline: "none" }} 
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "14px" }}>
                <button type="button" className="back-button" onClick={goToPrevStep} style={{ flex: 1, margin: 0, padding: "14px" }}>← Back</button>
                <button 
                  type="button" 
                  className="primary-button" 
                  onClick={generateAppIdFinal}
                  style={{ flex: 2, padding: "14px", fontWeight: "bold", borderRadius: "10px", background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)", boxShadow: "0 10px 20px rgba(99, 102, 241, 0.3)" }}
                >
                  Confirm &amp; Generate ID <span>→</span>
                </button>
              </div>

            </div>
          </div>

        </main>
      </Page>
    );
  }

  if (currentView === "methodSelect") {
    return (
      <div className="app">
        <header className="navbar">
          <div className="brand" onClick={goHome}><div className="brand-mark">SR</div><div><h2>SmartRegTech</h2><p>Digital Registration & Compliance</p></div></div>
          <div className="nav-buttons">
            <button type="button" className="nav-button secondary" onClick={() => setShowCopilot(true)}><span>✦</span> AI Copilot</button>
          </div>
        </header>

        <main className="page-container" style={{ maxWidth: "900px", margin: "40px auto", textAlign: "center" }}>
          <div style={{ marginBottom: "30px" }}>
            <span style={{ color: "#a5b4fc", fontSize: "12px", fontWeight: "700", letterSpacing: "1.5px", display: "block", marginBottom: "8px" }}>CHOOSE REGISTRATION METHOD</span>
            <h1 style={{ fontSize: "36px", fontWeight: "800", color: "#fff" }}>How would you like to register?</h1>
            <p style={{ color: "#94a3b8", fontSize: "15px", marginTop: "8px" }}>Select one of the verification options below to begin your application flow.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px", marginBottom: "40px", textAlign: "left" }}>
            
            <div onClick={handleSelectAadhaar} style={{ background: "#0a1124", border: "1px solid #3b486d", borderRadius: "16px", padding: "28px", cursor: "pointer", transition: "transform 0.2s, border-color 0.2s", boxShadow: "0 10px 30px rgba(0,0,0,0.4)" }} onMouseEnter={e => { e.currentTarget.style.borderColor = "#6c4cff"; e.currentTarget.style.transform = "translateY(-4px)"; }} onMouseLeave={e => { e.currentTarget.style.borderColor = "#3b486d"; e.currentTarget.style.transform = "translateY(0)"; }}>
              <div style={{ width: "48px", height: "48px", background: "rgba(108,76,255,0.15)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", marginBottom: "18px" }}>🆔</div>
              <h3 style={{ color: "#fff", fontSize: "18px", fontWeight: "700", marginBottom: "10px" }}>Register using Aadhaar</h3>
              <p style={{ color: "#94a3b8", fontSize: "13px", lineHeight: "1.5", marginBottom: "20px" }}>Secure verification using your 12-digit Aadhaar number and one-time OTP consent.</p>
              <span style={{ color: "#a5b4fc", fontSize: "13px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "6px" }}>Select Aadhaar Flow →</span>
            </div>

            <div onClick={handleSelectManual} style={{ background: "#0a1124", border: "1px solid #3b486d", borderRadius: "16px", padding: "28px", cursor: "pointer", transition: "transform 0.2s, border-color 0.2s", boxShadow: "0 10px 30px rgba(0,0,0,0.4)" }} onMouseEnter={e => { e.currentTarget.style.borderColor = "#22c55e"; e.currentTarget.style.transform = "translateY(-4px)"; }} onMouseLeave={e => { e.currentTarget.style.borderColor = "#3b486d"; e.currentTarget.style.transform = "translateY(0)"; }}>
              <div style={{ width: "48px", height: "48px", background: "rgba(34, 197, 94, 0.15)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", marginBottom: "18px" }}>📝</div>
              <h3 style={{ color: "#fff", fontSize: "18px", fontWeight: "700", marginBottom: "10px" }}>Register Yourself Manually</h3>
              <p style={{ color: "#94a3b8", fontSize: "13px", lineHeight: "1.5", marginBottom: "20px" }}>Enter your name, verify your email via OTP, and provide your phone number.</p>
              <span style={{ color: "#4ade80", fontSize: "13px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "6px" }}>Select Manual Flow →</span>
            </div>

            <div onClick={handleSelectGoogle} style={{ background: "#0a1124", border: "1px solid #3b486d", borderRadius: "16px", padding: "28px", cursor: "pointer", transition: "transform 0.2s, border-color 0.2s", boxShadow: "0 10px 30px rgba(0,0,0,0.4)" }} onMouseEnter={e => { e.currentTarget.style.borderColor = "#38bdf8"; e.currentTarget.style.transform = "translateY(-4px)"; }} onMouseLeave={e => { e.currentTarget.style.borderColor = "#3b486d"; e.currentTarget.style.transform = "translateY(0)"; }}>
              <div style={{ width: "48px", height: "48px", background: "rgba(56, 189, 248, 0.15)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", marginBottom: "18px" }}>🌐</div>
              <h3 style={{ color: "#fff", fontSize: "18px", fontWeight: "700", marginBottom: "10px" }}>Register using Google Account</h3>
              <p style={{ color: "#94a3b8", fontSize: "13px", lineHeight: "1.5", marginBottom: "20px" }}>Instant single sign-on (SSO) to verify your email address securely via Google.</p>
              <span style={{ color: "#38bdf8", fontSize: "13px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "6px" }}>Select Google SSO →</span>
            </div>

          </div>

          <button type="button" className="back-button" onClick={goHome}>← Cancel &amp; Return Home</button>

        </main>
        {showCopilot && <AICopilot onClose={() => setShowCopilot(false)} />}
      </div>
    );
  }

  if (activeStepId === "home") {
    return (
      <div className="app">
        <header className="navbar">
          <div className="brand" onClick={goHome}>
            <div className="brand-mark">SR</div>
            <div>
              <h2>SmartRegTech</h2>
              <p>Digital Registration & Compliance</p>
            </div>
          </div>
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
          <div className="floating-orb-1"></div>
          <div className="floating-orb-2"></div>

          <section className="hero-section" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", maxWidth: "900px", margin: "0 auto", padding: "90px 20px 60px" }}>
            <div className="hero-content" style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div className="hero-badge" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 16px", background: "rgba(108, 76, 255, 0.15)", border: "1px solid rgba(108, 76, 255, 0.35)", borderRadius: "20px", color: "#c7d2fe", fontSize: "13px", fontWeight: "600", marginBottom: "28px", boxShadow: "0 0 20px rgba(108, 76, 255, 0.2)" }}>
                <span className="live-dot" style={{ width: "8px", height: "8px", backgroundColor: "#22c55e", borderRadius: "50%", display: "inline-block", boxShadow: "0 0 8px #22c55e" }}></span> Digital Registration Platform
              </div>
              
              <h1 style={{ fontSize: "clamp(42px, 6.5vw, 72px)", fontWeight: "800", lineHeight: "1.12", color: "#fff", marginBottom: "28px", letterSpacing: "-1.5px" }}>
                Register smarter.<br />
                <span style={{ background: "linear-gradient(135deg, #c7d2fe 0%, #818cf8 50%, #6c4cff 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Skip the paperwork.</span>
              </h1>

              <div className="hero-actions" style={{ display: "flex", gap: "16px", justifyContent: "center", alignItems: "center", flexWrap: "wrap", width: "100%", marginBottom: "40px" }}>
                <button type="button" className="primary-button" onClick={startRegistration} style={{ padding: "16px 32px", fontSize: "16px", fontWeight: "700", borderRadius: "12px", boxShadow: "0 10px 25px rgba(108, 76, 255, 0.4)" }}>
                  {currentUserUid ? "Resume Registration" : "Start Registration"} <span>→</span>
                </button>
                <button type="button" className="outline-button" onClick={() => setShowCopilot(true)} style={{ padding: "16px 32px", fontSize: "16px", fontWeight: "600", borderRadius: "12px", background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(8px)", border: "1px solid #3b486d", color: "#fff", cursor: "pointer" }}>
                  Ask AI Copilot
                </button>
              </div>

              <div className="trust-row" style={{ display: "flex", gap: "28px", justifyContent: "center", alignItems: "center", flexWrap: "wrap", color: "#a5b4fc", fontSize: "13px", background: "rgba(15, 23, 42, 0.5)", padding: "10px 24px", borderRadius: "30px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}><span className="trust-icon" style={{ color: "#22c55e", fontWeight: "bold" }}>✓</span> Aadhaar verification</div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}><span className="trust-icon" style={{ color: "#22c55e", fontWeight: "bold" }}>✓</span> Smart forms</div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}><span className="trust-icon" style={{ color: "#22c55e", fontWeight: "bold" }}>✓</span> Digital receipt</div>
              </div>
            </div>
          </section>

          <section className="feature-section" style={{ padding: "60px 20px", position: "relative", zIndex: 1 }}>
            <div className="section-heading" style={{ textAlign: "center", marginBottom: "40px" }}><span style={{ color: "#a5b4fc", fontSize: "12px", fontWeight: "700", letterSpacing: "1.5px", display: "block", marginBottom: "8px" }}>PLATFORM CAPABILITIES</span><h2 style={{ fontSize: "32px", fontWeight: "800", color: "#fff" }}>Everything you need for<br />a smoother registration experience.</h2></div>
            <div className="feature-grid">
              <FeatureCard icon="◈" title="Secure Verification" text="Verify applicant identity through a controlled mock workflow." />
              <FeatureCard icon="✦" title="AI Copilot Assist" text="Get contextual guidance throughout the registration process." />
              <FeatureCard icon="⌁" title="Smart Forms" text="Automatically reduce repetitive information entry after verification." />
              <FeatureCard icon="▦" title="Admin Analytics" text="Monitor applications, verification, payments and program activity." />
            </div>
          </section>

          <section className="how-section" style={{ padding: "60px 20px 80px", position: "relative", zIndex: 1 }}>
            <div className="section-heading centered" style={{ textAlign: "center", marginBottom: "40px" }}><span style={{ color: "#a5b4fc", fontSize: "12px", fontWeight: "700", letterSpacing: "1.5px", display: "block", marginBottom: "8px" }}>SIMPLE WORKFLOW</span><h2 style={{ fontSize: "32px", fontWeight: "800", color: "#fff" }}>From verification to registration<br />in a few simple steps.</h2></div>
            <div className="workflow-grid">
              <WorkflowStep number="01" title="Verify Aadhaar" text="Complete the demo Aadhaar verification." />
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
      <Page currentStep={activeStepId} completionPercentage={currentCompletionPercentage} onHome={goHome} showCopilot={showCopilot} setShowCopilot={setShowCopilot} flowConfig={activeFlow} currentIndex={currentStepIndex} currentUserUid={currentUserUid} handleLogout={handleLogout} openAdmin={openAdmin} onStepClick={(idx) => setCurrentStepIndex(idx)}>
        <div className="form-layout">
          <div className="form-intro">
            <div className="step-label">STEP / AADHAAR</div>
            <h1>Verify once.<br />Reuse your details.</h1>
            <p className="description">A realistic verification flow for this prototype. Your Aadhaar identity is checked first, followed by live face liveness verification and profile retrieval.</p>
            <div className="security-points">
              <div><span>✓</span> 12-digit Aadhaar validation</div>
              <div><span>✓</span> One-time OTP verification</div>
              <div><span>✓</span> Live Face Liveness Match</div>
              <div><span>✓</span> Explicit consent &amp; profile retrieval</div>
            </div>
          </div>

          <div className="form-panel digilocker-flow-panel">
            <div className="dl-brand-row"><div className="dl-logo-mark">▣</div><div><strong>Verification</strong><span>SmartRegTech sandbox connector</span></div><span className="sandbox-pill">DEMO</span></div>

            <div className="dl-flow-steps">
              <span className={identityPhase === "aadhaar" ? "active" : "done"}>1 Aadhaar</span>
              <span className={identityPhase === "otp" ? "active" : identityPhase === "photoCapture" || identityPhase === "consent" || identityPhase === "fetching" ? "done" : ""}>2 OTP</span>
              <span className={identityPhase === "photoCapture" ? "active" : identityPhase === "consent" || identityPhase === "fetching" ? "done" : ""}>3 Photo</span>
              <span className={identityPhase === "consent" ? "active" : identityPhase === "fetching" ? "done" : ""}>4 Consent</span>
            </div>

            {identityPhase === "aadhaar" && (
              <>
                <div className="panel-heading">
                  <div className="panel-icon">◈</div>
                  <div>
                    <h2>Aadhaar verification</h2>
                    <p>Start with your 12-digit Aadhaar number</p>
                  </div>
                </div>
                <div className="warning">
                  <span>!</span>
                  <div>
                    <strong>Prototype / sandbox</strong>
                    <p>Use the demo Aadhaar number shown below.</p>
                  </div>
                </div>
                <div className="form-group">
                  <label>AADHAAR NUMBER</label>
                  <input type="text" inputMode="numeric" autoComplete="off" placeholder="XXXX XXXX XXXX" maxLength="12" value={formData.identity} onChange={(event) => updateField("identity", event.target.value.replace(/\D/g, ""))} />
                </div>
                <div className="demo-number">
                  <span>Demo Aadhaar</span>
                  <strong>{DEMO_IDENTITY}</strong>
                  <button type="button" onClick={() => updateField("identity", DEMO_IDENTITY)}>Use demo</button>
                </div>
                <button type="button" className="primary-button full" onClick={verifyIdentity}>Continue to OTP <span>→</span></button>
              </>
            )}

            {identityPhase === "otp" && (
              <>
                <div className="otp-background-card"><div className="panel-heading"><div className="panel-icon">✉</div><div><h2>Verification required</h2><p>Enter the one-time code to continue.</p></div></div><div className="otp-window-hint">A secure OTP verification window has been opened.</div></div>
                <div className="otp-modal-overlay">
                  <div className="otp-modal" role="dialog" aria-modal="true" aria-labelledby="otp-modal-title">
                    <button type="button" className="otp-modal-close" onClick={() => { setOtp(""); setIdentityPhase("aadhaar"); }}>×</button>
                    <div className="otp-modal-brand"><div className="otp-modal-logo">SR</div><div><strong>SmartRegTech</strong><span>Secure Aadhaar verification</span></div></div>
                    <div className="otp-modal-icon">✉</div><div className="success-badge">OTP SENT</div><h2 id="otp-modal-title">Verify your Aadhaar</h2><p className="otp-modal-description">Enter the 6-digit verification code sent to your registered mobile number.</p>
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

            {identityPhase === "photoCapture" && (
              <div style={{ textAlign: "center" }}>
                <AadhaarPhotoCapture
                  onCaptureSuccess={(imageSrc, score) => {
                    setAadhaarCapturedPhoto(imageSrc);
                    setAadhaarMatchScore(score);
                  }}
                  onRetake={() => {
                    setAadhaarCapturedPhoto(null);
                    setAadhaarMatchScore(null);
                  }}
                />
                <button
                  type="button"
                  className="primary-button full"
                  style={{ marginTop: "20px" }}
                  onClick={proceedFromAadhaarPhoto}
                  disabled={!aadhaarCapturedPhoto}
                >
                  Continue to Authorization <span>→</span>
                </button>
              </div>
            )}

            {identityPhase === "redirect" && (
              <div className="digilocker-redirect-card">
                <div className="redirect-connection-line"><div className="redirect-node smartregtech-node">SR</div><div className="redirect-line"><span /></div><div className="redirect-node digilocker-node">DL</div></div>
                <div className="redirect-badge">AADHAAR VERIFIED</div><div className="redirect-icon">↗</div><h2>Continue to Connector</h2><p className="redirect-description">Your Aadhaar identity has been verified. You will now be redirected to the sandbox to give consent for retrieving your verified registration details.</p>
                <div className="redirect-flow"><div><span className="redirect-check">✓</span><span>Aadhaar verified</span></div><div><span className="redirect-check">✓</span><span>Secure connection ready</span></div><div><span className="redirect-next">3</span><span>Consent</span></div></div>
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
                <div className="fetch-log"><div><span className="fetch-dot done"></span> Aadhaar verified</div><div><span className="fetch-dot done"></span> Consent recorded</div><div><span className="fetch-dot"></span> Fetching profile JSON</div><div><span className="fetch-dot"></span> Mapping fields to registration form</div></div>
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

  if (activeStepId === "verified") {
    const classXMarks = [
      { subject: "English Lang & Lit", marks: 88 },
      { subject: "Hindi Course-A", marks: 91 },
      { subject: "Mathematics Standard", marks: 89 },
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
      <Page currentStep={activeStepId} completionPercentage={currentCompletionPercentage} onHome={goHome} showCopilot={showCopilot} setShowCopilot={setShowCopilot} flowConfig={activeFlow} currentIndex={currentStepIndex} currentUserUid={currentUserUid} handleLogout={handleLogout} openAdmin={openAdmin} onStepClick={(idx) => setCurrentStepIndex(idx)}>
        <div className="verification-result">
          <div className="verified-icon">✓</div><div className="success-badge">AADHAAR VERIFIED</div><h1>We found your details.</h1><p className="description center-text">Retrieved from a simulated JSON payload <span className="mock-label">SANDBOX CONNECTOR</span></p>

          <div className="verified-card">
            <div className="verified-card-header"><div><span>VERIFIED PROFILE</span><h3>Applicant Information</h3></div><div className="verified-pill">✓ Verified</div></div>
            <div className="verified-profile-top">
              <div className="profile-photo">
                {verifiedProfile?.customPhoto ? (
                  <img src={verifiedProfile.customPhoto} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
                ) : (
                  verifiedProfile?.photo || "PS"
                )}
              </div>
              <div><span>DOCUMENT SOURCE</span><strong>{verifiedProfile?.source || "Sandbox"}</strong><small>Document: {verifiedProfile?.document || "Profile"}</small></div>
            </div>
            <div className="verified-grid">
              <VerifiedField label="Full Name" value={verifiedProfile?.name || "Priya Sharma"} />
              <VerifiedField label="Date of Birth" value={verifiedProfile?.dob || "—"} />
              <VerifiedField label="Gender" value={verifiedProfile?.gender || "—"} />
              <VerifiedField label="Address" value={verifiedProfile?.address || "—"} />
              <VerifiedField label="Board" value={verifiedProfile?.board || "—"} />
              <VerifiedField label="Qualification Stream" value={verifiedProfile?.qualification || "—"} />
              <VerifiedField label="Mobile Number" value={verifiedProfile?.phone || "—"} />
              <VerifiedField label="Registered Email" value={verifiedProfile?.email || "priya.sharma@example.com"} />
            </div>

            <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px dashed #3b486d" }}>
              <h4 style={{ color: "#8a9fc2", marginBottom: "12px", fontSize: "12px", fontWeight: 700, letterSpacing: "1px" }}>VERIFIED DOCUMENTS ATTACHED</h4>
              <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                <button type="button" onClick={() => setActiveDocument("Class X Marksheet")} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px", background: "rgba(108, 76, 255, 0.1)", border: "1px solid rgba(108, 76, 255, 0.4)", borderRadius: "8px", color: "#b99cff", cursor: "pointer", fontWeight: "bold", fontSize: "13px" }}>📄 Class X Marksheet</button>
                <button type="button" onClick={() => setActiveDocument("Class XII Marksheet")} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px", background: "rgba(108, 76, 255, 0.1)", border: "1px solid rgba(108, 76, 255, 0.4)", borderRadius: "8px", color: "#b99cff", cursor: "pointer", fontWeight: "bold", fontSize: "13px" }}>📄 Class XII Marksheet</button>
              </div>
            </div>
          </div>
          <div className="info-box"><span>✦</span><div><strong>Smart form activated</strong><p>Your verified details have been automatically carried forward.</p></div></div>
          
          <button type="button" className="primary-button" onClick={handleProceedFromVerifiedProfile}>
            Confirm Details &amp; Generate Application ID <span>→</span>
          </button>
        </div>

        {activeDocument && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.85)", zIndex: 99999, display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }} onClick={() => setActiveDocument(null)}>
            <div style={{ background: "#fff", width: "100%", maxWidth: "550px", boxSizing: "border-box", borderRadius: "12px", padding: "35px 30px", color: "#2c3e50", position: "relative", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }} onClick={e => e.stopPropagation()}>
              <button style={{ position: "absolute", top: "15px", right: "20px", background: "none", border: "none", fontSize: "28px", cursor: "pointer", color: "#888" }} onClick={() => setActiveDocument(null)}>×</button>
              <div style={{ textAlign: "center", borderBottom: "2px solid #34495e", paddingBottom: "15px", marginBottom: "25px" }}><h2 style={{ margin: 0, color: "#1abc9c", fontSize: "22px", letterSpacing: "1px" }}>CENTRAL BOARD OF SECONDARY EDUCATION</h2><h3 style={{ margin: "10px 0 5px", color: "#34495e", fontSize: "16px" }}>{activeDocument === "Class X Marksheet" ? "SECONDARY SCHOOL EXAMINATION (CLASS X)" : "SENIOR SECONDARY CERTIFICATE (CLASS XII)"}</h3><p style={{ margin: 0, fontSize: "13px", color: "#7f8c8d" }}>Academic Session {academicSession}</p></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "25px", fontSize: "14px", lineHeight: "1.6", color: "#0f172a" }}><div><strong>Candidate Name:</strong> {verifiedProfile?.name || "Priya Sharma"}</div><div><strong>Roll No:</strong> 12345678</div><div><strong>DOB:</strong> {verifiedProfile?.dob || "15/06/2004"}</div><div><strong>School:</strong> Delhi Public School</div></div>
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

  if (activeStepId === "form") {
    const groupedCourses = Object.entries(COURSE_CATALOG).reduce((acc, [id, data]) => {
      if (TARGET_COLLEGE && data.university !== TARGET_COLLEGE) return acc;
      
      if (!acc[data.university]) acc[data.university] = [];
      acc[data.university].push({ id, ...data });
      return acc;
    }, {});

    const allAssociatedExams = Array.from(new Set(
      cart.map(id => COURSE_CATALOG[id]?.exam).filter(exam => exam && exam !== "Merit Based Admission")
    ));

    return (
      <Page currentStep={activeStepId} completionPercentage={currentCompletionPercentage} onHome={goHome} showCopilot={showCopilot} setShowCopilot={setShowCopilot} flowConfig={activeFlow} currentIndex={currentStepIndex} currentUserUid={currentUserUid} handleLogout={handleLogout} openAdmin={openAdmin} onStepClick={(idx) => setCurrentStepIndex(idx)}>
        
        {newAccountDetails && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.85)", zIndex: 999999, display: "flex", justifyContent: "center", alignItems: "center", padding: "20px", backdropFilter: "blur(5px)" }}>
            <div style={{ background: "#0a1124", width: "100%", maxWidth: "450px", borderRadius: "16px", padding: "40px 30px", border: "1px solid #3b486d", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.7)", textAlign: "center", animation: "slideIn 0.3s ease-out" }}>
              <div style={{ width: "64px", height: "64px", background: "#22c55e", color: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", margin: "0 auto 20px", boxShadow: "0 0 20px rgba(34, 197, 94, 0.4)" }}>✓</div>
              <h2 style={{ color: "#fff", margin: "0 0 10px 0", fontSize: "24px" }}>Application ID Generated</h2>
              <p style={{ color: "#8a9fc2", fontSize: "14px", marginBottom: "30px", lineHeight: "1.5" }}>Your application account credentials have been successfully generated.</p>

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
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "4px" }}>
                      <div style={{ color: "#b99cff", fontSize: "20px", fontWeight: "bold", fontFamily: "monospace", letterSpacing: "2px" }}>
                        {showTempPwd ? newAccountDetails.pwd : "••••••••"}
                      </div>
                      <button 
                        type="button"
                        onClick={() => setShowTempPwd(!showTempPwd)} 
                        style={{ background: "none", border: "none", color: "#a5b4fc", cursor: "pointer", fontSize: "12px", padding: 0 }}
                      >
                        {showTempPwd ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(newAccountDetails.pwd);
                      alert("Password copied to clipboard!");
                    }} 
                    style={{ background: "rgba(108,76,255,0.15)", color: "#b99cff", border: "none", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}
                  >
                    Copy
                  </button>
                </div>

              </div>

              <div style={{ background: "rgba(108, 76, 255, 0.1)", color: "#b99cff", padding: "12px 16px", borderRadius: "8px", fontSize: "12px", marginBottom: "30px", lineHeight: "1.5", border: "1px solid rgba(108, 76, 255, 0.2)" }}>
                📱 Credentials have been automatically dispatched to your email address.
              </div>

              <button 
                type="button" 
                className="primary-button full" 
                onClick={() => setnewAccountDetails(null)} 
                style={{ boxShadow: "0 0 15px rgba(108, 76, 255, 0.4)" }}
              >
                Select Programs <span>→</span>
              </button>
            </div>
          </div>
        )}

        <div className="form-layout">
          <div className="form-intro">
            <div className="step-label">STEP / PROGRAM SELECTION</div>
            <h1>Select Academic Programs</h1>
            <p className="description">Choose programs with course fees. Entrance exams are optional checkboxes below in the range of 1000 to 2000.</p>
            <div className="verified-summary"><div className="mini-verified">✓</div><div><strong>{verifiedProfile?.name || "Priya Sharma"}</strong><span style={{ display: "block", fontSize: "12px", color: "#8a9fc2", marginTop: "2px" }}>📱 Contact & Documents Verified</span></div></div>
          </div>

          <div className="form-panel">
            <div className="panel-heading"><div className="panel-icon">✦</div><div><h2>Academic Program Selection</h2><p>Select programs to add to cart.</p></div></div>
            
            <div className="form-group" style={{ marginTop: "16px" }}>
              <label>AVAILABLE PROGRAMS <span style={{ textTransform: "none", color: "#8a9fc2", fontWeight: "normal" }}>(Check to add to cart)</span></label>
              <div style={{ maxHeight: "350px", overflowY: "auto", background: "#0a1124", padding: "14px", borderRadius: "10px", border: "1px solid #3b486d", display: "flex", flexDirection: "column", gap: "16px" }}>
                {Object.entries(groupedCourses).map(([uniName, courses]) => (
                  <div key={uniName} style={{ background: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <h3 style={{ color: "#a5b4fc", fontSize: "13px", marginTop: 0, marginBottom: "12px", borderBottom: "1px solid rgba(165, 180, 252, 0.2)", paddingBottom: "6px", textTransform: "uppercase", letterSpacing: "1px" }}>
                      🏛 {uniName}
                    </h3>
                    <div style={{ display: "grid", gap: "10px" }}>
                      {courses.map(course => (
                        <label key={course.id} style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", color: "#fff", cursor: "pointer", fontSize: "14px", padding: "4px 0" }}>
                          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                            <input type="checkbox" checked={cart.includes(course.id)} onChange={() => toggleCartItem(course.id)} style={{ width: "18px", height: "18px", accentColor: "#6c4cff", cursor: "pointer", marginTop: "2px" }} />
                            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                              <span>{course.name}</span>
                              <span style={{ color: "#a5b4fc", fontSize: "11px" }}>📝 Associated Exam: {course.exam}</span>
                              <div>
                                <span style={{ background: "rgba(34, 197, 94, 0.15)", color: "#22c55e", padding: "2px 6px", borderRadius: "4px", fontSize: "10px", fontWeight: "bold", border: "1px solid rgba(34, 197, 94, 0.3)", display: "inline-block" }}>
                                  ✓ Eligible ({course.eligibilityType})
                                </span>
                              </div>
                            </div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <strong style={{ color: "#a5b4fc", display: "block" }}>₹{course.programFee.toLocaleString("en-IN")}</strong>
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

            {allAssociatedExams.length > 0 && (
              <div style={{ marginTop: "24px", paddingTop: "18px", borderTop: "1px solid #293c5c" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                  <span style={{ fontSize: "20px" }}>📝</span><div><h3 style={{ margin: 0, fontSize: "16px", color: "#fff" }}>Optional Entrance Exam Opt-In</h3><small style={{ color: "#8a9fc2", fontSize: "12px" }}>Entrance exams are optional (Fee range: ₹1,000 - ₹2,000). Check below if you wish to take the exam.</small></div>
                </div>
                <div style={{ background: "#0a1124", padding: "16px", borderRadius: "10px", border: "1px solid #3b486d", display: "grid", gap: "12px" }}>
                  {allAssociatedExams.map(examName => {
                    const matchingProgKey = Object.keys(COURSE_CATALOG).find(k => COURSE_CATALOG[k].exam === examName);
                    const examFee = matchingProgKey ? COURSE_CATALOG[matchingProgKey].examFee : 1500;
                    const isOptedIn = selectedExamsCart.includes(examName);
                    return (
                      <div key={examName} style={{ background: "#130e2b", border: "1px solid #3b486d", padding: "12px 14px", borderRadius: "8px" }}>
                        <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: "#fff", cursor: "pointer", fontSize: "14px", marginBottom: "8px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <input type="checkbox" checked={isOptedIn} onChange={() => toggleExamSelection(examName)} style={{ width: "16px", height: "16px", accentColor: "#6c4cff", cursor: "pointer" }} />
                            <span>Opt-in for <strong>{examName}</strong></span>
                          </div>
                          <strong style={{ color: "#a5b4fc" }}>₹{examFee.toLocaleString("en-IN")} Exam Fee</strong>
                        </label>
                        {isOptedIn && (
                          <div style={{ marginTop: "8px", paddingTop: "8px", borderTop: "1px dashed #3b486d" }}>
                            <select value={selectedExamSlots[examName] || ""} onChange={(e) => setSelectedExamSlots({...selectedExamSlots, [examName]: e.target.value})} style={{ width: "100%", padding: "8px", borderRadius: "6px", background: "#081222", color: "#fff", border: "1px solid #3b486d", fontSize: "13px" }}>
                              <option value="">Choose Preferred Date & Shift...</option>
                              {EXAM_SCHEDULE_OPTIONS[examName]?.map(slot => <option key={slot} value={slot}>{slot}</option>)}
                            </select>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {showCenterPreferences && (
              <div style={{ marginTop: "20px" }}>
                <label style={{ display: "block", fontSize: "12px", color: "#b99cff", fontWeight: 700, marginBottom: "8px" }}>TEST CITY PREFERENCES</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "12px" }}>
                  <div className="form-group" style={{ margin: 0 }}><label style={{ fontSize: "11px", color: "#8a9fc2" }}>PREFERENCE 1</label><select value={cityPreferences.pref1} onChange={(e) => setCityPreferences({...cityPreferences, pref1: e.target.value})} style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", background: "#081222", color: "#fff", border: "1px solid #3b486d", fontSize: "13px" }}><option value="">Choose City</option>{CITIES.map(c => <option key={c} value={c} disabled={c === cityPreferences.pref2 || c === cityPreferences.pref3}>{c}</option>)}</select></div>
                  <div className="form-group" style={{ margin: 0 }}><label style={{ fontSize: "11px", color: "#8a9fc2" }}>PREFERENCE 2</label><select value={cityPreferences.pref2} onChange={(e) => setCityPreferences({...cityPreferences, pref2: e.target.value})} style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", background: "#081222", color: "#fff", border: "1px solid #3b486d", fontSize: "13px" }}><option value="">Choose City</option>{CITIES.map(c => <option key={c} value={c} disabled={c === cityPreferences.pref1 || c === cityPreferences.pref3}>{c}</option>)}</select></div>
                  <div className="form-group" style={{ margin: 0 }}><label style={{ fontSize: "11px", color: "#8a9fc2" }}>PREFERENCE 3</label><select value={cityPreferences.pref3} onChange={(e) => setCityPreferences({...cityPreferences, pref3: e.target.value})} style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", background: "#081222", color: "#fff", border: "1px solid #3b486d", fontSize: "13px" }}><option value="">Choose City</option>{CITIES.map(c => <option key={c} value={c} disabled={c === cityPreferences.pref1 || c === cityPreferences.pref2}>{c}</option>)}</select></div>
                </div>
              </div>
            )}
            
            <button type="button" className="primary-button full" onClick={continueFromForm} style={{ marginTop: "22px" }}>
              Continue to Application Review <span>→</span>
            </button>
            <button type="button" className="back-button" onClick={goToPrevStep}>← Back</button>
          </div>
        </div>
      </Page>
    );
  }

  if (activeStepId === "review") {
    return (
      <Page currentStep={activeStepId} completionPercentage={currentCompletionPercentage} onHome={goHome} showCopilot={showCopilot} setShowCopilot={setShowCopilot} flowConfig={activeFlow} currentIndex={currentStepIndex} currentUserUid={currentUserUid} handleLogout={handleLogout} openAdmin={openAdmin} onStepClick={(idx) => setCurrentStepIndex(idx)}>
        <div className="review-page">
          <div className="step-label">STEP / REVIEW</div>
          <h1>Review your application.</h1>
          <p className="description">Verify your selected programs, opted exams, and itemized fee breakdown before payment.</p>
          <div className="review-grid">
            <div className="review-card">
              <div className="review-card-title"><span className="review-icon">✓</span><div><h2>Verified Information</h2><span>Retrieved Securely</span></div></div>
              <ReviewRow label="Applicant Name" value={verifiedProfile?.name || "Priya Sharma"} verified />
              <ReviewRow label="Aadhaar Verification" value={currentUserUid ? `UID: ${currentUserUid}` : "Verified"} verified />
              <ReviewRow label="Date of Birth" value={verifiedProfile?.dob || "—"} verified />
              <ReviewRow label="Mobile" value={verifiedProfile?.phone || "9876543210"} verified />
              <ReviewRow label="Email" value={verifiedProfile?.email || "priya.sharma@example.com"} verified />
            </div>

            <div className="review-card">
              <div className="review-card-title"><span className="review-icon purple">📍</span><div><h2>Exam Booking</h2><span>Opted Exams &amp; Slots</span></div></div>
              <div style={{ marginBottom: "12px" }}>
                {selectedExamsCart.length === 0 ? (
                  <div style={{ color: "#7890b2", fontSize: "13px", fontStyle: "italic" }}>No entrance exams opted in.</div>
                ) : (
                  selectedExamsCart.map(e => {
                    const matchingProgKey = Object.keys(COURSE_CATALOG).find(k => COURSE_CATALOG[k].exam === e);
                    const examFee = matchingProgKey ? COURSE_CATALOG[matchingProgKey].examFee : 1500;
                    return (
                      <div key={e} style={{ background: "#0a1124", padding: "8px 12px", borderRadius: "6px", marginBottom: "6px", border: "1px solid #3b486d" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ color: "#fff", fontWeight: "bold", fontSize: "13px" }}>{e}</div>
                          <strong style={{ color: "#a5b4fc", fontSize: "12px" }}>₹{examFee}</strong>
                        </div>
                        <div style={{ color: "#a5b4fc", fontSize: "11px", marginTop: "2px" }}>📅 {selectedExamSlots[e] || "Slot not selected"}</div>
                      </div>
                    );
                  })
                )}
              </div>
              {showCenterPreferences && (
                <><ReviewRow label="City Preference 1" value={cityPreferences.pref1 || "—"} /><ReviewRow label="City Preference 2" value={cityPreferences.pref2 || "—"} /><ReviewRow label="City Preference 3" value={cityPreferences.pref3 || "—"} /></>
              )}
            </div>

            <div className="review-card" style={{ gridColumn: "1 / -1" }}>
              <div className="review-card-title">
                <span className="review-icon purple">+</span>
                <div>
                  <h2>Cart Itemization &amp; Fee Breakdown</h2>
                  <span>Program Fee &amp; Exam Fee</span>
                </div>
              </div>
              <div style={{ paddingTop: "5px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontSize: "12px", color: "#8a9fc2", fontWeight: 700 }}>PROGRAMS SELECTED ({(Array.isArray(cart) ? cart : []).length})</span>
                  <button type="button" onClick={goToPrevStep} style={{ background: "transparent", border: "1px solid #6c4cff", color: "#b99cff", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>✏️ Edit Cart</button>
                </div>
                {(Array.isArray(cart) ? cart : []).map((item, idx) => {
                  const entry = COURSE_CATALOG[item] || {};
                  return (
                    <div key={idx} style={{ marginTop: "10px", paddingBottom: "10px", borderBottom: idx !== cart.length - 1 ? "1px solid #3b486d" : "none" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <strong style={{ color: "#fff", fontSize: "14px" }}>• {entry.name}</strong>
                          <span style={{ display: "block", color: "#22c55e", fontSize: "12px" }}>🎓 {entry.university}</span>
                          <span style={{ display: "block", color: "#a5b4fc", fontSize: "11px" }}>Program Fee: ₹{entry.programFee.toLocaleString("en-IN")}</span>
                        </div>
                        <div style={{ color: "#22c55e", fontSize: "15px", fontWeight: "bold", marginLeft: "15px" }}>₹{entry.programFee.toLocaleString("en-IN")}</div>
                      </div>
                    </div>
                  );
                })}

                {selectedExamsCart.map((examName, idx) => {
                  const matchingProgKey = Object.keys(COURSE_CATALOG).find(k => COURSE_CATALOG[k].exam === examName);
                  const examFee = matchingProgKey ? COURSE_CATALOG[matchingProgKey].examFee : 1500;
                  return (
                    <div key={`ex-${idx}`} style={{ marginTop: "10px", paddingBottom: "10px", borderBottom: "1px solid #3b486d" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <strong style={{ color: "#fff", fontSize: "14px" }}>• {examName} (Entrance Exam)</strong>
                          <span style={{ display: "block", color: "#a5b4fc", fontSize: "11px" }}>Exam Fee</span>
                        </div>
                        <div style={{ color: "#22c55e", fontSize: "15px", fontWeight: "bold", marginLeft: "15px" }}>₹{examFee.toLocaleString("en-IN")}</div>
                      </div>
                    </div>
                  );
                })}
                
                {cart.length > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px", paddingTop: "14px", borderTop: "2px dashed #3b486d" }}>
                    <span style={{ fontSize: "14px", color: "#fff", fontWeight: 800 }}>CONSOLIDATED TOTAL PAYABLE FEE</span>
                    <strong style={{ color: "#22c55e", fontSize: "18px" }}>₹{currentTotalFee.toLocaleString("en-IN")}</strong>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="ready-banner"><div className="ready-icon">✓</div><div><strong>Ready for payment</strong><p>Your itemized application cart is complete and ready for checkout.</p></div></div>
          <div className="review-actions">
            <button type="button" className="back-button" onClick={goToPrevStep}>← Edit Details</button>
            <button type="button" className="primary-button" onClick={goToNextStep}>Continue to Payment <span>→</span></button>
          </div>
        </div>
      </Page>
    );
  }

  if (activeStepId === "payment") {
    return (
      <Page currentStep={activeStepId} completionPercentage={currentCompletionPercentage} onHome={goHome} showCopilot={showCopilot} setShowCopilot={setShowCopilot} flowConfig={activeFlow} currentIndex={currentStepIndex} currentUserUid={currentUserUid} handleLogout={handleLogout} openAdmin={openAdmin} onStepClick={(idx) => setCurrentStepIndex(idx)}>
        <div className="payment-page">
          <div className="step-label">STEP / PAYMENT</div>
          <h1>Complete your payment.</h1>
          <p className="description">Review your cart itemization and complete the sandbox transaction.</p>
          <div className="payment-layout" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.5fr) minmax(280px, .7fr)", gap: "24px", alignItems: "start" }}>
            <div className="payment-card" style={{ padding: "28px" }}>
              <div className="payment-card-top"><div><span>CONSOLIDATED TOTAL FEE</span><h2>₹{currentTotalFee.toLocaleString("en-IN")}</h2></div><div className="sandbox-pill">SANDBOX</div></div>
              <div className="payment-divider" />
              <div className="payment-detail"><span>Applicant</span><strong>{verifiedProfile?.name || "Priya Sharma"}</strong></div>
              <div className="payment-detail"><span>Aadhaar UID</span><strong className="green-text">✓ {currentUserUid || "Verified"}</strong></div>

              <div style={{ marginTop: "24px", marginBottom: "24px" }}>
                <h3 style={{ marginBottom: "12px", fontSize: "14px", color: "#a5b4fc" }}>Cart Item Breakdown</h3>
                <div style={{ display: "grid", gap: "10px" }}>
                  {(Array.isArray(cart) ? cart : []).map((item, idx) => {
                    const entry = COURSE_CATALOG[item] || {};
                    return (
                      <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: "#0a1124", border: "1px solid #3b486d", borderRadius: "10px" }}>
                        <div>
                          <strong style={{ display: "block", color: "#fff", fontSize: "13px" }}>{entry.name}</strong>
                          <span style={{ color: "#22c55e", fontSize: "11px", display: "block" }}>🎓 {entry.university}</span>
                          <span style={{ color: "#159957", fontSize: "12px", fontWeight: "bold" }}>₹{entry.programFee.toLocaleString("en-IN")} Program Fee</span>
                        </div>
                        <button type="button" onClick={() => toggleCartItem(item)} disabled={processingPayment} style={{ background: "rgba(255, 77, 79, 0.1)", color: "#ff4d4f", border: "1px solid rgba(255, 77, 79, 0.3)", padding: "4px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "11px", fontWeight: "bold" }}>Remove</button>
                      </div>
                    );
                  })}
                  {selectedExamsCart.map((examName, idx) => {
                    const matchingProgKey = Object.keys(COURSE_CATALOG).find(k => COURSE_CATALOG[k].exam === examName);
                    const examFee = matchingProgKey ? COURSE_CATALOG[matchingProgKey].examFee : 1500;
                    return (
                      <div key={`ex-${idx}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "#130e2b", border: "1px solid #3b486d", borderRadius: "10px" }}>
                        <div>
                          <strong style={{ display: "block", color: "#fff", fontSize: "13px" }}>📝 {examName} (Entrance Exam)</strong>
                          <span style={{ color: "#a5b4fc", fontSize: "12px", fontWeight: "bold" }}>₹{examFee.toLocaleString("en-IN")} Exam Fee</span>
                        </div>
                        <button type="button" onClick={() => toggleExamSelection(examName)} disabled={processingPayment} style={{ background: "rgba(255, 77, 79, 0.1)", color: "#ff4d4f", border: "1px solid rgba(255, 77, 79, 0.3)", padding: "4px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "11px", fontWeight: "bold" }}>Remove</button>
                      </div>
                    );
                  })}
                  {(!cart || cart.length === 0) && (
                    <div style={{ padding: "15px", background: "rgba(255, 77, 79, 0.1)", border: "1px solid rgba(255, 77, 79, 0.3)", borderRadius: "10px", color: "#ff4d4f", fontSize: "14px" }}>Your cart is empty! Please go back and add programs before paying.</div>
                  )}
                </div>
              </div>

              <div style={{ marginTop: "24px" }}>
                <h3 style={{ marginBottom: "12px" }}>Select payment method</h3>
                <div style={{ display: "grid", gap: "10px" }}>
                  {[["upi", "UPI", "Google Pay / PhonePe / BHIM", "U"], ["card", "Card", "Credit / Debit Card", "💳"], ["netbanking", "Net Banking", "All major banks", "🏦"]].map(([id, title, subtitle, icon]) => (
                    <button key={id} type="button" onClick={() => setPaymentMethod(id)} disabled={processingPayment || !cart || cart.length === 0} style={{ display: "grid", gridTemplateColumns: "42px 1fr auto", alignItems: "center", gap: "12px", width: "100%", padding: "14px", borderRadius: "12px", border: paymentMethod === id ? "1px solid #7556ff" : "1px solid #293c5c", background: paymentMethod === id ? "#151f3c" : "#101c30", color: "#fff", textAlign: "left", cursor: processingPayment ? "not-allowed" : "pointer" }}>
                      <span style={{ width: "42px", height: "42px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "11px", background: "#211d49", color: "#b99cff", fontWeight: 800 }}>{icon}</span>
                      <span><strong style={{ display: "block" }}>{title}</strong><small style={{ color: "#7890b2" }}>{subtitle}</small></span>
                      <span style={{ color: "#a47bff", fontSize: "18px" }}>{paymentMethod === id ? "●" : "○"}</span>
                    </button>
                  ))}
                </div>
              </div>

              {paymentMethod === "upi" && cart?.length > 0 && (
                <div style={{ marginTop: "18px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: 700 }}>UPI ID</label>
                  <input value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="demo@upi" disabled={processingPayment} style={{ width: "100%", boxSizing: "border-box", padding: "14px", borderRadius: "11px", border: "1px solid #33496d", background: "#081222", color: "#fff" }} />
                  <small style={{ display: "block", marginTop: "7px", color: "#7288aa" }}>🔒 Demo UPI only — no real money will be charged.</small>
                </div>
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
              <div className="sandbox-warning"><strong>Programs in Cart</strong><span>{(Array.isArray(cart) ? cart : []).length}</span></div>
              <div className="sandbox-warning"><strong>Consolidated Fee</strong><span>₹{currentTotalFee.toLocaleString("en-IN")}</span></div>
              <div className="sandbox-warning"><strong>Demo Environment</strong><span>No real money will be charged.</span></div>
            </div>
          </div>
        </div>
      </Page>
    );
  }

  if (activeStepId === "success") {
    return (
      <Page currentStep={activeStepId} completionPercentage={currentCompletionPercentage} onHome={goHome} showCopilot={showCopilot} setShowCopilot={setShowCopilot} flowConfig={activeFlow} currentIndex={currentStepIndex} currentUserUid={currentUserUid} handleLogout={handleLogout} openAdmin={openAdmin} onStepClick={(idx) => setCurrentStepIndex(idx)}>
        
        {showWhatsAppAlert && (
          <div style={{ position: "fixed", bottom: "30px", right: "30px", background: "#064e3b", color: "#ecfdf5", padding: "16px 20px", borderRadius: "12px", boxShadow: "0 20px 40px rgba(0,0,0,0.6)", zIndex: 99999, display: "flex", alignItems: "flex-start", gap: "14px", width: "350px", animation: "slideIn 0.4s ease-out forwards", border: "1px solid #10b981" }}>
            <span style={{ fontSize: "26px" }}>💬</span>
            <div style={{ flex: 1 }}>
              <strong style={{ display: "block", fontSize: "14px", marginBottom: "4px", color: "#34d399" }}>SmartRegTech Admissions</strong>
              <p style={{ margin: 0, fontSize: "13px", lineHeight: "1.4" }}>Dear {verifiedProfile?.name?.split(" ")[0] || "Priya"}, your registration for ID <strong>{registrationId}</strong> is successful! Log in anytime to track your admission status.</p>
            </div>
            <button onClick={() => { setShowWhatsAppAlert(false); setAlertDismissed(true); }} style={{ background: "none", border: "none", color: "#a7f3d0", fontSize: "18px", cursor: "pointer", padding: 0 }}>×</button>
          </div>
        )}

        {showSupportModal && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.85)", zIndex: 999999, display: "flex", justifyContent: "center", alignItems: "center", padding: "20px", backdropFilter: "blur(5px)" }}>
            <div style={{ background: "#0a1124", width: "100%", maxWidth: "500px", borderRadius: "16px", padding: "35px", border: "1px solid #3b486d", boxShadow: "0 25px 50px rgba(0,0,0,0.7)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ color: "#fff", margin: 0, fontSize: "20px" }}>🛠️ Submit Helpdesk Ticket</h3>
                <button onClick={() => setShowSupportModal(false)} style={{ background: "none", border: "none", color: "#94a3b8", fontSize: "20px", cursor: "pointer" }}>×</button>
              </div>
              <div className="form-group" style={{ marginBottom: "16px" }}>
                <label style={{ color: "#a5b4fc", fontSize: "12px", fontWeight: "700", display: "block", marginBottom: "6px" }}>SUBJECT / CATEGORY</label>
                <input type="text" placeholder="e.g. Discrepancy in Admit Card / Exam Center Shift" value={ticketSubject} onChange={(e) => setTicketSubject(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "8px", background: "#040812", color: "#fff", border: "1px solid #3b486d", fontSize: "13px", boxSizing: "border-box" }} />
              </div>
              <div className="form-group" style={{ marginBottom: "24px" }}>
                <label style={{ color: "#a5b4fc", fontSize: "12px", fontWeight: "700", display: "block", marginBottom: "6px" }}>MESSAGE DETAILS</label>
                <textarea rows="4" placeholder="Describe your query or issue in detail..." value={ticketMessage} onChange={(e) => setTicketMessage(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "8px", background: "#040812", color: "#fff", border: "1px solid #3b486d", fontSize: "13px", boxSizing: "border-box", resize: "none" }}></textarea>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <button type="button" onClick={() => setShowSupportModal(false)} className="back-button" style={{ flex: 1, margin: 0 }}>Cancel</button>
                <button type="button" onClick={() => {
                  if(!ticketSubject || !ticketMessage) { alert("Please fill out both subject and message."); return; }
                  alert("✅ Ticket submitted successfully! Support Ticket Reference: #SR-TK-" + Math.floor(1000 + Math.random() * 9000));
                  setShowSupportModal(false);
                  setTicketSubject("");
                  setTicketMessage("");
                }} className="primary-button" style={{ flex: 2 }}>Submit Ticket <span>→</span></button>
              </div>
            </div>
          </div>
        )}

        <div className="dashboard-page" style={{ textAlign: "left", maxWidth: "1150px", margin: "0 auto" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #293c5c", paddingBottom: "20px", marginBottom: "30px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <div className="step-label" style={{ marginBottom: "6px", color: "#818cf8", fontWeight: "700", letterSpacing: "1px", fontSize: "11px" }}>OFFICIAL APPLICANT PORTAL</div>
              <h1 style={{ margin: 0, fontSize: "30px", fontWeight: "800", color: "#fff" }}>Welcome, {verifiedProfile?.name || "Priya Sharma"}</h1>
              <p style={{ margin: "4px 0 0 0", color: "#8a9fc2", fontSize: "13px" }}>Application ID (UID): <span style={{ fontFamily: "monospace", color: "#818cf8", fontWeight: "bold" }}>{currentUserUid}</span></p>
            </div>
            
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <button 
                type="button" 
                onClick={() => setShowSupportModal(true)} 
                style={{ background: "#1e293b", color: "#94a3b8", border: "1px solid #334155", padding: "10px 16px", borderRadius: "10px", fontWeight: "bold", cursor: "pointer", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span>🛠</span> Helpdesk Support
              </button>
              <button 
                type="button" 
                onClick={downloadReceipt} 
                style={{ background: "#16a34a", color: "white", border: "none", padding: "10px 18px", borderRadius: "10px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 4px 15px rgba(22, 163, 74, 0.3)", fontSize: "13px" }}
              >
                <span>↓</span> Download Consolidated Receipt (PDF)
              </button>
            </div>
          </div>

          <div style={{ background: "#0a1124", border: "1px solid #3b486d", borderRadius: "16px", padding: "20px 24px", marginBottom: "30px" }}>
            <h4 style={{ color: "#a5b4fc", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1.2px", margin: "0 0 16px 0", fontWeight: "700" }}>Application Progress Lifecycle</h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px", alignItems: "center" }}>
              
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#22c55e", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "12px" }}>✓</div>
                <div><strong style={{ display: "block", color: "#fff", fontSize: "12px" }}>1. Registration</strong><small style={{ color: "#22c55e", fontSize: "10px", fontWeight: "bold" }}>Completed</small></div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#22c55e", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "12px" }}>✓</div>
                <div><strong style={{ display: "block", color: "#fff", fontSize: "12px" }}>2. Document Verification</strong><small style={{ color: "#22c55e", fontSize: "10px", fontWeight: "bold" }}>Verified</small></div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#6366f1", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "12px" }}>3</div>
                <div><strong style={{ display: "block", color: "#fff", fontSize: "12px" }}>3. Entrance Examination</strong><small style={{ color: "#818cf8", fontSize: "10px", fontWeight: "bold" }}>Scheduled</small></div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#1e293b", color: "#64748b", border: "1px solid #334155", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "12px" }}>4</div>
                <div><strong style={{ display: "block", color: "#94a3b8", fontSize: "12px" }}>4. Merit Rank List</strong><small style={{ color: "#64748b", fontSize: "10px" }}>Awaiting Exam</small></div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#1e293b", color: "#64748b", border: "1px solid #334155", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "12px" }}>5</div>
                <div><strong style={{ display: "block", color: "#94a3b8", fontSize: "12px" }}>5. Seat Allotment</strong><small style={{ color: "#64748b", fontSize: "10px" }}>Pending</small></div>
              </div>

            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr", gap: "24px", alignItems: "start" }}>
            
            <div>
              
              {selectedExamsCart.length > 0 && (
                <div style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #311b92 100%)", border: "1px solid #6366f1", borderRadius: "16px", padding: "20px", marginBottom: "24px", boxShadow: "0 10px 25px rgba(99, 102, 241, 0.2)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <span style={{ background: "#4338ca", color: "#e0e7ff", padding: "4px 10px", borderRadius: "12px", fontSize: "10px", fontWeight: "bold", letterSpacing: "1px" }}>🚨 UPCOMING ENTRANCE EXAMINATION</span>
                    <span style={{ color: "#a5b4fc", fontSize: "12px", fontWeight: "bold" }}>⏳ 34 Days Remaining</span>
                  </div>
                  <h3 style={{ color: "#fff", margin: "0 0 6px 0", fontSize: "18px" }}>{selectedExamsCart[0]} Scheduled</h3>
                  <p style={{ color: "#c7d2fe", fontSize: "13px", margin: "0 0 16px 0", lineHeight: "1.4" }}>Your examination hall ticket is generated. Please review the mandatory examination guidelines and test center rules.</p>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button type="button" onClick={() => downloadAdmitCard(selectedExamsCart[0])} style={{ background: "#6366f1", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", fontSize: "12px" }}>Download Hall Ticket PDF</button>
                    <button type="button" onClick={() => alert("📖 Mock Practice Test Portal loaded for " + selectedExamsCart[0])} style={{ background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", padding: "8px 16px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", fontSize: "12px" }}>Practice Mock Exam</button>
                  </div>
                </div>
              )}

              <h3 style={{ color: "#a5b4fc", fontSize: "13px", marginBottom: "14px", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "700" }}>Entrance Exam Admit Cards (Opted Exams)</h3>
              
              {selectedExamsCart.length === 0 ? (
                <div style={{ padding: "16px", background: "#0a1124", borderRadius: "12px", border: "1px solid #3b486d", color: "#7890b2", fontSize: "13px", marginBottom: "28px" }}>No entrance exams were opted in for this application.</div>
              ) : (
                <div style={{ display: "grid", gap: "16px", marginBottom: "28px" }}>
                  {selectedExamsCart.map((examName, idx) => {
                    const matchingProgKey = Object.keys(COURSE_CATALOG).find(k => COURSE_CATALOG[k].exam === examName);
                    const examFee = matchingProgKey ? COURSE_CATALOG[matchingProgKey].examFee : 1500;
                    return (
                      <div key={idx} style={{ background: "#0a1124", border: "1px solid #3b486d", borderRadius: "14px", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 8px 20px rgba(0,0,0,0.3)" }}>
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px", gap: "12px" }}>
                            <h4 style={{ color: "#fff", margin: 0, fontSize: "16px", fontWeight: "700" }}>{examName}</h4>
                            <span style={{ background: "rgba(34, 197, 94, 0.15)", color: "#4ade80", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "bold", border: "1px solid rgba(34, 197, 94, 0.3)", whiteSpace: "nowrap" }}>✓ Hall Ticket Ready</span>
                          </div>
                          
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", borderTop: "1px solid #293c5c", paddingTop: "14px", fontSize: "12px" }}>
                            <div><span style={{ color: "#7890b2", display: "block" }}>Registration ID</span><strong style={{ color: "#fff", fontFamily: "monospace" }}>{registrationId}-{idx + 1}</strong></div>
                            <div><span style={{ color: "#7890b2", display: "block" }}>Fee Paid</span><strong style={{ color: "#a5b4fc" }}>₹{examFee.toLocaleString("en-IN")}</strong></div>
                            <div><span style={{ color: "#7890b2", display: "block" }}>Test Slot</span><strong style={{ color: "#a5b4fc" }}>{selectedExamSlots[examName] || "Slot Selected"}</strong></div>
                            <div><span style={{ color: "#7890b2", display: "block" }}>Test Center</span><strong style={{ color: "#fff" }}>{showCenterPreferences ? (cityPreferences?.pref1 || "Chennai") : "Online / Remote"}</strong></div>
                          </div>
                        </div>

                        <button 
                          type="button"
                          onClick={() => downloadAdmitCard(examName)}
                          style={{ width: "100%", marginTop: "16px", padding: "10px", background: "rgba(108, 76, 255, 0.15)", color: "#b99cff", border: "1px solid rgba(108, 76, 255, 0.4)", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "12px" }}
                        >
                          <span>↓</span> Download Admit Card (PDF)
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              <h3 style={{ color: "#a5b4fc", fontSize: "13px", marginBottom: "14px", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "700" }}>Enrolled Academic Programs</h3>
              
              <div style={{ display: "grid", gap: "16px" }}>
                {(Array.isArray(cart) ? cart : []).map((item, idx) => {
                  const catalogEntry = COURSE_CATALOG[item] || {};
                  return (
                    <div key={idx} style={{ background: "#0a1124", border: "1px solid #3b486d", borderRadius: "14px", padding: "18px", boxShadow: "0 8px 20px rgba(0,0,0,0.3)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px", gap: "12px" }}>
                        <h4 style={{ color: "#fff", margin: 0, fontSize: "15px", fontWeight: "700" }}>{catalogEntry.name}</h4>
                        <span style={{ background: "rgba(34, 197, 94, 0.15)", color: "#4ade80", padding: "4px 8px", borderRadius: "6px", fontSize: "10px", fontWeight: "bold", border: "1px solid rgba(34, 197, 94, 0.3)" }}>✓ Enrolled</span>
                      </div>
                      <div style={{ color: "#a5b4fc", fontSize: "12px", marginBottom: "12px" }}>🎓 {catalogEntry.university}</div>
                      
                      <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #293c5c", paddingTop: "10px", fontSize: "12px" }}>
                        <span style={{ color: "#7890b2" }}>Application ID: <strong style={{ color: "#fff", fontFamily: "monospace" }}>{registrationId}-{idx + 1}</strong></span>
                        <span style={{ color: "#7890b2" }}>Fee Paid: <strong style={{ color: "#4ade80" }}>₹{catalogEntry.programFee.toLocaleString("en-IN")}</strong></span>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

            <div>
              
              <div style={{ background: "#0a1124", border: "1px solid #3b486d", borderRadius: "16px", padding: "20px", marginBottom: "24px" }}>
                <h4 style={{ color: "#a5b4fc", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 14px 0", fontWeight: "700" }}>Candidate Verified Profile</h4>
                
                <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
                  <div style={{ width: "54px", height: "54px", borderRadius: "50%", background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "#fff", fontSize: "20px", overflow: "hidden" }}>
                    {verifiedProfile?.customPhoto ? (
                      <img src={verifiedProfile.customPhoto} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      verifiedProfile?.photo || "PS"
                    )}
                  </div>
                  <div>
                    <strong style={{ color: "#fff", display: "block", fontSize: "15px" }}>{verifiedProfile?.name || "Priya Sharma"}</strong>
                    <span style={{ color: "#22c55e", fontSize: "11px", fontWeight: "bold" }}>✓ Verified Candidate</span>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "12px", borderTop: "1px solid #293c5c", paddingTop: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#7890b2" }}>Email:</span><strong style={{ color: "#fff" }}>{verifiedProfile?.email || "priya.sharma@example.com"}</strong></div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#7890b2" }}>Mobile:</span><strong style={{ color: "#fff" }}>{verifiedProfile?.phone || "9876543210"}</strong></div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#7890b2" }}>Gender:</span><strong style={{ color: "#fff" }}>{verifiedProfile?.gender || "Female"}</strong></div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#7890b2" }}>Qualification:</span><strong style={{ color: "#a5b4fc", textAlign: "right", maxWidth: "150px" }}>{verifiedProfile?.qualification || "Science (PCM)"}</strong></div>
                </div>

                <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px dashed #3b486d", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <button type="button" onClick={() => setActiveDocument("Class XII Marksheet")} style={{ background: "rgba(108, 76, 255, 0.15)", color: "#b99cff", border: "1px solid rgba(108, 76, 255, 0.3)", padding: "6px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}>📄 Marksheet</button>
                  {manualGovtIdFile && <button type="button" onClick={() => window.open(manualGovtIdFile.url, '_blank')} style={{ background: "rgba(108, 76, 255, 0.15)", color: "#b99cff", border: "1px solid rgba(108, 76, 255, 0.3)", padding: "6px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}>🆔 Govt ID</button>}
                </div>
              </div>

              <div style={{ background: "#0a1124", border: "1px solid #3b486d", borderRadius: "16px", padding: "20px" }}>
                <h4 style={{ color: "#a5b4fc", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 14px 0", fontWeight: "700" }}>Important Dates &amp; Deadlines</h4>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "8px" }}>
                    <span style={{ color: "#7890b2" }}>Admit Card Download</span>
                    <strong style={{ color: "#22c55e" }}>Available Now</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "8px" }}>
                    <span style={{ color: "#7890b2" }}>Entrance Examination</span>
                    <strong style={{ color: "#fff" }}>May 05, 2026</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "8px" }}>
                    <span style={{ color: "#7890b2" }}>Answer Key Challenge</span>
                    <strong style={{ color: "#94a3b8" }}>May 12, 2026</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "8px" }}>
                    <span style={{ color: "#7890b2" }}>Result Declaration</span>
                    <strong style={{ color: "#94a3b8" }}>May 20, 2026</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#7890b2" }}>Counseling Registration</span>
                    <strong style={{ color: "#94a3b8" }}>May 25, 2026</strong>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </Page>
    );
  }

  return null;
}

function Page({ children, currentStep, completionPercentage, onHome, flowConfig, currentIndex, currentUserUid, handleLogout, openAdmin, onStepClick, showCopilot, setShowCopilot }) {
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "800px", margin: "0 auto 12px auto", padding: "0 10px" }}>
          <span style={{ color: "#a5b4fc", fontSize: "12px", fontWeight: "700", letterSpacing: "0.5px" }}>PROGRESS TRACKING</span>
          <span style={{ color: "#22c55e", fontSize: "13px", fontWeight: "800", background: "rgba(34, 197, 94, 0.15)", padding: "3px 10px", borderRadius: "12px", border: "1px solid rgba(34, 197, 94, 0.3)" }}>
            {completionPercentage}% Completed
          </span>
        </div>

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