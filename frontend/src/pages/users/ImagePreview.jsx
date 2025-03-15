import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosConfig";

const ImagePreview = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  // Fetch Image Details
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axiosInstance.get(`/api/images/slug/${slug}`);
        setImage(response.data);
      } catch (error) {
        setError("Failed to load image details.");
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [slug]);

  if (loading) return <p className="text-center mt-4">Loading image...</p>;
  if (error) return <p className="text-center mt-4 text-red-500">{error}</p>;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await axiosInstance.get(`/api/images/download/${slug}`, {
        responseType: 'arraybuffer',
      });
  
      const mimeType = response.headers["content-type"];
      const extension = mimeType.split("/")[1];
  
      const url = window.URL.createObjectURL(new Blob([response.data], { type: mimeType }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `${response.headers.filename || "downloaded-image"}.${extension}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("You must be logged in to download this image.");
        navigate("/login");
      } else if (error.response && error.response.status === 404) {
        alert("Image not found.");
      } else {
        alert("Failed to download the image. Please try again later.");
      }
    } finally {
      setDownloading(false);
    }
  };

  // Copy Embed Code
  const handleEmbed = () => {
    const embedCode = `<img src="${image.image}" alt="${image.title}" />`;
    navigator.clipboard.writeText(embedCode).then(() => {
      alert("Embed code copied to clipboard!");
    });
  };

  // Share Image
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: image.title,
          text: image.description,
          url: image.image,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      alert("Sharing is not supported in your browser. Copy the URL instead.");
      navigator.clipboard.writeText(image.image);
    }
  };

  return (
    <div>
      <div className="p-6 flex flex-col justify-center items-center bg-amber-100 m-6">
        <img
          src={image.imageUrl}
          alt={image.title || "Image"}
          className="h-[75vh] rounded-md shadow-lg"
        />
        <h1 className="text-2xl font-bold mt-4">{image.title || "Untitled"}</h1>
        <p className="mt-2 text-gray-600">
          {image.description || "No description available."}
        </p>

        {/* Action Buttons */}
        <div className="mt-4 flex gap-4">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className={`px-4 py-2 ${
              downloading ? "bg-gray-500" : "bg-blue-600"
            } text-white rounded-md shadow-md hover:bg-blue-700`}
          >
            {downloading ? "Downloading..." : "Download"}
          </button>

          <button
            onClick={handleEmbed}
            className="px-4 py-2 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700"
          >
            Embed
          </button>

          <button
            onClick={handleShare}
            className="px-4 py-2 bg-purple-600 text-white rounded-md shadow-md hover:bg-purple-700"
          >
            Share
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;
