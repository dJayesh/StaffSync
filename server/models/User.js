const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required"], trim: true },
  email: { type: String, required: [true, "Email is required"], unique: true, lowercase: true, trim: true },
  password: { type: String, required: [true, "Password is required"], minlength: 6 },
  role: { type: String, enum: ["HR", "Employee", "Manager"], default: "Employee" },
  department: { type: String, default: "General", trim: true },
  createdAt: { type: Date, default: Date.now },
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = function (entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model("User", userSchema);
