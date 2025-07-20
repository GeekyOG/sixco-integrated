import { createBrowserRouter } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import AuthLayout from "../layout/AuthLayout";
import Login from "../pages/Login";
import React from "react";
import Dashboard from "../pages/Dashboard";
import Portfolio from "../pages/Portfolio";
import Settings from "../pages/Settings";
import Applayout from "../layout/Applayout";
import Users from "../pages/Users";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import Staffs from "../pages/Staffs";
import Teams from "../pages/Teams";
import TeamDetails from "../pages/TeamDetails";
import ProjectDetails from "../pages/ProjectDetails";
import Reports from "../pages/Reports";
import Leaves from "../pages/Leaves";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PublicRoute>
        <AuthLayout />
      </PublicRoute>
    ),
    children: [
      { path: "", element: <Login /> },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Applayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },

      {
        path: "/dashboard/projects",
        element: <Portfolio />,
      },
      {
        path: "/dashboard/projects/:id",
        element: <ProjectDetails />,
      },
      {
        path: "/dashboard/users",
        element: <Users />,
      },
      {
        path: "/dashboard/staffs",
        element: <Staffs />,
      },
      {
        path: "/dashboard/teams",
        element: <Teams />,
      },
      {
        path: "/dashboard/teams/:id",
        element: <TeamDetails />,
      },

      {
        path: "/dashboard/reports",
        element: <Reports />,
      },

      {
        path: "/dashboard/leaves",
        element: <Leaves />,
      },
      {
        path: "/dashboard/settings",
        element: <Settings />,
      },
    ],
  },
]);

export default router;
