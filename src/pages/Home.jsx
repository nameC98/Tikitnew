import banner from "../../assets/imgs/banner.jpg";
import heroImg from "../../assets/imgs/heroImage.jpg";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, redirect, useLoaderData } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";

export const loader = async () => {
  try {
    const { data } = await axios.get(
      "https://api.tikiti.co.zw/opn/v1/events/active"
    );
    // console.log(data.content);
    return data;
  } catch (error) {
    return redirect("/");
  }
};

function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // Track if on small screens

  const [events, setEvents] = useState([]);
  const allevents = useLoaderData();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          "https://api.tikiti.co.zw/opn/v1/files"
        );
        setEvents(response.data); // Assuming response data is an array of events
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  console.log(events);

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleClose = () => {
    setIsSidebarOpen(false);
  };

  // Handle window resize to show/hide sidebar or topbar based on screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Set mobile state based on screen width
      if (window.innerWidth > 768) {
        setIsSidebarOpen(false); // Hide sidebar when resizing to larger screens
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const baseImageUrl = "https://api.tikiti.co.zw/opn/v1/files";

  console.log(allevents);

  const [loading, setLoading] = useState(false);

  const handleBookNowClick = (id) => {
    setLoading((prev) => ({ ...prev, [id]: true })); // Set loading for the specific button

    setTimeout(() => {
      setLoading((prev) => ({ ...prev, [id]: false }));
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <div>
        <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Sidebar for small screens */}
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          isMobile={isMobile}
          toggleClose={toggleClose}
        />
      </div>

      {/* Hero Section */}

      <header
        className="relative bg-cover bg-center sm:h-[100vh] h-[60vh] flex flex-col justify-center items-center text-white"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div className="bg-black/50 w-full absolute sm:h-[100vh] h-[60vh]"></div>
        <motion.div
          className="flex flex-col justify-center items-center "
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0, transition: { duration: 1 } }}
        >
          <h1 className="font-bold text-[43px] sm:text-5xl leading-tight tracking-wide">
            Come ALive!
          </h1>
          <p className="mt-4 sm:block hidden  text-[15px] sm:text-xl  text-white/80">
            Get front row experience for your favourite show.
          </p>

          <div className="sm:hidden block mt-4">
            <p className=" text-[17.8px] sm:text-xl font-medium leading-tight tracking-wide  text-white/80">
              Get front row experience for
            </p>
            <p className=" flex items-center  font-medium leading-tight tracking-wide justify-center w-full text-[17.8px] sm:text-xl  text-white/80">
              your favourite show.
            </p>
          </div>

          <motion.button
            className="z-50 mt-6 bg-white text-green-500 px-6 py-[8px] rounded-3xl font-bold"
            whileTap={{ scale: 0.85 }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            Get Started
          </motion.button>
        </motion.div>
      </header>

      {/* Trending Events Section */}
      <section
        className="bg-white py-[4rem] text-center"
        style={{ backgroundImage: `url(${banner})` }}
      >
        <h2 className="font-bold text-3xl sm:text-4xl  text-white tracking-wide leading-tight">
          Trending Events
        </h2>
      </section>

      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{
            opacity: 0,
            y: 100,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: {
              duration: 1,
            },
          }}
          className="grid  xl:px-[2rem] grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {allevents?.content?.map((event) => (
            <div key={event.id}>
              <motion.div
                className="border rounded-lg overflow-hidden shadow-sm bg-white"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 10px 15px rgba(0, 0, 0, 0.2)",
                }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={`${baseImageUrl}?fileName=${event.imageFileName}`}
                  alt="Event"
                  className="w-[20rem] h-[15rem] object-cover"
                />
                <div className="p-3">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-sm text-green-600">{event.date}</h3>
                      <h2 className="font-bold text-lg text-black/80 sm:text-[14px] text-[12.8px]">
                        {event.name}
                      </h2>
                    </div>
                    <div>
                      <h3 className="sm:text-[12px] text-[12.8px] flex flex-shrink-0 text-green-600">
                        {event.eventType.name}
                      </h3>
                    </div>
                  </div>
                  <p className="font-bold text-lg sm:text-[14px] text-[12.8px] text-black/80">
                    From $10
                  </p>

                  {loading[event.uid] ? ( // Check if the specific button is loading
                    <Loader />
                  ) : (
                    <Link
                      to={`geteventid/${event.uid}`}
                      onClick={() => handleBookNowClick(event.uid)}
                    >
                      <motion.button
                        className="mt-4 bg-green-500 text-white px-4 sm:text-[14px] text-[13px] py-2 rounded-3xl w-full"
                        whileHover={{ scale: 1.1, backgroundColor: "#38b2ac" }}
                        transition={{ duration: 0.3 }}
                        whileTap={{ scale: 0.85 }}
                      >
                        Book Now
                      </motion.button>
                    </Link>
                  )}
                </div>
              </motion.div>
            </div>
          ))}
        </motion.div>
        <div className="text-center mt-8">
          <a
            href="#browse"
            className="text-green-600 font-semibold sm:text-[16px] text-[15px] hover:underline"
          >
            Browse All Events →
          </a>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Home;
