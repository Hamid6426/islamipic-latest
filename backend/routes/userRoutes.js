const express = require("express");
const {
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  updateUserPassword,
  updateUserRole,
  getUsersByRole,
} = require("../controllers/userController");

const {
  authenticateUser,
  authorizeRoles,
  normalizeEmail
} = require("../middlewares/authMiddlewares");

const router = express.Router();

router.get(
  "/all",
  authenticateUser,
  authorizeRoles(["super-admin", "admin"]),
  getAllUsers
);

router.get(
  "/:id/profile",
  authenticateUser,
  authorizeRoles(["super-admin", "admin", "editor", "user"]),
  getUserProfile
);

router.patch(
  "/:id/patch",
  authenticateUser,
  normalizeEmail,
  authorizeRoles(["super-admin", "admin", "editor", "user"]),
  updateUserProfile
);

router.delete(
  "/:id/delete",
  authenticateUser,
  authorizeRoles(["super-admin"]),
  deleteUserProfile
);

router.patch(
  "/:id/password",
  authenticateUser,
  authorizeRoles(["super-admin", "admin", "editor", "user"]),
  updateUserPassword
);

router.patch(
  "/:id/role",
  authenticateUser,
  authorizeRoles(["super-admin"]),
  updateUserRole
);

router.get(
  "/role/:role",
  authenticateUser,
  authorizeRoles(["super-admin"]),
  getUsersByRole
);

module.exports = router;
