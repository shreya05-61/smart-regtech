import { useState, useEffect } from "react";
import "./AdminAnalytics.css";

const COURSE_CATALOG = {
  "SIU-BTECH-CS": "B.Tech (Computer Science & Engineering) - Symbiosis",
  "SIU-BBA": "BBA (Honours) - Symbiosis",
  "SIU-BALLB": "B.A. LL.B (Honours) - Symbiosis",
  "VIT-BTECH-CS": "B.Tech (Computer Science) - VIT",
  "VIT-BTECH-EC": "B.Tech (Electronics & Communication) - VIT",
  "VIT-BCA": "BCA (Data Analytics) - VIT",
  "BITS-BE-CS": "B.E. (Computer Science) - BITS Pilani",
  "BITS-BE-MECH": "B.E. (Mechanical Engineering) - BITS Pilani",
  "BITS-BPHARM": "B.Pharm (Honours) - BITS Pilani",
  "DU-BCOM": "B.Com (Honours) - Delhi University",
  "DU-BA-ECO": "B.A. (Honours) Economics - Delhi University",
  "IIM-IPM": "Integrated Programme in Management - IIM Rohtak"
};

const COURSE_PRICES = {
  "SIU-BTECH-CS": 1500,
  "SIU-BBA": 1000,
  "SIU-BALLB": 1200,
  "VIT-BTECH-CS": 1350,
  "VIT-BTECH-EC": 1350,
  "VIT-BCA": 900,
  "BITS-BE-CS": 2000,
  "BITS-BE-MECH": 2000,
  "BITS-BPHARM": 1500,
  "DU-BCOM": 800,
  "DU-BA-ECO": 800,
  "IIM-IPM": 2500
};

