const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // normalizeEmail middlware is used
      trim: true,
    },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["super-admin", "admin", "editor", "reviewer", "user"],
      required: true,
    },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
