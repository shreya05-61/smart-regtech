from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import sqlite3
import uuid
import csv
import io


# ============================================================
# SMARTREGTECH BACKEND
# ============================================================

app = FastAPI(
    title="SmartRegTech API",
    description="Backend API for SmartRegTech Registration Portal",
    version="2.0.0"
)


# ============================================================
# CORS
# ============================================================

# Allows the deployed Vercel frontend to communicate
# with the deployed Render backend.

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# DATABASE
# ============================================================

DATABASE = "smartregtech.db"


def get_connection():
    connection = sqlite3.connect(DATABASE)
    connection.row_factory = sqlite3.Row
    return connection


def initialize_database():

    connection = get_connection()

    connection.execute(
        """
        CREATE TABLE IF NOT EXISTS applications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            registration_id TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            program TEXT NOT NULL,
            identity TEXT NOT NULL DEFAULT 'Verified',
            payment TEXT NOT NULL DEFAULT 'Pending',
            status TEXT NOT NULL DEFAULT 'Pending',
            created_at TEXT NOT NULL
        )
        """
    )

    connection.commit()
    connection.close()


initialize_database()


# ============================================================
# MODELS
# ============================================================

class IdentityRequest(BaseModel):
    identity_number: str


class RegistrationRequest(BaseModel):
    name: str
    email: str
    phone: Optional[str] = ""
    program: str


class CopilotQuery(BaseModel):
    question: str


# ============================================================
# COPILOT WEBSITE KNOWLEDGE BASE & SYSTEM LOGIC
# ============================================================

WEBSITE_KNOWLEDGE = """
YOU ARE SMARTREGTECH COPILOT, AN AI ASSISTANT FOR THE SMARTREGTECH ADMISSIONS PORTAL.

YOUR KNOWLEDGE BASE (WEBSITE CONTENT):
1. AVAILABLE PROGRAMS & UNIVERSITIES:
   - B.Tech (Computer Science & Engineering) - Symbiosis International University (Pune) | Fee: ₹4500 | Exam: SITEEE 2026
   - BBA (Honours) - Symbiosis International University (Pune) | Fee: ₹3800 | Exam: SET 2026
   - B.A. LL.B (Honours) - Symbiosis International University (Pune) | Fee: ₹4200 | Exam: SLAT 2026
   - B.Tech (Computer Science) - Vellore Institute of Technology (VIT) | Fee: ₹5000 | Exam: VITEEE 2026
   - B.Tech (Electronics & Communication) - Vellore Institute of Technology (VIT) | Fee: ₹4800 | Exam: VITEEE 2026
   - BCA (Data Analytics) - Vellore Institute of Technology (VIT) | Fee: ₹3500 | Exam: Merit Based
   - B.E. (Computer Science) - BITS Pilani | Fee: ₹6000 | Exam: BITSAT 2026
   - B.E. (Mechanical Engineering) - BITS Pilani | Fee: ₹5500 | Exam: BITSAT 2026
   - B.Pharm (Honours) - BITS Pilani | Fee: ₹4500 | Exam: BITSAT 2026
   - B.Com (Honours) - Delhi University (DU) | Fee: ₹3000 | Exam: CUET UG 2026
   - B.A. (Honours) Economics - Delhi University (DU) | Fee: ₹3200 | Exam: CUET UG 2026
   - B.Sc. (Honours) Mathematics - Delhi University (DU) | Fee: ₹3400 | Exam: CUET UG 2026
   - IPM Five Year Integrated Programme - IIM Rohtak | Fee: ₹7500 | Exam: IPMAT 2026
   - B.Tech Computer Science / Electrical - IIT Bombay | Fee: ₹6500 / ₹6200 | Exam: JEE Advanced 2026
   - B.Tech IT / B.E. Civil - Anna University | Fee: ₹3500 / ₹3200 | Exam: TNEA Counseling 2026
   - B.Tech AI & ML / BBA FinTech - MAHE Manipal | Fee: ₹4600 / ₹3800 | Exam: MET 2026 / Merit
   - B.Tech Cloud & IoT / B.Arch - SRM Institute | Fee: ₹4200 / ₹4900 | Exam: SRMJEE 2026 / NATA 2026

2. REGISTRATION METHODS:
   - Method 1: Identity Verification (Demo Identity Number & OTP)
   - Method 2: Manual Registration (Email OTP Verification)
   - Method 3: Google Single Sign-On (SSO) Verification

3. EXAM DATES & SLOTS:
   - SITEEE / SET / SLAT 2026: May 05, 2026
   - VITEEE 2026: Apr 21 - Apr 23, 2026
   - BITSAT 2026: May 20 - May 22, 2026
   - CUET UG 2026: May 15 - May 17, 2026
   - IPMAT 2026: May 18 - May 19, 2026
   - JEE Advanced 2026: Jun 04, 2026

4. PAYMENT & DASHBOARD FEATURES:
   - Supports simulated Sandbox payments via UPI (e.g., demo@upi), Cards, and Netbanking.
   - Applicants receive an Application ID (UID) and temporary password.
   - Allows downloading Hall Tickets / Admit Cards and PDF Receipts.
"""

