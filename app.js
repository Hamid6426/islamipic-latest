const express = require("express");
const path = require("path"); // ✅ Import path module
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const db = require("./config/db");
const { verifyAdmin } = require("./controllers/adminController");
const adminRouter = require("./routes/adminRoutes");
const imageRouter = require("./routes/imageRoutes");
const userRouter = require("./routes/userRoutes");

// Load environment variables
dotenv.config();

const app = express();

// Connect to database
db().catch((err) => {
  console.error("Database connection failed:", err);
  process.exit(1);
});

// Middleware
app.use(cors({ 
  origin: process.env.FRONTEND_URL, 
  credentials: true 
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.get("/api", (_req, res) => {
  res.send("Hello! This is our backend");
});

app.get("/verify-admin", verifyAdmin);
app.use("/api/admins", adminRouter);
app.use("/api/users", userRouter);
app.use("/api/images", imageRouter);

// ✅ Serve React-Vite Frontend
const publicPath = path.join(__dirname, "public", "dist");
app.use(express.static(publicPath));

// ✅ Handle React App Routing (Non-API routes)
app.get("*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

module.exports = app;
