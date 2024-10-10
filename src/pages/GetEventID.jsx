import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { FaMapMarkerAlt, FaTicketAlt } from "react-icons/fa";
import Footer from "../components/Footer";
import axios from "axios";
import { Link, redirect, useLoaderData } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";
import { motion } from "framer-motion";
import PopupCartBar from "../components/PopupCartBar";

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
  console.log(selectedEvent);

  console.log(eventId);

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

        <div className="w-[95%]  mt-[3rem] m-auto">
          {" "}
          {/* <h1 className="text-[15px] md:text-[18px] lg:md:text-[19px] font-bold text-black/70">
            {selectedEvent.name}
          </h1> */}
          {/* <div className="w-full bg-white  overflow-hidden">
            <div className="flex   gap-[3rem] ">
              <h2 className="text-[15px] md:text-[18px] lg:md:text-[19px] font-semibold text-gray-600 ">
                {selectedEvent.name}
              </h2>
              <div className=" flex gap-[3rem]">
                <div className="flex flex-col ">
                  <p className="text-[15px] md:text-[16px] lg:md:text-[18px]">
                    Location
                  </p>
                  <div className="flex gap-1 ">
                    <FaMapMarkerAlt className="text-green-500" />
                    <p className="text-gray-600 ">
                      {selectedEvent.location.description}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col border-l border-r border-gray-200 px-5">
                  <p className="text-green-500 font-bold uppercase   text-[15px] md:text-[16px] lg:md:text-[18px]">
                    Date
                  </p>
                  <p className="text-gray-600   md:text-[15px] text-[13px]">
                    {selectedEvent.date}
                  </p>
                </div>

                <div className="flex flex-col ">
                  <p className="text-green-500 text-[15px] md:text-[16px] lg:md:text-[18px] font-bold uppercase">
                    Start Time
                  </p>
                  {selectedEvent.time}
                </div>
              </div>
            </div>
          </div> */}
          <div className="flex flex-col md:flex-row md:space-x-5 w-full">
            {/* Event Card */}
            <div className="border rounded-lg shadow-sm mt-5 md:mt-0 p-3 bg-white flex-1 min-w-0 h-full">
              <h1 className="text-[15px] md:text-[18px] lg:text-[19px] font-bold text-black/70">
                {selectedEvent.name}
              </h1>
              <p className="text-gray-600 xl:text-[16px] md:text-[15px] text-[13px]">
                Location: {selectedEvent.location.description}
              </p>
              <p className="text-gray-600 md:text-[15px] text-[13px]">
                Date - {selectedEvent.date}
              </p>
            </div>

            {/* Date & Time Section */}
            <div className="border rounded-lg shadow-sm mt-5 md:mt-0 p-3 bg-white flex-1 min-w-0 h-full">
              <h3 className="text-[15px] md:text-[18px] lg:text-[19px] font-bold text-black/70">
                Date & Time
              </h3>
              <p className="text-gray-600 md:text-[15px] text-[13px]">
                Start Time - {selectedEvent.time}
              </p>
              <p className="text-gray-600 md:text-[15px] text-[13px]">
                Date - {selectedEvent.date}
              </p>
            </div>
          </div>
        </div>

        <div className="w-[95%]  mt-5 m-auto">
          <div className="grid grid-cols-1 md:grid-cols-2  gap-8">
            {/* Left Section - Event Image */}
            <div className="w-full  relative  rounded-lg">
              {/* <div className="bg-black/20 w-full absolute h-[12rem] overflow-hidden z-10"></div> */}

              <img
                src={`${baseImageUrl}?fileName=${selectedEvent.imageFileName}`}
                alt="Event"
                className="object-cover lg:h-[55vh] h-[45vh] w-full "
              />

              {/* Event Organizer */}
              <div className="mt-4 border rounded-lg shadow-sm p-4 bg-white flex justify-between items-center">
                <div className="flex flex-col">
                  <h2 className="lg:text-[18px] text-[15px]  text-black/70 font-semibold">
                    Organized by
                  </h2>
                  <p className="text-gray-600  md:text-[15px] text-[13px]">
                    Zimpraise
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="mt-8 border rounded-lg shadow-sm p-4 bg-white">
                <h2 className="lg:text-[18px] text-black/70 text-[15px]   font-semibold">
                  About This Event
                </h2>
                <p className="text-gray-600   md:text-[15px] text-[13px] text-black/70 mt-4">
                  {selectedEvent.details}
                </p>
              </div>
            </div>

            {tickets?.length > 0 ?
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
            : <p className=" flex justify-center mt-10">No tickets available</p>
            }
          </div>
        </div>

        {/* Location Map */}
        <div className="mt-[2rem] mb-[2rem] flex items-center  justify-center relative bg-white">
          <div className="flex items-center flex-col justify-center">
            <h2 className="lg:text-[20px] text-black/70 text-[18px]  mb-4 font-semibold">
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
