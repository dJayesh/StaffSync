const User = require("../models/User");

// HR sees everyone (returns null = no filter).
// A Manager sees the employees of their own department.
module.exports = async (user) => {
  if (user.role === "HR") return null;
  const filter = { role: "Employee" };
  if (user.department) filter.department = user.department;
  return (await User.find(filter).select("_id")).map((u) => u._id);
};
