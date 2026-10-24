import { useState, useEffect } from "react";
import api, { errMsg } from "../../api";
import useFetch from "../../useFetch";
import { Badge, PageHead, Loader, Empty, fmtDate, useToast } from "../ui";

export default function Attendance() {
  const { data, loading, reload } = useFetch("/attendance/mine");
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000 * 15);
    return () => clearInterval(t);
  }, []);

  const today = data.find((r) => new Date(r.date).toDateString() === now.toDateString());
  const act = async (path, msg) => {
    setBusy(true);
    try { await api.post(`/attendance/${path}`); toast(msg); await reload(); }
    catch (e) { toast(errMsg(e), "bad"); }
    finally { setBusy(false); }
  };

  return (
    <>
      <PageHead title="Attendance" sub="Check in when you start and check out when you finish." />
      <div className="clock-card">
        <div>
          <div className="clock-time">{now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</div>
          <p>{now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}</p>
          <p>{!today ? "You have not checked in yet." : today.checkOutTime ? `Checked in ${today.checkInTime}, out ${today.checkOutTime}.` : `Checked in at ${today.checkInTime}.`}</p>
        </div>
        <div className="clock-actions">
          <button className="btn btn-primary" disabled={busy || !!today} onClick={() => act("check-in", "Checked in. Have a great day!")}>Check in</button>
          <button className="btn btn-ghost" disabled={busy || !today || !!today?.checkOutTime} onClick={() => act("check-out", "Checked out. See you tomorrow!")}>Check out</button>
        </div>
      </div>

      <div className="panel">
        <h3>Your history</h3>
        {loading ? <Loader /> : data.length === 0 ? <Empty title="No records yet" text="Your first check-in will appear here." /> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Date</th><th>Check in</th><th>Check out</th><th>Status</th></tr></thead>
              <tbody>
                {data.map((r) => (
                  <tr key={r._id}><td>{fmtDate(r.date)}</td><td>{r.checkInTime || "-"}</td><td>{r.checkOutTime || "-"}</td><td><Badge>{r.status}</Badge></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
