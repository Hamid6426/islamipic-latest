import React from "react";
import axiosInstance from "../utils/axiosConfig";

export default function DeleteImage({ id, onDelete }) {
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      try {
        await axiosInstance.delete(`/api/images/${id}/delete`);
        onDelete();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <button
      className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 transition"
      onClick={handleDelete}
    >
      Delete
    </button>
  );
}
