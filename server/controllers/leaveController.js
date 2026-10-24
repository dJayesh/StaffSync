const Leave = require("../models/Leave");
const h = require("../utils/asyncHandler");
const teamUserIds = require("../utils/team");

exports.apply = h(async (req, res) => {
  const { startDate, endDate, reason, type } = req.body;
  if (!startDate || !endDate || !reason || !reason.trim())
    return res.status(400).json({ message: "Start date, end date and reason are required" });
  const s = new Date(startDate), e = new Date(endDate);
  if (isNaN(s) || isNaN(e) || e < s) return res.status(400).json({ message: "End date must be on or after the start date" });
  const leave = await Leave.create({ user: req.user._id, startDate: s, endDate: e, reason: reason.trim(), type });
  res.status(201).json(leave);
});

exports.mine = h(async (req, res) => {
  res.json(await Leave.find({ user: req.user._id }).sort({ createdAt: -1 }));
});

exports.list = h(async (req, res) => {
  const ids = await teamUserIds(req.user);
  const filter = ids ? { user: { $in: ids } } : {};
  if (req.query.status) filter.status = req.query.status;
  res.json(await Leave.find(filter).populate("user", "name email department role").sort({ createdAt: -1 }));
});

exports.updateStatus = h(async (req, res) => {
  const { status } = req.body;
  if (!["Approved", "Rejected"].includes(status)) return res.status(400).json({ message: "Status must be Approved or Rejected" });
  const leave = await Leave.findById(req.params.id);
  if (!leave) return res.status(404).json({ message: "Leave request not found" });

  const ids = await teamUserIds(req.user);
  if (ids && !ids.some((i) => i.equals(leave.user)))
    return res.status(403).json({ message: "This request is outside your team" });
  if (leave.status !== "Pending") return res.status(400).json({ message: `This request was already ${leave.status.toLowerCase()}` });

  leave.status = status;
  leave.approverRole = req.user.role;
  await leave.save();
  res.json(leave);
});
