import { AiOutlineClose, AiOutlineMenu, AiOutlineSearch } from "react-icons/ai";
import { BiCheese } from "react-icons/bi";
import { IoLockClosedOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import logo from "../../assets/imgs/logo.jpg";
import { Link } from "react-router-dom";

function Navbar({ isSidebarOpen, toggleSidebar }) {
  return (
    <>
      {" "}
      {/* Top Navigation  */}
      <nav className="w-[90%] m-auto md:block hidden">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center lg:gap-[5rem] md:gap-[2rem] gap-[2rem]">
          <Link to="/">
            <img
              src={logo}
              alt="logo"
              className="sm:h-[3rem] md:h-[3rem]  h-[3rem]"
            />
          </Link>

          <div className="rounded-3xl border border-gray-300 sm:h-[2.5rem] h-10 md:block hidden w-[50%]">
            <div className="flex justify-between items-center px-2">
              <input
                type="text"
                placeholder="Search for Events"
                className="ml-4 px-1 py-[6px] w-[80%]  text-12px text-black/70 outline-none"
                autoFocus
              />
              <div className="rounded-[25px] p-2 bg-green-500 text-white">
                <AiOutlineSearch className="text-white" />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4 md:mr-10 lg:mr-none">
            <motion.button
              className="bg-green-500 text-white md:text-[16px] text-[15px] sm:px-4 px-4 py-[6px] rounded-3xl flex flex-shrink-0"
              whileHover={{ scale: 1.1, backgroundColor: "#38b2ac" }}
              transition={{ duration: 0.3 }}
              whileTap={{ scale: 0.85 }}
            >
              Create an Event
            </motion.button>

            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
                whileTap={{ scale: 0.85 }}
              >
                <p className="absolute -top-1 -right-1 bg-green-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  3
                </p>
                <BiCheese className="text-[2.3rem] text-gray-600" />
              </motion.button>
            </div>

            <motion.button
              className="border flex rounded-3xl gap-2 items-center border-gray-300 px-4 py-[6px] "
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
              whileTap={{ scale: 0.85 }}
            >
              <IoLockClosedOutline />
              <span className="md:text-[16px] text-[15px] ">Login</span>
            </motion.button>
          </div>
        </div>
      </nav>
      {/* Mobile Hamburger Icon for small screens */}
      <nav className="w-[90%] m-auto md:hidden flex justify-between items-center py-4 z-50">
        <img src={logo} alt="logo" className="h-[3rem]" />
        <button onClick={toggleSidebar}>
          {isSidebarOpen ? (
            <AiOutlineClose className="text-3xl" />
          ) : (
            <AiOutlineMenu className="text-3xl" />
          )}
        </button>
      </nav>
    </>
  );
}

export default Navbar;
