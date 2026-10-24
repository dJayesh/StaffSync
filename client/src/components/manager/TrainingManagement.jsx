import { useState } from "react";
import api, { errMsg } from "../../api";
import useFetch from "../../useFetch";
import { PageHead, Loader, Empty, Modal, Icon, Badge, fmtDate, useToast } from "../ui";

const blank = { title: "", description: "", date: "", trainer: "", assignedTo: [] };

export default function TrainingManagement() {
  const { data, loading, reload } = useFetch("/trainings");
  const team = useFetch("/employees");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(blank);
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const toggle = (id) => setForm((f) => ({ ...f, assignedTo: f.assignedTo.includes(id) ? f.assignedTo.filter((x) => x !== id) : [...f.assignedTo, id] }));

  const create = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post("/trainings", form);
      toast("Training program created");
      setOpen(false); setForm(blank); reload();
    } catch (err) { toast(errMsg(err), "bad"); }
    finally { setBusy(false); }
  };
  const remove = async (t) => {
    if (!window.confirm(`Delete "${t.title}"?`)) return;
    try { await api.delete(`/trainings/${t._id}`); toast("Training program deleted"); reload(); }
    catch (err) { toast(errMsg(err), "bad"); }
  };

  return (
    <>
      <PageHead title="Training and development" sub="Create programs and assign them to your team."
        action={<button className="btn btn-primary" onClick={() => setOpen(true)}><Icon name="plus" size={18} />New program</button>} />
      {loading ? <Loader /> : data.length === 0 ? (
        <div className="panel"><Empty title="No programs yet" text="Create a program and assign it to team members." /></div>
      ) : (
        <div className="cards">
          {data.map((t) => (
            <div className="card" key={t._id}>
              <div className="feed-top">
                <span className="date-chip"><Icon name="calendar" size={16} />{fmtDate(t.date)}</span>
                <button className="icon-btn" aria-label={`Delete ${t.title}`} onClick={() => remove(t)}><Icon name="trash" size={18} /></button>
              </div>
              <h4>{t.title}</h4>
              <p>{t.description}</p>
              <div className="meta"><span>Trainer: {t.trainer}</span><Badge tone="info">{t.assignedTo.length} assigned</Badge></div>
              {t.assignedTo.length > 0 && <div className="meta">{t.assignedTo.map((u) => u.name).join(", ")}</div>}
            </div>
          ))}
        </div>
      )}

      {open && (
        <Modal title="New training program" onClose={() => setOpen(false)}>
          <form onSubmit={create}>
            <div className="field"><label htmlFor="tt">Title</label><input id="tt" required value={form.title} onChange={set("title")} /></div>
            <div className="field"><label htmlFor="td">Description</label><textarea id="td" required value={form.description} onChange={set("description")} /></div>
            <div className="form-row">
              <div className="field"><label htmlFor="tdt">Date</label><input id="tdt" type="date" required value={form.date} onChange={set("date")} /></div>
              <div className="field"><label htmlFor="ttr">Trainer</label><input id="ttr" value={form.trainer} onChange={set("trainer")} placeholder="Optional" /></div>
            </div>
            <div className="field"><label>Assign to</label>
              {team.loading ? <Loader /> : team.data.length === 0 ? <span className="meta">No team members in your department yet.</span> : (
                <div className="check-grid">
                  {team.data.map((m) => (
                    <label className="check" key={m._id}>
                      <input type="checkbox" checked={form.assignedTo.includes(m.user._id)} onChange={() => toggle(m.user._id)} />{m.name}
                    </label>
                  ))}
                </div>
              )}
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>Cancel</button>
              <button className="btn btn-primary" disabled={busy}>{busy ? "Creating..." : "Create program"}</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
