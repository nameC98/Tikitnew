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
    session,
  } = location.state || {};

  const [eventDetails, setEventDetails] = useState(null);
  const [ticketHolders, setTicketHolders] = useState({});
  const [openTicketTypes, setOpenTicketTypes] = useState({});
  const [updatedBookedTickets, setUpdatedBookedTickets] =
    useState(bookedTickets);
  const [registrationFields, setRegistrationFields] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState("");

  const [cartUid, setcartUid] = useState();
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          `https://api.tikiti.co.zw/opn/v1/session/${session.uid}/cart`
        );

        setcartUid(response.data.uid);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const handleCheckout = async () => {
    if (!cartUid) {
      alert("Missing cart ID. Please try again or refresh the page.");
      return;
    }

    // Check if all required fields are filled
    const missingFields = updatedBookedTickets.some((ticket) =>
      Array.from({ length: ticket.quantity }).some((_, index) => {
        const holder = ticketHolders[ticket.name]?.[index];
        return !holder?.name || !holder?.email;
      })
    );

    if (missingFields) {
      alert("Please fill out all required fields for ticket holders.");
      return;
    }

    // Check if user email is filled
    if (!userEmail) {
      alert("Please enter your email.");
      return;
    }

    try {
      const newBookedTickets = [];

      for (const ticket of bookedTickets) {
        const ticketTotalPrice = ticket.price * ticket.quantity;

        // Build purchaseDetails dynamically
        const purchaseDetails = {
          firstName:
            ticketHolders[updatedBookedTickets[0]?.name]?.[0]?.name || "",
          email: userEmail,
          lastName:
            ticketHolders[updatedBookedTickets[0]?.name]?.[0]?.lastName || "", // Always send lastName, even if empty
        };

        const phoneNumber =
          ticketHolders[updatedBookedTickets[0]?.number]?.[0]?.phoneNumber ||
          "";
        if (phoneNumber) {
          purchaseDetails.phoneNumber = phoneNumber;
        }

        const payload = {
          parentUid: cartUid,
          productUid: ticket.uid,
          totalAmount: ticketTotalPrice,
          purchaseDetails, // Using the dynamically built object
        };

        const addItemsResponse = await axios.post(
          `https://api.tikiti.co.zw/opn/v1/cart/${cartUid}/add-items`,
          payload
        );
        console.log("cart:", addItemsResponse.data);
        const { cartItem } = addItemsResponse.data;
        newBookedTickets.push(cartItem);
      }

      // Proceed with the checkout
      const response = await axios.post(
        `https://api.tikiti.co.zw/opn/v1/cart/${cartUid}/checkout?email=${userEmail}`,
        {
          productUid: updatedBookedTickets[0]?.uid || "",
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const orderUid = response.data?.orderNumber;

      if (orderUid) {
        const paymentResponse = await axios.post(
          `https://api.tikiti.co.zw/opn/v1/orders/${orderUid}/initiate-payment`,
          {
            paymentMethod: "ONLINE",
            returnUrl: `https://tikitnew.vercel.app/confirmationpage?orderUid=${orderUid}`,
          },
          { headers: { "Content-Type": "application/json" } }
        );
        console.log("Checkout Success:", paymentResponse.data);
        const paymentUrl = paymentResponse.data.paymentTransaction.redirectUrl;
        window.location.href = paymentUrl;
      } else {
        setError("Failed to process checkout. Please try again.");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      setError("Checkout failed. Please try again.");
    }
  };

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

  const handleRemoveTicketHolder = (ticketType, index) => {
    setTicketHolders((prev) => {
      const updatedTicketHolders = { ...prev };
      if (updatedTicketHolders[ticketType]) {
        delete updatedTicketHolders[ticketType][index];
      }
      return updatedTicketHolders;
    });

    setUpdatedBookedTickets((prevTickets) =>
      prevTickets
        .map((ticket) =>
          ticket.name === ticketType && ticket.quantity > 0
            ? { ...ticket, quantity: ticket.quantity - 1 }
            : ticket
        )
        .filter((ticket) => ticket.quantity > 0)
    );
  };

  const handleAddTicketHolder = (ticketType) => {
    setUpdatedBookedTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.name === ticketType
          ? { ...ticket, quantity: ticket.quantity + 1 }
          : ticket
      )
    );

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

  const calculateTotalRemaining = () => {
    return updatedBookedTickets.reduce(
      (total, ticket) => total + ticket.quantity,
      0
    );
  };

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
          <div className=" max-w-4x p-6 bg-white rounded-lg overflow-auto h-[80vh]">
            <div className="flex justify-center items-center">
              <div className="flex  gap-10">
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
                              className="flex items-center gap-5 mt-4 "
                            >
                              <div className="flex items-center gap-5 w-full ">
                                <input
                                  type="text"
                                  value={
                                    ticketHolders[ticket.name]?.[index]?.name ||
                                    ""
                                  }
                                  onChange={(e) =>
                                    handleInputChange(
                                      ticket.name,
                                      index,
                                      "name",
                                      e.target.value
                                    )
                                  }
                                  placeholder="First Name"
                                  className="border p-2 rounded-md w-full"
                                />
                                <input
                                  type="email"
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
                                  placeholder="Email"
                                  className="border p-2 rounded-md w-full"
                                />
                              </div>
                              <button
                                onClick={() =>
                                  handleRemoveTicketHolder(ticket.name, index)
                                }
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                              >
                                Remove
                              </button>
                            </div>
                          )
                        )}
                      </div>
                    </li>
                  ))}
                  <button className="text-lg px-8 py-2 bg-orange-500 mt-5 text-white rounded-md">
                    Save
                  </button>{" "}
                </ul>
                <div>
                  {" "}
                  <div className="">
                    <h3 className="font-bold text-black/60 flex justify-center text-xl mb-8">
                      Summary:
                    </h3>
                    <div className="flex justify-between mb-4">
                      <div>Total tickets: {calculateTotalRemaining()}</div>
                      <div className="font-bold">
                        Total Price: ${calculateTotalPrice()}
                      </div>
                    </div>
                  </div>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="border p-2 rounded-md w-full"
                  />
                  {error && <p className="text-red-500">{error}</p>}
                  <button
                    className="text-lg px-8 py-2 bg-orange-500 mt-5 text-white rounded-md"
                    onClick={handleCheckout}
                  >
                    Checkout
                  </button>{" "}
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
