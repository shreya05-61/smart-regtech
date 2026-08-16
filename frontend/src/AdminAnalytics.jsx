import React, { useEffect, useMemo, useState } from "react";
import "./AdminAnalytics.css";

const API_BASE = "https://smart-regtech.onrender.com";

export default function AdminAnalytics() {
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [loading, setLoading] = useState(true);

  const loadApplications = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE}/api/applications`
      );

      const data = await response.json();

      setApplications(data.applications || []);
    } catch (error) {
      console.error("Backend error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const analytics = useMemo(() => {
    const total = applications.length;

    const successful = applications.filter(
      (app) => app.status === "Successful"
    ).length;

    const pending = applications.filter(
      (app) => app.status === "Pending"
    ).length;

    const verified = applications.filter(
      (app) => app.identity === "Verified"
    ).length;

    const payments = applications.filter(
      (app) => app.payment === "Paid"
    ).length;

    return {
      total,
      successful,
      pending,
      verified,
      payments,
    };
  }, [applications]);

  const filteredApplications = useMemo(() => {
    const query = search.toLowerCase();

    return applications.filter((app) => {
      const matchesSearch =
        !query ||
        app.name?.toLowerCase().includes(query) ||
        app.registration_id?.toLowerCase().includes(query) ||
        app.program?.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All Statuses" ||
        app.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applications, search, statusFilter]);

  const percentage = (value) => {
    if (analytics.total === 0) return 0;

    return Math.round(
      (value / analytics.total) * 100
    );
  };

  const exportCSV = () => {
    if (!applications.length) return;

    const headers = [
      "Registration ID",
      "Name",
      "Email",
      "Phone",
      "Program",
      "Identity",
      "Payment",
      "Status",
      "Created At",
    ];

    const rows = applications.map((app) => [
      app.registration_id || "",
      app.name || "",
      app.email || "",
      app.phone || "",
      app.program || "",
      app.identity || "",
      app.payment || "",
      app.status || "",
      app.created_at || "",
    ]);

    const csv = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map(
            (value) =>
              `"${String(value).replace(/"/g, '""')}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "smartregtech_applications.csv";

    link.click();

    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <h2>Loading Admin Dashboard...</h2>
        <p>Connecting to SmartRegTech backend</p>
      </div>
    );
  }

  return (
    <div className="admin-page">

      {/* HEADER */}

      <div className="admin-header">

        <div>
          <div className="admin-label">
            ADMIN ANALYTICS
          </div>

          <h1>
            Registration Overview
          </h1>

          <p>
            Monitor applications, verification and
            payment activity from one dashboard.
          </p>
        </div>

        <button
          className="export-button"
          onClick={exportCSV}
        >
          ↓ Export CSV
        </button>

      </div>


      {/* KPI CARDS */}

      <div className="kpi-grid">

        <KpiCard
          icon="👥"
          title="Total Applications"
          value={analytics.total}
          subtitle="All time"
          type="purple"
        />

        <KpiCard
          icon="✓"
          title="Successful"
          value={analytics.successful}
          subtitle={`${percentage(
            analytics.successful
          )}% of total`}
          type="green"
        />

        <KpiCard
          icon="⌛"
          title="Pending"
          value={analytics.pending}
          subtitle={`${percentage(
            analytics.pending
          )}% of total`}
          type="orange"
        />

        <KpiCard
          icon="♙"
          title="Verified"
          value={analytics.verified}
          subtitle={`${percentage(
            analytics.verified
          )}% of total`}
          type="blue"
        />

        <KpiCard
          icon="▣"
          title="Payments Completed"
          value={analytics.payments}
          subtitle={`${percentage(
            analytics.payments
          )}% of total`}
          type="pink"
        />

      </div>


      {/* MAIN ANALYTICS */}

      <div className="analytics-grid">


        {/* APPLICATION STATUS */}

        <div className="analytics-card">

          <div className="card-title">
            <h2>Application Status</h2>

            <p>
              Successful vs pending registrations.
            </p>
          </div>


          <div className="status-content">

            {/* DONUT */}

            <div
              className="status-donut"
              style={{
                background:
                  analytics.total === 0
                    ? "#27334c"
                    : `conic-gradient(
                        #8b5cf6 0% ${percentage(
                          analytics.successful
                        )}%,
                        #f59e0b ${percentage(
                          analytics.successful
                        )}% 100%
                      )`,
              }}
            >

              <div className="donut-center">

                <strong>
                  {analytics.total}
                </strong>

                <span>Total</span>

              </div>

            </div>


            {/* LEGEND */}

            <div className="status-legend">

              <div className="legend-row">

                <span className="legend-color purple"></span>

                <div>
                  <strong>Successful</strong>
                  <small>
                    {analytics.successful} (
                    {percentage(
                      analytics.successful
                    )}
                    %)
                  </small>
                </div>

              </div>


              <div className="legend-row">

                <span className="legend-color orange"></span>

                <div>
                  <strong>Pending</strong>
                  <small>
                    {analytics.pending} (
                    {percentage(
                      analytics.pending
                    )}
                    %)
                  </small>
                </div>

              </div>

            </div>

          </div>

        </div>


        {/* VERIFICATION & PAYMENT */}

        <div className="analytics-card">

          <div className="card-title">

            <h2>
              Verification & Payment
            </h2>

            <p>
              Current processing status.
            </p>

          </div>


          <div className="progress-list">

            <ProgressItem
              icon="♙"
              title="Verified Identities"
              value={analytics.verified}
              percentage={percentage(
                analytics.verified
              )}
              type="blue"
            />


            <ProgressItem
              icon="▣"
              title="Payments Completed"
              value={analytics.payments}
              percentage={percentage(
                analytics.payments
              )}
              type="pink"
            />


            <ProgressItem
              icon="✓"
              title="Successful Applications"
              value={analytics.successful}
              percentage={percentage(
                analytics.successful
              )}
              type="green"
            />

          </div>

        </div>

      </div>


      {/* PROGRAM */}

      <div className="analytics-card program-card">

        <div className="card-title">

          <h2>
            Applications by Program
          </h2>

          <p>
            Number of registrations for each program.
          </p>

        </div>


        <div className="program-list">

          {Object.entries(
            applications.reduce((acc, app) => {
              const program =
                app.program || "Unknown";

              acc[program] =
                (acc[program] || 0) + 1;

              return acc;
            }, {})
          ).map(([program, count]) => (

            <div
              className="program-row"
              key={program}
            >

              <span className="program-name">
                {program}
              </span>

              <div className="program-bar">

                <div
                  className="program-bar-fill"
                  style={{
                    width: `${Math.max(
                      count * 100,
                      20
                    )}%`,
                  }}
                />

              </div>

              <strong>
                {count}
              </strong>

            </div>

          ))}

        </div>

      </div>


      {/* APPLICATION TABLE */}

      <div className="applications-card">

        <div className="applications-header">

          <div>

            <h2>
              Applications
            </h2>

            <p>
              Search and filter registration records.
            </p>

          </div>

          <button
            className="refresh-button"
            onClick={loadApplications}
          >
            ↻ Refresh
          </button>

        </div>


        <div className="filters">

          <input
            type="text"
            placeholder="Search by name, ID or program..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >

            <option>
              All Statuses
            </option>

            <option>
              Successful
            </option>

            <option>
              Pending
            </option>

          </select>

        </div>


        <div className="table-wrapper">

          <table>

            <thead>

              <tr>

                <th>REGISTRATION ID</th>
                <th>APPLICANT</th>
                <th>PROGRAM</th>
                <th>IDENTITY</th>
                <th>PAYMENT</th>
                <th>STATUS</th>

              </tr>

            </thead>


            <tbody>

              {filteredApplications.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
                    className="empty-row"
                  >
                    No applications found.
                  </td>

                </tr>

              ) : (

                filteredApplications.map((app) => (

                  <tr key={app.registration_id}>

                    <td className="registration-id">
                      {app.registration_id}
                    </td>

                    <td>
                      {app.name}
                    </td>

                    <td>
                      {app.program}
                    </td>

                    <td>
                      <Badge
                        value={app.identity}
                      />
                    </td>

                    <td>
                      <Badge
                        value={app.payment}
                      />
                    </td>

                    <td>
                      <Badge
                        value={app.status}
                      />
                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* FOOTER */}

      <div className="prototype-note">

        <strong>
          Prototype / Demo Dashboard
        </strong>

        <span>
          Registration records are retrieved directly
          from the SmartRegTech FastAPI backend.
          DigiLocker and payment integrations are
          simulated for demonstration purposes.
        </span>

      </div>

    </div>
  );
}


/* KPI CARD */

function KpiCard({
  icon,
  title,
  value,
  subtitle,
  type,
}) {
  return (
    <div className="kpi-card">

      <div className={`kpi-icon ${type}`}>
        {icon}
      </div>

      <div className="kpi-content">

        <span>{title}</span>

        <strong>{value}</strong>

        <small>{subtitle}</small>

      </div>

    </div>
  );
}


/* PROGRESS ITEM */

function ProgressItem({
  icon,
  title,
  value,
  percentage,
  type,
}) {
  return (
    <div className="progress-item">

      <div className={`progress-icon ${type}`}>
        {icon}
      </div>

      <div className="progress-main">

        <div className="progress-heading">

          <strong>
            {title}
          </strong>

          <span>
            {value} ({percentage}%)
          </span>

        </div>

        <div className="progress-track">

          <div
            className={`progress-fill ${type}`}
            style={{
              width: `${percentage}%`,
            }}
          />

        </div>

      </div>

    </div>
  );
}


/* BADGE */

function Badge({ value }) {

  const positive =
    value === "Verified" ||
    value === "Paid" ||
    value === "Successful";

  return (
    <span
      className={
        positive
          ? "badge positive"
          : "badge pending"
      }
    >
      {positive ? "✓" : "•"} {value}
    </span>
  );
}