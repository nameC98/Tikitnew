import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import HomeLayout from "./pages/HomeLayout";
import { loader as homeloader } from "./pages/Home";
import { loader as geteventloader } from "./pages/GetEventID";
import GetEventID from "./pages/GetEventID";
import Purchaseticket from "./pages/Purchaseticket";
import CheckoutPage from "./pages/CheckoutPage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomeLayout />,
      // errorElement: <Error />, // Uncomment if you have an Error component
      children: [
        {
          index: true,
          element: <Home />, // No need to specify path as it is the index route
          loader: homeloader,
        },
        {
          path: "geteventid/:id",
          element: <GetEventID />,
          loader: geteventloader,
        },
        {
          path: "purchaseticket",
          element: <Purchaseticket />,
        },
        {
          path: "checkoutpage/:eventId", // Ensure this matches how you use it
          element: <CheckoutPage />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
