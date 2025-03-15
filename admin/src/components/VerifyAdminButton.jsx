import React from "react";
import axiosInstance from "../utils/axiosConfig";

const VerifyAdminButton = ({ id, onVerify }) => {
  const handleVerify = async () => {
    try {
      const response = await axiosInstance.post(
        `/api/auth/verify-admin/${id}`,
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        onVerify(); // Update user state in the parent component
      } else {
        console.error("Verification failed:", response.data.message);
      }
    } catch (error) {
      console.error("Verification error:", error);
    }
  };

  return (
    <button
      onClick={handleVerify}
      className="bg-green-500 text-white px-4 py-1 hover:bg-green-600 rounded"
    >
      Verify
    </button>
  );
};

export default VerifyAdminButton;
