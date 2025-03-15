import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Navigation links array for mapping
  const navLinks = [
    { label: "Full Gallery", path: "/gallery" },
    { label: "3D Renders", path: "/category/3D" },
    { label: "Calligraphy", path: "/category/calligraphy" },
    { label: "Arts", path: "/category/arts" },
    { label: "Icons", path: "/category/icons" },
    { label: "Textures", path: "/category/textures" },
  ];

  return (
    <header className="fixed z-50 w-full flex justify-between items-center px-4 h-16 bg-amber-100">
      {/* Logo */}
      <Link to="/">
        <img src="islamipic-logo.png" alt="islamipic logo" className="h-6" />
      </Link>

      {/* Desktop Links */}
      <div className="hidden md:flex gap-5 font-medium">
        {navLinks.map((link) => (
          <Link key={link.path} to={link.path} className="hover:text-blue-400">
            {link.label}
          </Link>
        ))}
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden block text-gray-700"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="z-5 absolute top-12 right-4 bg-white shadow-md rounded-md p-3 md:hidden flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path} className="hover:text-blue-400">
              {link.label}
            </Link>
          ))}
          <div className="flex gap-x-4">
            <Link
              to="/login"
              className="hover:bg-amber-300 bg-amber-200 px-3 py-1 text-sm font-medium"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-gray-950 hover:bg-gray-800 px-3 py-1 text-sm font-medium text-white"
            >
              SignUp
            </Link>
          </div>
        </div>
      )}

      {/* Login & Signup for Desktop */}
      <div className="gap-x-4 hidden md:flex">
        <Link
          to="/login"
          className="hover:bg-amber-300 bg-amber-200 px-3 py-1 text-sm font-medium"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="bg-gray-950 hover:bg-gray-800 px-3 py-1 text-sm font-medium text-white"
        >
          SignUp
        </Link>
      </div>
    </header>
  );
}
