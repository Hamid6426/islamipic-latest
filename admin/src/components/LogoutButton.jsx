import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosConfig";

const LogoutButton = () => { 
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/api/auth/logout", {
        withCredentials: true,
      });

      // Remove accessToken from localStorage
      localStorage.removeItem("accessToken");

      // Redirect to Sign In page after logout
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 hover:bg-red-600 transition"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
