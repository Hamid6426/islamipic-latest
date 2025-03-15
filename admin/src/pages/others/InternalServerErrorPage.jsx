import React from "react";

const InternalServerErrorPage = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">500: Internal Server Error</h1>
        <p className="text-lg mb-6">
          Sorry, something went wrong on our end. 
          Please try again later or contact our <a href="/contact" className="text-blue-500 hover:text-blue-700">support team</a>.
        </p>
      </div>
    </div>
  );
};

export default InternalServerErrorPage;