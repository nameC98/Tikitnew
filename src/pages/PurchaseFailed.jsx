import React from "react";

const PurchaseFailed = () => {
  const handleExit = () => {
    window.location.href = "/";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Purchase Failed
        </h1>
        <p className="text-gray-700 mb-6">
          We're sorry, but your purchase could not be completed. Please check
          your information and try again.
        </p>
        <button
          onClick={handleExit}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
        >
          Exit
        </button>
      </div>
    </div>
  );
};

export default PurchaseFailed;
