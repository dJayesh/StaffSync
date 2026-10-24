import { useState } from "react";
import Layout from "../components/Layout";
import { StaffOverview } from "../components/Overviews";
import EmployeeCRUD from "../components/hr/EmployeeCRUD";
import LeaveApplications from "../components/hr/LeaveApplications";
import AttendanceSummary from "../components/hr/AttendanceSummary";
import AnnouncementsManager from "../components/hr/AnnouncementsManager";

const ITEMS = [
  { key: "overview", label: "Overview", icon: "grid" },
  { key: "employees", label: "Employees", icon: "users" },
  { key: "leaves", label: "Leave requests", icon: "file" },
  { key: "attendance", label: "Attendance", icon: "clock" },
  { key: "announcements", label: "Announcements", icon: "bell" },
];

export default function HrDashboard() {
  const [tab, setTab] = useState("overview");
  return (
    <Layout items={ITEMS} active={tab} onChange={setTab}>
      {tab === "overview" && <StaffOverview role="HR" go={setTab} leaveTab="leaves" />}
      {tab === "employees" && <EmployeeCRUD />}
      {tab === "leaves" && <LeaveApplications />}
      {tab === "attendance" && <AttendanceSummary />}
      {tab === "announcements" && <AnnouncementsManager />}
    </Layout>
  );
}
