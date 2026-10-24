const User = require("../models/User");
const Employee = require("../models/Employee");
const Leave = require("../models/Leave");
const Attendance = require("../models/Attendance");
const Announcement = require("../models/Announcement");
const h = require("../utils/asyncHandler");
const teamUserIds = require("../utils/team");
const { startOfDay } = require("../utils/date");

const ROLES = ["HR", "Employee", "Manager"];
const pick = (o, keys) =>
  Object.fromEntries(keys.filter((k) => o[k] !== undefined && o[k] !== null && o[k] !== "").map((k) => [k, o[k]]));

exports.list = h(async (req, res) => {
  const ids = await teamUserIds(req.user);
  const filter = ids ? { user: { $in: ids } } : {};
  res.json(await Employee.find(filter).populate("user", "role").sort({ name: 1 }));
});

exports.create = h(async (req, res) => {
  const { name, email, password, role = "Employee" } = req.body;
  const department = (req.body.department || "General").trim();
  if (!name || !email || !password) return res.status(400).json({ message: "Name, email and password are required" });
  if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });
  if (!ROLES.includes(role)) return res.status(400).json({ message: "Invalid role" });
  if (await User.findOne({ email: email.toLowerCase() }))
    return res.status(400).json({ message: "An account with this email already exists" });

  const user = await User.create({ name, email, password, role, department });
  const emp = await Employee.create({
    user: user._id, name, email: user.email, department,
    ...pick(req.body, ["position", "salary", "joinDate", "phone", "address"]),
  });
  res.status(201).json(emp);
});

exports.update = h(async (req, res) => {
  const emp = await Employee.findById(req.params.id);
  if (!emp) return res.status(404).json({ message: "Employee not found" });

  Object.assign(emp, pick(req.body, ["name", "department", "position", "salary", "joinDate", "phone", "address"]));
  await emp.save();

  const userUpdate = pick(req.body, ["name", "department"]);
  if (ROLES.includes(req.body.role)) userUpdate.role = req.body.role;
  if (emp.user) await User.findByIdAndUpdate(emp.user, userUpdate);
  res.json(emp);
});

exports.remove = h(async (req, res) => {
  const emp = await Employee.findById(req.params.id);
  if (!emp) return res.status(404).json({ message: "Employee not found" });
  if (emp.user && emp.user.equals(req.user._id))
    return res.status(400).json({ message: "You cannot delete your own account" });
  if (emp.user) {
    await Promise.all([
      User.findByIdAndDelete(emp.user),
      Leave.deleteMany({ user: emp.user }),
      Attendance.deleteMany({ user: emp.user }),
    ]);
  }
  await emp.deleteOne();
  res.json({ message: "Employee removed" });
});

exports.getMe = h(async (req, res) => {
  let emp = await Employee.findOne({ user: req.user._id });
  if (!emp) {
    emp = await Employee.create({ user: req.user._id, name: req.user.name, email: req.user.email, department: req.user.department });
  }
  res.json(emp);
});

exports.updateMe = h(async (req, res) => {
  const emp = await Employee.findOne({ user: req.user._id });
  if (!emp) return res.status(404).json({ message: "Profile not found" });
  const { name, phone, address } = req.body;
  if (name !== undefined && !name.trim()) return res.status(400).json({ message: "Name cannot be empty" });
  if (name) { emp.name = name.trim(); await User.findByIdAndUpdate(req.user._id, { name: emp.name }); }
  if (phone !== undefined) emp.phone = phone;
  if (address !== undefined) emp.address = address;
  await emp.save();
  res.json(emp);
});

exports.stats = h(async (req, res) => {
  const today = startOfDay();
  const ids = await teamUserIds(req.user);
  const scope = ids ? { user: { $in: ids } } : {};
  const [employees, pendingLeaves, presentToday, announcements, departments] = await Promise.all([
    ids ? ids.length : Employee.countDocuments(),
    Leave.countDocuments({ ...scope, status: "Pending" }),
    Attendance.countDocuments({ ...scope, date: today }),
    Announcement.countDocuments(),
    Employee.aggregate([{ $group: { _id: "$department", count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
  ]);
  res.json({ employees, pendingLeaves, presentToday, announcements, departments });
});
