import React from "react";
import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";
import { Outlet } from "react-router-dom";
import Container from "../ui/Container";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

function Applayout() {
  return (
    <div className="flex">
      <div>
        <Sidebar />
      </div>
      <div className="w-[100%]">
        <DashboardHeader />
        <Container className="pt-[50px]">
          <Outlet />
        </Container>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Applayout;
