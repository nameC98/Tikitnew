import React from "react";

const ThankYou = () => {
  const handleExit = () => {
    window.location.href = "/";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">
          Thank You for Your Purchase!
        </h1>
        <p className="text-gray-700 mb-6">
          You can check your email for your ticket.
        </p>
        <button
          onClick={handleExit}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Exit
        </button>
      </div>
    </div>
  );
};

export default ThankYou;
