import React from "react";

const Contact = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-orange-300">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h1 className="text-3xl font-bold mb-2 text-center">Contact Us</h1>
        <div className="flex flex-col justify-center items-center gap-1">
          <p className="text-lg text-center">In case, you are not able to Login</p>
          <p className="text-lg text-center mb-2">
            Hello! Get in touch with Super Admin!
          </p>
          <div className="flex flex-col justify-center items-center gap-1 font-bold w-full">
            <p className="text-lg">Email</p>
            <a
              href="mailto:mianhamid6426@gmail.com"
              className="bg-orange-400 hover:text-white py-2 px-4 w-full text-center"
            >
              mianhamid6426@gmail.com
            </a>
          </div>
          <div className="flex mt-2 flex-col justify-center items-center gap-1 font-bold w-full">
            <p className="text-lg">Phone</p>
            <p className="bg-orange-400 py-2 px-4 w-full text-center">
              +923145711577
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
