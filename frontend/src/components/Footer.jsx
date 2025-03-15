import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const linkColumns = [
    [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/terms-and-conditions" },
    ],
    [
      { label: "Gallery", href: "/gallery" },
      { label: "3D Renders", href: "/category/3D" },
      { label: "Calligraphy", href: "/category/calligraphy" },
      { label: "Textures", href: "/category/textures" },
    ],
    [
      { label: "Arts", href: "/category/arts" },
      { label: "Icons", href: "/category/icons" },
      { label: "Quotes", href: "/category/quotes" },
      { label: "Islamic Posts", href: "/category/islamic-posts" },
    ],
  ];

  return (
    <div>
      <footer className="w-full min-w-screen flex flex-row p-6 bg-amber-100">
        <div className="w-full grid grid-cols-4">
          {/* Logo Column */}
          <div className="flex items-center justify-center">
            <img
              src="islamipic-logo.svg"
              alt="islamipic logo"
              className="h-6"
            />
          </div>

          {/* Link Columns */}
          {linkColumns.map((column, colIndex) => (
            <div
              key={colIndex}
              className="w-full flex flex-col justify-start items-start font-medium gap-2"
            >
              {column.map((link, linkIndex) => (
                <Link
                  key={linkIndex}
                  to={link.href}
                  className="hover:text-blue-400"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </footer>
      <div className="text-center min-w-screen py-2 border-t border-amber-300">
        Copyright © 2025 Islamipic
      </div>
    </div>
  );
}
