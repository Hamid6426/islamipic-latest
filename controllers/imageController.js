const Image = require("../models/Image");
const cloudinary = require("cloudinary").v2;
const axios = require("axios");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const generateSlug = (title) => {
  return title.toLowerCase().replace(/\s+/g, "-");
};

const uploadImage = async (req, res) => {
  try {
    console.log("Received image upload request.");

    // Check if file exists
    if (!req.file) {
      console.error("No file found in request.");
      return res.status(400).json({
        success: false,
        error: "No file uploaded.",
      });
    }

    console.log("Uploading image to Cloudinary...");
    const result = await cloudinary.uploader.upload(req.file.path);
    console.log("Cloudinary upload successful:", result);

    const slug = generateSlug(req.body.title);
    console.log("Generated slug:", slug);

    const tags = JSON.parse(req.body.tags);

    // Create a new image document
    const newImage = new Image({
      title: req.body.title,
      slug: slug,
      description: req.body.description,
      image: result.secure_url,
      tags: tags,
      category: req.body.category,
      likes: [],
      shares: 0,
      views: 0,
      downloads: 0,
    });

    console.log("Saving image to database...");
    await newImage.save();
    console.log("Image saved successfully:", newImage);

    res.status(201).json({
      success: true,
      data: newImage,
    });
  } catch (error) {
    console.error("Error in uploadImage:", error.message);

    res.status(500).json({
      success: false,
      error: "Server Error: " + error.message,
    });
  }
};

const findImageByIdAndUpdate = async (req, res) => {
  try {
    console.log("Received image update request.");

    const { id } = req.params;
    const { title, description, tags, category } = req.body;

    // Find existing image
    const existingImage = await Image.findById(id);
    if (!existingImage) {
      console.error("Image not found.");
      return res
        .status(404)
        .json({ success: false, error: "Image not found." });
    }

    let updatedImageUrl = existingImage.image; // Keep existing image

    // Check if a new file is uploaded
    if (req.file) {
      console.log("Uploading new image to Cloudinary...");

      // Delete old image from Cloudinary
      if (existingImage.image) {
        const publicId = existingImage.image.split("/").pop().split(".")[0]; // Extract Cloudinary public ID
        await cloudinary.uploader.destroy(publicId);
        console.log("Old image deleted from Cloudinary.");
      }

      // Upload new image
      const result = await cloudinary.uploader.upload(req.file.path);
      updatedImageUrl = result.secure_url;
      console.log("New image uploaded successfully:", updatedImageUrl);
    }

    const updatedSlug = title ? generateSlug(title) : existingImage.slug;
    const updatedTags = Array.isArray(tags)
      ? tags
      : tags
      ? JSON.parse(tags)
      : existingImage.tags;

    // Update image fields
    existingImage.title = title || existingImage.title;
    existingImage.slug = updatedSlug;
    existingImage.description = description || existingImage.description;
    existingImage.image = updatedImageUrl;
    existingImage.tags = updatedTags;
    existingImage.category = category || existingImage.category;

    console.log("Saving updated image...");
    await existingImage.save();
    console.log("Image updated successfully:", existingImage);

    res.status(200).json({ success: true, data: existingImage }); // Ensure frontend gets the full data
  } catch (error) {
    console.error("Error in updateImage:", error.message);
    res
      .status(500)
      .json({ success: false, error: "Server Error: " + error.message });
  }
};

const findImageBySlugAndUpdate = async (req, res) => {
  try {
    console.log("Received image update request.");

    const { slug } = req.params;
    const { title, description, tags, category } = req.body;

    // Find existing image
    const existingImage = await Image.findById(slug);
    if (!existingImage) {
      console.error("Image not found.");
      return res
        .status(404)
        .json({ success: false, error: "Image not found." });
    }

    let updatedImageUrl = existingImage.image; // Keep existing image

    // Check if a new file is uploaded
    if (req.file) {
      console.log("Uploading new image to Cloudinary...");

      // Delete old image from Cloudinary
      if (existingImage.image) {
        const publicId = existingImage.image.split("/").pop().split(".")[0]; // Extract Cloudinary public ID
        await cloudinary.uploader.destroy(publicId);
        console.log("Old image deleted from Cloudinary.");
      }

      // Upload new image
      const result = await cloudinary.uploader.upload(req.file.path);
      updatedImageUrl = result.secure_url;
      console.log("New image uploaded successfully:", updatedImageUrl);
    }

    const updatedSlug = title ? generateSlug(title) : existingImage.slug;
    const updatedTags = Array.isArray(tags)
      ? tags
      : tags
      ? JSON.parse(tags)
      : existingImage.tags;

    // Update image fields
    existingImage.title = title || existingImage.title;
    existingImage.slug = updatedSlug;
    existingImage.description = description || existingImage.description;
    existingImage.image = updatedImageUrl;
    existingImage.tags = updatedTags;
    existingImage.category = category || existingImage.category;

    console.log("Saving updated image...");
    await existingImage.save();
    console.log("Image updated successfully:", existingImage);

    res.status(200).json({ success: true, data: existingImage }); // Ensure frontend gets the full data
  } catch (error) {
    console.error("Error in updateImage:", error.message);
    res
      .status(500)
      .json({ success: false, error: "Server Error: " + error.message });
  }
};

