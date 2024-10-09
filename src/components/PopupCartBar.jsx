import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function PopupCartBar({
  isModalOpen,
  setIsModalOpen,
  tickets, // Array of ticket objects from the database
}) {
  const [totalPrice, setTotalPrice] = useState(0);
  const [ticketPrices, setTicketPrices] = useState({});
  const [quantities, setQuantities] = useState({});

  // Initialize ticketPrices from tickets array
  useEffect(() => {
    const prices = {};
    tickets.forEach((ticket) => {
      prices[ticket.name.toLowerCase()] = ticket.price; // Use ticket name as key
      setQuantities((prev) => ({
        ...prev,
        [ticket.name.toLowerCase()]: 0, // Initialize quantity for each ticket type
      }));
    });
    setTicketPrices(prices);
  }, [tickets]);

  // Calculate the total price whenever quantities or prices change
  useEffect(() => {
    const total = tickets.reduce((acc, ticket) => {
      const ticketName = ticket.name.toLowerCase();
      return (
        acc + (ticketPrices[ticketName] || 0) * (quantities[ticketName] || 0)
      );
    }, 0);
    setTotalPrice(total);
  }, [quantities, ticketPrices, tickets]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Handle quantity changes for both ticket types
  const handleQuantityChange = (ticket) => (event) => {
    const value = Number(event.target.value);
    setQuantities((prev) => ({
      ...prev,
      [ticket.name.toLowerCase()]: value, // Update only the selected ticket's quantity
    }));
  };

  return (
    <div className="bg-white rounded-lg relative border border-gray-300 p-3">
      <h2 className="text-[15px] md:text-[16px] lg:md:text-[18px] text-black/70 font-bold mb-4 text-center">
        Tickets
      </h2>

      {/* Tickets */}
      <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
        {tickets.map((ticket) => {
          // Define dynamic background color based on ticket type
          const bgColor =
            ticket.name === "VIP TICKET" ? "bg-[#0077ff]"
            : ticket.name === "STANDARD TICKET" ? "bg-[#aec8ff]"
            : "bg-[#7d3100]";

          // Shortened ticket type
          const shortenedName =
            ticket.name === "VIP TICKET" ? "VIP"
            : ticket.name === "STANDARD TICKET" ? "Standard"
            : ticket.name;

          return (
            <div
              key={ticket.uid}
              className=" border border-gray-200 rounded-lg  flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out "
            >
              <div
                className={`${bgColor}  flex-grow mb-2 rounded-lg items-center flex flex-col p-2 text-white`}
              >
                <p className="text-[13px] md:text-[15px] lg:text-[16px]   font-semibold">
                  Ticket Type
                </p>
                <h3 className="text-white text-[14px] uppercase md:text-[13px] font-medium my-1">
                  {ticket.name}
                </h3>
              </div>

              {/* Price */}
              <div className="px-2 py-[1.5rem] ">
                <div className="flex  justify-between items-center mb-2">
                  <p className="text-[13px] md:text-[15px] lg:text-[16px] text-gray-500 font-semibold">
                    Price
                  </p>
                  <p className="text-black/70 text-[14px] md:text-[15px] font-semibold">
                    {ticket.currencyCode} {ticket.price.toFixed(2)}
                  </p>
                </div>

                {/* Available Tickets */}
                <div className="flex  justify-between items-center mb-2">
                  <p className="text-[13px] md:text-[15px] lg:text-[16px] text-gray-500 font-semibold">
                    Available Tickets
                  </p>
                  <p className="text-gray-800 text-[14px] md:text-[15px] font-normal">
                    {ticket.availableTickets}
                  </p>
                </div>

                {/* Quantity Selector */}
                <div className="flex flex-col">
                  <label
                    htmlFor={`quantity-${ticket.uid}`}
                    className="mb-1 text-[13px] md:text-[15px] lg:text-[16px] text-gray-500"
                  >
                    Quantity
                  </label>
                  <select
                    id={`quantity-${ticket.uid}`}
                    value={quantities[ticket.name.toLowerCase()] || 0}
                    onChange={handleQuantityChange(ticket)}
                    className="border rounded-md p-2 text-[13px] md:text-[15px] lg:text-[16px] text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
                  >
                    {[0, 1, 2, 3, 4, 5, 6].map((quantity) => (
                      <option key={quantity} value={quantity}>
                        {quantity}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total */}
      <p className="text-[15px] md:text-[16px] lg:md:text-[18px] text-black/70 mt-[2rem] font-bold mb-4 text-center">
        Total: {tickets.length > 0 ? tickets[0].currencyCode : "USD"}{" "}
        {totalPrice.toFixed(2)}
      </p>

      <div className="flex justify-between">
        <div></div>
        <Link to="/purchaseticket">
          <motion.button
            className={`text-[12px] md:text-[14px] text-white py-2 px-8 rounded hover:bg-green-700 transition ${
              (
                Object.values(quantities).reduce((acc, qty) => acc + qty, 0) ===
                0
              ) ?
                "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
            }`}
            disabled={
              Object.values(quantities).reduce((acc, qty) => acc + qty, 0) === 0
            }
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
            whileTap={{ scale: 0.85 }}
          >
            Book
          </motion.button>
        </Link>
      </div>
    </div>
  );
}

export default PopupCartBar;
