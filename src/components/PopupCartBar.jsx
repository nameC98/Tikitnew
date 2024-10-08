import React from "react";
import { FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function PopupCartBar({
  setPremiumQuantity,
  setStandardQuantity,
  standardQuantity,
  premiumQuantity,
  isModalOpen,
  setIsModalOpen,
  ticketPrices,
  totalPrice,
}) {
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handlePremiumQuantityChange = (event) => {
    setPremiumQuantity(Number(event.target.value));
  };

  const handleStandardQuantityChange = (event) => {
    setStandardQuantity(Number(event.target.value));
  };

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg lg:w-[70%] md:w-[80%]  w-[95%] py-6  px-3 relative border border-gray-300 transition-all duration-300 ease-in-out transform hover:scale-105">
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 text-gray-800 hover:text-red-500 transition"
            >
              <FaTimes />
            </button>
            <h2 className="text-[15px] md:text-[18px]  font-bold mb-4  text-center">
              Tickets
            </h2>

            {/* Premium Ticket */}
            <div className="mb-4 border-b pb-4 flex justify-center xl:gap-[13rem] lg:gap-[10rem] md:gap-[9rem] sm:gap-[8rem] gap-[4rem]">
              <div className="flex flex-col">
                <p className="text-[12px] md:text-[13px]">Ticket type </p>
                <h3 className="sm:text-[15px] text-[13px] md:text-[18px] font-normal flex flex-shrink-0">
                  Premium Ticket
                </h3>
                <p className="text-gray-600 text-[11px] md:text-[12px] mb-2">
                  More info
                </p>
              </div>

              <div className="flex flex-col">
                <p className="text-[12px] md:text-[13px]">Price </p>
                <p className="sm:text-[15px] md:text-[18px] text-[13px] font-normal">
                  Price: ${ticketPrices.premium}
                </p>
              </div>

              <div className="flex flex-col">
                <label htmlFor="premiumQuantity" className="mb-1">
                  <p className="text-[12px] md:text-[13px]"> Quantity</p>
                </label>

                <select
                  id="premiumQuantity"
                  value={premiumQuantity}
                  onChange={handlePremiumQuantityChange}
                  className="border rounded p-2 mb-4 text-[12px] md:text-[13px]"
                >
                  {[0, 1, 2, 3, 4, 5].map((quantity) => (
                    <option key={quantity} value={quantity}>
                      {quantity}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Standard Ticket */}

            <div className="mb-4 border-b pb-4 flex justify-center xl:gap-[13rem] lg:gap-[10rem] md:gap-[9rem] sm:gap-[8rem] gap-[4rem]">
              <div className="flex flex-col">
                <p className="text-[12px] md:text-[13px]">Ticket type </p>
                <h3 className="sm:text-[15px] text-[13px] md:text-[18px] font-normal flex flex-shrink-0">
                  Standard Ticket
                </h3>
                <p className="text-gray-600 text-[12px] mb-2">More info</p>
              </div>

              <div className="flex flex-col">
                <p className="text-[12px] md:text-[13px]">Price </p>
                <p className="sm:text-[15px] text-[13px] md:text-[18px] font-normal">
                  Price: ${ticketPrices.standard}
                </p>
              </div>

              <div className="flex flex-col">
                <label htmlFor="premiumQuantity" className="mb-1">
                  <p className="text-[12px] md:text-[13px]"> Quantity</p>
                </label>

                <select
                  id="standardQuantity"
                  value={standardQuantity}
                  onChange={handleStandardQuantityChange}
                  className="border rounded p-2 mb-4 text-[12px] md:text-[13px]"
                >
                  {[0, 1, 2, 3, 4, 5, 6].map((quantity) => (
                    <option key={quantity} value={quantity}>
                      {quantity}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Total */}
            <p className="text-[15px] md:text-[18px]  font-bold mb-4 text-center">
              Total: ${totalPrice.toFixed(2)}
            </p>

            <div className="flex justify-between">
              <motion.button
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
                whileTap={{ scale: 0.85 }}
              >
                <button
                  onClick={handleCloseModal}
                  className=" text-[11px] md:text-[14px]    bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
                >
                  Cancel
                </button>
              </motion.button>
              <Link to="/purchaseticket">
                <motion.button
                  className={`bg-green-600 text-[12px] md:text-[14px] text-white py-2 px-4 rounded hover:bg-green-700  transition ${
                    premiumQuantity === 0 && standardQuantity === 0 ?
                      "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                  disabled={premiumQuantity === 0 && standardQuantity === 0}
                  n
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  whileTap={{ scale: 0.85 }}
                >
                  Checkout
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PopupCartBar;
