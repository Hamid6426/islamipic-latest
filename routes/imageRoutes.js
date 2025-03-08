const express = require("express");
const multer = require("multer");
const authMiddleware = require("../middlewares/authMiddleware"); // Role-based auth middleware

const {
  // **Admin Actions**
  uploadImage,
  findImageByIdAndUpdate,
  findImageBySlugAndUpdate,
  findImageByIdAndDelete,
  findImageBySlugAndDelete,

  // **Public Actions**
  getAllImages,
  getImageById,
  getImageBySlug,
  getImagesByCategory,
  getImagesByTag,
  searchImages,

  // **Authenticated Actions**
  findImageByIdAndLike,
  findImageBySlugAndLike,
  findImageByIdAndUnlike,
  findImageBySlugAndUnlike,
  findImageByIdAndDownload,
  findImageBySlugAndDownload,

  // **Protected Actions**
  incrementViews,
  incrementDownloads,
  incrementShares,
} = require("../controllers/imageController");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// **Admin Routes (Requires Admin or Super Admin)**
router.post("/upload", upload.single("file"), authMiddleware(["admin", "super-admin"]), uploadImage);
router.put("/:id/update", upload.single("file"), authMiddleware(["admin", "super-admin"]), findImageByIdAndUpdate);
router.put("/:slug/update", upload.single("file"), authMiddleware(["admin", "super-admin"]), findImageBySlugAndUpdate);
router.delete("/:id/delete", authMiddleware(["admin", "super-admin"]), findImageByIdAndDelete);
router.delete("/:slug/delete", authMiddleware(["admin", "super-admin"]), findImageBySlugAndDelete);

// **Public Routes (No authentication required)**
router.get("/get-all", getAllImages);
router.get("/id/:id", getImageById);
router.get("/slug/:slug", getImageBySlug);
router.get("/category/:category", getImagesByCategory);
router.get("/tag/:tag", getImagesByTag);
router.get("/search", searchImages);

// **Authenticated Routes (Requires User, Admin, or Super Admin)**
router.patch("/:id/like", authMiddleware(["user", "admin", "super-admin"]), findImageByIdAndLike);
router.patch("/:slug/like", authMiddleware(["user", "admin", "super-admin"]), findImageBySlugAndLike);
router.patch("/:id/unlike", authMiddleware(["user", "admin", "super-admin"]), findImageByIdAndUnlike);
router.patch("/:slug/unlike", authMiddleware(["user", "admin", "super-admin"]), findImageBySlugAndUnlike);
router.get("/:id/download", authMiddleware(["user", "admin", "super-admin"]), findImageByIdAndDownload);
router.get("/:slug/download", authMiddleware(["user", "admin", "super-admin"]), findImageBySlugAndDownload);

// **Protected Action Routes (Prevents Spam)**
router.patch("/:id/views", authMiddleware(["user", "admin", "super-admin"]), incrementViews);
router.patch("/:id/downloads", authMiddleware(["user", "admin", "super-admin"]), incrementDownloads);
router.patch("/:id/shares", authMiddleware(["user", "admin", "super-admin"]), incrementShares);

module.exports = router;
