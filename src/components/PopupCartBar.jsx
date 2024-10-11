import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function PopupCartBar({ isModalOpen, setIsModalOpen, tickets, eventId }) {
  const [totalPrice, setTotalPrice] = useState(0);
  const [ticketPrices, setTicketPrices] = useState({});
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();
  console.log(eventId);

  // Initialize ticketPrices from tickets array
  useEffect(() => {
    const prices = {};
    tickets.forEach((ticket) => {
      prices[ticket.name.toLowerCase()] = ticket.price;
      setQuantities((prev) => ({
        ...prev,
        [ticket.name.toLowerCase()]: 0,
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
      [ticket.name.toLowerCase()]: value,
    }));
  };

  // Handle booking button click
  const handleBook = () => {
    const bookedTickets = tickets
      .map((ticket) => ({
        ...ticket,
        quantity: quantities[ticket.name.toLowerCase()] || 0,
      }))
      .filter((ticket) => ticket.quantity > 0);

    // Debugging output
    console.log("Booked Tickets:", bookedTickets);
    console.log("Total Price:", totalPrice);

    // Check if bookedTickets is not empty before navigating
    if (bookedTickets.length > 0) {
      navigate(`/checkoutpage/${eventId}`, {
        state: { bookedTickets, totalPrice },
      });
      handleCloseModal();
    } else {
      alert("Please select at least one ticket to book.");
    }
  };

  return (
    <div className="bg-white rounded-lg max-w-fit relative flex justify-center  items-center border border-gray-300 p-3">
      <div className="flex justify-center flex-col">
        <h2 className="text-[15px] md:text-[16px] lg:md:text-[18px] text-black/70 font-bold mb-4 text-center">
          Tickets
        </h2>

        {/* Tickets */}
        <div className="grid gap-4 grid-cols-2 place-items-center">
          {tickets.map((ticket) => {
            return (
              <div
                key={ticket.uid}
                className="border border-gray-200 rounded-lg max-w-96 justify-between shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out "
              >
                <div className="bg-black  flex-grow mb-2 rounded-lg items-center flex flex-col p-2 text-white">
                  <h3 className="text-white text-[14px] uppercase md:text-[13px] font-medium my-1">
                    {ticket.name}
                  </h3>
                </div>

                {/* Price */}
                <div className="px-2 py-[1.5rem] flex flex-col">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-[13px] md:text-[13px] lg:text-[16px] text-gray-500 font-semibold">
                        Price
                      </p>
                      <p className="text-black/70 text-[14px] lg:text-[15px] md:text-[13px] font-semibold">
                        {ticket.price > 0 ?
                          <p className="ticket-price">${ticket.price}</p>
                        : <p className="ticket-free">Free</p>}
                      </p>
                    </div>

                    {/* Available Tickets */}
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-[13px] md:text-[13px] lg:text-[16px] text-gray-500 font-semibold">
                        Available Tickets
                      </p>
                      <p className="text-gray-800 text-[14px] md:text-[15px] font-normal ml-5">
                        {ticket.availableTickets}
                      </p>
                    </div>
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex justify-between">
                    <label
                      htmlFor={`quantity-${ticket.uid}`}
                      className="mb-1 text-[13px] md:text-[13px] lg:text-[16px] text-gray-500"
                    >
                      Quantity
                    </label>
                    <select
                      id={`quantity-${ticket.uid}`}
                      value={quantities[ticket.name.toLowerCase()] || 0}
                      onChange={handleQuantityChange(ticket)}
                      className="border rounded-md  text-[13px] md:text-[15px]  lg:text-[16px] text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
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
            onClick={handleBook} // Use handleBook for button click
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
            whileTap={{ scale: 0.85 }}
          >
            Book
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default PopupCartBar;
