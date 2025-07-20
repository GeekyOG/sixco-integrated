import React, { useState } from "react";
import { Button, Drawer } from "antd";
import AddPortfolioForm from "../forms/PortfolioForm";
import AddImageForm from "../forms/ImageForm";
import AddTeamForm from "../forms/TeamForm";
import TaskForm from "../forms/TaskForm";
import AddLeaveForm from "../forms/LeaveForm";

interface DashboardDrawerProps {
  id?: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  whatForm: string;
  callBackAction?: () => void;
}

const DashboardDrawer: React.FC<DashboardDrawerProps> = ({
  open,
  setOpen,
  whatForm,
  callBackAction,
  id,
}) => {
  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Drawer
        title={
          (whatForm == "Portfolio" && "Manage Project") ||
          (whatForm == "tasks" && "Mange Task")
        }
        onClose={onClose}
        open={open}
      >
        {whatForm == "teams" && <AddTeamForm reset={open} id={id} />}
        {whatForm == "tasks" && <TaskForm reset={open} id={id} />}
        {whatForm == "Portfolio" && (
          <AddPortfolioForm
            reset={open}
            id={id}
            callBackAction={callBackAction}
          />
        )}
        {whatForm == "Leave" && <AddLeaveForm reset={open} id={id} />}
      </Drawer>
    </>
  );
};

export default DashboardDrawer;
