const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    description: { type: String },
    imageUrl: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    tags: [{ type: String }],
    category: {
      type: String,
      required: true,
      enum: [
        "3D",
        "Arts",
        "Icons",
        "Textures",
        "Calligraphy",
        "Hadiths",
        "Mosques",
        "Quotes",
        "Posts",
        "Duas",
        "Ayahs",
        "Others",
      ],
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId }],
    shares: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
  },
  { timestamps: true }
);

imageSchema.index({
  title: "text",
  description: "text",
  tags: "text",
  category: "text",
});

const Image = mongoose.model("Image", imageSchema);
module.exports = Image;
