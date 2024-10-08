import logo2 from "../../assets/imgs/logo2.jpg";
import { motion } from "framer-motion";

function Footer() {
  return (
    <>
      <footer className="bg-black text-gray-400 py-2 md:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex-col flex gap-2">
            <img
              src={logo2}
              alt="logo"
              className="sm:h-[5rem] w-[5rem]  h-[5rem] "
            />
            <p>Tikiti {"\u00A9"}2024</p>
          </div>

          <div>
            <ul>
              <li>
                <a
                  href="#"
                  className="hover:text-white sm:text-[15px] text-[12px]"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white sm:text-[15px] text-[12px]"
                >
                  Box Office
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white sm:text-[15px] text-[12px]"
                >
                  Account
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white sm:text-[15px] text-[12px]"
                >
                  My Events
                </a>
              </li>
            </ul>
          </div>
          <div>
            {/* <h3 className="text-white font-bold mb-4 sm:text-[15px] text-[15px]">

        </h3> */}
            <ul>
              <li>
                <a
                  href="#"
                  className="hover:text-white sm:text-[15px] text-[12px]"
                >
                  {" "}
                  Trending Events
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white sm:text-[15px] text-[12px]"
                >
                  Corporate Bookings
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white sm:text-[15px] text-[12px]"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white sm:text-[15px] text-[12px]"
                >
                  FAQ's
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white sm:text-[15px] text-[12px]"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
          <div>
            <ul>
              <li>
                <a
                  href="#"
                  className="hover:text-white sm:text-[15px] text-[12px]"
                >
                  {" "}
                  Access to Information
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white sm:text-[15px] text-[12px]"
                >
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white sm:text-[15px] text-[12px]"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
          <div>
            <motion.button
              className="bg-green-500 text-white sm:text-[14px] text-[13px] px-4 py-2 rounded-3xl"
              whileHover={{ scale: 1.1, backgroundColor: "#38b2ac" }}
              transition={{ duration: 0.3 }}
              whileTap={{ scale: 0.85 }}
            >
              Create an Event
            </motion.button>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
