import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosConfig";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!formData.email || !formData.password) {
      setMessage("All fields are required!");
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post(
        "/api/auth/login",
        formData,
        { withCredentials: true } // Important to send cookies with requests
      );

      setMessage(response.data.message);
      setFormData({ email: "", password: "" });

      // Redirect to /gallery after successful login
      navigate("/dashboard");
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-orange-300">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-black text-center mb-4">
          Login as Admin
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none"
          />

          <button
            type="submit"
            className="w-full py-2 bg-blue-400 text-white font-bold rounded hover:bg-blue-500 transition"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
        
        {message && <p className="text-red-600 text-center">{message}</p>}

        <div className="text-center mt-4">
          Don't have an Account?{" "}
          <a
            href="/register"
            className="hover:text-blue-400 text-orange-400 cursor-pointer"
          >
            Register
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;