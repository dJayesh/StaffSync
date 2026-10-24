import { useState } from "react";
import Layout from "../components/Layout";
import { StaffOverview } from "../components/Overviews";
import LeaveApplications from "../components/manager/LeaveApplications";
import TrainingManagement from "../components/manager/TrainingManagement";
import AttendanceSummary from "../components/hr/AttendanceSummary";
import AnnouncementsManager from "../components/hr/AnnouncementsManager";
import Attendance from "../components/employee/Attendance";
import LeaveApply from "../components/employee/LeaveApply";
import LeaveList from "../components/employee/LeaveList";
import { PageHead } from "../components/ui";

const ITEMS = [
  { key: "overview", label: "Overview", icon: "grid" },
  { key: "leaves", label: "Team leave", icon: "file" },
  { key: "team", label: "Team attendance", icon: "users" },
  { key: "training", label: "Training", icon: "book" },
  { key: "announcements", label: "Announcements", icon: "bell" },
  { key: "mine", label: "My attendance", icon: "clock" },
  { key: "myleave", label: "My leave", icon: "calendar" },
];

export default function ManagerDashboard() {
  const [tab, setTab] = useState("overview");
  const [refresh, setRefresh] = useState(0);
  return (
    <Layout items={ITEMS} active={tab} onChange={setTab}>
      {tab === "overview" && <StaffOverview role="Manager" go={setTab} leaveTab="leaves" />}
      {tab === "leaves" && <LeaveApplications />}
      {tab === "team" && <AttendanceSummary title="Team attendance" sub="Check who on your team is in today." />}
      {tab === "training" && <TrainingManagement />}
      {tab === "announcements" && <AnnouncementsManager />}
      {tab === "mine" && <Attendance />}
      {tab === "myleave" && (
        <>
          <PageHead title="My leave" sub="Your own requests are reviewed by HR." />
          <LeaveApply onDone={() => setRefresh((k) => k + 1)} />
          <LeaveList refreshKey={refresh} />
        </>
      )}
    </Layout>
  );
}
