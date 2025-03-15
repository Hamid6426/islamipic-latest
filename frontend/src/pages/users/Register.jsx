import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosConfig";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    try {
      const response = await axiosInstance.post(
        `/api/auth/register`,
        formData,
        { withCredentials: true }
      );

      setMessage(response.data.message);
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "user", // Reset role to default "user"
      });
      setError(null);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration Failed");
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center items-center min-h-screen">
      <div className="bg-white w-full flex flex-col gap-4 max-w-sm p-6 border-2 border-orange-400 h-fit rounded-sm shadow-md">
        <h2 className="text-2xl font-bold text-center">Register an Account</h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center items-center gap-y-4"
        >
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded-sm focus:outline-none bg-white focus:ring focus:ring-blue-300"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded-sm focus:outline-none bg-white focus:ring focus:ring-blue-300"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded-sm focus:outline-none bg-white focus:ring focus:ring-blue-300"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-sm hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
          {message && (
            <p className="text-center text-orange-500 mb-4">{message}</p>
          )}
          {error && <p className="text-center text-red-500 mb-4">{error}</p>}
        </form>
        <div className="text-center">
          Already have an Account?{" "}
          <Link
            to="/login"
            className="font-bold hover:text-orange-400 cursor-pointer"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
