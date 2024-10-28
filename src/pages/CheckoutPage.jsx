import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import banner from "../assets/img/banner.svg";
import heroImg from "../assets/img/heroImage.jpg";
import { motion } from "framer-motion";
import { IoTrashOutline } from "react-icons/io5";

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

  const handleCheckout = async () => {
    if (!cartUid) {
      alert("Missing cart ID. Please try again or refresh the page.");
      return;
    }

    // Check if all required fields are filled
    const missingFields = updatedBookedTickets.some((ticket) =>
      Array.from({ length: ticket.quantity }).some((_, index) => {
        const holder = ticketHolders[ticket.name]?.[index];
        return registrationFields.some(
          (field) => field.mandatory && !holder?.[field.name]
        );
      })
    );
    console.log("Ticket Holders:", ticketHolders);
    console.log("Updated Booked Tickets:", updatedBookedTickets);

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

        const purchaseDetails = {};

        const phoneNumber =
          ticketHolders[updatedBookedTickets[0]?.name]?.[0]?.phoneNumber || "";
        const firstName =
          ticketHolders[updatedBookedTickets[0]?.name]?.[0]?.firstName || "";
        const email = userEmail;
        const lastName =
          ticketHolders[updatedBookedTickets[0]?.name]?.[0]?.lastName || "";

        if (phoneNumber) {
          purchaseDetails.phoneNumber = phoneNumber;
        }

        if (firstName) {
          purchaseDetails.firstName = firstName;
        }

        if (lastName) {
          purchaseDetails.lastName = lastName;
        }

        if (email) {
          purchaseDetails.email = email;
        }

        console.log(purchaseDetails);
        console.log(ticketHolders[ticket.name]);
        console.log(ticket.quantity);

        const payload = {
          parentUid: cartUid,
          productUid: ticket.uid,
          totalAmount: ticketTotalPrice,
          quantity: ticket.quantity,
          purchaseDetails,
        };

        console.log(payload);

        const addItemsResponse = await axios.post(
          `https://api.tikiti.co.zw/opn/v1/cart/${cartUid}/add-items`,
          payload
        );
        console.log("cart:", addItemsResponse.data);
        const { cartItem } = addItemsResponse.data;
        newBookedTickets.push(cartItem);

        console.log(cartItem);
      }

      // Proceed with the checkout
      const response = await axios.post(
        `https://api.tikiti.co.zw/opn/v1/cart/${cartUid}/checkout?email=${userEmail}`,
        {
          // cartUid: updatedBookedTickets[0]?.uid || "",
        },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("cart:", response.data);
      const responseamount = response.data?.amount;
      console.log(responseamount);

      const orderUid = response.data?.orderNumber;

      if (orderUid) {
        if (responseamount !== 0) {
          const paymentResponse = await axios.post(
            `https://api.tikiti.co.zw/opn/v1/orders/${orderUid}/initiate-payment`,
            {
              paymentMethod: "ONLINE",
              returnUrl: `https://tikitnew.vercel.app/result/${orderUid}`,
            },
            { headers: { "Content-Type": "application/json" } }
          );
          console.log("Checkout Success:", paymentResponse.data);

          const paymentUrl =
            paymentResponse.data.paymentTransaction.redirectUrl;
          window.location.href = paymentUrl;
        } else if (responseamount === 0) {
          // Redirect to results page directly
          // window.location.href = `https://tikitnew.vercel.app/result/${orderUid}`;
        }

        // console.log(
        //   "Payment URL:",
        //   paymentResponse.data.paymentTransaction.redirectUrl
        // );

        // const paymentUrl = paymentResponse.data.paymentTransaction.redirectUrl;
        // window.location.href = paymentUrl;
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
      console.log(registrationResponse.data);

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

  // if (loading) {
  //   return <p>Loading event data...</p>;
  // }

  // if (error) {
  //   return <p>{error}</p>;
  // }

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

      {/* Hero Section */}
      <header className="banner" style={{ backgroundImage: `url(${banner})` }}>
        <div className="banner__overlay"></div>
        <motion.div
          className="flex flex-col justify-center items-center "
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0, transition: { duration: 1 } }}
        >
          {/* <p className="banner__caption">Welcome Webster</p> */}
          <h1 className="banner__heading">{eventDetails?.name}</h1>
          {/* <motion.button className="banner__button">
            Get Started
          </motion.button> */}
        </motion.div>
      </header>

      <div className="content-area">
        <div className="billing-info">
          {updatedBookedTickets.map((ticket, ticketIndex) => (
            <>
              <section className="ticket-holder">
                <h2 className="ticket-holder__event-name">{ticket.name}</h2>

                {Array.from({ length: ticket.quantity }).map((_, index) => (
                  <div className="flex flex-col lg:flex-row lg:space-x-4 lg:items-center">
                    {registrationFields && registrationFields.length > 0 ? (
                      registrationFields.map((field) => (
                        <>
                          <div className="w-full lg:w-2/5">
                            <label
                              htmlFor="name"
                              className="block text-sm font-medium text-gray-600"
                            >
                              {field.displayName}:
                              <input
                                type={
                                  field.fieldType === "TEXT" ? "text" : "email"
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
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                required={field.mandatory}
                              />
                            </label>
                          </div>
                        </>
                      ))
                    ) : (
                      <p>No registration fields available.</p>
                    )}
                    <div className="mt-6 lg:pl-5 w-full lg:w-1/5 flex justify-start">
                      <button className="ticket-holder__remove">
                        <IoTrashOutline
                          onClick={() =>
                            handleRemoveTicketHolder(ticket.name, index)
                          }
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </section>
            </>
          ))}

          {/* <!-- Order Summary --> */}
          <div className="order-summary">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Order Summary
            </h2>
            {updatedBookedTickets.map((ticket, ticketIndex) => (
              <>
                <div className="border-b pb-4 mb-4">
                  <div className="flex justify-between">
                    <span>{ticket.name}</span>
                    <span>{ticket.price}</span>
                  </div>
                </div>

                <div className="flex justify-between font-semibold text-gray-700">
                  <span>Total</span>
                  <span>${calculateTotalPrice()}</span>
                </div>
              </>
            ))}
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="Enter your email"
              className="border p-2 mt-10 rounded-md w-full outline-green-600"
            />
            <button
              onClick={handleCheckout}
              className="w-full mt-4 bg-green-600 text-white  font-semibold py-2 rounded-md hover:bg-green-700 transition duration-300"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>

      {/* <button
        className={
          updatedBookedTickets.length
            ? "py-2 px-10 mt-6 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            : "py-2 px-10 mt-6 bg-gray-500 text-white rounded cursor-not-allowed transition"
        }
      >
        Buy
      </button> */}

      <Footer />
    </>
  );
}

export default CheckoutPage;
