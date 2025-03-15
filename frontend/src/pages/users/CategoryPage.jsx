import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosConfig";

export default function CategoryPage() {
  const { category } = useParams(); // Get category from URL
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axiosInstance.get(`/api/images/category/${category}`);

        if (response.data.data.length === 0) {
          setError(`No images found for category: "${category}"`);
        } else {
          setImages(response.data.data);
        }
      } catch (err) {
        setError("Failed to fetch images. Please try again.");
      }

      setLoading(false);
    };

    fetchImages();
  }, [category]);

  return (
    <div>
      <main className="p-6 text-center">
        <h2 className="text-2xl font-semibold mb-4 capitalize">
          Category: {category.replace("-", " ")}
        </h2>

        {loading && <p className="mt-4">Loading images...</p>}
        {error && <p className="mt-4 text-red-500">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 mt-6">
          {images.map((image, index) => (
            <div key={index} className="shadow-md rounded-md">
              <img src={image.image} alt={image.category} className="w-full rounded-md" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
