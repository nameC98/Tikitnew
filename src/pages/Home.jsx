import banner from "../assets/img/banner.svg";
import heroImg from "../assets/img/heroImage.jpg";
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
    const getevents = await axios.get(
      "https://api.tikiti.co.zw/opn/v1/events/active"
    );
    const getsessions = await axios.get(
      "https://api.tikiti.co.zw/opn/v1/sessions/current-session"
    );

    return { getallevents: getevents.data, getsession: getsessions.data };
  } catch (error) {
    return redirect("/");
  }
};

function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const [events, setEvents] = useState([]);
  const { getallevents, getsession } = useLoaderData();
  console.log(getsession);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          "https://api.tikiti.co.zw/opn/v1/files"
        );
        setEvents(response.data);
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

  // Handle window resize to show/hide sidebar
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

  const baseImageUrl = "https://api.tikiti.co.zw/opn/v1/files";

  console.log(getallevents);

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
        className="hero-section"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div className="hero-section__overlay"></div>
        <motion.div
          className="flex flex-col justify-center items-center "
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0, transition: { duration: 1 } }}
        >
          <h1 className="hero-section__heading">Come ALive!</h1>
          <p className="hero-section__caption">
            Get front row experience for your favourite show.
          </p>

          <motion.button className="hero-section__button">
            Get Started
          </motion.button>
        </motion.div>
      </header>

      {/* Trending Events Section */}
      <section
        className="trending-section"
        style={{ backgroundImage: `url(${banner})` }}
      >
        <h2 className="trending-section__heading">Trending Events</h2>
      </section>

      <section className="content-area">
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
          className="cards-section"
        >
          {getallevents?.content?.map((event) => (
            <div key={event.id}>
              <motion.div
                className="cards-section-card"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 10px 15px rgba(0, 0, 0, 0.2)",
                }}
                transition={{ duration: 0.3 }}
                key={event.id}
              >
                <Link
                  to={`geteventid/${event.uid}`}
                  onClick={() => handleBookNowClick(event.uid)}
                >
                  <img
                    src={`${baseImageUrl}?fileName=${event.imageFileName}`}
                    alt="Place Event name from Database"
                    className="cards-section-card__image"
                  />
                  <div className="p-3">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="cards-section-card__date">
                          {event.date}
                        </h3>
                        <h2 className="cards-section-card__title">
                          {event.name}
                        </h2>
                      </div>
                      <div>
                        <h3 className="cards-section-card__eventType">
                          {event.eventType.name}
                        </h3>
                      </div>
                    </div>

                    {loading[event.uid] ? (
                      <Loader />
                    ) : (
                      <motion.button className="cards-section-card__button">
                        Book Now
                      </motion.button>
                    )}
                  </div>
                </Link>
              </motion.div>
            </div>
          ))}
        </motion.div>

        <div className="text-center mt-8">
          <a href="#browse" className="browse-all-events">
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
