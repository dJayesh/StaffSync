const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  department: { type: String, default: "General" },
  position: { type: String, default: "Team Member" },
  salary: { type: Number, default: 0 },
  joinDate: { type: Date, default: Date.now },
  phone: { type: String },
  address: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Employee", employeeSchema);
