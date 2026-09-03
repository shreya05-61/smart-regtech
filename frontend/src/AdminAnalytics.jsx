import { useState, useEffect } from "react";

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

export default function AdminAnalytics() {
  const [applications, setApplications] = useState([]);
  const [rawUserData, setRawUserData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [showInspectorModal, setShowInspectorModal] = useState(false);

  useEffect(() => {
    loadLiveData();
    window.addEventListener('storage', loadLiveData);
    return () => window.removeEventListener('storage', loadLiveData);
  }, []);

  const loadLiveData = () => {
    try {
      const savedData = localStorage.getItem("smartRegUsers");
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        if (Array.isArray(parsedData)) {
          setRawUserData(parsedData);
          const formatted = parsedData.map(user => {
            let status = "Incomplete";
            let paymentStatus = "—";
            
            if (user.highestStepIndex >= 5) {
              status = "Completed";
              paymentStatus = "Paid";
            } else if (user.highestStepIndex === 4) {
              status = "Pending Payment";
            }

            const programDisplay = user.cart && user.cart.length > 0 
              ? user.cart.map(id => COURSE_CATALOG[id] || id).join(", ") 
              : "No programs selected";

            return {
              id: user.uid || `APP-${Math.floor(100000 + Math.random() * 900000)}`,
              name: user.verifiedProfile?.name || "Anonymous Applicant",
              program: programDisplay,
              identity: user.verifiedProfile ? "Verified" : "Pending",
              payment: paymentStatus,
              status: status
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

  const filteredApplications = applications.filter((app) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = query === "" || (app.name && app.name.toLowerCase().startsWith(query));
    const matchesStatus = statusFilter === "All Statuses" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalApps = applications.length;
  const verifiedIds = applications.filter(a => a.identity === "Verified").length;
  const completedRegs = applications.filter(a => a.status === "Completed").length;

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', background: '#090d16', minHeight: '100vh', padding: '40px', color: '#f8fafc', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '40px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h1 style={{ fontSize: '36px', fontWeight: '800', margin: '0 0 8px 0', color: '#fff' }}>
              Admin Control Center
            </h1>
            <p style={{ color: '#94a3b8', margin: 0, fontSize: '15px' }}>
              Live monitoring of registrations, verifications, and secure payments.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <button 
              onClick={() => setShowInspectorModal(true)}
              style={{ background: 'rgba(108, 76, 255, 0.15)', border: '1px solid rgba(108, 76, 255, 0.4)', color: '#b99cff', padding: '9px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              🔍 View Retrieved Data
            </button>
            
            <button 
              onClick={clearOldTestData}
              style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '9px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              🗑️ Clear Data
            </button>
            
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '9px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', background: '#34d399', borderRadius: '50%', display: 'inline-block' }}></span>
              SYSTEM LIVE
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '40px' }}>
          <div style={{ background: 'rgba(30, 41, 59, 0.4)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '54px', height: '54px', borderRadius: '14px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>📋</div>
            <div>
              <div style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '700', letterSpacing: '1px', marginBottom: '4px' }}>TOTAL APPLICATIONS</div>
              <div style={{ fontSize: '36px', fontWeight: '800', color: '#fff' }}>{totalApps}</div>
            </div>
          </div>

          <div style={{ background: 'rgba(30, 41, 59, 0.4)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '54px', height: '54px', borderRadius: '14px', background: 'rgba(34, 197, 94, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>🛡️</div>
            <div>
              <div style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '700', letterSpacing: '1px', marginBottom: '4px' }}>VERIFIED IDENTITIES</div>
              <div style={{ fontSize: '36px', fontWeight: '800', color: '#4ade80' }}>{verifiedIds}</div>
            </div>
          </div>

          <div style={{ background: 'rgba(30, 41, 59, 0.4)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '54px', height: '54px', borderRadius: '14px', background: 'rgba(192, 132, 252, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>💳</div>
            <div>
              <div style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '700', letterSpacing: '1px', marginBottom: '4px' }}>COMPLETED REGISTRATIONS</div>
              <div style={{ fontSize: '36px', fontWeight: '800', color: '#c084fc' }}>{completedRegs}</div>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div style={{ background: 'rgba(30, 41, 59, 0.4)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden' }}>
          
          <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '16px', flexWrap: 'wrap', background: 'rgba(0,0,0,0.2)' }}>
            <div style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
              <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>🔍</span>
              <input 
                type="text" 
                placeholder="Prefix search by applicant name..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} 
                style={{ width: '100%', padding: '14px 16px 14px 44px', borderRadius: '10px', fontSize: '14px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(148, 163, 184, 0.2)', color: '#f8fafc', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ padding: '14px 20px', borderRadius: '10px', minWidth: '200px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(148, 163, 184, 0.2)', color: '#f8fafc', outline: 'none' }}
            >
              <option value="All Statuses">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Pending Payment">Pending Payment</option>
              <option value="Incomplete">Incomplete</option>
            </select>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', whiteSpace: 'nowrap' }}>
              <thead>
                <tr style={{ background: 'rgba(0,0,0,0.3)', color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  <th style={{ padding: '18px 24px', fontWeight: '700' }}>Registration ID</th>
                  <th style={{ padding: '18px 24px', fontWeight: '700' }}>Applicant Name</th>
                  <th style={{ padding: '18px 24px', fontWeight: '700', maxWidth: '300px' }}>Program Enrolled</th>
                  <th style={{ padding: '18px 24px', fontWeight: '700' }}>Identity Status</th>
                  <th style={{ padding: '18px 24px', fontWeight: '700' }}>Payment</th>
                  <th style={{ padding: '18px 24px', fontWeight: '700' }}>Application Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#64748b', fontSize: '15px' }}>
                      <div style={{ fontSize: '32px', marginBottom: '10px' }}>📭</div>
                      {searchQuery ? `No applicant name starts with "${searchQuery}"` : "No live registrations found yet. Complete a registration in the portal!"}
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((app, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <td style={{ padding: '18px 24px', fontFamily: 'monospace', fontSize: '14px', color: '#818cf8', fontWeight: 'bold' }}>
                        {app.id}
                      </td>
                      <td style={{ padding: '18px 24px', color: '#f8fafc', fontWeight: '600', fontSize: '14px' }}>
                        {app.name}
                      </td>
                      <td style={{ padding: '18px 24px', color: '#cbd5e1', fontSize: '13px', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }} title={app.program}>
                        {app.program}
                      </td>
                      <td style={{ padding: '18px 24px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', background: app.identity === 'Verified' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(234, 179, 8, 0.15)', color: app.identity === 'Verified' ? '#4ade80' : '#facc15', border: app.identity === 'Verified' ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(234, 179, 8, 0.3)' }}>
                          {app.identity === 'Verified' ? '✓ Verified' : '⏳ Pending'}
                        </span>
                      </td>
                      <td style={{ padding: '18px 24px', fontSize: '13px', color: app.payment !== '—' ? '#e2e8f0' : '#64748b', fontWeight: app.payment !== '—' ? 'bold' : 'normal' }}>
                        {app.payment}
                      </td>
                      <td style={{ padding: '18px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: app.status === 'Completed' ? '#4ade80' : app.status === 'Pending Payment' ? '#facc15' : '#64748b' }}></span>
                          <span style={{ color: app.status === 'Completed' ? '#4ade80' : app.status === 'Pending Payment' ? '#facc15' : '#94a3b8', fontWeight: '600', fontSize: '13px' }}>
                            {app.status}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* INSPECTOR MODAL */}
      {showInspectorModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 999999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
          <div style={{ background: '#0a1124', width: '100%', maxWidth: '700px', maxHeight: '85vh', borderRadius: '16px', border: '1px solid #3b486d', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #293c5c', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.3)' }}>
              <div>
                <h3 style={{ margin: 0, color: '#fff', fontSize: '18px' }}>📥 DigiLocker & Backend Retrieved Data</h3>
                <p style={{ margin: '4px 0 0 0', color: '#8a9fc2', fontSize: '12px' }}>Parsed session profiles and verified document payloads.</p>
              </div>
              <button onClick={() => setShowInspectorModal(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer' }}>×</button>
            </div>

            <div style={{ padding: '24px', overflowY: 'auto', flex: 1, background: '#060a12', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {rawUserData.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#8a9fc2', padding: '40px' }}>
                  <div style={{ fontSize: '32px', marginBottom: '10px' }}>📭</div>
                  No active session records found. Complete a registration flow in the portal to inspect retrieved data packets.
                </div>
              ) : (
                rawUserData.map((user, idx) => (
                  <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                      <span style={{ fontFamily: 'monospace', color: '#818cf8', fontWeight: 'bold' }}>UID: {user.uid}</span>
                      <span style={{ padding: '4px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80' }}>✓ Secure Sandbox Sync</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                      <div>
                        <span style={{ color: '#64748b', display: 'block', fontSize: '11px', fontWeight: 'bold' }}>FULL NAME</span>
                        <strong style={{ color: '#fff' }}>{user.verifiedProfile?.name || '—'}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748b', display: 'block', fontSize: '11px', fontWeight: 'bold' }}>DATE OF BIRTH</span>
                        <strong style={{ color: '#fff' }}>{user.verifiedProfile?.dob || '—'}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748b', display: 'block', fontSize: '11px', fontWeight: 'bold' }}>EDUCATIONAL BOARD</span>
                        <strong style={{ color: '#fff' }}>{user.verifiedProfile?.board || '—'}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748b', display: 'block', fontSize: '11px', fontWeight: 'bold' }}>DOCUMENT STATUS</span>
                        <strong style={{ color: '#4ade80' }}>{user.verifiedProfile?.documentStatus || 'Verified'}</strong>
                      </div>
                    </div>

                    <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px dashed rgba(255,255,255,0.05)' }}>
                      <span style={{ color: '#64748b', display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}>SELECTED PROGRAMS CART</span>
                      <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
                        {user.cart && user.cart.length > 0 ? user.cart.join(', ') : 'No courses selected'}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div style={{ padding: '16px 24px', borderTop: '1px solid #293c5c', background: 'rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowInspectorModal(false)} style={{ background: '#6c4cff', border: 'none', color: '#fff', padding: '10px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>
                Close Inspector
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}