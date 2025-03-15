const Image = require("../models/Image");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const generateSlug = async (title) => {
  let slug = title.toLowerCase().replace(/\s+/g, "-");
  let exists = await Image.findOne({ slug });
  let counter = 1;

  while (exists) {
    slug = `${slug}-${counter}`;
    exists = await Image.findOne({ slug });
    counter++;
  }
  return slug;
};

const uploadImage = async (req, res) => {
  try {
    console.log("Starting image upload process...");

    // Validate input
    if (!req.file) {
      console.log("Validation failed: No file uploaded");
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }
    console.log("File detected:", req.file);

    if (!req.body.title) {
      console.log("Validation failed: Title not provided");
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }
    console.log("Title provided:", req.body.title);

    // Validate category
    const allowedCategories = [
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
    ];
    if (!req.body.category) {
      console.log("Validation failed: Category not provided");
      return res.status(400).json({
        success: false,
        message: "Category is required",
      });
    }
    if (!allowedCategories.includes(req.body.category)) {
      console.log("Validation failed: Invalid category");
      return res.status(400).json({
        success: false,
        message: `Invalid category. Allowed categories are: ${allowedCategories.join(
          ", "
        )}`,
      });
    }
    console.log("Category provided and valid:", req.body.category);

    // Upload to Cloudinary
    console.log("Uploading image to Cloudinary...");
    const file = req.file;
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "your-upload-folder",
    });
    console.log("Cloudinary upload result:", result);

    // Process tags
    let tags = [];
    try {
      tags = req.body.tags ? JSON.parse(req.body.tags) : [];
    } catch (error) {
      if (typeof req.body.tags === "string") {
        tags = req.body.tags.split(",").map((tag) => tag.trim());
      }
    }
    console.log("Processed tags:", tags);

    // Generate slug and create image document
    const slug = await generateSlug(req.body.title);
    console.log("Generated slug:", slug);

    const newImage = new Image({
      title: req.body.title,
      slug: slug,
      description: req.body.description || "",
      imageUrl: result.secure_url,
      publicId: result.public_id,
      tags: tags,
      category: req.body.category, // category is now required and validated
    });
    console.log("Image document created:", newImage);

    // Save image document to database
    await newImage.save();
    console.log("Image saved successfully:", newImage);

    // Return success response
    res.status(201).json({
      success: true,
      data: {
        _id: newImage._id,
        title: newImage.title,
        slug: newImage.slug,
        imageUrl: newImage.imageUrl,
        category: newImage.category,
        tags: newImage.tags,
      },
    });
    console.log("Response sent with success status");
  } catch (error) {
    console.error("Error in uploadImage:", error);

    // Handle duplicate slug error
    if (error.name === "MongoError" && error.code === 11000) {
      console.log("Duplicate slug error detected");
      return res.status(400).json({
        success: false,
        error: "Slug must be unique",
      });
    }

    // Handle Cloudinary errors
    if (error.message.includes("Cloudinary API")) {
      console.log("Cloudinary API error detected");
      return res.status(502).json({
        success: false,
        error: "Image storage service unavailable",
      });
    }
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
    // console.log(images);
    console.log("Images are fetched successfully");
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
    const { slug } = req.params;
    console.log(`Fetching image with slug: ${slug}`);

    // Find the image document by slug
    const image = await Image.findOne({ slug });
    if (!image) {
      console.log("Image not found");
      return res.status(404).json({ message: "Image not found" });
    }

    console.log("Image found:", image);
    // Return the image details
    res.status(200).json(image);
  } catch (error) {
    console.error("Error in getImageBySlug:", error);
    res.status(500).json({ message: "Server error", error: error.message });
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
    const images = await Image.find([tags]);
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
  // Authentication Check
  // if (!req.user) {
  //   return res.status(401).json({ error: "Unauthorized. Please log in." });
  // }
  const { id } = req.params;
};

const findImageBySlugAndDownload = async (req, res) => {
  try {
    const { slug } = req.params;
    console.log("Downloading image for slug:", slug);

    // Find image document by slug
    const image = await Image.findOne({ slug });
    if (!image) {
      console.log("Image not found for slug:", slug);
      return res.status(404).json({ message: "Image not found" });
    }

    const imageUrl = image.imageUrl;
    console.log("Found image URL:", imageUrl);

    // Fetch the image from Cloudinary as a stream
    const response = await axios({
      url: imageUrl,
      method: "GET",
      responseType: "stream",
    });

    // Dynamically determine MIME Type and Extension
    const mimeType = response.headers["content-type"];
    const extension = imageUrl.split(".").pop(); // e.g., jpg or png

    // Set headers for download
    res.setHeader("Content-Type", mimeType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${slug}.${extension}"`
    );

    // Pipe the image stream to the response
    response.data.pipe(res);
  } catch (error) {
    console.error(
      `Error downloading image [Slug: ${req.params.slug}]:`,
      error.message
    );
    if (error.response) {
      return res.status(500).json({
        error: `Failed to fetch image from source: ${error.response.statusText}`,
      });
    }
    res.status(500).json({ message: "Server error", error: error.message });
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
