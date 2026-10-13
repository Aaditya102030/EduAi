import { useMemo, useState } from "react";
import "./App.css";

const seed = [
  { id: 1, name: "Aarav Sharma", roll: 1, attendance: "Present", quiz: 85, assignment: "Submitted" },
  { id: 2, name: "Ananya Verma", roll: 2, attendance: "Present", quiz: 92, assignment: "Submitted" },
  { id: 3, name: "Vivaan Singh", roll: 3, attendance: "Absent", quiz: 68, assignment: "Pending" },
  { id: 4, name: "Diya Gupta", roll: 4, attendance: "Present", quiz: 88, assignment: "Submitted" },
  { id: 5, name: "Aditya Kumar", roll: 5, attendance: "Late", quiz: 74, assignment: "Submitted" },
  { id: 6, name: "Myra Patel", roll: 6, attendance: "Present", quiz: 96, assignment: "Submitted" },
  { id: 7, name: "Arjun Yadav", roll: 7, attendance: "Absent", quiz: 55, assignment: "Pending" },
  { id: 8, name: "Saanvi Mishra", roll: 8, attendance: "Present", quiz: 81, assignment: "Submitted" },
];
const sections = ["8-A", "8-B", "9-A", "9-B"];

function Brand({ small = false }) {
  return <div className={`brand ${small ? "brand-small" : ""}`}><div className="brand-icon">E</div><div><div className="brand-name">EduPulse <span>AI</span></div>{!small && <div className="brand-tagline">Every child. Every day. Every opportunity.</div>}</div></div>;
}

function Login({ onLogin }) {
  const [role, setRole] = useState("Teacher");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  return <main className="login-page"><section className="login-left"><Brand /><div className="login-hero"><div className="eyebrow">✳ SMARTER SCHOOLS, BRIGHTER FUTURES</div><h1>Every child deserves a chance to <span>shine.</span></h1><p>Track attendance, understand learning progress, and help every student move forward with EduPulse AI.</p><div className="hero-stats"><div><strong>100%</strong><span>Every child counts</span></div><div><strong>AI-powered</strong><span>Smarter insights</span></div><div><strong>One goal</strong><span>Better learning</span></div></div></div><div className="login-footer">Made for better learning outcomes ✳</div></section>
    <section className="login-right"><div className="login-card"><div className="mobile-brand"><Brand /></div><div className="welcome-label">WELCOME TO EDUPULSE</div><h2>Sign in to your account</h2><p className="muted">Choose your role to continue.</p>
      <div className="role-picker">{["Teacher", "Student"].map(r => <button type="button" key={r} className={`role-option ${role === r ? "selected" : ""}`} onClick={() => setRole(r)}><span className="role-icon">{r === "Teacher" ? "▤" : "♧"}</span><span><strong>{r}</strong><small>{r === "Teacher" ? "Manage your class" : "View your learning"}</small></span><span className="role-radio">{role === r ? "✓" : ""}</span></button>)}</div>
      <form className="login-form" onSubmit={e => { e.preventDefault(); if (!username.trim() || !password.trim()) { setError("Enter username and password."); return; } onLogin({ role, username: username.trim() }); }}>
        <label htmlFor="username">Email or username</label><input id="username" value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter your email or username" />
        <label htmlFor="password">Password</label><input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" />
        {error && <p className="form-error">{error}</p>}<button className="primary-button login-submit">Sign in as {role} →</button>
      </form><div className="demo-note">ⓘ Demo mode: any non-empty username and password will work.</div><p className="login-privacy">Secure account verification is not connected yet.</p>
    </div></section></main>;
}

function Metric({ label, value, note, icon, onClick, tone = "" }) {
  return <button className="metric-card metric-card-clickable" onClick={onClick}><div className={`metric-icon ${tone}`}>{icon}</div><div className="metric-label">{label}</div><div className="metric-value">{value}</div><div className="metric-note">{note}</div><div className="metric-open-hint">Click to explore ↗</div></button>;
}

