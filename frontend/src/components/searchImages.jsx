import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchImages = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search-results?query=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="p-6">
      <div className="flex gap-6 flex-row justify-between items-center">
        <div className="w-full">
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search images..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()} // Detects Enter key
          />
        </div>

        <button
          className="px-6 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchImages;
