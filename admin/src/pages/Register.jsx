import { useState } from "react";
import axiosInstance from "../utils/axiosConfig";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/api/auth/register-admin", formData);
      setMessage(res.data.message);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Registration Failed");
      setMessage(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-orange-300">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-black text-center mb-4">
          Register as Admin
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none"
          />

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

          <label className="block text-gray-700">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="reviewer">Reviewer</option>
          </select>

          <button
            type="submit"
            className="w-full py-2 bg-blue-400 text-white font-bold rounded hover:bg-blue-500 transition"
            disabled={loading}
          >
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>

        {message && <p className="text-orange-500 text-center">{message}</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="text-center mt-4">
          Already have an Account?{" "}
          <a
            href="/login"
            className="hover:text-blue-400 text-orange-400 cursor-pointer"
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;
