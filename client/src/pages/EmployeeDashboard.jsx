import { useState } from "react";
import Layout from "../components/Layout";
import { EmployeeOverview } from "../components/Overviews";
import Attendance from "../components/employee/Attendance";
import LeaveApply from "../components/employee/LeaveApply";
import LeaveList from "../components/employee/LeaveList";
import Training from "../components/employee/Training";
import Announcements from "../components/employee/Announcements";
import Profile from "../components/employee/Profile";
import { PageHead } from "../components/ui";

const ITEMS = [
  { key: "overview", label: "Overview", icon: "grid" },
  { key: "attendance", label: "Attendance", icon: "clock" },
  { key: "leave", label: "Leave", icon: "file" },
  { key: "training", label: "Training", icon: "book" },
  { key: "announcements", label: "Announcements", icon: "bell" },
  { key: "profile", label: "My profile", icon: "user" },
];

export default function EmployeeDashboard() {
  const [tab, setTab] = useState("overview");
  const [refresh, setRefresh] = useState(0);
  return (
    <Layout items={ITEMS} active={tab} onChange={setTab}>
      {tab === "overview" && <EmployeeOverview go={setTab} />}
      {tab === "attendance" && <Attendance />}
      {tab === "leave" && (
        <>
          <PageHead title="Leave" sub="Apply for time off and track your requests." />
          <LeaveApply onDone={() => setRefresh((k) => k + 1)} />
          <LeaveList refreshKey={refresh} />
        </>
      )}
      {tab === "training" && <Training />}
      {tab === "announcements" && <Announcements />}
      {tab === "profile" && <Profile />}
    </Layout>
  );
}
