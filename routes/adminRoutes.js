const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  verifyAdminToken,
  getAllAdmins,
  getAdminById,
  getAdminProfile,
} = require("../controllers/adminController");

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post(
  "/logout",
  authMiddleware(["admin", "super-admin", "moderator", "editor"]),
  logoutAdmin
);
router.get(
  "/verify-admin-token",
  authMiddleware(["admin", "super-admin", "moderator", "editor"]),
  verifyAdminToken
);
router.get("/get-all", authMiddleware(["super-admin", "admin"]), getAllAdmins);
router.get(
  "/id/:id",
  authMiddleware(["admin", "super-admin", "moderator", "editor"]),
  getAdminById
);
router.get("/profile", getAdminProfile);

module.exports = router;
