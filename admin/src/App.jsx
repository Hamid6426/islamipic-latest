import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import HomePage from "./pages/HomePage";
import Layout from "./layouts/Layout";
import ProtectedRoute from "./context/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Contact from "./pages/Contact";

import Dashboard from "./pages/Dashboard";
import AdminManagement from "./pages/AdminManagement";
import UserManagement from "./pages/UserManagement";
import ImageManagement from "./pages/ImageManagement";

import ImageUploadPage from "./pages/ImageUploadPage";
import ImageUpdatePage from "./pages/ImageUpdatePage";

import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";

import ForbiddenPage from "./pages/others/ForbiddenPage";
import NotFoundPage from "./pages/others/NotFoundPage";
import InternalServerErrorPage from "./pages/others/InternalServerErrorPage";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route index element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<Contact />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={["super-admin", "admin", "editor", "reviewer"]} />}>
          <Route element={<Layout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="manage-admins" element={<AdminManagement />} />
            <Route path="manage-users" element={<UserManagement />} />
            <Route path="manage-images" element={<ImageManagement />} />
            <Route path="manage-images/upload-image" element={<ImageUploadPage />} />
            <Route path="manage-images/update-image/:_id" element={<ImageUpdatePage />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="manage-settings" element={<Settings />} />
          </Route>
        </Route>

        {/* Error Routes */}
        <Route path="/403" element={<ForbiddenPage />} />
        <Route path="/500" element={<InternalServerErrorPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
