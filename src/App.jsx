// export default App;
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import HomeLayout from "./pages/HomeLayout";
import { loader as homeloader } from "./pages/Home";
import { loader as geteventloader } from "./pages/GetEventID";
import GetEventID from "./pages/GetEventID";
import Purchaseticket from "./pages/Purchaseticket";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomeLayout />,
      // errorElement: <Error />,
      children: [
        {
          index: true,
          path: "/",
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
          // loader: geteventloader,
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
