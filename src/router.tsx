import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Dashboard from "./layouts/Dashboard";
import NonAuth from "./layouts/NonAuth";
import Root from "./layouts/Root";
import LoginPage from "./pages/login/Login.js";
import Users from "./pages/users/Users.js";

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
