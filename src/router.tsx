import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Dashboard from "./layouts/Dashboard";
import NonAuth from "./layouts/NonAuth";
import Root from "./layouts/Root";
import Users from "./pages/users/Users.js";
import Tenants from "./pages/tenants/Tenants.js";
import LoginPage from "./pages/login/login.js";
import Products from "./pages/products/Products.js";
import Promos from "./pages/promos/Promos.js";
import Orders from "./pages/orders/Orders.js";
import SingleOrder from "./pages/orders/SingleOrder.js";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "",
        element: <Dashboard />,
        children: [
          // Authenticated Routes
          {
            path: "",
            element: <HomePage />,
          },
          {
            path: "/users",
            element: <Users />,
          },
          {
            path: "/restaurants",
            element: <Tenants />,
          },
          {
            path: "/products",
            element: <Products />
          },
          {
            path: "/orders",
            element: <Orders />
          },
          {
            path: '/orders/:orderId',
            element: <SingleOrder />,
          },
          {
            path: "/promos",
            element: <Promos />,
          }
        ],
      },
      // Not Authenticated
      {
        path: "/auth",
        element: <NonAuth />,
        children: [
          {
            path: "login",
            element: <LoginPage />,
          },
        ],
      },
    ],
  },
]);
