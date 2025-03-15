import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import axiosInstance from "../../utils/axiosConfig";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (query) {
      fetchImages();
    }
  }, [query]);

  const fetchImages = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/api/images/search", {
        params: { query, page: 1, limit: 12 },
      });
      setImages(response.data);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">
          Search Results for "{query}"
        </h2>

        {isLoading ? (
          <p>Loading...</p>
        ) : images.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div
                key={image._id}
                className="border rounded-lg overflow-hidden"
              >
                <img
                  src={image.image}
                  alt={image.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold">{image.title}</h3>
                  <p className="text-gray-600">{image.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
