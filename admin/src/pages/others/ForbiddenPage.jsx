import React from "react";

const ForbiddenPage = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">403: Forbidden</h1>
        <p className="text-lg mb-6">
          Sorry, you don't have permission to access this page. 
          Please <a href="/login" className="text-blue-500 hover:text-blue-700">log in</a> or contact our <a href="/contact" className="text-blue-500 hover:text-blue-700">support team</a> for assistance.
        </p>
      </div>
    </div>
  );
};

export default ForbiddenPage;