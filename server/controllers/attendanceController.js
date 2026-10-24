const Attendance = require("../models/Attendance");
const User = require("../models/User");
const h = require("../utils/asyncHandler");
const teamUserIds = require("../utils/team");
const { startOfDay } = require("../utils/date");

const fmt = (d) => d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

exports.checkIn = h(async (req, res) => {
  const date = startOfDay();
  if (await Attendance.findOne({ user: req.user._id, date }))
    return res.status(400).json({ message: "You have already checked in today" });
  const rec = await Attendance.create({ user: req.user._id, date, checkInTime: fmt(new Date()), status: "Present" });
  res.status(201).json(rec);
});

exports.checkOut = h(async (req, res) => {
  const rec = await Attendance.findOne({ user: req.user._id, date: startOfDay() });
  if (!rec) return res.status(400).json({ message: "Check in first before checking out" });
  if (rec.checkOutTime) return res.status(400).json({ message: "You have already checked out today" });
  const now = new Date();
  rec.checkOutTime = fmt(now);
  if ((now - rec.createdAt) / 36e5 < 4) rec.status = "Half Day"; // under 4 hours worked
  await rec.save();
  res.json(rec);
});

exports.mine = h(async (req, res) => {
  res.json(await Attendance.find({ user: req.user._id }).sort({ date: -1 }).limit(60));
});

// HR: everyone. Manager: own team. Returns one row per person for the chosen date.
exports.list = h(async (req, res) => {
  const date = req.query.date ? new Date(`${req.query.date}T00:00:00`) : new Date();
  date.setHours(0, 0, 0, 0);
  const ids = await teamUserIds(req.user);
  const userFilter = ids ? { _id: { $in: ids } } : { role: { $in: ["Employee", "Manager"] } };
  const users = await User.find(userFilter).select("name email department role").sort({ name: 1 });
  const records = await Attendance.find({ user: { $in: users.map((u) => u._id) }, date });
  const byUser = Object.fromEntries(records.map((r) => [String(r.user), r]));
  res.json(users.map((u) => ({ user: u, record: byUser[String(u._id)] || null })));
});
