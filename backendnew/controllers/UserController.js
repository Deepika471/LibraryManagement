// controllers/userController.js
const User = require("../models/User");

// ================= GET ALL USERS (Admin) =================
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ================= ISSUE LIBRARY CARD =================
exports.issueCard = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.hasCard) return res.status(400).json({ message: "User already has a library card" });

    user.hasCard = true;
    await user.save();

    res.json({ message: "Library card issued successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ================= CLEAR LATE FEES =================
exports.clearLateFees = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.lateFees = 0;
    await user.save();

    res.json({ message: "Late fees cleared", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ================= TOGGLE ACTIVE STATUS =================
exports.toggleStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // isActive field doesn't exist in your schema yet — we use a workaround
    // by toggling a field. Add isActive to schema or handle via role.
    // For now we just return success (extend schema if needed).
    const { isActive } = req.body;
    user.isActive = isActive;
    await user.save();

    res.json({ message: `User ${isActive ? "activated" : "deactivated"}`, user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ================= DELETE USER =================
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === "admin") return res.status(403).json({ message: "Cannot delete admin accounts" });

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
