const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Employee = require("../models/Employee");
const h = require("../utils/asyncHandler");

const ROLES = ["HR", "Employee", "Manager"];
const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
const pack = (u) => ({ _id: u._id, name: u.name, email: u.email, role: u.role, department: u.department });

exports.register = h(async (req, res) => {
  const { name, email, password, role = "Employee" } = req.body;
  const department = (req.body.department || "General").trim();
  if (!name || !email || !password) return res.status(400).json({ message: "Name, email and password are required" });
  if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ message: "Enter a valid email address" });
  if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });
  if (!ROLES.includes(role)) return res.status(400).json({ message: "Invalid role selected" });
  if (await User.findOne({ email: email.toLowerCase() }))
    return res.status(400).json({ message: "An account with this email already exists" });

  const user = await User.create({ name, email, password, role, department });
  await Employee.create({ user: user._id, name, email: user.email, department });
  res.status(201).json({ token: sign(user._id), user: pack(user) });
});

exports.login = h(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password are required" });
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ message: "Incorrect email or password" });
  res.json({ token: sign(user._id), user: pack(user) });
});

exports.me = (req, res) => res.json({ user: pack(req.user) });
