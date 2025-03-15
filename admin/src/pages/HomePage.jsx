import React from "react";

const HomePage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-orange-300">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h1 className="text-4xl font-bold mb-4 text-center">Welcome!</h1>
        <div className="flex flex-col justify-center items-center gap-4">
        <a
          href="/login"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded block w-full text-center"
        >
          Login
        </a>
        <a
          href="/register"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded block w-full text-center"
        >
          Register
        </a>
        <a
          href="/contact"
          className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded block w-full text-center"
        >
          Contact
        </a>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
