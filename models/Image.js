const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    description: { type: String },
    image: { type: String, required: true },
    tags: [{ type: String, index: true }],
    category: { type: String, required: true, index: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId }],
    shares: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 }
  },
  { timestamps: true }
);

imageSchema.index({ title: "text", description: "text", tags: "text" });


const Image = mongoose.model("Image", imageSchema);
module.exports = Image;
