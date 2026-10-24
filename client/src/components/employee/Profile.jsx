import { useState, useEffect } from "react";
import api, { errMsg } from "../../api";
import { useAuth } from "../../context/AuthContext";
import { PageHead, Loader, useToast, fmtDate } from "../ui";

export default function Profile() {
  const [emp, setEmp] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const { setUser } = useAuth();

  useEffect(() => {
    api.get("/employees/me").then((r) => {
      setEmp(r.data);
      setForm({ name: r.data.name || "", phone: r.data.phone || "", address: r.data.address || "" });
    }).catch((e) => toast(errMsg(e), "bad"));
  }, [toast]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const r = await api.put("/employees/me", form);
      setEmp(r.data);
      setUser((u) => {
        const next = { ...u, name: r.data.name };
        localStorage.setItem("user", JSON.stringify(next));
        return next;
      });
      toast("Profile updated");
    } catch (err) { toast(errMsg(err), "bad"); }
    finally { setBusy(false); }
  };

  if (!emp) return <Loader />;
  return (
    <>
      <PageHead title="My profile" sub="Keep your personal details up to date." />
      <div className="two-col">
        <form className="panel" onSubmit={save}>
          <h3>Personal information</h3>
          <div className="field"><label htmlFor="pn">Full name</label><input id="pn" required value={form.name} onChange={set("name")} /></div>
          <div className="field"><label htmlFor="pp">Phone</label><input id="pp" value={form.phone} onChange={set("phone")} placeholder="+91 98765 43210" /></div>
          <div className="field"><label htmlFor="pa">Address</label><textarea id="pa" value={form.address} onChange={set("address")} /></div>
          <button className="btn btn-primary" disabled={busy}>{busy ? "Saving..." : "Save changes"}</button>
        </form>
        <div className="panel">
          <h3>Work details</h3>
          <div className="feed">
            {[["Email", emp.email], ["Department", emp.department], ["Position", emp.position], ["Joined", fmtDate(emp.joinDate)]].map(([k, v]) => (
              <div className="feed-item" key={k}><span className="meta">{k}</span><strong>{v || "-"}</strong></div>
            ))}
          </div>
          <p className="meta" style={{ marginTop: 14 }}>Work details are managed by HR.</p>
        </div>
      </div>
    </>
  );
}
