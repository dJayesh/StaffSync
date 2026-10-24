import useFetch from "../../useFetch";
import { Badge, PageHead, Loader, Empty, fmtDate } from "../ui";

export const AnnouncementFeed = ({ items, onDelete, canDelete }) => (
  <div className="feed">
    {items.map((a) => (
      <article className="feed-item" key={a._id}>
        <div className="feed-top">
          <h4>{a.title}</h4>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Badge tone="info">{a.targetAudience}</Badge>
            {canDelete?.(a) && <button className="btn btn-bad btn-sm" onClick={() => onDelete(a)}>Delete</button>}
          </div>
        </div>
        <p>{a.message}</p>
        <div className="meta"><span>{a.postedBy?.name || "Unknown"} ({a.postedBy?.role})</span><span>{fmtDate(a.createdAt)}</span></div>
      </article>
    ))}
  </div>
);

export default function Announcements() {
  const { data, loading } = useFetch("/announcements");
  return (
    <>
      <PageHead title="Announcements" sub="News and updates from HR and your managers." />
      <div className="panel">
        {loading ? <Loader /> : data.length === 0 ? <Empty title="Nothing posted yet" text="New announcements will appear here." /> : <AnnouncementFeed items={data} />}
      </div>
    </>
  );
}
