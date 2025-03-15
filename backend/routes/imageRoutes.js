const express = require("express");
const multer = require("multer");

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

const {
  authenticateUser,
  authorizeRoles,
} = require("../middlewares/authMiddlewares");

const router = express.Router();

const upload = multer({
  dest: "uploads/",
  // limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
  },
});

router.post(
  "/upload",
  upload.single("image"),
  authenticateUser,
  authorizeRoles(["admin", "super-admin"]),
  uploadImage
);
router.put(
  "/:id/update",
  upload.single("image"),
  authenticateUser,
  authorizeRoles(["admin", "super-admin"]),
  findImageByIdAndUpdate
);
router.put(
  "/:slug/update",
  upload.single("image"),
  authenticateUser,
  authorizeRoles(["admin", "super-admin"]),
  findImageBySlugAndUpdate
);
router.delete(
  "/:id/delete",
  authenticateUser,
  authorizeRoles(["admin", "super-admin"]),
  findImageByIdAndDelete
);
router.delete(
  "/:slug/delete",
  authenticateUser,
  authorizeRoles(["admin", "super-admin"]),
  findImageBySlugAndDelete
);

// **Public Routes (No authentication required)**
router.get("/all", getAllImages);
router.get("/id/:id", getImageById);
router.get("/slug/:slug", getImageBySlug);
router.get("/category/:category", getImagesByCategory);
router.get("/tag/:tag", getImagesByTag);
router.get("/search", searchImages);

// **Authenticated Routes (Requires User, Admin, or Super Admin)**
router.patch(
  "/:id/like",
  authenticateUser,
  authorizeRoles(["user", "admin", "super-admin"]),
  findImageByIdAndLike
);
router.patch(
  "/:slug/like",
  authenticateUser,
  authorizeRoles(["user", "admin", "super-admin"]),
  findImageBySlugAndLike
);
router.patch(
  "/:id/unlike",
  authenticateUser,
  authorizeRoles(["user", "admin", "super-admin"]),
  findImageByIdAndUnlike
);
router.patch(
  "/:slug/unlike",
  authenticateUser,
  authorizeRoles(["user", "admin", "super-admin"]),
  findImageBySlugAndUnlike
);
router.get(
  "/:id/download",
  authenticateUser,
  authorizeRoles(["user", "admin", "super-admin"]),
  findImageByIdAndDownload
);
router.get(
  "/:slug/download",
  authenticateUser,
  authorizeRoles(["user", "admin", "super-admin"]),
  findImageBySlugAndDownload
);
``;

// **Protected Action Routes (Prevents Spam)**
router.patch(
  "/:id/views",
  authenticateUser,
  authorizeRoles(["user", "admin", "super-admin"]),
  incrementViews
);
router.patch(
  "/:id/downloads",
  authenticateUser,
  authorizeRoles(["user", "admin", "super-admin"]),
  incrementDownloads
);
router.patch(
  "/:id/shares",
  authenticateUser,
  authorizeRoles(["user", "admin", "super-admin"]),
  incrementShares
);

module.exports = router;
