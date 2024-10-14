import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function CheckoutPage() {
  const location = useLocation();
  const { eventId } = useParams();
  const {
    bookedTickets = [],
    totalPrice = 0,
    registrationId,
  } = location.state || {};

  console.log(registrationId);

  const [eventDetails, setEventDetails] = useState(null);
  const [ticketHolders, setTicketHolders] = useState({});
  const [openTicketTypes, setOpenTicketTypes] = useState({});
  const [updatedBookedTickets, setUpdatedBookedTickets] =
    useState(bookedTickets);
  const [registrationFields, setRegistrationFields] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEventData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [eventResponse, registrationResponse] = await Promise.all([
        axios.get(`https://api.tikiti.co.zw/opn/v1/events/${eventId}`),
        axios.get(
          `https://api.tikiti.co.zw/opn/v1/event-types/${registrationId}/registration-fields`
        ),
      ]);

      setEventDetails(eventResponse.data);
      setRegistrationFields(registrationResponse.data);
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventData();
  }, [eventId, registrationId]);

  if (loading) {
    return <p>Loading event data...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  console.log(registrationFields);

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

  // Handle adding a ticket holder
  const handleAddTicketHolder = (ticketType) => {
    // Increment the ticket quantity for the corresponding ticket type
    setUpdatedBookedTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.name === ticketType ?
          { ...ticket, quantity: ticket.quantity + 1 }
        : ticket
      )
    );

    // Add a new ticket holder for the added ticket
    setTicketHolders((prev) => ({
      ...prev,
      [ticketType]: {
        ...prev[ticketType],
        [Object.keys(prev[ticketType] || {}).length]: {
          name: "",
          lastName: "",
          email: "",
        },
      },
    }));
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

  return (
    <>
      <Navbar />
      <div className="justify-center items-center flex-col">
        <div className="flex flex-col justify-center items-center mt-5 gap-1">
          <h1 className="text-[20px] lg:text-[23px] font-bold text-black/70">
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
              <div className="flex flex-col gap-5">
                <ul className="space-y-4">
                  {updatedBookedTickets.map((ticket, ticketIndex) => (
                    <li
                      key={ticketIndex}
                      className="border border-gray-300 rounded-md p-4"
                    >
                      <div className="flex justify-between gap-[2rem] items-center">
                        <div className="font-semibold">{ticket.name}</div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAddTicketHolder(ticket.name)}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                          >
                            Add
                          </button>
                        </div>
                      </div>

                      <div className="mt-4">
                        {Array.from({ length: ticket.quantity }).map(
                          (_, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-5 mb-5 border py-2 px-5 rounded-md"
                            >
                              {(
                                registrationFields &&
                                registrationFields.length > 0
                              ) ?
                                registrationFields.map((field) => (
                                  <label key={field.uid} className="block mb-1">
                                    {field.displayName}:
                                    <input
                                      type={
                                        field.fieldType === "TEXT" ?
                                          "text"
                                        : "email"
                                      }
                                      placeholder={`Enter ${field.displayName}`}
                                      value={
                                        ticketHolders[ticket.name]?.[index]?.[
                                          field.name
                                        ] || ""
                                      }
                                      onChange={(e) =>
                                        handleInputChange(
                                          ticket.name,
                                          index,
                                          field.name,
                                          e.target.value
                                        )
                                      }
                                      className="border border-gray-300 text-[13px] outline-none rounded-md p-1 w-full"
                                      required={field.mandatory}
                                    />
                                  </label>
                                ))
                              : <p>No registration fields available.</p>}
                              {/* Remove Button */}
                              <div>
                                <button
                                  onClick={() =>
                                    handleRemoveTicketHolder(ticket.name, index)
                                  }
                                  className="bg-red-500  px-5 border text-[13px] outline-none rounded-md p-1 mt-5 w-full font-semibold text-white"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between items-center mt-6">
                  <div className="text-lg font-semibold text-green-500">
                    <span className="text-black">Tickets Remaining:</span>{" "}
                    {calculateTotalRemaining()}{" "}
                  </div>
                  <div className="text-lg text-green-500 font-semibold">
                    <span className="text-black">Total Price:</span> $
                    {calculateTotalPrice()}{" "}
                  </div>
                </div>
                <div className="flex justify-center items-center">
                  <button
                    className="text-lg px-8 py-2 bg-orange-500 text-white rounded-md"
                    onClick={() => console.log("Proceed to Payment")}
                  >
                    checkout
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
