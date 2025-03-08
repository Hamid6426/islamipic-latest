const crypto = require("crypto");
const Admin = require("../models/Admin");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const validRoles = ["admin", "moderator", "editor"];

const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role specified." });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Email already exists." });
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword, // Store hashed password
      role,
      isVerified: false,
      verificationToken,
    });

    await newAdmin.save();

    await sendVerificationEmail(newAdmin);

    res.status(201).json({
      message: "Admin registered successfully. Awaiting verification.",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const sendVerificationEmail = async (admin) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SUPER_ADMIN_EMAIL,
      pass: process.env.SUPER_ADMIN_PASS,
    },
  });

  const verificationLink = `${process.env.APP_BASE_URL}/verify-admin?token=${admin.verificationToken}`;
  const mailOptions = {
    from: `${admin.email}`,
    to: process.env.SUPER_ADMIN_EMAIL,
    subject: "New Admin Verification Request",
    text: `Please verify the new admin:
         Name: ${admin.name}
         Email: ${admin.email}
         Click the link to verify: ${verificationLink}`,
  };

  await transporter.sendMail(mailOptions);
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt with email:", email);

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      console.log("Admin not found");
      return res.status(400).json({ message: "Admin not found" });
    }

    // Check if email is verified
    if (!admin.isVerified) {
      console.log("Admin approval pending");
      return res.status(403).json({ message: "Admin approval pending" });
    }

    // Compare the hashed password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      console.log("Invalid credentials");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const adminToken = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role, name: admin.name },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    res.cookie("adminToken", adminToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax", // CSRF protection in production
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    console.log("Login successful");
    console.log(`token: ${adminToken}`);
    res.status(200).json({
      message: "Login successful",
      admin: { name: admin.name, email: admin.email, role: admin.role },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const logoutAdmin = async (req, res) => {
  res.clearCookie('userToken');
  res.status(200).json({ message: 'User logged out successfully!' });
};

const verifyAdmin = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res
        .status(400)
        .json({ message: "Verification token is required" });
    }

    // Find admin by verification token
    const admin = await Admin.findOne({ verificationToken: token });

    if (!admin) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Mark admin as verified
    admin.isVerified = true;
    admin.verificationToken = null; // Remove the token after verification
    await admin.save();

    res.status(200).json({ message: "Admin verified successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const verifyAdminToken = async (req, res) => {
  const token = req.cookies.adminToken; // Ensure you're using `req.cookies`
  // console.log("Received token:", token); 

  if (!token) {
    return res.status(403).json({ message: "Unauthorized - No token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ isValid: true, admin: decoded });
  } catch (error) {
    console.error("JWT Verification Failed:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({});
    res.status(200).json(admins);
  } catch (error) {
    console.error("Error fetching all admins:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json(admin);
  } catch (error) {
    console.error("Error fetching admin by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET admin profile from cookies
const getAdminProfile = async (req, res) => {
  try {
    const token = req.cookies.adminToken; // Read token from HTTP-only cookie
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Admin.findById(decoded.id).select("-password"); // Exclude password

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  verifyAdmin,
  verifyAdminToken,
  getAllAdmins,
  getAdminById,
  getAdminProfile
};
