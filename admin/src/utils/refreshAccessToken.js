import axiosInstance from "./axiosConfig";

const refreshAccessToken = async () => {
  try {
    const response = await axiosInstance.post("api/auth/verify-refresh-token");
    const { accessToken } = response.data;
    console.log("New Access Token:", accessToken);
    // Save the new access token in localStorage
    localStorage.setItem("accessToken", accessToken);
    return accessToken;
  } catch (error) {
    console.error("Error refreshing token:", error.response?.data || error.message);
    // Optionally, handle redirection to login here if needed
    throw error;
  }
};

export default refreshAccessToken;
