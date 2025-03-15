import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosConfig";

const ImagesByCategory = () => {
  const { category } = useParams(); // Get category from URL
  const [images, setImages] = useState([]);
  const [columns, setColumns] = useState([[], [], []]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Function to divide images into 3 columns
  const divideIntoColumns = (images, numColumns) => {
    const cols = Array.from({ length: numColumns }, () => []); 

    images.forEach((image, index) => {
      cols[index % numColumns].push(image);
    });

    return cols;
  };

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axiosInstance.get(`/api/images/category/${category}`);
        setImages(response.data.data);
        setColumns(divideIntoColumns(response.data.data, 3));
      } catch (err) {
        setError("Failed to fetch images. Please try again.");
      }

      setLoading(false);
    };

    fetchImages();
  }, [category]); // Re-fetch images when category changes

  {images.length === 0 && !loading && <p>No images found.</p>}

  return (
    <main className="p-6 text-center">
      <h2 className="text-2xl font-semibold mb-4">Category: "{category}"</h2>

      {loading && <p className="mt-4">Loading images...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 mt-6">
        {columns.map((column, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-y-6">
            {column.map((image, index) => (
              <div key={index} className="shadow-md rounded-md">
                <img src={image.url} alt={image.category} className="w-full rounded-md" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </main>
  );
};

export default ImagesByCategory;
