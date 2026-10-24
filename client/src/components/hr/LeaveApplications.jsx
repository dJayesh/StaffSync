import { useState } from "react";
import api, { errMsg } from "../../api";
import useFetch from "../../useFetch";
import { Badge, PageHead, Loader, Empty, fmtDate, useToast } from "../ui";

export default function LeaveApplications({ title = "Leave requests", sub = "Review and decide on leave applications." }) {
  const [filter, setFilter] = useState("Pending");
  const { data, loading, reload } = useFetch(`/leaves${filter === "All" ? "" : `?status=${filter}`}`);
  const [busyId, setBusyId] = useState("");
  const toast = useToast();

  const decide = async (id, status) => {
    setBusyId(id);
    try { await api.put(`/leaves/${id}/status`, { status }); toast(`Request ${status.toLowerCase()}`); reload(); }
    catch (e) { toast(errMsg(e), "bad"); }
    finally { setBusyId(""); }
  };

  return (
    <>
      <PageHead title={title} sub={sub} />
      <div className="panel">
        <div className="toolbar">
          <div className="tabs" role="tablist">
            {["Pending", "Approved", "Rejected", "All"].map((f) => (
              <button key={f} role="tab" aria-selected={filter === f} className={filter === f ? "on" : ""} onClick={() => setFilter(f)}>{f}</button>
            ))}
          </div>
        </div>
        {loading ? <Loader /> : data.length === 0 ? <Empty title={`No ${filter === "All" ? "" : filter.toLowerCase() + " "}requests`} text="You are all caught up." /> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Employee</th><th>Type</th><th>Dates</th><th>Reason</th><th>Status</th><th /></tr></thead>
              <tbody>
                {data.map((l) => (
                  <tr key={l._id}>
                    <td>{l.user?.name}<span className="sub">{l.user?.department}</span></td>
                    <td>{l.type}</td>
                    <td>{fmtDate(l.startDate)} to {fmtDate(l.endDate)}</td>
                    <td style={{ maxWidth: 240 }}>{l.reason}</td>
                    <td><Badge>{l.status}</Badge></td>
                    <td>
                      {l.status === "Pending" ? (
                        <div className="row-actions">
                          <button className="btn btn-ok btn-sm" disabled={busyId === l._id} onClick={() => decide(l._id, "Approved")}>Approve</button>
                          <button className="btn btn-bad btn-sm" disabled={busyId === l._id} onClick={() => decide(l._id, "Rejected")}>Reject</button>
                        </div>
                      ) : <span className="meta">by {l.approverRole}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