function Table({ students, search, setSearch, onOpen, onUpdate, mode = "overview" }) {
  return <section className="panel table-panel"><div className="panel-heading"><div><h2>{mode === "attendance" ? "Attendance register" : mode === "learning" ? "Learning reports" : "Student overview"}</h2><p>Search students or open their individual report.</p></div><span className="table-count">{students.length} students</span></div>
    <div className="table-toolbar"><input className="search-input" placeholder="Search name or roll number" value={search} onChange={e => setSearch(e.target.value)} /></div><div className="table-scroll"><table><thead><tr><th>STUDENT</th><th>ROLL</th>{mode !== "learning" && <th>ATTENDANCE</th>}{mode !== "attendance" && <th>QUIZ</th>}{mode === "learning" && <th>ASSIGNMENT</th>}<th>REPORT</th></tr></thead><tbody>
      {students.map(s => <tr key={s.id}><td><div className="student-name-cell"><div className="student-avatar">{s.name[0]}</div><strong>{s.name}</strong></div></td><td>{String(s.roll).padStart(2, "0")}</td>
        {mode !== "learning" && <td>{mode === "attendance" ? <select className={`status-select ${s.attendance.toLowerCase()}`} value={s.attendance} onChange={e => onUpdate(s.id, { attendance: e.target.value })}><option>Present</option><option>Absent</option><option>Late</option></select> : <span className={`status-pill ${s.attendance.toLowerCase()}`}>{s.attendance}</span>}</td>}
        {mode !== "attendance" && <td>{mode === "learning" ? <><span className="quiz-score">{s.quiz}%</span></> : <span className="quiz-score">{s.quiz}%</span>}</td>}
        {mode === "learning" && <td><span className={`status-pill ${s.assignment === "Submitted" ? "present" : "absent"}`}>{s.assignment}</span></td>}
        <td><button className="report-link" onClick={() => onOpen(s)}>View report →</button></td></tr>)}
      {students.length === 0 && <tr><td colSpan="5" className="empty-state">No students found.</td></tr>}
    </tbody></table></div></section>;
}

