import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AuthLayout from "./layouts/AuthLayout";
import Layout from "./layouts/Layout";

// User Pages
import Register from "./pages/users/Register";
import Login from "./pages/users/Login";
import Home from "./pages/users/Home";
import Gallery from "./pages/users/Gallery";
import SearchResults from "./pages/users/SearchResults";
import CategoryPage from "./pages/users/CategoryPage";
import ImagePreview from "./pages/users/ImagePreview";

// Error Pages
import ForbiddenPage from "./pages/others/ForbiddenPage";
import InternalServerErrorPage from "./pages/others/InternalServerErrorPage";
import NotFoundPage from "./pages/others/NotFoundPage";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Public Routes */}
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/preview/:slug" element={<ImagePreview />} />
          <Route path="/search-results" element={<SearchResults />} />
        </Route>

        {/* Error Routes */}
        <Route path="/403" element={<ForbiddenPage />} />
        <Route path="/500" element={<InternalServerErrorPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        {/* Redirect unknown routes to 404 */}
        <Route path="*" element={<Navigate to="/404" />} />
      </Routes>
    </Router>
  );
};

export default App;
