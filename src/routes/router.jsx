import { createBrowserRouter } from "react-router-dom";
import { AdminLayout } from "../AdminLayout";
import { Dashboard } from "../pages/Dashboard/Dashboard";
import { MenuManagement } from "../pages/MenuManagement/MenuManagement";
import { Users } from "../pages/Users/Users";
import { Orders } from "../pages/Orders/Orders";
import { AdminLogin } from "../pages/AdminLogin/AdminLogin";
import { ProtectedRoute } from "../components/Common/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "login",
    element: <AdminLogin />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "menu",
        element: <MenuManagement />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "Orders",
        element: <Orders />,
      },
    ],
  },
]);
