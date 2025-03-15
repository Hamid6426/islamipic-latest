const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const User = require("../models/User");

// Tokens are saved as cookies and parse with cookie-parser at app.js
// There are two tokens currently: refreshToken and accessToken
// JWT_SECRET is available in .env and dotenv is configured in app.js

const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Authorization token is required. Please login." });
    }

    const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"
    let decoded;

    try {
      decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      console.log("Decoded Access Token:", decoded);
    } catch (err) {
      console.log("Access Token Error:", err.message);
      return res
        .status(401)
        .json({ message: "Invalid or expired access token. Please login again." });
    }

    // Find the user associated with the token
    const user = await User.findById(decoded.id);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found. Please register." });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: " + error.message });
  }
};

const authorizeRoles = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({
          message:
            "Forbidden: You do not have permission to access this resource.",
        });
    }
    next();
  };
};

const normalizeEmail = (req, res, next) => {
  if (req.body.email) {
    req.body.email = req.body.email.toLowerCase().trim();
  }
  next();
};

module.exports = {
  authenticateUser,
  authorizeRoles,
  normalizeEmail,
}