def generate_copilot_response(query: str) -> str:
    q = query.lower()

    if any(k in q for k in ["program", "course", "available", "offer", "what and all"]):
        return (
            "Here are the primary programs available on the SmartRegTech portal:\n\n"
            "• Symbiosis International (Pune): B.Tech CSE (₹4500), BBA Hons (₹3800), B.A. LL.B Hons (₹4200)\n"
            "• VIT: B.Tech CS (₹5000), B.Tech ECE (₹4800), BCA Data Analytics (₹3500)\n"
            "• BITS Pilani: B.E. CS (₹6000), B.E. Mech (₹5500), B.Pharm Hons (₹4500)\n"
            "• Delhi University: B.Com Hons (₹3000), B.A. Eco Hons (₹3200), B.Sc. Math (₹3400)\n"
            "• IIM Rohtak: IPM 5-Year Integrated Programme (₹7500)\n"
            "• IIT Bombay: B.Tech CS (₹6500), B.Tech Electrical (₹6200)\n"
            "• Anna University: B.Tech IT (₹3500), B.E. Civil (₹3200)\n"
            "• MAHE Manipal: B.Tech AI & ML (₹4600), BBA FinTech (₹3800)\n"
            "• SRM Institute: B.Tech Cloud & IoT (₹4200), B.Arch (₹4900)"
        )

    if any(k in q for k in ["exam", "slot", "date", "schedule"]):
        return (
            "Here are the upcoming entrance exam schedules and slots:\n\n"
            "• SITEEE / SET / SLAT 2026: May 05, 2026\n"
            "• VITEEE 2026: Apr 21 – Apr 23, 2026\n"
            "• BITSAT 2026: May 20 – May 22, 2026\n"
            "• CUET UG 2026: May 15 – May 17, 2026\n"
            "• IPMAT 2026: May 18 – May 19, 2026\n"
            "• JEE Advanced 2026: Jun 04, 2026"
        )

    if any(k in q for k in ["verification", "identity", "method", "sso"]):
        return (
            "SmartRegTech provides 3 flexible registration modes:\n"
            "1. Identity Verification (Demo ID & OTP Verification)\n"
            "2. Manual Registration (Email OTP Verification)\n"
            "3. Google SSO (Single Sign-On Verification)"
        )

    if any(k in q for k in ["login", "password", "uid", "resume"]):
        return (
            "Upon verifying your profile, an Application ID (UID) and temporary password "
            "are created automatically. You can use these credentials anytime on the "
            "'Login / Resume' page to continue your application."
        )

    if any(k in q for k in ["payment", "fee", "upi", "card", "pay"]):
        return (
            "We support simulated Sandbox payments via UPI (e.g. demo@upi), "
            "Credit/Debit Cards, and Net Banking. All transactions are simulated for testing purposes."
        )

    if any(k in q for k in ["step", "process", "registration", "how to"]):
        return (
            "The registration workflow follows 6 simple steps:\n"
            "1. Choose Registration Method & Verify Contact/Identity\n"
            "2. Enter Basic Personal Details & Address\n"
            "3. Upload Passport Photo & Documents\n"
            "4. Select Academic Programs & Optional Entrance Exams\n"
            "5. Review Consolidated Application\n"
            "6. Complete Payment & Download Admit Card / Receipt"
        )

    return (
        "I am SmartRegTech Copilot! I can help you with details about our available programs, "
        "fee structures, exam dates, test center options, registration methods, or general academic guidance. "
        "What would you like to know?"
    )


