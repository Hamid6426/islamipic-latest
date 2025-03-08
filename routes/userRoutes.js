const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  registerUser,
  loginUser,
  logoutUser,
  getAllUsers,
  getUserById,
  getUserProfile,
} = require("../controllers/userController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", authMiddleware(["user"]), logoutUser);
router.get("/all", authMiddleware(["super-admin", "admin"]), getAllUsers);
router.get("/id/:id", authMiddleware(["super-admin", "admin"]), getUserById);
router.get("/profile", authMiddleware(["user", "admin", "super-admin"]), getUserProfile);


module.exports = router;
