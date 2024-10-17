import React, { useEffect, useState } from "react";
import axios from "axios";

const ConfirmationPage = () => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState(null); // To handle and display errors
  const orderUidInfo = new URLSearchParams(window.location.search);
  const orderUid = Object.fromEntries(orderUidInfo.entries());
  console.log(orderUid);

  console.log(orderUid);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        if (!orderUid) {
          throw new Error("No order ID found in the URL.");
        }

        const response = await axios.get(
          `https://api.tikiti.co.zw/opn/v1/orders/${orderUid}`
        );
        setOrderDetails(response.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
        setError(error.message || "Failed to fetch order details.");
      }
    };

    fetchOrderDetails();
  }, [orderUid]);

  if (error) {
    return <div>Error: {error}</div>; // Display any error that occurs
  }

  if (!orderDetails) {
    return <div>Loading...</div>; // Loading state
  }

  return (
    <div>
      <h1>Order Confirmation</h1>
      <p>Thank you for your purchase!</p>
      <h2>Order Details</h2>
      <p>Order Number: {orderDetails.orderNumber}</p>
      <p>Email: {orderDetails.email}</p>
      <p>
        Amount: {orderDetails.amount} {orderDetails.currencyCode}
      </p>
      <p>Date: {orderDetails.orderDate}</p>
      <h3>Event Details</h3>
      <p>Description: {orderDetails.description}</p>
      {/* Add any other relevant details */}
    </div>
  );
};

export default ConfirmationPage;