const findImageByIdAndDelete = async (req, res) => {
  try {
    const { id } = req.body;
    const deletedImage = await Image.findByIdAndDelete(req.params.id);
    if (!deletedImage)
      return res.status(404).json({ error: "Image not found" });
    res.status(200).json({ message: "Image deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const findImageBySlugAndDelete = async (req, res) => {
  try {
    const slug = req.params.slug;
    const deletedImage = await Image.findOneAndDelete({
      slug,
    });
    if (!deletedImage)
      return res.status(404).json({ error: "Image not found" });
    res.status(200).json({ message: "Image deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllImages = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 12; // Default limit is 10 if not specified
    const images = await Image.find({}).limit(limit);
    console.log(images);

    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getImageById = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await Image.findById(id);
    if (!image) return res.status(404).json({ error: "Image not found" });
    res.status(200).json(image);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getImageBySlug = async (req, res) => {
  try {
    const image = await Image.findOne({ slug: req.params.slug });
    if (!image) return res.status(404).json({ error: "Image not found" });

    const pngUrl = image.image;
    const svgUrl = pngUrl.replace("/upload/", "/upload/f_svg/");

    res.status(200).json({
      image: pngUrl,
      svg: svgUrl,
      title: image.title,
      description: image.description,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getImagesByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    const images = await Image.find({ category });
    res.status(200).json({
      success: true,
      data: images,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

const getImagesByTag = async (req, res) => {
  const [tags] = req.params;

  try {
    const images = await Image.find( [tags] );
    res.status(200).json({
      success: true,
      data: images,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

const searchImages = async (req, res) => {
  try {
    const { query, page = 1, limit = 12 } = req.query; // Extract query term, page, and limit from query string
    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const images = await Image.find({
      $or: [
        { $text: { $search: query } }, // Text search (title, description, tags)
        { category: { $regex: query, $options: "i" } }, // Case-insensitive category search
      ],
    })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json(images);
  } catch (err) {
    console.error("Error in searchImages controller:", err);
    res.status(500).json({ error: "An error occurred while searching" });
  }
};

const findImageByIdAndLike = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).json({ error: "Image not found" });
    image.likes.push(req.user._id);
    await image.save();
    res.status(200).json(image);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const findImageBySlugAndLike = async (req, res) => {
  try {
    const image = await Image.findOne({ slug: req.params.slug });
    if (!image) return res.status(404).json({ error: "Image not found" });
    image.likes.push(req.user._id);
    await image.save();
    res.status(200).json(image);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const findImageByIdAndUnlike = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).json({ error: "Image not found" });
    image.likes.pull(req.user._id);
    await image.save();
    res.status(200).json(image);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const findImageBySlugAndUnlike = async (req, res) => {
  try {
    const image = await Image.findOne({ slug: req.params.slug });
    if (!image) return res.status(404).json({ error: "Image not found" });
    image.likes.pull(req.user._id);
    await image.save();
    res.status(200).json(image);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const findImageByIdAndDownload = async (req, res) => {
  try {
    // Authentication Check
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized. Please log in." });
    }

    const { slug } = req.params;

    // Find Image by Slug
    const image = await Image.findOne({ slug });
    if (!image) {
      return res.status(404).json({ error: "Image not found." });
    }

    // Fetch the Image from the External URL
    const response = await axios.get(image.image, {
      responseType: "arraybuffer",
      timeout: 10000, // Timeout after 10 seconds
    });

    // Dynamically Determine MIME Type and Extension
    const mimeType = response.headers["content-type"];
    const extension = mimeType.split("/")[1];

    // Set Headers for Download
    res.setHeader("Content-Type", mimeType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${image.title || "downloaded-image"}.${extension}"`
    );

    // Send Image Data to the Client
    res.send(Buffer.from(response.data, "binary"));
  } catch (error) {
    console.error(
      `Error downloading image [Slug: ${req.params.slug}]:`,
      error.message
    );

    // Handle External Image Fetch Errors
    if (error.response) {
      return res.status(500).json({
        error: `Failed to fetch image from source: ${error.response.statusText}`,
      });
    }

    // Generic Server Error Response
    res.status(500).json({ error: "Failed to download image." });
  }
};

const findImageBySlugAndDownload = async (req, res) => {
  try {
    // Authentication Check
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized. Please log in." });
    }

    const { slug } = req.params;

    // Find Image by Slug
    const image = await Image.findOne({ slug });
    if (!image) {
      return res.status(404).json({ error: "Image not found." });
    }

    // Fetch the Image from the External URL
    const response = await axios.get(image.image, {
      responseType: "arraybuffer",
      timeout: 10000, // Timeout after 10 seconds
    });

    // Dynamically Determine MIME Type and Extension
    const mimeType = response.headers["content-type"];
    const extension = mimeType.split("/")[1];

    // Set Headers for Download
    res.setHeader("Content-Type", mimeType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${image.title || "downloaded-image"}.${extension}"`
    );

    // Send Image Data to the Client
    res.send(Buffer.from(response.data, "binary"));
  } catch (error) {
    console.error(
      `Error downloading image [Slug: ${req.params.slug}]:`,
      error.message
    );

    // Handle External Image Fetch Errors
    if (error.response) {
      return res.status(500).json({
        error: `Failed to fetch image from source: ${error.response.statusText}`,
      });
    }

    // Generic Server Error Response
    res.status(500).json({ error: "Failed to download image." });
  }
};

const incrementViews = async (req, res) => {
  try {
    const image = await Image.findOne({ slug: req.params.slug });
    if (!image) return res.status(404).json({ error: "Image not found" });
    image.views += 1;
    await image.save();
    res.status(200).json(image);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const incrementDownloads = async (req, res) => {
  try {
    const image = await Image.findOne({ slug: req.params.slug });
    if (!image) return res.status(404).json({ error: "Image not found" });
    image.downloads += 1;
    await image.save();
    res.status(200).json(image);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const incrementShares = async (req, res) => {
  try {
    const image = await Image.findOne({ slug: req.params.slug });
    if (!image) return res.status(404).json({ error: "Image not found" });
    image.shares += 1;
    await image.save();
    res.status(200).json(image);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
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
};
