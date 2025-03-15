import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosConfig";

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
      const response = await axiosInstance.post(`/api/auth/login`, formData, {
        withCredentials: true,
      });

      setMessage(response.data.message);
      setFormData({ email: "", password: "" });
      navigate("/gallery");
    } catch (error) {
      setMessage(error.response?.data?.message || "Login Failed");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white w-full flex flex-col gap-4 max-w-sm p-6 border-2 border-orange-400 h-fit rounded-sm shadow-md">
        <h2 className="text-2xl font-bold text-center">Account Login</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-sm focus:ring focus:ring-blue-300"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-sm focus:ring focus:ring-blue-300"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-sm hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
        {message && <p className="text-center text-red-500">{message}</p>}
        <div className="text-center">
          Don't have an Account?{" "}
          <Link
            to="/register"
            className="font-bold hover:text-orange-400 cursor-pointer"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
