import useFetch from "../../useFetch";
import { PageHead, Loader, Empty, Icon, Badge, fmtDate } from "../ui";

export default function Training() {
  const { data, loading } = useFetch("/trainings");
  return (
    <>
      <PageHead title="Training programs" sub="Programs your manager has assigned to you." />
      {loading ? <Loader /> : data.length === 0 ? (
        <div className="panel"><Empty title="No programs assigned" text="When your manager assigns a program, it will show up here." /></div>
      ) : (
        <div className="cards">
          {data.map((t) => {
            const past = new Date(t.date) < new Date();
            return (
              <div className="card" key={t._id}>
                <span className="date-chip"><Icon name="calendar" size={16} />{fmtDate(t.date)}</span>
                <h4>{t.title}</h4>
                <p>{t.description}</p>
                <div className="meta"><span>Trainer: {t.trainer}</span><Badge tone={past ? "muted" : "ok"}>{past ? "Completed" : "Upcoming"}</Badge></div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
