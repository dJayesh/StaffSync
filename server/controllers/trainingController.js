const Training = require("../models/Training");
const h = require("../utils/asyncHandler");

exports.create = h(async (req, res) => {
  const { title, description, date, trainer, assignedTo = [] } = req.body;
  if (!title || !description || !date) return res.status(400).json({ message: "Title, description and date are required" });
  const t = await Training.create({ title, description, date, trainer: trainer || undefined, assignedTo, createdBy: req.user._id });
  res.status(201).json(t);
});

exports.list = h(async (req, res) => {
  const { role, _id } = req.user;
  const filter = role === "HR" ? {} : role === "Manager" ? { createdBy: _id } : { assignedTo: _id };
  res.json(await Training.find(filter).populate("assignedTo", "name").populate("createdBy", "name").sort({ date: 1 }));
});

exports.remove = h(async (req, res) => {
  const t = await Training.findById(req.params.id);
  if (!t) return res.status(404).json({ message: "Training not found" });
  if (req.user.role !== "HR" && !t.createdBy.equals(req.user._id))
    return res.status(403).json({ message: "You can only delete your own programs" });
  await t.deleteOne();
  res.json({ message: "Training program deleted" });
});
