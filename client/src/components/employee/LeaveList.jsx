import useFetch from "../../useFetch";
import { Badge, Loader, Empty, fmtDate } from "../ui";

export default function LeaveList({ refreshKey = 0 }) {
  const { data, loading } = useFetch(`/leaves/mine?k=${refreshKey}`);
  return (
    <div className="panel">
      <h3>Your leave requests</h3>
      {loading ? <Loader /> : data.length === 0 ? <Empty title="No leave requests" text="Requests you send will show their status here." /> : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Type</th><th>Dates</th><th>Reason</th><th>Status</th><th>Decided by</th></tr></thead>
            <tbody>
              {data.map((l) => (
                <tr key={l._id}>
                  <td>{l.type}</td>
                  <td>{fmtDate(l.startDate)} to {fmtDate(l.endDate)}</td>
                  <td>{l.reason}</td>
                  <td><Badge>{l.status}</Badge></td>
                  <td>{l.approverRole || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
