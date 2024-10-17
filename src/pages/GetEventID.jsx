import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

import Footer from "../components/Footer";
import axios from "axios";
import { redirect, useLoaderData, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

import PopupCartBar from "../components/PopupCartBar";

import { Link } from "react-scroll";
import { motion, useScroll } from "framer-motion";

// Add icons
import {
  IoCalendarClearOutline,
  IoLocationOutline,
  IoTimeOutline,
  IoTrashOutline,
} from "react-icons/io5";

export const loader = async ({ params }) => {
  try {
    const eventResponse = await axios.get(
      `https://api.tikiti.co.zw/opn/v1/events/${params.id}`
    );
    const ticketResponse = await axios.get(
      `https://api.tikiti.co.zw/opn/v1/events/${params.id}/ticket-types`
    );

    return { selectedEvent: eventResponse.data, tickets: ticketResponse.data };
    return data;
  } catch (error) {
    return redirect("/");
  }
};

function GetEventID() {
  const eventDate = new Date("2024-10-25T09:00:00");
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const calculateTimeLeft = () => {
    const now = new Date();
    const difference = eventDate - now;

    let time = {};
    if (difference > 0) {
      time = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return time;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const { selectedEvent, tickets } = useLoaderData();
  const eventId = selectedEvent.uid;
  const baseImageUrl = "https://api.tikiti.co.zw/opn/v1/files";
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate the total price whenever the quantities change

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleClose = () => {
    setIsSidebarOpen(false);
  };

  const handlePurchaseClick = () => {
    setIsModalOpen(true);
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
  // console.log(selectedEvent);

  // console.log(eventId);

  // Used for scroll-linked animation, like Progress Indicators
  // https://www.framer.com/motion/use-scroll/
  const { scrollYProgress } = useScroll();

  // PopUpCartBar
  // const [totalPrice, setTotalPrice] = useState(0);
  const [ticketPrices, setTicketPrices] = useState({});
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();
  const [session, setSession] = useState();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          "https://api.tikiti.co.zw/opn/v1/sessions/current-session"
        );
        setSession(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  // console.log(session);

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
  const handleBook = async () => {
    console.log("book");

    const bookedTickets = tickets
      .map((ticket) => ({
        ...ticket,
        quantity: quantities[ticket.name.toLowerCase()] || 0,
      }))
      .filter((ticket) => ticket.quantity > 0);

    try {
      handleCloseModal();
      console.log(bookedTickets);

      // Process for navigation after booking
      if (bookedTickets.length > 0) {
        navigate(`/checkoutpage/${eventId}`, {
          state: {
            bookedTickets,
            totalPrice,
            registrationId: selectedEvent?.eventType.uid,
            session,
          },
        });
        handleCloseModal();
      } else {
        alert("Please select at least one ticket to book.");
      }
    } catch (error) {
      console.error("Error during booking:", error.response?.data);
      alert(
        error.response?.data.message ||
          "An error occurred while processing your booking."
      );
    }
  };

  return (
    <>
      {/* Progress bar */}
      {/* <div className="z-100"> */}
      <motion.div
        style={{
          scaleX: scrollYProgress,
          height: "10px",
          background: "green",
          transformOrigin: "0 0", // Anchor the scale from the left
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
        }}
      />
      {/* </div> */}

      <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="z-50">
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          isMobile={isMobile}
          toggleClose={toggleClose}
        />
      </div>

      {/* Event Details */}
      <section
        class="event-details"
        style={{
          backgroundImage: `url(${baseImageUrl}?fileName=${selectedEvent.imageFileName})`,
        }}
      >
        <div class="event-details__overlay"></div>

        <div class="event-details__card">
          <div class="event-details__card-background">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-3">
                <h2>{selectedEvent.name}</h2>
                <p>Organized by: Zimpraise</p>
                <p>
                  {selectedEvent.details} Lorem ipsum dolor sit, amet
                  consectetur adipisicing elit. Accusamus deserunt repellendus
                  ut fugit, id inventore temporibus aperiam numquam facere
                  suscipit est assumenda minima.
                </p>
              </div>

              <div className="md:col-span-1">
                <div className="event-details__card-details">
                  <p>
                    <IoCalendarClearOutline /> Date: {selectedEvent.date}
                  </p>
                  <p>
                    <IoLocationOutline /> Venue:{" "}
                    <Link to="location" smooth={true} duration={500}>
                      {selectedEvent.location.description}
                    </Link>
                  </p>
                  <p>
                    <IoTimeOutline /> Time: {selectedEvent.time}
                  </p>
                  <Link
                    to="location"
                    smooth={true}
                    duration={800}
                    className="button"
                  >
                    View Map
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Purchase Tickets */}
      <section class="content-area">
        <h2>Purchase Tickets</h2>
        {tickets.map((ticket) => {
          return (
            <>
              <div class="purchase-ticket">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div class="md:col-span-2">
                    <p>Ticket Type</p>
                    <h3 class="purchase-ticket__name">{ticket.name}</h3>
                    <p class="purchase-ticket__avalability">
                      Available Tickets: {ticket.availableTickets}
                    </p>
                  </div>

                  <div class="md:col-span-1">
                    <p>Price</p>
                    <h3 class="purchase-ticket__price">${ticket.price}</h3>
                  </div>

                  <div class="md:col-span-1">
                    <label
                      htmlFor={`quantity-${ticket.uid}`}
                      className="mb-1 text-[13px] md:text-[13px] lg:text-[16px] text-gray-500"
                    >
                      <p>Quantity</p>
                    </label>
                    <input
                      id={`quantity-${ticket.uid}`}
                      type="number"
                      value={quantities[ticket.name.toLowerCase()] || 0}
                      onChange={handleQuantityChange(ticket)}
                      className="purchase-ticket__quantity w-[13rem]"
                      min="0"
                      max="100"
                    />

                    <div class="purchase-ticket__remove">
                      <IoTrashOutline />
                    </div>
                  </div>
                </div>
              </div>
            </>
          );
        })}

        {/* <!-- Ticket Booking Button & Total--> */}
        <div className="purchase-ticket__book">
          <h2>
            {" "}
            Total: {tickets.length > 0 ? tickets[0].currencyCode : "USD"}{" "}
            {totalPrice.toFixed(2)}
          </h2>
          <Link onClick={handleBook} className="button" to="#">
            Book Tickets
          </Link>
        </div>
      </section>

      {/* OLD LOGIC */}
      {/* {tickets?.length > 0 ? (
        <div className="space-y-4 md:overflow-auto">
          <PopupCartBar
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            totalPrice={totalPrice}
            tickets={tickets}
            selectedEvent={selectedEvent}
            baseImageUrl={baseImageUrl}
            eventId={eventId}
          />
        </div>
      ) : (
        <p className=" flex justify-center mt-10">No tickets available</p>
      )} */}
      {/* END OLD LOGIC */}

      {/* Location Map */}
      <motion.div id="location">
        <section className="container mx-auto" id="location">
          {/* {isLoading && (
              <div className="loader-container absolute inset-0 flex justify-center items-center bg-white bg-opacity-75 z-50">
                <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
                <p className="text-center mt-2">Loading Map...</p>
              </div>
            )} */}

          <iframe
            className="w-full h-[450px] relative z-40"
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15193.470280343081!2d30.9950297!3d-17.8213959!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1931a5da14f14cfd%3A0xd2e9507a9581c24b!2sNational%20Sports%20Stadium!5e0!3m2!1sen!2szw!4v1728120210313!5m2!1sen!2szw"
            width="1000"
            height="450"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </section>
      </motion.div>

      <Footer />
    </>
  );
}

export default GetEventID;
