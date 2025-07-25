import React from "react";
import { Drawer } from "antd";
import AddPortfolioForm from "../forms/PortfolioForm";
import AddTeamForm from "../forms/TeamForm";
import TaskForm from "../forms/TaskForm";
import AddLeaveForm from "../forms/LeaveForm";
import EditPortfolioFormForm from "../forms/EditPortfolioForm";

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
  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Drawer
        title={
          (whatForm == "Portfolio" && id && "Edit Project") ||
          (whatForm == "Portfolio" && "Manage Project") ||
          (whatForm == "tasks" && "Mange Task")
        }
        onClose={onClose}
        open={open}
      >
        {whatForm == "teams" && <AddTeamForm reset={open} id={id} />}
        {whatForm == "tasks" && <TaskForm reset={open} id={id} />}
        {whatForm == "Portfolio" && !id && (
          <AddPortfolioForm reset={open} callBackAction={callBackAction} />
        )}
        {whatForm == "Portfolio" && id && (
          <EditPortfolioFormForm
            reset={open}
            callBackAction={callBackAction}
            id={id}
          />
        )}
        {whatForm == "Leave" && <AddLeaveForm reset={open} id={id} />}
      </Drawer>
    </>
  );
};

export default DashboardDrawer;
