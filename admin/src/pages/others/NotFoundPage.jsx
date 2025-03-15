import React from "react";

const NotFoundPage = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404: Page Not Found</h1>
        <p className="text-lg mb-6">
          Sorry, the page you're looking for doesn't exist. 
          You can try searching for it or return to our <a href="/" className="text-blue-500 hover:text-blue-700">homepage</a>.
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;