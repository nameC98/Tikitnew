import React, { useState } from "react";
import Image from "../assets/img/gospel.jpg";
import { Link, useParams } from "react-router-dom";
import Footer from "../components/Footer";

const Result = () => {
  const [order, setOrder] = useState();

  const { orderUid } = useParams();

  console.log(orderUid);

  // useEffect(() => {
  //   const fetchEvents = async () => {
  //     try {
  //       const response = await axios.get(
  //         `https://api.tikiti.co.zw/opn/v1/session/${session.uid}/cart`
  //       );

  //       setcartUid(response.data.uid);
  //     } catch (error) {
  //       console.error("Error fetching events:", error);
  //     }
  //   };

  //   fetchEvents();
  // }, []);

  return (
    <>
      <div
        style={{ backgroundImage: `url(${Image})` }}
        className="min-h-screen bg-cover bg-center bg-no-repeat  flex items-center justify-center px-4"
      >
        <div className="bg-white shadow-lg rounded-lg overflow-hidden  w-full max-w-3xl md:max-w-4xl lg:max-w-6xl">
          <div className="bg-green-600 flex justify-between sm:px-[4rem] px-[1rem] text-white text-lg font-bold text-center py-4">
            <h1> TRANSACTION STATUS </h1>
            <h1> SUCCESS </h1>
          </div>
          <div className="divide-y divide-gray-300 mt-3 ">
            <div className="py-3 flex justify-between sm:text-[18px] text-[16px] sm:px-[4rem] px-[1rem] text-gray-600">
              <span>Amount</span>
              <span>0.1</span>
            </div>
            <div className="py-3 flex justify-between sm:text-[18px] text-[16px] sm:px-[4rem] px-[1rem] text-gray-600">
              <span>Fees</span>
              <span>0</span>
            </div>
            <div className="py-3 flex justify-between sm:text-[18px] text-[16px] sm:px-[4rem] px-[1rem] text-gray-600">
              <span>Total Amount</span>
              <span>0.1</span>
            </div>
            <div className="py-3 flex justify-between sm:text-[18px] text-[16px] sm:px-[4rem] px-[1rem] text-gray-600">
              <span>Currency Code</span>
              <span>ZiG</span>
            </div>
            <div className="py-3 flex justify-between sm:text-[18px] text-[16px] sm:px-[4rem] px-[1rem] text-gray-600">
              <span>Reference</span>
              <span>20241018083731881-1C748E3C</span>
            </div>
            <div className="py-3 flex justify-between sm:text-[18px] text-[16px] sm:px-[4rem] px-[1rem] text-gray-600">
              <span>Reason for Payment</span>
              <span>Donation</span>
            </div>
            <div className="py-3 flex justify-between sm:text-[18px] text-[16px] sm:px-[4rem] px-[1rem] text-gray-600">
              <span>Transaction Status</span>
              <span>Transaction completed successfully</span>
            </div>
          </div>
          <Link to="/">
            <div className="flex justify-center mt-8 mb-8">
              <button className="bg-orange-600  text-white font-semibold py-2 px-[7rem] rounded-md hover:bg-orange-500 transition-all duration-300">
                Home
              </button>
            </div>
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Result;
