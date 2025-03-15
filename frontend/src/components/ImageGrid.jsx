import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link
import axiosInstance from "../utils/axiosConfig";

const ImageGrid = () => {
  const [images, setImages] = useState([]);
  const [columns, setColumns] = useState([[], [], []]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axiosInstance.get("/api/images/all");
        setImages(response.data);
        setColumns(divideIntoColumns(response.data, 3));
      } catch (error) {
        setError("Failed to load images. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const divideIntoColumns = (images, numColumns) => {
    const cols = Array.from({ length: numColumns }, () => []);
    images.forEach((image, index) => {
      cols[index % numColumns].push(image);
    });
    return cols;
  };

  if (loading) return <p className="text-center mt-4">Loading images...</p>;
  if (error) return <p className="text-center mt-4 text-red-500">{error}</p>;

  return (
    <main className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6">
        {columns.map((column, colIndex) => (
          <div key={colIndex} className="flex flex-col items-center gap-y-6">
            {column.map((image, index) => (
              <Link to={`/preview/${image.slug}`} key={index}>
                <img
                  src={image.imageUrl}
                  alt={image.title}
                  className="w-full rounded-md shadow-md cursor-pointer"
                />
              </Link>
            ))}
          </div>
        ))}
      </div>
    </main>
  );
};

export default ImageGrid;