export default function AdminAnalytics() {
  const [applications, setApplications] = useState([]);
  const [rawUserData, setRawUserData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [dateRangeFilter, setDateRangeFilter] = useState("all");
  const [activeReportTab, setActiveReportTab] = useState("course");
  const [showInspectorModal, setShowInspectorModal] = useState(false);

  useEffect(() => {
    loadLiveData();
    window.addEventListener("storage", loadLiveData);
    return () => window.removeEventListener("storage", loadLiveData);
  }, []);

  const loadLiveData = () => {
    try {
      const savedData = localStorage.getItem("smartRegUsers");
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        if (Array.isArray(parsedData)) {
          setRawUserData(parsedData);
          const formatted = parsedData.map((user) => {
            let status = "Incomplete";
            let paymentStatus = "—";

            if (user.highestStepIndex >= 5) {
              status = "Completed";
              paymentStatus = "Paid";
            } else if (user.highestStepIndex === 4) {
              status = "Pending Payment";
            }

            const programDisplay =
              user.cart && user.cart.length > 0
                ? user.cart.map((id) => COURSE_CATALOG[id] || id).join(", ")
                : "No programs selected";

            // Maintain null if user.createdAt does not exist to avoid defaulting to today
            const timestamp = user.createdAt ? new Date(user.createdAt) : null;

            return {
              id: user.uid || `APP-${Math.floor(100000 + Math.random() * 900000)}`,
              name: user.verifiedProfile?.name || "Anonymous Applicant",
              program: programDisplay,
              identity: user.verifiedProfile ? "Verified" : "Pending",
              payment: paymentStatus,
              status: status,
              rawCart: user.cart || [],
              board: user.verifiedProfile?.board || user.examBoard || "General Entry",
              stepIndex: user.highestStepIndex || 0,
              timestamp: timestamp,
              dateStr: timestamp ? timestamp.toISOString().split("T")[0] : "Earlier Record"
            };
          });
          setApplications(formatted.reverse());
        }
      } else {
        setApplications([]);
        setRawUserData([]);
      }
    } catch (error) {
      console.error("Error loading live Admin Data", error);
    }
  };

  const clearOldTestData = () => {
    if (window.confirm("Are you sure you want to clear all live registration records?")) {
      localStorage.removeItem("smartRegUsers");
      setApplications([]);
      setRawUserData([]);
    }
  };

  // Fixed Date Filtering Logic
  const isWithinDateRange = (appTimestamp) => {
    if (dateRangeFilter === "all") return true;
    if (!appTimestamp) return false;

    const now = new Date();
    const appDate = new Date(appTimestamp);

    if (dateRangeFilter === "today") {
      return appDate.toDateString() === now.toDateString();
    }

    const diffTime = now - appDate;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (dateRangeFilter === "7days") return diffDays >= 0 && diffDays <= 7;
    if (dateRangeFilter === "30days") return diffDays >= 0 && diffDays <= 30;
    return true;
  };

  const filteredApplications = applications.filter((app) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = query === "" || (app.name && app.name.toLowerCase().startsWith(query));
    const matchesStatus = statusFilter === "All Statuses" || app.status === statusFilter;
    const matchesDate = isWithinDateRange(app.timestamp);
    return matchesSearch && matchesStatus && matchesDate;
  });

  // CSV Export Handler
  const exportToCSV = () => {
    if (filteredApplications.length === 0) {
      alert("No applicant data available to export.");
      return;
    }

    const headers = ["Registration ID", "Name", "Board/Exam", "Programs", "Identity Status", "Payment Status", "Application Status", "Date"];
    const rows = filteredApplications.map((app) => [
      `"${app.id}"`,
      `"${app.name}"`,
      `"${app.board}"`,
      `"${app.program.replace(/"/g, '""')}"`,
      `"${app.identity}"`,
      `"${app.payment}"`,
      `"${app.status}"`,
      `"${app.dateStr}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Registration_Report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Dynamic Metrics Calculation based on filteredApplications
  const totalApps = filteredApplications.length;
  const verifiedIds = filteredApplications.filter((a) => a.identity === "Verified").length;
  const paidRegs = filteredApplications.filter((a) => a.payment === "Paid").length;
  const pendingPaymentRegs = filteredApplications.filter((a) => a.status === "Pending Payment").length;

  const verificationRate = totalApps > 0 ? Math.round((verifiedIds / totalApps) * 100) : 0;
  const paymentRate = totalApps > 0 ? Math.round((paidRegs / totalApps) * 100) : 0;

  const funnelStages = {
    registered: totalApps,
    verified: verifiedIds,
    formFilled: filteredApplications.filter((a) => a.stepIndex >= 3).length,
    courseSelected: filteredApplications.filter((a) => a.rawCart && a.rawCart.length > 0).length,
    paid: paidRegs
  };

  // Aggregations based on filtered dataset
  const dayWiseMap = {};
  filteredApplications.forEach((app) => {
    const date = app.dateStr;
    if (!dayWiseMap[date]) {
      dayWiseMap[date] = { total: 0, verified: 0, paid: 0, revenue: 0 };
    }
    dayWiseMap[date].total += 1;
    if (app.identity === "Verified") dayWiseMap[date].verified += 1;
    if (app.payment === "Paid") {
      dayWiseMap[date].paid += 1;
      const appRev = app.rawCart.reduce((sum, code) => sum + (COURSE_PRICES[code] || 1000), 0);
      dayWiseMap[date].revenue += appRev;
    }
  });

  const courseWiseMap = {};
  filteredApplications.forEach((app) => {
    app.rawCart.forEach((code) => {
      const courseName = COURSE_CATALOG[code] || code;
      const price = COURSE_PRICES[code] || 1000;
      if (!courseWiseMap[courseName]) {
        courseWiseMap[courseName] = { count: 0, paidCount: 0, totalRevenue: 0 };
      }
      courseWiseMap[courseName].count += 1;
      if (app.payment === "Paid") {
        courseWiseMap[courseName].paidCount += 1;
        courseWiseMap[courseName].totalRevenue += price;
      }
    });
  });

  const examWiseMap = {};
  filteredApplications.forEach((app) => {
    const board = app.board;
    if (!examWiseMap[board]) {
      examWiseMap[board] = { total: 0, verified: 0, paid: 0 };
    }
    examWiseMap[board].total += 1;
    if (app.identity === "Verified") examWiseMap[board].verified += 1;
    if (app.payment === "Paid") examWiseMap[board].paid += 1;
  });

  const totalRevenue = Object.values(courseWiseMap).reduce((acc, c) => acc + c.totalRevenue, 0);

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="admin-header">
        <div>
          <div className="admin-label">SYSTEM METRICS</div>
          <h1>Admin Control Center</h1>
          <p>Live candidate funnel tracking, verification analytics, and payment insights.</p>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          <button className="export-button" onClick={exportToCSV} style={{ background: "rgba(34, 197, 94, 0.15)", borderColor: "#22c55e", color: "#4ade80" }}>
            📥 Export CSV
          </button>
          <button className="export-button" onClick={() => setShowInspectorModal(true)}>
            🔍 View Data
          </button>
          <button className="export-button" onClick={clearOldTestData} style={{ borderColor: "#ef4444", color: "#ef4444" }}>
            🗑 Clear
          </button>
          <button className="refresh-button" onClick={loadLiveData}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Date Filter & Quick Alerts Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px", marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "13px", color: "#8190af", fontWeight: "bold" }}>Filter Timeline:</span>
          <select value={dateRangeFilter} onChange={(e) => setDateRangeFilter(e.target.value)} style={{ padding: "8px 12px", borderRadius: "8px", background: "#0b1120", border: "1px solid #2d3953", color: "#fff", fontSize: "13px" }}>
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
          </select>
        </div>

        {pendingPaymentRegs > 0 && (
          <div style={{ background: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.3)", padding: "8px 16px", borderRadius: "8px", color: "#fbbf24", fontSize: "13px", fontWeight: "600" }}>
            ⚠️ Action Required: {pendingPaymentRegs} candidates are pending payment completion.
          </div>
        )}
      </div>

      {/* Primary KPI Summary Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon">📋</div>
          <div className="kpi-content">
            <span>TOTAL REGISTERED</span>
            <strong>{funnelStages.registered}</strong>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon verified">🛡️</div>
          <div className="kpi-content">
            <span>VERIFIED IDENTITIES</span>
            <strong>{funnelStages.verified}</strong>
            <small>({verificationRate}%)</small>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon pending">📝</div>
          <div className="kpi-content">
            <span>FORMS FILLED</span>
            <strong>{funnelStages.formFilled}</strong>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon success">💳</div>
          <div className="kpi-content">
            <span>PAID CANDIDATES</span>
            <strong>{funnelStages.paid}</strong>
            <small>({paymentRate}%)</small>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon payment">💰</div>
          <div className="kpi-content">
            <span>TOTAL REVENUE</span>
            <strong>₹{totalRevenue.toLocaleString("en-IN")}</strong>
          </div>
        </div>
      </div>

      {/* Candidate Movement & Pipeline Funnel */}
      <div className="analytics-card" style={{ marginBottom: "20px" }}>
        <div className="card-header">
          <div>
            <h2>Candidate Movement & Funnel Analytics</h2>
            <p>Conversion metrics across registration and verification steps.</p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "15px", marginTop: "20px" }}>
          <div style={{ background: "rgba(15, 23, 42, 0.6)", padding: "16px", borderRadius: "12px", border: "1px solid #2d3953" }}>
            <span style={{ fontSize: "11px", color: "#8190af", textTransform: "uppercase", fontWeight: "700" }}>Stage 1: Initial Signup</span>
            <div style={{ fontSize: "24px", fontWeight: "800", color: "#fff", margin: "6px 0" }}>{funnelStages.registered}</div>
            <div className="progress-track" style={{ marginTop: "8px" }}><div className="progress-fill" style={{ width: "100%" }}></div></div>
          </div>

          <div style={{ background: "rgba(15, 23, 42, 0.6)", padding: "16px", borderRadius: "12px", border: "1px solid #2d3953" }}>
            <span style={{ fontSize: "11px", color: "#8190af", textTransform: "uppercase", fontWeight: "700" }}>Stage 2: Identity Verified</span>
            <div style={{ fontSize: "24px", fontWeight: "800", color: "#4ade80", margin: "6px 0" }}>{funnelStages.verified}</div>
            <div className="progress-track" style={{ marginTop: "8px" }}><div className="progress-fill" style={{ width: `${verificationRate}%` }}></div></div>
          </div>

          <div style={{ background: "rgba(15, 23, 42, 0.6)", padding: "16px", borderRadius: "12px", border: "1px solid #2d3953" }}>
            <span style={{ fontSize: "11px", color: "#8190af", textTransform: "uppercase", fontWeight: "700" }}>Stage 3: Form Details Filled</span>
            <div style={{ fontSize: "24px", fontWeight: "800", color: "#818cf8", margin: "6px 0" }}>{funnelStages.formFilled}</div>
            <div className="progress-track" style={{ marginTop: "8px" }}><div className="progress-fill" style={{ width: `${totalApps > 0 ? Math.round((funnelStages.formFilled / totalApps) * 100) : 0}%` }}></div></div>
          </div>

          <div style={{ background: "rgba(15, 23, 42, 0.6)", padding: "16px", borderRadius: "12px", border: "1px solid #2d3953" }}>
            <span style={{ fontSize: "11px", color: "#8190af", textTransform: "uppercase", fontWeight: "700" }}>Stage 4: Course Selected</span>
            <div style={{ fontSize: "24px", fontWeight: "800", color: "#c084fc", margin: "6px 0" }}>{funnelStages.courseSelected}</div>
            <div className="progress-track" style={{ marginTop: "8px" }}><div className="progress-fill" style={{ width: `${totalApps > 0 ? Math.round((funnelStages.courseSelected / totalApps) * 100) : 0}%` }}></div></div>
          </div>

          <div style={{ background: "rgba(15, 23, 42, 0.6)", padding: "16px", borderRadius: "12px", border: "1px solid #2d3953" }}>
            <span style={{ fontSize: "11px", color: "#8190af", textTransform: "uppercase", fontWeight: "700" }}>Stage 5: Exam & Fee Paid</span>
            <div style={{ fontSize: "24px", fontWeight: "800", color: "#38bdf8", margin: "6px 0" }}>{funnelStages.paid}</div>
            <div className="progress-track" style={{ marginTop: "8px" }}><div className="progress-fill" style={{ width: `${paymentRate}%` }}></div></div>
          </div>
        </div>
      </div>

      {/* Reports Breakdown */}
      <div className="analytics-card" style={{ marginBottom: "20px" }}>
        <div className="card-header" style={{ borderBottom: "1px solid #26324a", paddingBottom: "16px", marginBottom: "20px" }}>
          <div>
            <h2>Detailed Reports & Analytics Breakdown</h2>
            <p>Group candidate performance by Course, Qualifying Exam / Board, or Registration Day.</p>
          </div>
          
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => setActiveReportTab("course")}
              className="export-button"
              style={{ background: activeReportTab === "course" ? "rgba(108, 76, 255, 0.35)" : "transparent" }}
            >
              📚 Course-Wise
            </button>
            <button
              onClick={() => setActiveReportTab("exam")}
              className="export-button"
              style={{ background: activeReportTab === "exam" ? "rgba(108, 76, 255, 0.35)" : "transparent" }}
            >
              🏫 Exam / Board-Wise
            </button>
            <button
              onClick={() => setActiveReportTab("day")}
              className="export-button"
              style={{ background: activeReportTab === "day" ? "rgba(108, 76, 255, 0.35)" : "transparent" }}
            >
              📅 Day-Wise
            </button>
          </div>
        </div>

        {activeReportTab === "course" && (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>COURSE / PROGRAM NAME</th>
                  <th>SELECTED CANDIDATES</th>
                  <th>PAID REGISTRATIONS</th>
                  <th>ESTIMATED REVENUE</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(courseWiseMap).length === 0 ? (
                  <tr><td colSpan="4" className="table-message">No course selections recorded yet.</td></tr>
                ) : (
                  Object.entries(courseWiseMap).map(([name, stat], idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: "700", color: "#f8fafc" }}>{name}</td>
                      <td>{stat.count} candidates</td>
                      <td>
                        <span className="status-badge paid-badge">{stat.paidCount} Paid</span>
                      </td>
                      <td style={{ fontWeight: "700", color: "#4ade80" }}>₹{stat.totalRevenue.toLocaleString("en-IN")}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeReportTab === "exam" && (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>QUALIFYING EXAM / BOARD</th>
                  <th>TOTAL CANDIDATES</th>
                  <th>VERIFIED STATUS</th>
                  <th>PAYMENT CONVERTED</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(examWiseMap).length === 0 ? (
                  <tr><td colSpan="4" className="table-message">No exam details recorded yet.</td></tr>
                ) : (
                  Object.entries(examWiseMap).map(([board, stat], idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: "700", color: "#f8fafc" }}>{board}</td>
                      <td>{stat.total} candidates</td>
                      <td>
                        <span className="status-badge verified-badge">{stat.verified} Verified</span>
                      </td>
                      <td>
                        <span className="status-badge success-badge">{stat.paid} Completed</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeReportTab === "day" && (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>DATE</th>
                  <th>NEW REGISTRATIONS</th>
                  <th>VERIFIED CANDIDATES</th>
                  <th>PAID APPLICATIONS</th>
                  <th>DAILY REVENUE</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(dayWiseMap).length === 0 ? (
                  <tr><td colSpan="5" className="table-message">No day-wise entries available yet.</td></tr>
                ) : (
                  Object.entries(dayWiseMap).map(([date, stat], idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: "700", color: "#818cf8" }}>{date}</td>
                      <td>{stat.total} applicants</td>
                      <td>{stat.verified} verified</td>
                      <td>
                        <span className="status-badge paid-badge">{stat.paid} Paid</span>
                      </td>
                      <td style={{ fontWeight: "700", color: "#4ade80" }}>₹{stat.revenue.toLocaleString("en-IN")}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Live Applicants Master Table */}
      <div className="applications-card">
        <div className="applications-header">
          <div>
            <h2>Registered Applicants Master List</h2>
            <p>Filter, inspect, and manage individual student records in real time.</p>
          </div>
        </div>

        <div className="filters">
          <input
            type="text"
            placeholder="Prefix search by applicant name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All Statuses">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Pending Payment">Pending Payment</option>
            <option value="Incomplete">Incomplete</option>
          </select>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>REGISTRATION ID</th>
                <th>APPLICANT NAME</th>
                <th>BOARD / EXAM</th>
                <th>PROGRAM ENROLLED</th>
                <th>IDENTITY STATUS</th>
                <th>APPLICATION STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan="6" className="table-message">
                    <div style={{ fontSize: "32px", marginBottom: "10px" }}>📭</div>
                    {searchQuery
                      ? `No applicant name starts with "${searchQuery}"`
                      : "No live registrations found matching selected criteria!"}
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app, index) => (
                  <tr key={index}>
                    <td className="registration-id">{app.id}</td>
                    <td style={{ fontWeight: "600", color: "#f8fafc" }}>{app.name}</td>
                    <td style={{ color: "#94a3b8" }}>{app.board}</td>
                    <td style={{ maxWidth: "260px", overflow: "hidden", textOverflow: "ellipsis", color: "#cbd5e1" }} title={app.program}>
                      {app.program}
                    </td>
                    <td>
                      <span className={`status-badge ${app.identity === "Verified" ? "verified-badge" : "pending-badge"}`}>
                        {app.identity === "Verified" ? "✓ Verified" : "⏳ Pending"}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${
                          app.status === "Completed"
                            ? "success-badge"
                            : app.status === "Pending Payment"
                            ? "pending-badge"
                            : ""
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspector Modal */}
      {showInspectorModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.85)",
            zIndex: 999999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px"
          }}
        >
          <div
            style={{
              background: "#0a1124",
              width: "100%",
              maxWidth: "700px",
              maxHeight: "85vh",
              borderRadius: "16px",
              border: "1px solid #3b486d",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden"
            }}
          >
            <div
              style={{
                padding: "20px 24px",
                borderBottom: "1px solid #293c5c",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "rgba(0,0,0,0.3)"
              }}
            >
              <div>
                <h3 style={{ margin: 0, color: "#fff", fontSize: "18px" }}>📥 DigiLocker & Backend Retrieved Data</h3>
                <p style={{ margin: "4px 0 0 0", color: "#8a9fc2", fontSize: "12px" }}>
                  Parsed session profiles and verified document payloads.
                </p>
              </div>
              <button
                onClick={() => setShowInspectorModal(false)}
                style={{ background: "none", border: "none", color: "#fff", fontSize: "24px", cursor: "pointer" }}
              >
                ×
              </button>
            </div>

            <div style={{ padding: "24px", overflowY: "auto", flex: 1, background: "#060a12", display: "flex", flexDirection: "column", gap: "20px" }}>
              {rawUserData.length === 0 ? (
                <div style={{ textAlign: "center", color: "#8a9fc2", padding: "40px" }}>
                  <div style={{ fontSize: "32px", marginBottom: "10px" }}>📭</div>
                  No active session records found. Complete a registration flow in the portal to inspect retrieved data packets.
                </div>
              ) : (
                rawUserData.map((user, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "12px",
                      padding: "18px"
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "12px",
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                        paddingBottom: "8px"
                      }}
                    >
                      <span style={{ fontFamily: "monospace", color: "#818cf8", fontWeight: "bold" }}>UID: {user.uid}</span>
                      <span
                        style={{
                          padding: "4px 10px",
                          borderRadius: "9999px",
                          fontSize: "11px",
                          fontWeight: "600",
                          background: "rgba(34, 197, 94, 0.15)",
                          color: "#4ade80"
                        }}
                      >
                        ✓ Secure Sandbox Sync
                      </span>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "13px" }}>
                      <div>
                        <span style={{ color: "#64748b", display: "block", fontSize: "11px", fontWeight: "bold" }}>FULL NAME</span>
                        <strong style={{ color: "#fff" }}>{user.verifiedProfile?.name || "—"}</strong>
                      </div>
                      <div>
                        <span style={{ color: "#64748b", display: "block", fontSize: "11px", fontWeight: "bold" }}>DATE OF BIRTH</span>
                        <strong style={{ color: "#fff" }}>{user.verifiedProfile?.dob || "—"}</strong>
                      </div>
                      <div>
                        <span style={{ color: "#64748b", display: "block", fontSize: "11px", fontWeight: "bold" }}>EDUCATIONAL BOARD</span>
                        <strong style={{ color: "#fff" }}>{user.verifiedProfile?.board || "—"}</strong>
                      </div>
                      <div>
                        <span style={{ color: "#64748b", display: "block", fontSize: "11px", fontWeight: "bold" }}>DOCUMENT STATUS</span>
                        <strong style={{ color: "#4ade80" }}>{user.verifiedProfile?.documentStatus || "Verified"}</strong>
                      </div>
                    </div>

                    <div style={{ marginTop: "12px", paddingTop: "10px", borderTop: "1px dashed rgba(255,255,255,0.05)" }}>
                      <span style={{ color: "#64748b", display: "block", fontSize: "11px", fontWeight: "bold", marginBottom: "4px" }}>
                        SELECTED PROGRAMS CART
                      </span>
                      <div style={{ color: "#cbd5e1", fontSize: "13px" }}>
                        {user.cart && user.cart.length > 0 ? user.cart.join(", ") : "No courses selected"}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div
              style={{
                padding: "16px 24px",
                borderTop: "1px solid #293c5c",
                background: "rgba(0,0,0,0.3)",
                display: "flex",
                justifyContent: "flex-end"
              }}
            >
              <button
                onClick={() => setShowInspectorModal(false)}
                style={{
                  background: "#6c4cff",
                  border: "none",
                  color: "#fff",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}