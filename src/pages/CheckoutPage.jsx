import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function CheckoutPage() {
  const location = useLocation();
  const { eventId } = useParams(); // Get eventId from URL
  const { bookedTickets = [], totalPrice = 0 } = location.state || {};

  const [eventDetails, setEventDetails] = useState(null);
  const [ticketHolders, setTicketHolders] = useState({});
  const [openTicketTypes, setOpenTicketTypes] = useState({});
  const [updatedBookedTickets, setUpdatedBookedTickets] =
    useState(bookedTickets);

  const [registrationFields, setRegistrationFields] = useState(null);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const [eventResponse, registrationResponse] = await Promise.all([
          axios.get(`https://api.tikiti.co.zw/opn/v1/events/${eventId}`),
          axios.get(
            `https://api.tikiti.co.zw/opn/v1/event-types/${eventId}/registration-fields`
          ),
        ]);

        setEventDetails(eventResponse.data);
        setRegistrationFields(registrationResponse.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchEventData();
  }, [eventId]);

  if (!updatedBookedTickets.length) {
    return (
      <div className="checkout-container text-center p-6">
        <h1 className="text-2xl font-bold mb-4">No tickets booked</h1>
        <Link to="/" className="text-blue-500 underline">
          Go back to event selection
        </Link>
      </div>
    );
  }

  // Handle input change
  const handleInputChange = (ticketType, index, field, value) => {
    setTicketHolders((prev) => ({
      ...prev,
      [ticketType]: {
        ...prev[ticketType],
        [index]: {
          ...prev[ticketType]?.[index],
          [field]: value,
        },
      },
    }));
  };

  // Handle file input change
  const handleFileChange = (ticketType, index, file) => {
    setTicketHolders((prev) => ({
      ...prev,
      [ticketType]: {
        ...prev[ticketType],
        [index]: {
          ...prev[ticketType]?.[index],
          file,
        },
      },
    }));
  };

  // Handle removing a ticket holder
  const handleRemoveTicketHolder = (ticketType, index) => {
    setTicketHolders((prev) => {
      const updatedTicketHolders = { ...prev };
      if (updatedTicketHolders[ticketType]) {
        delete updatedTicketHolders[ticketType][index];
      }

      return updatedTicketHolders;
    });

    // Update the booked tickets state to reduce the quantity for the corresponding ticket type
    setUpdatedBookedTickets((prevTickets) =>
      prevTickets
        .map((ticket) =>
          ticket.name === ticketType && ticket.quantity > 0 ?
            { ...ticket, quantity: ticket.quantity - 1 }
          : ticket
        )
        .filter((ticket) => ticket.quantity > 0)
    );
  };

  // Calculate the total remaining tickets
  const calculateTotalRemaining = () => {
    return updatedBookedTickets.reduce(
      (total, ticket) => total + ticket.quantity,
      0
    );
  };

  // Calculate the total price
  const calculateTotalPrice = () => {
    return updatedBookedTickets.reduce(
      (total, ticket) => total + ticket.quantity * ticket.price,
      0
    );
  };

  // Toggle visibility of ticket type input fields
  const toggleTicketType = (ticketType) => {
    setOpenTicketTypes((prev) => ({
      ...prev,
      [ticketType]: !prev[ticketType],
    }));
  };

  return (
    <>
      <Navbar />
      <div className="justify-center items-center flex-col">
        <div className="flex flex-col justify-center items-center mt-5 gap-1">
          <h1 className="text-[20px]  lg:text-[23px] font-bold text-black/70">
            {eventDetails?.name}
          </h1>
          <h2 className="text-lg font-semibold text-black/70">Your Tickets:</h2>
        </div>

        <div className="justify-center items-center flex">
          <div className="">
            {/* Left Section - Event Image */}
            <div className="w-full relative rounded-lg">
              {eventDetails && eventDetails.image && (
                <img
                  src={`${baseImageUrl}/${eventDetails.image}`}
                  alt={eventDetails.name}
                  className="w-full h-auto rounded-lg"
                />
              )}
            </div>
          </div>

          <div className="checkout-container max-w-4xl p-6 bg-white rounded-lg overflow-auto h-[80vh]">
            <div className="flex justify-center items-center">
              <div className="flex flex-col">
                <ul className="space-y-4">
                  {updatedBookedTickets.map((ticket, ticketIndex) => (
                    <li
                      key={ticketIndex}
                      className="border border-gray-300 rounded-md p-4"
                    >
                      <div className="flex justify-between gap-[2rem] items-center">
                        <div className="font-semibold">{ticket.name}</div>
                        <button
                          onClick={() => toggleTicketType(ticket.name)}
                          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                        >
                          {openTicketTypes[ticket.name] ?
                            "Hide Details"
                          : "Show Details"}
                        </button>
                      </div>
                      {openTicketTypes[ticket.name] && (
                        <div className="mt-4 ">
                          {Array.from({ length: ticket.quantity }).map(
                            (_, index) => (
                              <div
                                key={index}
                                className="flex gap-5 border py-2 px-5 rounded-md  "
                              >
                                {/* Name Field */}
                                <label className=" mb-1 block gap-1">
                                  Name:
                                  <input
                                    type="text"
                                    placeholder="Enter Name"
                                    value={
                                      ticketHolders[ticket.name]?.[index]
                                        ?.name || ""
                                    }
                                    onChange={(e) =>
                                      handleInputChange(
                                        ticket.name,
                                        index,
                                        "name",
                                        e.target.value
                                      )
                                    }
                                    className="border border-gray-300 text-[13px] outline-none rounded-md p-1 w-full"
                                  />
                                </label>

                                {/* Last Name Field */}
                                <label className="block mb-1">
                                  Last Name:
                                  <input
                                    type="text"
                                    placeholder="Enter Last Name"
                                    value={
                                      ticketHolders[ticket.name]?.[index]
                                        ?.lastName || ""
                                    }
                                    onChange={(e) =>
                                      handleInputChange(
                                        ticket.name,
                                        index,
                                        "lastName",
                                        e.target.value
                                      )
                                    }
                                    className="border border-gray-300 text-[13px] outline-none rounded-md p-1 w-full"
                                  />
                                </label>

                                {/* Email Field */}
                                <label className="block mb-1">
                                  Email Address:
                                  <input
                                    type="email"
                                    placeholder="Enter Email"
                                    value={
                                      ticketHolders[ticket.name]?.[index]
                                        ?.email || ""
                                    }
                                    onChange={(e) =>
                                      handleInputChange(
                                        ticket.name,
                                        index,
                                        "email",
                                        e.target.value
                                      )
                                    }
                                    className="border border-gray-300 text-[13px] outline-none rounded-md p-1 w-full"
                                  />
                                </label>

                                <button
                                  onClick={() =>
                                    handleRemoveTicketHolder(ticket.name, index)
                                  }
                                  className="bg-red-500 text-white rounded px-1 "
                                >
                                  Remove
                                </button>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between items-center mt-6">
                  <div className="text-lg font-semibold text-green-500 ">
                    <span className="text-black">Tickets Remaining:</span>{" "}
                    {calculateTotalRemaining()}{" "}
                  </div>
                  <div className="text-lg text-green-500 font-semibold">
                    <span className="text-black"> Total Price:</span> $
                    {calculateTotalPrice()}{" "}
                  </div>
                </div>
                <div className="flex justify-center items-center">
                  <button className=" py-2 px-10 mt-6 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                    Buy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default CheckoutPage;
