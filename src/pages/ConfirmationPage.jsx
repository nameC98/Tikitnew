import React, { useEffect, useState } from "react";
import axios from "axios";

const ConfirmationPage = () => {
  const [orderDetails, setOrderDetails] = useState(null);
  const orderUid = new URLSearchParams(window.location.search).get("orderUid");

  console.log(orderUid);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(
          `https://api.tikiti.co.zw/opn/v1/orders/${orderUid}`
        );
        setOrderDetails(response.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
        // Handle error appropriately (e.g., display an error message)
      }
    };

    if (orderUid) {
      fetchOrderDetails();
    } else {
      // Handle the case where orderUid is missing
      console.error("No order ID found in the URL.");
    }
  }, [orderUid]);

  if (!orderDetails) {
    return <div>Loading...</div>; // Or a loading spinner
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
