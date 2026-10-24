import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useAuth, roleHome } from "../../context/AuthContext";
import { errMsg } from "../../api";

export const AuthSide = () => (
  <div className="auth-side">
    <Link to="/" className="brand" style={{ padding: 0 }}>
      <span className="brand-mark">S</span><span className="brand-name">StaffSync</span>
    </Link>
    <div>
      <h2>People do their best work when the paperwork is handled.</h2>
      <p>One calm place for attendance, leave, announcements and training.</p>
    </div>
    <small>StaffSync HR suite</small>
  </div>
);

const DEMO = [
  ["HR", "hr@staffsync.com"],
  ["Manager", "manager@staffsync.com"],
  ["Employee", "employee@staffsync.com"],
];

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to={roleHome[user.role]} replace />;

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const u = await login(form.email, form.password);
      navigate(roleHome[u.role], { replace: true });
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth">
      <AuthSide />
      <div className="auth-main">
        <div className="auth-box">
          <h1>Welcome back</h1>
          <p>Sign in to continue to your dashboard.</p>
          {error && <div className="form-error" role="alert">{error}</div>}
          <form onSubmit={submit}>
            <div className="field"><label htmlFor="email">Email</label>
              <input id="email" type="email" required autoComplete="email" value={form.email} onChange={set("email")} placeholder="you@company.com" /></div>
            <div className="field"><label htmlFor="password">Password</label>
              <input id="password" type="password" required autoComplete="current-password" value={form.password} onChange={set("password")} placeholder="Your password" /></div>
            <button className="btn btn-primary btn-block" disabled={busy}>{busy ? "Signing in..." : "Sign in"}</button>
          </form>
          <p className="auth-alt">New here? <Link to="/register">Create an account</Link></p>
          <div className="demo">
            <p>Demo accounts (after running the seed script), password Password@123</p>
            <div>
              {DEMO.map(([role, email]) => (
                <button key={role} type="button" className="btn btn-ghost btn-sm" onClick={() => setForm({ email, password: "Password@123" })}>{role}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
