import { useState } from "react";
import useFetch from "../../useFetch";
import { Badge, PageHead, Loader, Empty, Icon } from "../ui";

export default function AttendanceSummary({ title = "Attendance summary", sub = "See who is in, who is out and who has not checked in." }) {
  const todayStr = new Date().toLocaleDateString("en-CA");
  const [date, setDate] = useState(todayStr);
  const [q, setQ] = useState("");
  const { data, loading } = useFetch(`/attendance?date=${date}`);

  const rows = data.filter((r) => `${r.user.name} ${r.user.department}`.toLowerCase().includes(q.toLowerCase()));
  const present = data.filter((r) => r.record?.status === "Present").length;
  const half = data.filter((r) => r.record?.status === "Half Day").length;
  const missing = data.length - present - half;

  return (
    <>
      <PageHead title={title} sub={sub} />
      <div className="panel">
        <div className="toolbar">
          <div className="search"><Icon name="search" size={18} /><input aria-label="Search people" placeholder="Search by name or department" value={q} onChange={(e) => setQ(e.target.value)} /></div>
          <input type="date" aria-label="Date" max={todayStr} value={date} onChange={(e) => e.target.value && setDate(e.target.value)}
            style={{ padding: "9px 12px", border: "1px solid var(--line)", borderRadius: 999, background: "var(--paper)" }} />
          <span className="meta"><Badge tone="ok">{present} present</Badge><Badge tone="warn">{half} half day</Badge><Badge tone="bad">{missing} not marked</Badge></span>
        </div>
        {loading ? <Loader /> : rows.length === 0 ? <Empty title="No people found" text="Try a different search or date." /> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Name</th><th>Department</th><th>Check in</th><th>Check out</th><th>Status</th></tr></thead>
              <tbody>
                {rows.map(({ user, record }) => (
                  <tr key={user._id}>
                    <td>{user.name}<span className="sub">{user.role}</span></td>
                    <td>{user.department}</td>
                    <td>{record?.checkInTime || "-"}</td>
                    <td>{record?.checkOutTime || "-"}</td>
                    <td>{record ? <Badge>{record.status}</Badge> : <Badge tone="bad">Not marked</Badge>}</td>
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
