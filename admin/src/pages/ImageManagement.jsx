import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosConfig";
import DeleteImageButton from "../components/DeleteImageButton";

export default function ImageManagement() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch images from server
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axiosInstance.get("/api/images/all");
        setImages(response.data);
      } catch (error) {
        console.error("Error fetching images:", error);
        setError("Failed to load images. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) return <p className="text-center mt-4">Loading images...</p>;
  if (error) return <p className="text-center mt-4 text-red-500">{error}</p>;

  return (
    <main className="p-4">
      <div className="py-2 w-48 flex justify-center items-center bg-green-500 rounded-md hover:bg-green-600 text-center mb-4">
        <a href="/manage-images/upload-image" className="w-full text-white ">
          Upload Image
        </a>
      </div>
      <div className="w-full overflow-x-auto">
        <div className="">
          <div className="text-white bg-black flex justify-start items-center font-bold">
            <div className="h-8 w-60 flex justify-center items-center"> Object ID </div>
            <div className="h-8 w-40 flex justify-center items-center">
              {" "}
              Image{" "}
            </div>
            <div className="h-8 w-40 pl-3 flex justify-start items-center">
              {" "}
              Title{" "}
            </div>
            <div className="h-8 w-40 pl-3 flex justify-start items-center">
              {" "}
              Category{" "}
            </div>
            <div className="h-8 w-80 pl-3 flex justify-start items-center">
              {" "}
              Description{" "}
            </div>
            <div className="h-8 w-40 flex justify-center items-center">
              {" "}
              Likes{" "}
            </div>
            <div className="h-8 w-40 flex justify-center items-center">
              {" "}
              Shares{" "}
            </div>
            <div className="h-8 w-40 flex justify-center items-center">
              {" "}
              Views{" "}
            </div>
            <div className="h-8 w-40 flex justify-center items-center">
              {" "}
              Downloads{" "}
            </div>
            <div className="h-8 w-80 pl-3 flex justify-start items-center">
              {" "}
              Tags{" "}
            </div>
            <div className="h-8 w-80 flex justify-center items-center">
              {" "}
              Actions{" "}
            </div>
          </div>

          {images.map((image) => (
            <React.Fragment key={image._id}>
              <div className="text-white bg-gray-800 flex justify-start items-center">
                <div className="h-16 w-60 flex justify-center items-center">
                  {image._id}
                </div>
                <div className="h-16 w-40 flex justify-center items-center">
                  <img
                    src={image.imageUrl} // Use the correct property
                    alt={image.title}
                    className="h-12 rounded-md shadow-sm"
                  />
                </div>
                <div className="h-16 w-40 pl-3 flex justify-start items-center">
                  {image.title}
                </div>
                <div className="h-16 w-40 pl-3 flex justify-start items-center">
                  {image.category}
                </div>
                <div className="h-16 w-80 px-3 flex justify-start items-center">
                  {image.description
                    ? image.description.slice(0, 50) + "..."
                    : "No description"}
                </div>

                <div className="h-16 w-40 flex justify-center items-center">
                  {image.likes?.length || 0}
                </div>
                <div className="h-16 w-40 flex justify-center items-center">
                  {image.shares}
                </div>
                <div className="h-16 w-40 flex justify-center items-center">
                  {image.views}
                </div>
                <div className="h-16 w-40 flex justify-center items-center">
                  {image.downloads}
                </div>
                <div className="h-16 w-80 pl-3 flex justify-start items-center">
                  {image.tags && image.tags.length > 0
                    ? image.tags.join(", ")
                    : "No tags"}
                </div>
                <div className="h-16 w-80 flex justify-center items-center">
                  <div className="gap-2 min-w-[160px] grid grid-cols-2">
                    <a
                      href={`/manage-images/update-image/${image._id}`}
                      className="text-center px-2 py-1 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                    >
                      Edit
                    </a>

                    <DeleteImageButton
                      id={image._id}
                      onDelete={() =>
                        setImages(images.filter((img) => img._id !== image._id))
                      }
                    />
                  </div>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </main>
  );
}
