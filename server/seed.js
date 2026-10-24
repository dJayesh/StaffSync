// Run with: npm run seed   (creates demo accounts + sample data)
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Employee = require("./models/Employee");
const Leave = require("./models/Leave");
const Attendance = require("./models/Attendance");
const Announcement = require("./models/Announcement");
const Training = require("./models/Training");
const { startOfDay } = require("./utils/date");

const day = (n) => new Date(Date.now() + n * 864e5);

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Promise.all([User, Employee, Leave, Attendance, Announcement, Training].map((m) => m.deleteMany({})));

  const people = [
    { name: "Aarav Mehta", email: "hr@staffsync.com", role: "HR", department: "Human Resources", position: "HR Director", salary: 90000 },
    { name: "Priya Nair", email: "manager@staffsync.com", role: "Manager", department: "Engineering", position: "Engineering Manager", salary: 80000 },
    { name: "Rohan Verma", email: "employee@staffsync.com", role: "Employee", department: "Engineering", position: "Software Engineer", salary: 55000 },
    { name: "Sneha Kulkarni", email: "sneha@staffsync.com", role: "Employee", department: "Engineering", position: "UI Designer", salary: 50000 },
    { name: "Kabir Shah", email: "kabir@staffsync.com", role: "Employee", department: "Engineering", position: "QA Engineer", salary: 48000 },
  ];

  const users = [];
  for (const p of people) {
    const u = await User.create({ name: p.name, email: p.email, password: "Password@123", role: p.role, department: p.department });
    await Employee.create({
      user: u._id, name: p.name, email: p.email, department: p.department,
      position: p.position, salary: p.salary, joinDate: day(-(200 + users.length * 90)), phone: "+91 98765 4321" + users.length,
    });
    users.push(u);
  }
  const [hr, mgr, e1, e2, e3] = users;

  await Announcement.create([
    { title: "Welcome to StaffSync", message: "Mark your attendance daily, apply for leave from the Leave tab and check here for company news.", postedBy: hr._id, targetAudience: "All" },
    { title: "Quarterly town hall", message: "Join us on Friday at 4 PM in the main hall for the quarterly business update and Q&A.", postedBy: hr._id, targetAudience: "All" },
    { title: "Sprint planning moved", message: "Sprint planning shifts to Monday 10 AM this week.", postedBy: mgr._id, targetAudience: "Employees" },
  ]);

  await Leave.create([
    { user: e1._id, type: "Casual", startDate: day(5), endDate: day(6), reason: "Family function out of town" },
    { user: e2._id, type: "Sick", startDate: day(1), endDate: day(2), reason: "Fever, doctor advised rest" },
    { user: e3._id, type: "Annual", startDate: day(-12), endDate: day(-10), reason: "Short vacation", status: "Approved", approverRole: "Manager" },
  ]);

  for (const u of [e1, e2, e3]) {
    for (const n of [1, 2, 3]) {
      await Attendance.create({ user: u._id, date: startOfDay(day(-n)), checkInTime: "09:12", checkOutTime: "18:05", status: "Present" });
    }
  }

  await Training.create({
    title: "Clean Code Workshop",
    description: "A hands-on session on naming, small functions and code reviews.",
    date: day(7), trainer: "Priya Nair", createdBy: mgr._id, assignedTo: [e1._id, e2._id, e3._id],
  });

  console.log("\nSeed complete. Sign in with password Password@123 using:");
  people.forEach((p) => console.log(`  ${p.role.padEnd(9)} ${p.email}`));
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
