import { useState } from "react";
import api, { errMsg } from "../../api";
import useFetch from "../../useFetch";
import { useAuth } from "../../context/AuthContext";
import { AnnouncementFeed } from "../employee/Announcements";
import { PageHead, Loader, Empty, Modal, Icon, useToast } from "../ui";

const blank = { title: "", message: "", targetAudience: "All" };

export default function AnnouncementsManager() {
  const { user } = useAuth();
  const { data, loading, reload } = useFetch("/announcements");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(blank);
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const post = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post("/announcements", form);
      toast("Announcement published");
      setOpen(false); setForm(blank); reload();
    } catch (err) { toast(errMsg(err), "bad"); }
    finally { setBusy(false); }
  };
  const remove = async (a) => {
    if (!window.confirm(`Delete "${a.title}"?`)) return;
    try { await api.delete(`/announcements/${a._id}`); toast("Announcement deleted"); reload(); }
    catch (err) { toast(errMsg(err), "bad"); }
  };
  const canDelete = (a) => user.role === "HR" || a.postedBy?._id === user._id;

  return (
    <>
      <PageHead title="Announcements" sub="Share news with the whole company or a specific group."
        action={<button className="btn btn-primary" onClick={() => setOpen(true)}><Icon name="plus" size={18} />New announcement</button>} />
      <div className="panel">
        {loading ? <Loader /> : data.length === 0 ? <Empty title="No announcements yet" text="Post the first one to get everyone up to speed." />
          : <AnnouncementFeed items={data} onDelete={remove} canDelete={canDelete} />}
      </div>
      {open && (
        <Modal title="New announcement" onClose={() => setOpen(false)}>
          <form onSubmit={post}>
            <div className="field"><label htmlFor="at">Title</label><input id="at" required value={form.title} onChange={set("title")} /></div>
            <div className="field"><label htmlFor="am">Message</label><textarea id="am" required value={form.message} onChange={set("message")} /></div>
            <div className="field"><label htmlFor="aa">Who should see it?</label>
              <select id="aa" value={form.targetAudience} onChange={set("targetAudience")}><option>All</option><option>Employees</option><option>Managers</option></select></div>
            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>Cancel</button>
              <button className="btn btn-primary" disabled={busy}>{busy ? "Publishing..." : "Publish"}</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
