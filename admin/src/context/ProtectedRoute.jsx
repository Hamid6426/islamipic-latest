import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import refreshAccessToken from "../utils/refreshAccessToken";

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      // Get the access token from localStorage
      let token = localStorage.getItem("accessToken");

      // If no token exists, attempt to refresh it
      if (!token) {
        await refreshAccessToken();
        token = localStorage.getItem("accessToken");
      }

      // If a token is now present, consider the user authenticated
      setIsAuthenticated(!!token);
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  if (loading) return <div>Loading...</div>;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
