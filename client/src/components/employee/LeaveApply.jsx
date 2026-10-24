import { useState } from "react";
import api, { errMsg } from "../../api";
import { useToast } from "../ui";

const blank = { type: "Casual", startDate: "", endDate: "", reason: "" };

export default function LeaveApply({ onDone }) {
  const [form, setForm] = useState(blank);
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const today = new Date().toLocaleDateString("en-CA");

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post("/leaves", form);
      toast("Leave request sent for approval");
      setForm(blank);
      onDone?.();
    } catch (err) { toast(errMsg(err), "bad"); }
    finally { setBusy(false); }
  };

  return (
    <form className="panel" onSubmit={submit}>
      <h3>Apply for leave</h3>
      <div className="form-row">
        <div className="field"><label htmlFor="lt">Leave type</label>
          <select id="lt" value={form.type} onChange={set("type")}><option>Casual</option><option>Sick</option><option>Annual</option><option>Other</option></select></div>
        <div className="field"><label htmlFor="ls">From</label>
          <input id="ls" type="date" required min={today} value={form.startDate} onChange={set("startDate")} /></div>
      </div>
      <div className="form-row">
        <div className="field"><label htmlFor="le">To</label>
          <input id="le" type="date" required min={form.startDate || today} value={form.endDate} onChange={set("endDate")} /></div>
        <div className="field"><label htmlFor="lr">Reason</label>
          <input id="lr" required value={form.reason} onChange={set("reason")} placeholder="A short reason" /></div>
      </div>
      <button className="btn btn-primary" disabled={busy}>{busy ? "Sending..." : "Send request"}</button>
    </form>
  );
}
