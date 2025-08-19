import React, { useState } from "react";
import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";
import { Outlet } from "react-router-dom";
import Container from "../ui/Container";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { cn } from "../utils/cn";

function Applayout() {
  const innerWidth = window.innerWidth;
  const [hideSideBar, setHideSideBar] = useState(
    innerWidth < 1198 ? false : true
  );
  return (
    <div className="flex">
      <div className={cn(innerWidth < 1198 && "absolute")}>
        {hideSideBar && <Sidebar setHideSideBar={setHideSideBar} />}
      </div>
      <div className={cn("w-[100%]", hideSideBar && "lg:pl-[100px]")}>
        <DashboardHeader setHideSideBar={setHideSideBar} />
        <Container className="pt-[50px]">
          <Outlet />
        </Container>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Applayout;
