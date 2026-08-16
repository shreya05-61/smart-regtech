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