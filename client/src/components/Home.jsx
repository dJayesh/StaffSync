import { Link } from "react-router-dom";
import { useAuth, roleHome } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();
  return (
    <div className="land">
      <header className="land-nav">
        <Link to="/" className="brand dark" style={{ padding: 0 }}>
          <span className="brand-mark">S</span><span className="brand-name">StaffSync</span>
        </Link>
        <div className="actions">
          {user ? (
            <Link to={roleHome[user.role]} className="btn btn-primary">Open dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">Sign in</Link>
              <Link to="/register" className="btn btn-primary">Create account</Link>
            </>
          )}
        </div>
      </header>

      <section className="hero">
        <div>
          <h1>HR that keeps up with your people.</h1>
          <p className="lead">
            Attendance, leave, announcements and training in one calm workspace, with the right view for HR, managers and every employee.
          </p>
          <div className="actions">
            <Link to={user ? roleHome[user.role] : "/register"} className="btn btn-primary">
              {user ? "Go to my dashboard" : "Get started"}
            </Link>
            {!user && <Link to="/login" className="btn btn-ghost">I already have an account</Link>}
          </div>
        </div>

        <div className="preview" aria-hidden="true">
          <div className="pv-row">
            <div><small>Today, 9:12 AM</small><div className="pv-time">09:12</div></div>
            <span className="pv-pill">Checked in</span>
          </div>
          <div className="pv-row">
            <div><strong>Sneha Kulkarni</strong><small>Sick leave, 2 days</small></div>
            <span className="pv-pill soft">Pending</span>
          </div>
          <div className="pv-row">
            <div><strong>Quarterly town hall</strong><small>Posted by HR for everyone</small></div>
            <span className="pv-pill soft">New</span>
          </div>
        </div>
      </section>

      <section className="roles">
        <div><h3>HR</h3><p>Keep employee records accurate, watch attendance across teams and publish company news.</p></div>
        <div><h3>Managers</h3><p>Review leave requests for your team, plan training programs and see who is in today.</p></div>
        <div><h3>Employees</h3><p>Check in, apply for leave, update your profile and stay on top of announcements.</p></div>
      </section>

      <section className="land-features">
        <h2>Everything the day-to-day needs, nothing it does not.</h2>
        <div className="feat-list">
          <div><strong>Attendance</strong><span>One-tap check-in and check-out with a clear history for employees and a daily summary for HR.</span></div>
          <div><strong>Leave</strong><span>Employees apply online. Managers and HR approve or reject with the status updated straight away.</span></div>
          <div><strong>Announcements</strong><span>Post updates to everyone, or only to employees or managers.</span></div>
          <div><strong>Training</strong><span>Managers create programs and assign them to team members, who see them on their dashboard.</span></div>
          <div><strong>Secure access</strong><span>Hashed passwords, token-based sign-in and role-based permissions on every request.</span></div>
        </div>
      </section>

      <footer className="land-foot">StaffSync, a MERN stack human resource management system.</footer>
    </div>
  );
}
