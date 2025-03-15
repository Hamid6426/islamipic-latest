import React, { useState } from "react";
import axiosInstance from "../utils/axiosConfig";

const ImageUploadPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
    category: "",
    image: null,
  });
  const [message, setMessage] = useState({ type: "", content: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Allowed categories
  const categories = [
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", content: "" });

    if (!formData.image) {
      setMessage({ type: "error", content: "Please select an image" });
      setIsSubmitting(false);
      return;
    }

    const formattedTags = formData.tags
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag !== "");

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("tags", JSON.stringify(formattedTags));
    data.append("category", formData.category);
    data.append("image", formData.image); // Field name must match backend expectation

    try {
      const response = await axiosInstance.post("/api/images/upload", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      setMessage({
        type: "success",
        content: "Image uploaded successfully!",
      });
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      setMessage({
        type: "error",
        content: errorMessage || "Failed to upload image",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Upload Image</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md"
            rows="3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image *
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border rounded-md"
            accept="image/*"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 rounded-md text-white ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? "Uploading..." : "Upload Image"}
        </button>

        {message.content && (
          <div className={`mt-4 p-3 rounded-md ${
              message.type === "error"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}>
            {message.content}
          </div>
        )}
      </form>
    </div>
  );
};

export default ImageUploadPage;
