const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Title is required"], trim: true },
    message: { type: String, required: [true, "Message is required"], trim: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    targetAudience: { type: String, enum: ["All", "Employees", "Managers"], default: "All" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Announcement", announcementSchema);
