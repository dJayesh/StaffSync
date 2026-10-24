import { useState } from "react";
import api, { errMsg } from "../../api";
import useFetch from "../../useFetch";
import { Badge, PageHead, Loader, Empty, Modal, Icon, fmtDate, useToast } from "../ui";

const blank = { name: "", email: "", password: "", role: "Employee", department: "", position: "", salary: "", joinDate: "", phone: "", address: "" };

export default function EmployeeCRUD() {
  const { data, loading, reload } = useFetch("/employees");
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState(null); // null = closed, {} = new, doc = edit
  const [form, setForm] = useState(blank);
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const openNew = () => { setForm(blank); setEditing({}); };
  const openEdit = (emp) => {
    setForm({ ...blank, ...emp, role: emp.user?.role || "Employee", salary: emp.salary ?? "", joinDate: emp.joinDate ? emp.joinDate.slice(0, 10) : "", phone: emp.phone || "", address: emp.address || "" });
    setEditing(emp);
  };

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    const payload = { ...form, salary: form.salary === "" ? undefined : Number(form.salary) };
    try {
      if (editing._id) {
        delete payload.email; delete payload.password;
        await api.put(`/employees/${editing._id}`, payload);
        toast("Employee updated");
      } else {
        await api.post("/employees", payload);
        toast("Employee added");
      }
      setEditing(null); reload();
    } catch (err) { toast(errMsg(err), "bad"); }
    finally { setBusy(false); }
  };

  const remove = async (emp) => {
    if (!window.confirm(`Remove ${emp.name}? Their account, leave and attendance records will be deleted.`)) return;
    try { await api.delete(`/employees/${emp._id}`); toast("Employee removed"); reload(); }
    catch (err) { toast(errMsg(err), "bad"); }
  };

  const rows = data.filter((e) => `${e.name} ${e.email} ${e.department} ${e.position}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <PageHead title="Employees" sub="Add, update and remove employee records."
        action={<button className="btn btn-primary" onClick={openNew}><Icon name="plus" size={18} />Add employee</button>} />
      <div className="panel">
        <div className="toolbar">
          <div className="search"><Icon name="search" size={18} /><input aria-label="Search employees" placeholder="Search by name, email or department" value={q} onChange={(e) => setQ(e.target.value)} /></div>
          <span className="meta">{rows.length} of {data.length} people</span>
        </div>
        {loading ? <Loader /> : rows.length === 0 ? <Empty title="No employees found" text="Add an employee or adjust your search." /> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Name</th><th>Role</th><th>Department</th><th>Position</th><th>Joined</th><th /></tr></thead>
              <tbody>
                {rows.map((emp) => (
                  <tr key={emp._id}>
                    <td>{emp.name}<span className="sub">{emp.email}</span></td>
                    <td><Badge>{emp.user?.role || "Employee"}</Badge></td>
                    <td>{emp.department}</td>
                    <td>{emp.position}</td>
                    <td>{fmtDate(emp.joinDate)}</td>
                    <td><div className="row-actions">
                      <button className="icon-btn" title="Edit" aria-label={`Edit ${emp.name}`} onClick={() => openEdit(emp)}><Icon name="edit" size={18} /></button>
                      <button className="icon-btn" title="Delete" aria-label={`Delete ${emp.name}`} onClick={() => remove(emp)}><Icon name="trash" size={18} /></button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing && (
        <Modal title={editing._id ? "Edit employee" : "Add employee"} onClose={() => setEditing(null)}>
          <form onSubmit={save}>
            <div className="form-row">
              <div className="field"><label htmlFor="en">Full name</label><input id="en" required value={form.name} onChange={set("name")} /></div>
              <div className="field"><label htmlFor="ee">Email</label><input id="ee" type="email" required disabled={!!editing._id} value={form.email} onChange={set("email")} /></div>
            </div>
            <div className="form-row">
              {!editing._id && <div className="field"><label htmlFor="ep">Temporary password</label><input id="ep" type="password" required minLength={6} value={form.password} onChange={set("password")} /></div>}
              <div className="field"><label htmlFor="er">Role</label>
                <select id="er" value={form.role} onChange={set("role")}><option>Employee</option><option>Manager</option><option>HR</option></select></div>
            </div>
            <div className="form-row">
              <div className="field"><label htmlFor="ed">Department</label><input id="ed" value={form.department} onChange={set("department")} placeholder="Engineering" /></div>
              <div className="field"><label htmlFor="eo">Position</label><input id="eo" value={form.position} onChange={set("position")} placeholder="Software Engineer" /></div>
            </div>
            <div className="form-row">
              <div className="field"><label htmlFor="es">Monthly salary</label><input id="es" type="number" min="0" value={form.salary} onChange={set("salary")} /></div>
              <div className="field"><label htmlFor="ej">Joining date</label><input id="ej" type="date" value={form.joinDate} onChange={set("joinDate")} /></div>
            </div>
            <div className="field"><label htmlFor="eh">Phone</label><input id="eh" value={form.phone} onChange={set("phone")} /></div>
            <div className="field"><label htmlFor="ea">Address</label><textarea id="ea" value={form.address} onChange={set("address")} /></div>
            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
              <button className="btn btn-primary" disabled={busy}>{busy ? "Saving..." : editing._id ? "Save changes" : "Add employee"}</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
