import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useAuth, roleHome } from "../../context/AuthContext";
import { errMsg } from "../../api";
import { AuthSide } from "./Login";

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "Employee", department: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to={roleHome[user.role]} replace />;

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) return setError("Password must be at least 6 characters");
    setBusy(true);
    try {
      const u = await register(form);
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
          <h1>Create your account</h1>
          <p>It takes less than a minute.</p>
          {error && <div className="form-error" role="alert">{error}</div>}
          <form onSubmit={submit}>
            <div className="field"><label htmlFor="name">Full name</label>
              <input id="name" required value={form.name} onChange={set("name")} placeholder="Riya Sharma" /></div>
            <div className="field"><label htmlFor="email">Work email</label>
              <input id="email" type="email" required autoComplete="email" value={form.email} onChange={set("email")} placeholder="you@company.com" /></div>
            <div className="field"><label htmlFor="password">Password</label>
              <input id="password" type="password" required minLength={6} autoComplete="new-password" value={form.password} onChange={set("password")} placeholder="At least 6 characters" /></div>
            <div className="form-row">
              <div className="field"><label htmlFor="role">Role</label>
                <select id="role" value={form.role} onChange={set("role")}>
                  <option>Employee</option><option>Manager</option><option>HR</option>
                </select></div>
              <div className="field"><label htmlFor="dept">Department</label>
                <input id="dept" value={form.department} onChange={set("department")} placeholder="e.g. Engineering" /></div>
            </div>
            <button className="btn btn-primary btn-block" disabled={busy}>{busy ? "Creating account..." : "Create account"}</button>
          </form>
          <p className="auth-alt">Already registered? <Link to="/login">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}