# ============================================================
# HOME
# ============================================================

@app.get("/")
def home():

    return {
        "message": "SmartRegTech Backend is running",
        "status": "success",
        "database": "SQLite",
        "version": "2.0.0"
    }


# ============================================================
# COPILOT AI ASSISTANT ENDPOINT
# ============================================================

@app.post("/api/copilot")
def copilot_chat(data: CopilotQuery):
    answer = generate_copilot_response(data.question)
    return {
        "success": True,
        "question": data.question,
        "answer": answer
    }


# ============================================================
# IDENTITY VERIFICATION
# ============================================================

@app.post("/api/verify")
def verify_identity(data: IdentityRequest):

    # --------------------------------------------------------
    # DEMO ONLY
    # --------------------------------------------------------

    if data.identity_number == "999988887777":

        return {
            "verified": True,
            "name": "Rohan Verma",
            "dob": "2004-06-15",
            "gender": "Male",
            "address": "Chennai, Tamil Nadu",
            "verification_source": "DigiLocker Mock"
        }

    return {
        "verified": False,
        "message": "Invalid demo identity number"
    }


# ============================================================
# REGISTER APPLICATION
# ============================================================

@app.post("/api/register")
def register(data: RegistrationRequest):

    # Generate registration ID
    registration_id = (
        "SR-AI-2026-"
        + str(uuid.uuid4().int)[:5]
    )

    created_at = datetime.now().isoformat()

    connection = get_connection()

    try:

        connection.execute(
            """
            INSERT INTO applications
            (
                registration_id,
                name,
                email,
                phone,
                program,
                identity,
                payment,
                status,
                created_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                registration_id,
                data.name,
                data.email,
                data.phone,
                data.program,
                "Verified",
                "Pending",
                "Pending",
                created_at
            )
        )

        connection.commit()

    finally:

        connection.close()

    application = {
        "registration_id": registration_id,
        "name": data.name,
        "email": data.email,
        "phone": data.phone,
        "program": data.program,
        "identity": "Verified",
        "payment": "Pending",
        "status": "Pending",
        "created_at": created_at
    }

    return {
        "success": True,
        "registration_id": registration_id,
        "application": application
    }


# ============================================================
# COMPLETE PAYMENT
# ============================================================

@app.post("/api/payment/{registration_id}")
def complete_payment(registration_id: str):

    connection = get_connection()

    cursor = connection.execute(
        """
        SELECT *
        FROM applications
        WHERE registration_id = ?
        """,
        (registration_id,)
    )

    application = cursor.fetchone()

    if application is None:

        connection.close()

        return {
            "success": False,
            "message": "Registration not found"
        }

    connection.execute(
        """
        UPDATE applications
        SET
            payment = 'Paid',
            status = 'Successful'
        WHERE registration_id = ?
        """,
        (registration_id,)
    )

    connection.commit()
    connection.close()

    return {
        "success": True,
        "message": "Sandbox payment completed",
        "registration_id": registration_id
    }


# ============================================================
# GET APPLICATIONS
# ============================================================

@app.get("/api/applications")
def get_applications(
    search: Optional[str] = None,
    status: Optional[str] = None
):

    connection = get_connection()

    query = """
        SELECT
            registration_id,
            name,
            email,
            phone,
            program,
            identity,
            payment,
            status,
            created_at
        FROM applications
        WHERE 1 = 1
    """

    parameters = []

    # --------------------------------------------------------
    # SEARCH
    # --------------------------------------------------------

    if search:

        query += """
            AND (
                LOWER(name) LIKE ?
                OR LOWER(registration_id) LIKE ?
                OR LOWER(program) LIKE ?
                OR LOWER(email) LIKE ?
            )
        """

        search_value = f"%{search.lower()}%"

        parameters.extend([
            search_value,
            search_value,
            search_value,
            search_value
        ])

    # --------------------------------------------------------
    # STATUS FILTER
    # --------------------------------------------------------

    if status and status.lower() != "all":

        query += """
            AND LOWER(status) = ?
        """

        parameters.append(status.lower())

    query += """
        ORDER BY id DESC
    """

    rows = connection.execute(
        query,
        parameters
    ).fetchall()

    connection.close()

    applications = [
        dict(row)
        for row in rows
    ]

    return {
        "total": len(applications),
        "applications": applications
    }


# ============================================================
# GET SINGLE APPLICATION
# ============================================================

@app.get("/api/applications/{registration_id}")
def get_application(registration_id: str):

    connection = get_connection()

    row = connection.execute(
        """
        SELECT *
        FROM applications
        WHERE registration_id = ?
        """,
        (registration_id,)
    ).fetchone()

    connection.close()

    if row is None:

        return {
            "success": False,
            "message": "Registration not found"
        }

    return {
        "success": True,
        "application": dict(row)
    }


# ============================================================
# ANALYTICS
# ============================================================

@app.get("/api/analytics")
def analytics():

    connection = get_connection()

    total = connection.execute(
        """
        SELECT COUNT(*)
        FROM applications
        """
    ).fetchone()[0]

    successful = connection.execute(
        """
        SELECT COUNT(*)
        FROM applications
        WHERE status = 'Successful'
        """
    ).fetchone()[0]

    pending = connection.execute(
        """
        SELECT COUNT(*)
        FROM applications
        WHERE status = 'Pending'
        """
    ).fetchone()[0]

    verified = connection.execute(
        """
        SELECT COUNT(*)
        FROM applications
        WHERE identity = 'Verified'
        """
    ).fetchone()[0]

    payments_completed = connection.execute(
        """
        SELECT COUNT(*)
        FROM applications
        WHERE payment = 'Paid'
        """
    ).fetchone()[0]

    connection.close()

    completion_rate = (
        round((successful / total) * 100)
        if total > 0
        else 0
    )

    return {
        "total_applications": total,
        "successful": successful,
        "pending": pending,
        "verified": verified,
        "payments_completed": payments_completed,
        "completion_rate": completion_rate
    }


# ============================================================
# CSV EXPORT
# ============================================================

@app.get("/api/export/csv")
def export_csv():

    connection = get_connection()

    rows = connection.execute(
        """
        SELECT
            registration_id,
            name,
            email,
            phone,
            program,
            identity,
            payment,
            status,
            created_at
        FROM applications
        ORDER BY id DESC
        """
    ).fetchall()

    connection.close()

    # Create CSV in memory
    output = io.StringIO()

    writer = csv.writer(output)

    writer.writerow([
        "Registration ID",
        "Name",
        "Email",
        "Phone",
        "Program",
        "Identity",
        "Payment",
        "Status",
        "Created At"
    ])

    for row in rows:

        writer.writerow([
            row["registration_id"],
            row["name"],
            row["email"],
            row["phone"],
            row["program"],
            row["identity"],
            row["payment"],
            row["status"],
            row["created_at"]
        ])

    output.seek(0)

    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={
            "Content-Disposition":
                "attachment; filename=smartregtech_applications.csv"
        }
    )


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/api/health")
def health():

    connection = get_connection()

    count = connection.execute(
        """
        SELECT COUNT(*)
        FROM applications
        """
    ).fetchone()[0]

    connection.close()

    return {
        "status": "healthy",
        "database": "connected",
        "applications": count
    }