const logout = () => {
  localStorage.removeItem("accessToken"); // Remove access token
  document.cookie = "refreshToken=; Max-Age=0; path=/;"; // Clear refresh token cookie
  window.location.href = "/login"; // Redirect to login page
};