import { AiOutlineSearch } from "react-icons/ai";
import { BiCheese } from "react-icons/bi";
import { IoLockClosedOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import logo from "../../assets/imgs/logo.jpg";
import { Link } from "react-router-dom";

function Sidebar({ isSidebarOpen, isMobile, toggleClose }) {
  return (
    <>
      {" "}
      {isSidebarOpen && isMobile && (
        <div className="fixed top-0 left-0 w-2/3 h-full bg-white text-black z-20 p-4">
          <div className="flex justify-between px-1">
            <Link to="/">
              {" "}
              <img src={logo} alt="logo" className="h-[3rem] mb-10 z-50" />{" "}
            </Link>

            <div onClick={toggleClose} className="relative">
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
          </div>
          <div className=" flex justify-center w-full">
            <div className=" flex justify-center gap-10  flex-col  ">
              <div className="rounded-3xl border border-gray-300 h-[2.5rem]   w-full">
                <div className="flex justify-between items-center px-2">
                  <input
                    type="text"
                    placeholder="Search for Events"
                    className="ml-4 text-12px text-black/70   text-[13px]  px-1 py-2 w-[80%] outline-none"
                    autoFocus
                  />
                  <div
                    onClick={toggleClose}
                    className="rounded-[25px] p-2 bg-green-500 text-white"
                  >
                    <AiOutlineSearch className="text-white" />
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="flex flex-col gap-5 space-x-4 ">
                  <div>
                    <motion.button
                      className="bg-green-500 text-white text-[13px] font-semibold text-md sm:text-lg px-4 py-2 rounded-3xl"
                      whileHover={{ scale: 1.1, backgroundColor: "#38b2ac" }}
                      transition={{ duration: 0.3 }}
                      whileTap={{ scale: 0.85 }}
                    >
                      Create an Event
                    </motion.button>
                  </div>
                  <div>
                    <motion.button
                      className="border flex gap-2 items-center border-gray-300 px-4 py-2 rounded-3xl"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                      whileTap={{ scale: 0.85 }}
                      onClick={toggleClose}
                    >
                      <IoLockClosedOutline />
                      <span className="md:text-[16px]  text-[13px]  ">
                        Login
                      </span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;
