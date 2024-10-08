import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { FaTicketAlt, FaTimes } from "react-icons/fa";
import Footer from "../components/Footer";
import axios from "axios";
import { Link, redirect, useLoaderData } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";
import { motion } from "framer-motion";
import PopupCartBar from "../components/PopupCartBar";

export const loader = async ({ params }) => {
  try {
    const { data } = await axios.get(
      `https://api.tikiti.co.zw/opn/v1/events/${params.id}`
    );
    return data;
  } catch (error) {
    return redirect("/explore");
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

  const selectedEvent = useLoaderData();
  const baseImageUrl = "https://api.tikiti.co.zw/opn/v1/files";
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [premiumQuantity, setPremiumQuantity] = useState(0);
  const [standardQuantity, setStandardQuantity] = useState(0);
  const ticketPrices = {
    premium: 50,
    standard: 30,
  };

  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate the total price whenever the quantities change
  useEffect(() => {
    const total =
      ticketPrices.premium * premiumQuantity +
      ticketPrices.standard * standardQuantity;
    setTotalPrice(total);
  }, [premiumQuantity, standardQuantity]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleClose = () => {
    setIsSidebarOpen(false);
  };

  // const handlePurchaseClick = () => {
  //   if (premiumQuantity > 0 || standardQuantity > 0) {
  //     setIsModalOpen(true);
  //   }
  // };

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

  return (
    <>
      <div className="relative h-[100vh]">
        <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="z-50">
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            isMobile={isMobile}
            toggleClose={toggleClose}
          />
        </div>

        <div className="w-[90%] md:w-[96%] lg:w-[85%] mt-5 m-auto">
          <div className="grid grid-cols-1 md:grid-cols-2  gap-8">
            {/* Left Section - Event Image */}
            <div className="w-full md:h-[18.5rem] relative md:bg-gray-200 rounded-lg">
              <div className="bg-black/20 w-full absolute h-[12rem] overflow-hidden z-10"></div>
              <img
                src={`${baseImageUrl}?fileName=${selectedEvent.imageFileName}`}
                alt="Event"
                className="object-cover w-full md:h-full"
              />

              {/* Event Organizer */}
              <div className="mt-4 border rounded-lg shadow-sm p-4 bg-white flex justify-between items-center">
                <div className="flex flex-col">
                  <h2 className="lg:text-[18px] text-[15px]   font-semibold">
                    Organized by
                  </h2>
                  <p className="text-gray-600">Zimpraise</p>
                </div>
                <div className="border border-green-500 flex items-center gap-3 p-2">
                  <FaTicketAlt className="text-green-500 text-[1rem] md:text-[2rem]" />
                  <p className="font-bold text-red-500">
                    Only 20 tickets left!
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="mt-8 border rounded-lg shadow-sm p-4 bg-white">
                <h2 className="lg:text-[18px] text-[15px]   font-semibold">
                  About This Event
                </h2>
                <p className="text-gray-600 mt-2">{selectedEvent.details}</p>
              </div>
            </div>

            {/* Right Section - Event Info */}
            <div className="space-y-4 h-[48rem] md:h-[43rem] md:overflow-auto">
              {/* Event Info */}
              <div className="border rounded-lg shadow-sm p-4 bg-white">
                <h1 className="xl:text-2xl text-xl font-bold">
                  {selectedEvent.name}
                </h1>
                <p className="text-gray-600 md:text-[18px] text-[15px]">
                  Location: {selectedEvent.location.description}
                </p>
                <p className="text-gray-600 md:text-[18px] text-[15px]">
                  Date: {selectedEvent.date}
                </p>
                {/* <p className="text-gray-600">Time: 9:00 AM - 5:00 PM (ADST)</p> */}
                {/* <div className="lg:text-[18px] text-[15px]  font-semibold text-green-600">
                  USD: $3
                </div> */}
                <button
                  onClick={handlePurchaseClick}
                  className="mt-4 w-full bg-green-600 md:text-[17px] text-[15px] text-white py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Purchase Ticket
                </button>
              </div>

              {/* Countdown */}
              <div className="border rounded-lg shadow-sm p-4 bg-white">
                <h2 className="lg:text-[18px] text-[15px]   font-semibold text-center">
                  Booking will end on November 1st, 2024
                </h2>
                <div className="flex justify-center space-x-4 text-center mt-4">
                  <div className="text-gray-600">
                    <span className="block lg:text-[25px] text-[20px] bg-green-500 text-white rounded-md p-3 font-bold">
                      {timeLeft.days || "0"}
                    </span>
                    <span className="block lg:text-[16px] text-[15px]  ">
                      Days
                    </span>
                  </div>
                  <div className="text-gray-600">
                    <span className="block lg:text-[25px] text-[20px] bg-green-500 text-white rounded-md p-3 font-bold">
                      {timeLeft.hours || "0"}
                    </span>
                    <span className="block lg:text-[16px] text-[15px]  ">
                      Hours
                    </span>
                  </div>
                  <div className="text-gray-600">
                    <span className="block lg:text-[25px] text-[20px] bg-green-500 text-white rounded-md p-3 font-bold">
                      {timeLeft.minutes || "0"}
                    </span>
                    <span className="block lg:text-[16px] text-[15px]  ">
                      Minutes
                    </span>
                  </div>
                  <div className="text-gray-600">
                    <span className="block lg:text-[25px] text-[20px] bg-green-500 text-white rounded-md p-3 font-bold">
                      {timeLeft.seconds || "0"}
                    </span>
                    <span className="block lg:text-[16px] text-[15px]  ">
                      Seconds
                    </span>
                  </div>
                </div>
              </div>

              {/* Date & Time Section */}
              <div className="border rounded-lg shadow-sm p-3 bg-white">
                <h3 className="text-lg font-semibold mt-4">Date & Time</h3>
                <p className="text-gray-600 md:text-[18px] text-[15px]">
                  Start Time - {selectedEvent.time}
                </p>
                <p className="text-gray-600 md:text-[18px] text-[15px]">
                  Date - {selectedEvent.date}
                </p>
              </div>

              {/* Location Section */}
              <div className="border rounded-lg shadow-sm p-4 bg-white">
                <h3 className="text-lg font-semibold mt-4 ">Location</h3>
                <p className="text-gray-600 md:text-[18px] text-[15px]">
                  {selectedEvent.location.description}
                </p>
              </div>

              {/* Refund Policy Section */}
              <div className="border rounded-lg shadow-sm p-4 bg-white">
                <h3 className="text-lg font-semibold mt-4">Refund Policy</h3>
                <p className="text-gray-600 md:text-[18px] text-[15px]">
                  Full refunds are available up to 7 days before the event. No
                  refunds will be issued after this date.
                </p>
              </div>
            </div>
          </div>
          {/* Modal for Ticket Purchase */}
          <PopupCartBar
            setPremiumQuantity={setPremiumQuantity}
            setStandardQuantity={setStandardQuantity}
            standardQuantity={standardQuantity}
            premiumQuantity={premiumQuantity}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            ticketPrices={ticketPrices}
            totalPrice={totalPrice}
          />
        </div>

        {/* Location Map */}
        <div className="mt-[2rem] mb-[2rem] flex items-center  justify-center relative bg-white">
          <div className="flex items-center flex-col justify-center">
            <h2 className="lg:text-[20px] text-[18px]  mb-4 font-semibold">
              Location
            </h2>
            {isLoading && (
              <div className="loader-container absolute flex justify-center items-center">
                <div className="loader border-t-4 z-10 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
                <p className="text-center mt-2">Loading Map...</p>
              </div>
            )}
            <iframe
              className="z-50 xl:w-[330%] lg:w-[300%] md:w-[250%] w-[110%] sm:w-[200%]"
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15193.470280343081!2d30.9950297!3d-17.8213959!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1931a5da14f14cfd%3A0xd2e9507a9581c24b!2sNational%20Sports%20Stadium!5e0!3m2!1sen!2szw!4v1728120210313!5m2!1sen!2szw"
              width="1000"
              height="450"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}

export default GetEventID;
