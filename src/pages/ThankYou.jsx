import React from "react";

function ThankYou() {
  return (
    <div className="min-h-screen bg-blue-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
        <h1 className="text-4xl font-bold text-center mb-6">Ethnic</h1>
        <div className="text-center">
          <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg> */}
          </div>
          <h2 className="text-2xl font-bold mb-2">
            Thank you for your purchase
          </h2>
          <p className="text-gray-600 mb-6">
            We've received your order and it will ship in 5-7 business days.
            Your order number is <span className="font-bold">#B6CT3</span>.
          </p>
          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center space-x-4">
                <img
                  src="https://via.placeholder.com/50"
                  alt="Product 1"
                  className="w-12 h-12 object-cover rounded-lg"
                />
                <span>Half Sleeve 100% Cotton Shirts For Women</span>
              </div>
              <span className="font-semibold">₹800</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <img
                  src="https://via.placeholder.com/50"
                  alt="Product 2"
                  className="w-12 h-12 object-cover rounded-lg"
                />
                <span>Stylish womens scarf combo</span>
              </div>
              <span className="font-semibold">₹800</span>
            </div>
            <div className="flex justify-between items-center border-t border-gray-300 mt-4 pt-4">
              <span className="font-semibold">Total</span>
              <span className="font-semibold">₹1600</span>
            </div>
          </div>
          <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition duration-300">
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default ThankYou;
