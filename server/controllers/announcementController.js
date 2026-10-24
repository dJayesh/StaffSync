const Announcement = require("../models/Announcement");
const h = require("../utils/asyncHandler");

exports.create = h(async (req, res) => {
  const { title, message, targetAudience } = req.body;
  if (!title || !message) return res.status(400).json({ message: "Title and message are required" });
  const a = await Announcement.create({ title, message, targetAudience, postedBy: req.user._id });
  res.status(201).json(a);
});

exports.list = h(async (req, res) => {
  const role = req.user.role;
  const filter = role === "HR" ? {} : { targetAudience: { $in: ["All", role === "Manager" ? "Managers" : "Employees"] } };
  res.json(await Announcement.find(filter).populate("postedBy", "name role").sort({ createdAt: -1 }));
});

exports.remove = h(async (req, res) => {
  const a = await Announcement.findById(req.params.id);
  if (!a) return res.status(404).json({ message: "Announcement not found" });
  if (req.user.role !== "HR" && !a.postedBy.equals(req.user._id))
    return res.status(403).json({ message: "You can only delete your own announcements" });
  await a.deleteOne();
  res.json({ message: "Announcement deleted" });
});
