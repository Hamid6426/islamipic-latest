const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables

const db = async () => {
  const URI = process.env.MONGO_URI;
  if (!URI) {
    console.error("MONGO_URI is not defined in environment variables");
    return;
  }

  try {
    await mongoose.connect(URI);
    if (process.env.NODE_ENV !== "test") {
      console.log("DB connected successfully");
    }
  } catch (err) {
    console.error("DB connection error:", err);
  }
};

module.exports = db;
