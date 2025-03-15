const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate input: Requires all fields.
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Prevent non-user roles from registering through this route.
    if (["super-admin", "admin", "editor"].includes(role)) {
      return res
        .status(400)
        .json({ message: "Only user registration is allowed here" });
    }

    // Check if the user already exists (case-insensitive)
    // (Consider normalizing email to lowercase for consistency)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user (force role to "user" and mark as verified)
    const newUser = new User({
      name,
      email,
      role: "user",
      password: hashedPassword,
      isVerified: true,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const registerAdmin = async (req, res) => {
  try {
    // Extract role along with other fields
    const { name, email, password, role } = req.body;

    // Validate input
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Only admin, editor, or reviewer registrations are allowed here.
    if (!["admin", "editor", "reviewer"].includes(role)) {
      return res
        .status(400)
        .json({ message: "Invalid role for this endpoint" });
    }

    // If role is super-admin, ensure only one exists.
    if (role === "super-admin") {
      const superAdminExists = await User.findOne({ role: "super-admin" });
      if (superAdminExists) {
        return res.status(400).json({ message: "Super admin already exists" });
      }
    }

    // Check if the user already exists (case-insensitive)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash password

    // Create new admin/editor/reviewer user with isVerified set to false.
    const newUser = new User({
      name,
      email,
      role,
      password: hashedPassword,
      isVerified: false,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const verifyAdmin = async (req, res) => {
  try {
    // Ensure the requester is a super-admin
    if (!req.user || req.user.role !== "super-admin") {
      return res.status(403).json({
        message: "Access denied. Only a super-admin can verify admins.",
      });
    }

    // Get the admin ID from the request parameters
    const id = req.params.id;

    // Find the admin user by ID
    const adminUser = await User.findById(id);
    if (!adminUser) {
      return res.status(404).json({ message: "Admin user not found." });
    }

    // Prevent verification of a super-admin or if already verified
    if (adminUser.role === "super-admin") {
      return res
        .status(400)
        .json({ message: "Super-admin verification is not applicable." });
    }
    if (adminUser.isVerified) {
      return res.status(400).json({ message: "Admin is already verified." });
    }

    // Update the isVerified flag to true
    adminUser.isVerified = true;
    await adminUser.save();

    return res.status(200).json({ message: "Admin verified successfully." });
  } catch (error) {
    console.error("Error", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "Account not verified. Contact Super Admin." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate Access & Refresh Tokens
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRE } // Short lifespan
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRE } // Long lifespan
    );

    // Set Refresh Token in HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax", // Lax is better for CORS then strict
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      message: "Login successful",
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
};

const verifyRefreshToken = async (req, res) => {
  try {
    // Extract refresh token from cookies
    const token = req.cookies?.refreshToken;
    if (!token) {
      console.log("No refresh token found in cookies");
      return res.status(401).json({ message: "Unauthorized, no refresh token" });
    }
    console.log("Refresh token found, verifying token...");

    // Custom token verification using a Promise with a callback
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decodedToken) => {
        if (err) {
          return reject(err);
        }
        resolve(decodedToken);
      });
    });

    console.log("Token decoded successfully:", decoded);

    // Confirm the refresh token payload contains the user's ID
    if (!decoded || !decoded.id) {
      console.log("Decoded token does not contain user id");
      return res.status(403).json({ message: "Invalid token payload" });
    }
    console.log(`Token payload confirmed: user id = ${decoded.id}`);

    // Find user in the database
    const user = await User.findById(decoded.id);
    if (!user) {
      console.log(`User not found for id: ${decoded.id}`);
      return res.status(404).json({ message: "User not found. Please log in again." });
    }
    console.log("User found:", user.email);

    // Generate a new access token
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRE }
    );
    console.log("New access token generated for user:", user.email);

    res.json({ accessToken });
  } catch (error) {
    console.error("Error in refreshToken:", error);
    res.status(403).json({ message: "Invalid refresh token", error: error.message });
  }
};

module.exports = {
  registerUser,
  registerAdmin,
  verifyAdmin,
  loginUser,
  logoutUser,
  verifyRefreshToken,
};
