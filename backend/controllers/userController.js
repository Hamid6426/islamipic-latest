const User = require("../models/User");
const bcrypt = require("bcrypt");

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error("Get User Profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update allowed fields
    if (name) user.name = name;
    if (email) user.email = email; // Email normalization handled via schema/middleware

    await user.save();
    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Update User Profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteUserProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete User Profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    // pagination via query parameters (e.g., ?limit=10&skip=0)
    const users = await User.find().select("-password");
    res.status(200).json({ users });
  } catch (error) {
    console.error("Get All Users error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateUserPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Old password is incorrect." });
    }

    // Hash new password and update
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Update Password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const allowedRoles = ["super-admin", "admin", "editor", "user"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role provided." });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update user role
    user.role = role;
    await user.save();
    res.status(200).json({ message: "User role updated successfully", user });
  } catch (error) {
    console.error("Update User Role error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;
    const allowedRoles = ["super-admin", "admin", "editor", "user"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role provided." });
    }

    const users = await User.find({ role }).select("-password");
    res.status(200).json({ users });
  } catch (error) {
    console.error("Get Users By Role error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  updateUserPassword,
  updateUserRole,
  getUsersByRole
};
