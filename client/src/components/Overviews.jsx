import useFetch from "../useFetch";
import { useAuth } from "../context/AuthContext";
import { AnnouncementFeed } from "./employee/Announcements";
import { Badge, StatCard, Loader, Empty, PageHead, greeting, fmtDate } from "./ui";

const Welcome = ({ sub }) => {
  const { user } = useAuth();
  return <PageHead title={`${greeting()}, ${user.name.split(" ")[0]}`} sub={sub} />;
};

export function EmployeeOverview({ go }) {
  const att = useFetch("/attendance/mine");
  const leaves = useFetch("/leaves/mine");
  const training = useFetch("/trainings");
  const news = useFetch("/announcements");

  const month = new Date().getMonth();
  const presentDays = att.data.filter((r) => new Date(r.date).getMonth() === month).length;
  const pending = leaves.data.filter((l) => l.status === "Pending").length;
  const upcoming = training.data.filter((t) => new Date(t.date) >= new Date()).length;

  return (
    <>
      <Welcome sub={new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })} />
      <div className="stats">
        <StatCard icon="clock" label="Days present this month" value={presentDays} />
        <StatCard icon="file" label="Pending leave requests" value={pending} tone="gold" />
        <StatCard icon="book" label="Upcoming trainings" value={upcoming} tone="blue" />
        <StatCard icon="bell" label="Announcements" value={news.data.length} />
      </div>
      <div className="panel">
        <div className="panel-head"><h3>Latest announcements</h3><button className="btn btn-ghost btn-sm" onClick={() => go("announcements")}>View all</button></div>
        {news.loading ? <Loader /> : news.data.length === 0 ? <Empty title="Nothing new" text="Company updates will appear here." /> : <AnnouncementFeed items={news.data.slice(0, 3)} />}
      </div>
    </>
  );
}

export function StaffOverview({ go, leaveTab, role }) {
  const stats = useFetch("/employees/stats", {});
  const pending = useFetch("/leaves?status=Pending");
  const s = stats.data;
  const depts = s.departments || [];
  const max = Math.max(...depts.map((d) => d.count), 1);

  return (
    <>
      <Welcome sub={role === "HR" ? "Here is how the organisation looks today." : "Here is how your team looks today."} />
      {stats.loading ? <Loader /> : (
        <div className="stats">
          <StatCard icon="users" label={role === "HR" ? "People in the company" : "Team members"} value={s.employees ?? 0} />
          <StatCard icon="clock" label="Checked in today" value={s.presentToday ?? 0} tone="blue" />
          <StatCard icon="file" label="Leave requests waiting" value={s.pendingLeaves ?? 0} tone="gold" />
          <StatCard icon="bell" label="Announcements" value={s.announcements ?? 0} />
        </div>
      )}
      <div className="two-col">
        <div className="panel">
          <div className="panel-head"><h3>Waiting for your decision</h3><button className="btn btn-ghost btn-sm" onClick={() => go(leaveTab)}>Open requests</button></div>
          {pending.loading ? <Loader /> : pending.data.length === 0 ? <Empty title="All caught up" text="No leave requests need your attention." /> : (
            <div className="feed">
              {pending.data.slice(0, 4).map((l) => (
                <div className="feed-item" key={l._id}>
                  <div className="feed-top"><strong>{l.user?.name}</strong><Badge>{l.status}</Badge></div>
                  <div className="meta"><span>{l.type} leave</span><span>{fmtDate(l.startDate)} to {fmtDate(l.endDate)}</span></div>
                </div>
              ))}
            </div>
          )}
        </div>
        {role === "HR" && (
          <div className="panel">
            <h3>People by department</h3>
            {depts.length === 0 ? <Empty title="No data yet" /> : (
              <div className="bars">
                {depts.map((d) => (
                  <div className="bar-row" key={d._id}>
                    <div><span>{d._id}</span><strong>{d.count}</strong></div>
                    <div className="bar"><span style={{ width: `${(d.count / max) * 100}%` }} /></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
