const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const db = require("./config/db");
const authRouter = require("./routes/authRoutes");
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
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:5174", // when using both vite projects
        "http://localhost:4173", // vite preview (staging)
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        process.env.BACKEND_URL, 
        process.env.FRONTEND_URL,
      ];
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.get("/api", (_req, res) => {
  res.send("Hello! This is our backend");
});

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/images", imageRouter);

// Serve React-Vite Frontend
const publicPath = path.join(__dirname, "public", "dist");
app.use(express.static(publicPath));

// Handle React App Routing (Non-API routes)
app.get("*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

module.exports = app;
