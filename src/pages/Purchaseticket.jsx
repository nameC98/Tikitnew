import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";

const Purchaseticket = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [tickets, setTickets] = useState([
    { type: "Premium Ticket", price: 50, quantity: 0 },
    { type: "General Admission", price: 25, quantity: 0 },
  ]);

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(""); // Clear error on input change
  };

  const handleAddTicket = (index) => {
    const updatedTickets = [...tickets];
    updatedTickets[index].quantity += 1;
    setTickets(updatedTickets);
  };

  const handleBuy = () => {
    const { firstName, lastName, email } = formData;
    let errorMessages = [];

    if (!firstName) errorMessages.push("First Name");
    if (!lastName) errorMessages.push("Last Name");
    if (!email) errorMessages.push("Email");

    if (errorMessages.length > 0) {
      setError(`Please insert your ${errorMessages.join(", ")}.`);
      return;
    }

    console.log("Purchasing...", { formData, tickets });
  };

  const isFormComplete =
    formData.firstName && formData.lastName && formData.email;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const toggleClose = () => {
    setIsSidebarOpen(false);
  };
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        isMobile={isMobile}
        toggleClose={toggleClose}
      />
      <div className="flex items-center py-[3rem] justify-center  bg-gray-100">
        <div className="flex flex-col gap-5 sm:gap-0 md:flex-row w-full max-w-4xl p-4 space-x-4">
          {/* Left Side: User Details Form */}
          <div className="flex-grow md:w-1/2 p-6 flex flex-col justify-center bg-white rounded-lg shadow-md max-w-md mx-auto">
            <h2 className="font-mono sm:text-[28px] text-[23px]  font-bold mb-4 text-center text-gray-800">
              Add Your Details
            </h2>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg sm:text-[15px] text-[12px] focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  !formData.firstName && error ?
                    "border-red-500 "
                  : "border-gray-300"
                }`}
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg sm:text-[15px] text-[12px] focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  !formData.lastName && error ?
                    "border-red-500"
                  : "border-gray-300"
                }`}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg sm:text-[15px] text-[12px] focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  !formData.email && error ?
                    "border-red-500"
                  : "border-gray-300"
                }`}
                required
              />
              {error && (
                <p className="text-red-500 text-[14px] text-center">{error}</p>
              )}
            </form>
          </div>

          {/* Right Side: Event Information */}
          <div className="flex-grow md:w-1/2 p-6 flex flex-col bg-gradient-to-br from-green-500 to-blue-500 rounded-lg shadow-md text-white max-w-md mx-auto">
            <h2 className="sm:text-[28px] text-[23px] font-mono font-bold mb-4 text-center">
              Event Information
            </h2>
            <div className="space-y-5 text-lg text-center">
              <div>
                <h3 className="font-semibold lg:text-[20px] md:text-[18px] text-[16px]">
                  Worship Moments Album Launch
                </h3>
                <p className="mb-1  md:text-[17px] text-[16px]">
                  Oct 25, 2024, 6:00 PM – 8:00 PM
                </p>
                <p className="mb-[1rem]  md:text-[17px] text-[16px]">
                  Celebration Centre (Foyer)
                </p>
              </div>

              {/* Ticket Types Section */}
              <div>
                {tickets.map((ticket, index) => (
                  <div
                    key={index}
                    className="flex justify-between border-t-2 border-b-2 border-white/40 py-2 mt-4"
                  >
                    <div className="flex-col flex ">
                      <p className="md:text-[16px] text-[15px]">
                        {ticket.type}
                      </p>
                      <div className="flex justify-between">
                        <p className="md:text-[16px] text-[15px]">
                          Qty: {ticket.quantity}
                        </p>
                        <button
                          onClick={() => handleAddTicket(index)}
                          className="bg-white text-green-500 py-1 px-3 rounded"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="md:text-[16px] text-[15px] font-bold">
                        ${ticket.price}.00
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between">
                <label className="block md:text-[16px] text-[15px] font-semibold">
                  Total:
                </label>
                <p className="md:text-[16px] text-[15px] font-bold">
                  $
                  {tickets.reduce(
                    (total, ticket) => total + ticket.price * ticket.quantity,
                    0
                  )}
                  .00
                </p>
              </div>
            </div>

            <button
              onClick={handleBuy}
              className={`mt-6 ${isFormComplete ? "bg-green-700 hover:bg-green-700" : "bg-gray-400"} text-white py-2 px-4 rounded-lg transition duration-300 w-full`}
            >
              Buy
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Purchaseticket;