function Teacher({ username, onLogout }) {
  const [section, setSection] = useState("8-A");
  const [page, setPage] = useState("Overview");
  const [allStudents, setAllStudents] = useState(Object.fromEntries(sections.map((s, i) => [s, seed.map(x => ({ ...x, attendance: i === 0 ? x.attendance : x.id % (i + 3) === 0 ? "Absent" : "Present" }))])));
  const [search, setSearch] = useState("");
  const [studentId, setStudentId] = useState(null);
  const [popup, setPopup] = useState(null);
  const [notice, setNotice] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [file, setFile] = useState(null);
  const [uploadDate, setUploadDate] = useState("");
  const [month, setMonth] = useState(0);

  const students = allStudents[section];
  const selected = students.find(s => s.id === studentId);
  const present = students.filter(s => s.attendance === "Present").length;
  const absent = students.filter(s => s.attendance === "Absent").length;
  const late = students.filter(s => s.attendance === "Late").length;
  const rate = Math.round(present / students.length * 100);
  const filtered = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || String(s.roll).includes(search));
  const monthInfo = useMemo(() => {
    const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() + month);
    const y = d.getFullYear(), m = d.getMonth(), total = new Date(y, m + 1, 0).getDate(), offset = new Date(y, m, 1).getDay();
    const days = Array.from({ length: total }, (_, i) => { const day = i + 1, wd = new Date(y, m, day).getDay(), working = wd !== 0 && wd !== 6; return { day, working, status: !working ? "weekend" : (day + (selected?.id || 1)) % 7 === 0 ? "absent" : "present" }; });
    const workingDays = days.filter(x => x.working).length, presentDays = days.filter(x => x.status === "present").length, absentDays = days.filter(x => x.status === "absent").length;
    return { label: d.toLocaleDateString("en-IN", { month: "long", year: "numeric" }), offset, days, workingDays, presentDays, absentDays, rate: workingDays ? Math.round(presentDays / workingDays * 100) : 0 };
  }, [month, selected]);
  function updateStudent(id, changes) { setAllStudents(prev => ({ ...prev, [section]: prev[section].map(s => s.id === id ? { ...s, ...changes } : s) })); }
  function notify(msg) { setNotice(msg); window.setTimeout(() => setNotice(""), 3000); }
  function openStudent(s) { setStudentId(s.id); setPage("Students"); setMonth(0); }
  function dateText(value) { return new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); }
  function saveAssignment(e) {
    e.preventDefault();
    if (!title.trim()) return;
    setAssignments(prev => [{ id: Date.now(), title: title.trim(), description: description.trim(), dueDate, section, uploadedAt: new Date().toISOString(), fileName: file?.name || "", fileUrl: file ? URL.createObjectURL(file) : "" }, ...prev]);
    setTitle(""); setDescription(""); setDueDate(""); setFile(null); setShowUpload(false); notify("Assignment added to this session's assignment list.");
  }
  const nav = ["Overview", "Attendance", "Monthly Reports", "Assignments", "Learning Reports", "Students"];
  function go(p) { setPage(p); setStudentId(null); setSearch(""); }
  return <div className="app-shell"><aside className="sidebar"><Brand small/><div className="sidebar-label">WORKSPACE</div><nav className="sidebar-nav">{nav.map((p, i) => <button key={p} className={`nav-item ${page === p ? "active" : ""}`} onClick={() => go(p)}><span className="nav-icon">{["▦","✓","▦","▤","↗","♧"][i]}</span>{p}{p === "Assignments" && <span className="nav-count">{assignments.filter(a => a.section === section).length}</span>}</button>)}</nav><div className="sidebar-bottom"><div className="help-card"><strong>✳ Every child matters</strong><p>Small steps create brighter futures.</p></div><div className="profile-row"><div className="avatar">{username[0].toUpperCase()}</div><div className="profile-info"><strong>{username}</strong><span>Teacher account</span></div><button className="logout-icon" onClick={onLogout}>↪</button></div></div></aside>
    <main className="main-panel"><header className="topbar"><div className="breadcrumb">Workspace / <strong>{selected ? "Student Report" : page}</strong></div><div className="topbar-actions"><span className="today-label">{new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span><div className="avatar avatar-small">{username[0].toUpperCase()}</div></div></header>
      <div className="page-content">{notice && <div className="notice-banner">{notice}</div>}
        <div className="page-heading"><div><div className="eyebrow">TEACHER WORKSPACE</div><h1>{selected ? `${selected.name}'s report` : `Good day, ${username} 👋`}</h1><p>{selected ? "Monthly attendance and individual learning progress." : "Here’s what’s happening in your classroom today."}</p></div>
          <label className="section-select-label"><span>CLASS / SECTION</span><select value={section} onChange={e => { setSection(e.target.value); setStudentId(null); }} >{sections.map(s => <option key={s} value={s}>Class {s.replace("-", " — Section ")}</option>)}</select></label></div>

        {selected ? <section className="panel student-detail"><button className="back-button" onClick={() => setStudentId(null)}>← Back to students</button><div className="student-detail-header"><div className="student-avatar large-avatar">{selected.name[0]}</div><div><h2>{selected.name}</h2><p>Roll number {selected.roll} · Class {section}</p></div><span className={`status-pill ${selected.attendance.toLowerCase()}`}>{selected.attendance} today</span></div>
          <div className="stats-grid detail-stats"><Metric label="Attendance today" value={selected.attendance} note="Current demo status" icon="✓" onClick={() => setPopup({ title: "Today's attendance", body: `${selected.name} is marked ${selected.attendance.toLowerCase()} in demo data.` })}/><Metric label="Quiz score" value={`${selected.quiz}%`} note="Sample result" icon="✎" onClick={() => setPopup({ title: "Quiz score", body: `${selected.name}'s sample quiz score is ${selected.quiz}%.` })}/><Metric label="Assignment" value={selected.assignment} note="Submission status" icon="▤" onClick={() => setPopup({ title: "Assignment status", body: `${selected.name}'s sample status is ${selected.assignment}.` })}/><Metric label="Working days" value={monthInfo.workingDays} note={monthInfo.label} icon="▦" onClick={() => setPopup({ title: "Working days", body: `${monthInfo.label} has ${monthInfo.workingDays} weekdays in this sample calendar.` })}/></div>
          <h3>Monthly attendance report</h3><p className="muted">{monthInfo.label} · Demo attendance</p><div className="profile-chart-row"><div className="attendance-pie" style={{ "--present-angle": `${monthInfo.rate}%`, "--absent-angle": "100%" }}><div className="attendance-pie-inner"><strong>{monthInfo.rate}%</strong><span>Attendance</span></div></div><div className="profile-legend"><div><i className="profile-present"/>Present<strong>{monthInfo.presentDays}</strong></div><div><i className="profile-absent"/>Absent<strong>{monthInfo.absentDays}</strong></div><div><i className="profile-nodata"/>Working days<strong>{monthInfo.workingDays}</strong></div></div></div>
          <div className="panel-heading"><div><h2>Attendance calendar</h2><p>Green = present · Red = absent · Grey = weekend</p></div><div className="month-controls"><button onClick={() => setMonth(v => v - 1)}>‹</button><button onClick={() => setMonth(v => v + 1)}>›</button></div></div><div className="calendar-title">{monthInfo.label}</div>
          <div className="student-attendance-calendar">{["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => <div className="calendar-weekday" key={d}>{d}</div>)}{Array.from({ length: monthInfo.offset }, (_, i) => <div className="calendar-day no-record" key={`blank${i}`}/>)}
            {monthInfo.days.map(d => <div key={d.day} className={`calendar-day ${d.status}`} title={`${d.day}: ${d.status}`}><span>{d.day}</span></div>)}</div><p className="muted demo-disclaimer">Demo only: connect a database to show verified daily attendance records.</p>
        </section> : <>
          {page === "Overview" && <><div className="stats-grid"><Metric label="Total students" value={students.length} note="In selected section" icon="♧" onClick={() => setPopup({ title: "Total students", body: `Class ${section} has ${students.length} sample students.` })}/><Metric label="Present today" value={present} note={`${rate}% attendance rate`} icon="✓" onClick={() => setPopup({ title: "Present today", body: `${present} students are marked present in Class ${section}.` })}/><Metric label="Absent today" value={absent} note="Needs follow-up" icon="↗" tone="orange" onClick={() => setPopup({ title: "Absent today", body: `${absent} students are marked absent in Class ${section}.` })}/><Metric label="Assignments pending" value={students.filter(s => s.assignment === "Pending").length} note="Across this section" icon="▤" tone="purple" onClick={() => go("Assignments")}/></div>
            <div className="dashboard-grid"><section className="panel attendance-panel"><div className="panel-heading"><div><h2>Today’s attendance</h2><p>Class {section} · Daily overview</p></div><button className="text-button" onClick={() => go("Attendance")}>View roster →</button></div><div className="attendance-visual"><div className="donut" style={{ "--progress": `${rate}%` }}><div className="donut-center"><strong>{rate}%</strong><span>Present</span></div></div><div className="legend"><div><i className="legend-dot present-dot"/>Present <strong>{present}</strong></div><div><i className="legend-dot absent-dot"/>Absent <strong>{absent}</strong></div><div><i className="legend-dot late-dot"/>Late <strong>{late}</strong></div></div></div><div className="camera-strip"><div className="camera-icon">▣</div><div><strong>Photo attendance</strong><p>Photo selection demo; face recognition is not connected.</p></div><label className="secondary-button file-label">Choose photo<input type="file" accept="image/*" capture="environment" hidden onChange={e => e.target.files?.[0] && notify(`Selected ${e.target.files[0].name}; recognition is not enabled.`)}/></label></div></section>
              <section className="panel quick-panel"><div className="panel-heading"><div><h2>Learning snapshot</h2><p>Quick class overview</p></div></div><div className="learning-stat"><span className="learning-icon quiz-icon">✎</span><div><strong>78%</strong><p>Average quiz score</p></div><span className="trend">Sample</span></div><div className="learning-stat"><span className="learning-icon assignment-icon">▤</span><div><strong>{Math.round(students.filter(s => s.assignment === "Submitted").length / students.length * 100)}%</strong><p>Assignments submitted</p></div></div><div className="insight-box"><span>✳</span><div><strong>Teacher insight</strong><p>Review absences and pending assignments to identify students who may need support.</p></div></div></section></div><Table students={students.slice(0, 5)} search={search} setSearch={setSearch} onOpen={openStudent} onUpdate={updateStudent}/></>}
          {page === "Attendance" && <><div className="attendance-summary"><span className="summary-chip present-chip">Present: {present}</span><span className="summary-chip absent-chip">Absent: {absent}</span><span className="summary-chip late-chip">Late: {late}</span></div><Table students={filtered} search={search} setSearch={setSearch} onOpen={openStudent} onUpdate={updateStudent} mode="attendance"/><p className="muted">Changes are currently kept in page memory only.</p></>}
          {page === "Monthly Reports" && <div className="reports-grid"><section className="panel calendar-panel"><div className="panel-heading"><div><h2>Monthly attendance</h2><p>Illustrative calendar for Class {section}</p></div><div className="month-controls"><button onClick={() => setMonth(v => v - 1)}>‹</button><button onClick={() => setMonth(v => v + 1)}>›</button></div></div><div className="calendar-title">{monthInfo.label}</div><div className="calendar-grid">{["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => <div className="calendar-weekday" key={d}>{d}</div>)}{Array.from({ length: monthInfo.offset }, (_, i) => <div className="calendar-day" key={`e${i}`}/>)}{monthInfo.days.map(d => <div className={`calendar-day ${d.status}`} key={d.day}>{d.day}</div>)}</div><p className="muted calendar-note">Sample dates only, not real attendance records.</p></section><section className="panel report-summary"><h2>Section summary</h2><div className="report-big-number">{rate}%<span>Present today</span></div><div className="report-row"><span>Present</span><strong>{present}</strong></div><div className="report-row"><span>Absent</span><strong>{absent}</strong></div><div className="report-row"><span>Late</span><strong>{late}</strong></div></section></div>}
          {page === "Assignments" && <section className="panel"><div className="panel-heading"><div><h2>Assignment centre</h2><p>Upload classwork and track upload dates.</p></div><button className="primary-button" onClick={() => setShowUpload(true)}>+ Upload assignment</button></div><div className="modal-field assignment-filter"><label htmlFor="upload-date">Filter by upload date</label><input id="upload-date" type="date" value={uploadDate} onChange={e => setUploadDate(e.target.value)}/></div><div className="assignment-list">{assignments.filter(a => a.section === section && (!uploadDate || a.uploadedAt.slice(0,10) === uploadDate)).map(a => <article className="assignment-item" key={a.id}><strong>{a.title}</strong><p>{a.description || "No additional instructions."}</p><p>Class {a.section} · Uploaded {dateText(a.uploadedAt)} at {new Date(a.uploadedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</p>{a.dueDate && <p>Due: {dateText(`${a.dueDate}T12:00:00`)}</p>}{a.fileName && <p>Attachment: <a href={a.fileUrl} download={a.fileName}>{a.fileName}</a></p>}<span className="assignment-date">Uploaded {dateText(a.uploadedAt)}</span></article>)}{assignments.filter(a => a.section === section && (!uploadDate || a.uploadedAt.slice(0,10) === uploadDate)).length === 0 && <p className="muted">No assignments for this class/date yet.</p>}</div></section>}
          {page === "Learning Reports" && <Table students={filtered} search={search} setSearch={setSearch} onOpen={openStudent} onUpdate={updateStudent} mode="learning"/>}
          {page === "Students" && <Table students={filtered} search={search} setSearch={setSearch} onOpen={openStudent} onUpdate={updateStudent}/>}
        </>}
        <footer className="page-footer">EduPulse AI · Helping every learner thrive</footer>
      </div>
    </main>
    {popup && <div className="modal-overlay" onClick={() => setPopup(null)}><section className="modal-card" role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}><div className="modal-header"><div><h2>{popup.title}</h2><p>Class {section} · Dashboard details</p></div><button className="modal-close" onClick={() => setPopup(null)}>×</button></div><p className="muted">{popup.body}</p><button className="primary-button" onClick={() => setPopup(null)}>Done</button></section></div>}
    {showUpload && <div className="modal-overlay" onClick={() => setShowUpload(false)}><section className="modal-card" role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}><div className="modal-header"><div><h2>Upload assignment</h2><p>Class {section} · Add a learning task</p></div><button className="modal-close" onClick={() => setShowUpload(false)}>×</button></div><form onSubmit={saveAssignment}><div className="modal-field"><label>Assignment title *</label><input required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Mathematics Chapter 4"/></div><div className="modal-field"><label>Instructions</label><textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Write assignment instructions..."/></div><div className="modal-field"><label>Due date</label><input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}/></div><div className="modal-field"><label>Attachment (optional)</label><input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png" onChange={e => setFile(e.target.files?.[0] || null)}/></div><div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setShowUpload(false)}>Cancel</button><button className="primary-button">Save assignment</button></div></form></section></div>}
  </div>;
}

function StudentDashboard({ username, onLogout }) {
  return <div className="student-placeholder-page"><header className="student-topbar"><Brand small/><button className="secondary-button" onClick={onLogout}>Log out ↪</button></header><main className="student-placeholder-card"><div className="student-welcome-icon">✳</div><div className="eyebrow">STUDENT WORKSPACE</div><h1>Welcome, {username}!</h1><p>Your student dashboard is coming soon.</p><div className="coming-soon-grid"><div><span>✓</span><strong>Attendance</strong><p>View attendance record</p></div><div><span>✎</span><strong>Quiz results</strong><p>Track learning progress</p></div><div><span>▤</span><strong>Assignments</strong><p>Check tasks and submissions</p></div></div><button className="primary-button" onClick={onLogout}>Back to login</button></main></div>;
}

export default function App() {
  const [session, setSession] = useState(null);
  if (!session) return <Login onLogin={setSession}/>;
  return session.role === "Teacher" ? <Teacher username={session.username} onLogout={() => setSession(null)}/> : <StudentDashboard username={session.username} onLogout={() => setSession(null)}/>;
}
