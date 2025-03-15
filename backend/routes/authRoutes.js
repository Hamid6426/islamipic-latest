const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  verifyRefreshToken,
  verifyAdmin,
  registerAdmin,
} = require("../controllers/authController");
const {
  authenticateUser,
  authorizeRoles,
  normalizeEmail,
} = require("../middlewares/authMiddlewares");

const router = express.Router();

router.post("/register", normalizeEmail, registerUser);
router.post("/register-admin", normalizeEmail, registerAdmin);
router.post("/login", normalizeEmail, loginUser);

router.post("/logout", authenticateUser, logoutUser);
router.post("/verify-refresh-token", verifyRefreshToken);
router.post("/verify-admin/:id", authenticateUser, authorizeRoles(["super-admin"]), verifyAdmin);

module.exports = router;
