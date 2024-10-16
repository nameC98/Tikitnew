import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import HomeLayout from "./pages/HomeLayout";
import { loader as homeloader } from "./pages/Home";
import { loader as geteventloader } from "./pages/GetEventID";
import GetEventID from "./pages/GetEventID";
import Purchaseticket from "./pages/Purchaseticket";
import CheckoutPage from "./pages/CheckoutPage";
import ConfirmationPage from "./pages/ConfirmationPage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomeLayout />,
      // errorElement: <Error />,
      children: [
        {
          index: true,
          element: <Home />,
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
          path: "checkoutpage/:eventId",
          element: <CheckoutPage />,
        },
        {
          path: "confirmationpage",
          element: <ConfirmationPage />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
