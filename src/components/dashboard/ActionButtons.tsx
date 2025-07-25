import React, { useState } from "react";
import TableActionButtons from "../../ui/dashboard/TableActionButtons";
import DashboardDrawer from "./Drawer";
import DialogContainer from "../../ui/dashboard/Modal";
import { toast } from "react-toastify";
import {
  useDeletePortfolioMutation,
  useRemoveProjectMutation,
} from "../../api/portfolio";
import { useDeleteLeaveMutation } from "../../api/leaveApi";
import AddUser from "../../modules/users/AddUser";
import { useDeleteClientsMutation } from "../../api/clientApi";
import { useNavigate } from "react-router-dom";
import AddStaff from "../../modules/users/AddStaff";
// import EditCategory from "../../modules/products/EditCategory";
interface ActionButtonsProps {
  id: string;
  type: string;
  callBackAction?: () => void;
  remove?: boolean;
  removeAction?: string;
  targetId?: string;
}

function ActionButtons({
  id,
  type,
  callBackAction,
  remove,
  removeAction,
  targetId,
}: ActionButtonsProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogContent, setDialogContent] = useState("");
  const [dialogBtnText, setDialogBtnText] = useState("");
  const [openAddCustomers, setOpenAddCustomers] = useState(false);
  const [openAddStaff, setOpenAddStaff] = useState(false);

  const navigate = useNavigate();

  const [deletePortfolio, { isLoading: deletePortfolioLoading }] =
    useDeletePortfolioMutation();

  const [deleteLeave, { isLoading: deleteLeaveLoading }] =
    useDeleteLeaveMutation();

  const handleDeleteFeaturedDialog = () => {
    setShowDialog(true);
    setDialogTitle("Delete Featured Work Permanently");
    setDialogContent(
      "Deleting this featured work, this featured work would would not longer be displayed on your website. Please note this action cannot be undone"
    );
    setDialogBtnText("Delete Featured Work");
  };

  const handleDeletePortfolioDialog = () => {
    setShowDialog(true);
    setDialogTitle("Delete Work Portfolio Item");
    setDialogContent(
      "Deleting this portfolio item, this portfolio item would would not longer be displayed on your website. Please note this action cannot be undone"
    );
    setDialogBtnText("Delete Portfolio Item");
  };

  const handleDeletePortfolio = () => {
    deletePortfolio(id)
      .then(() => {
        toast.success("Action Successful");
        callBackAction && callBackAction();
        setShowDialog(true);
      })
      .catch(() => {
        toast.error("Action Failed");
      });
  };

  const [deleteClient, { isLoading: deleteClientLoading }] =
    useDeleteClientsMutation();

  const handleDeleteClient = () => {
    deleteClient(id)
      .then(() => {
        toast.success("Action Successful");
        callBackAction && callBackAction();
        setShowDialog(true);
      })
      .catch(() => {
        toast.error("Action Failed");
      });
  };

  const handleDeleteClientDialog = () => {
    setShowDialog(true);
    setDialogTitle("Delete Client Permanently");
    setDialogContent(
      "Deleting this Client shows this Client would would not longer be displayed on your website. Please note this action cannot be undone"
    );
    setDialogBtnText("Delete Client");
  };

  const handleDeleteLeave = () => {
    deleteLeave(id)
      .then(() => {
        toast.success("Action Successful");
        callBackAction && callBackAction();
        setShowDialog(true);
      })
      .catch(() => {
        toast.error("Action Failed");
      });
  };

  const handleDeleteLeaveDialog = () => {
    setShowDialog(true);
    setDialogTitle("Delete Request Permanently");
    setDialogContent(
      "Deleting this Request shows this Request would would not longer be displayed on your website. Please note this action cannot be undone"
    );
    setDialogBtnText("Delete Request");
  };

  const [showRemoveDialog, setShowRemoveDialog] = useState(false);

  const [removeProject, { isLoading }] = useRemoveProjectMutation();

  const handleProjectRemove = () => {
    removeProject({
      projectId: targetId,
      id,
    });
  };

  return (
    <>
      {type === "teams" && (
        <>
          <TableActionButtons
            setShow={() => {
              navigate(`/dashboard/teams/${id}`);
            }}
            handleEdit={() => {
              setDrawerOpen(true);
            }}
            handleDelete={
              remove
                ? () => setShowRemoveDialog((prev) => !prev)
                : handleDeleteFeaturedDialog
            }
          />
        </>
      )}

      {type === "Portfolio" && (
        <>
          <TableActionButtons
            setShow={() => {
              navigate(`/dashboard/projects/${id}`);
            }}
            handleEdit={() => {
              setDrawerOpen(true);
            }}
            handleDelete={
              remove
                ? () => setShowRemoveDialog((prev) => !prev)
                : handleDeleteFeaturedDialog
            }
          />
        </>
      )}

      {type === "staff" && (
        <>
          <TableActionButtons
            setShow={() => {
              navigate(`/dashboard/staffs/${id}`);
            }}
            handleEdit={() => {
              setOpenAddStaff(true);
            }}
            handleDelete={
              remove
                ? () => setShowRemoveDialog((prev) => !prev)
                : handleDeleteFeaturedDialog
            }
          />
        </>
      )}

      {type === "Leave" && (
        <>
          <TableActionButtons
            handleEdit={() => {
              setDrawerOpen(true);
            }}
            handleDelete={
              remove
                ? () => setShowRemoveDialog((prev) => !prev)
                : handleDeleteFeaturedDialog
            }
          />
        </>
      )}

      {type === "client" && (
        <>
          <TableActionButtons
            setShow={() => {
              navigate(`/dashboard/users/${id}`);
            }}
            handleEdit={() => {
              setOpenAddCustomers(true);
            }}
            handleDelete={
              remove
                ? () => setShowRemoveDialog((prev) => !prev)
                : handleDeleteFeaturedDialog
            }
          />
        </>
      )}

      <DashboardDrawer
        id={id}
        callBackAction={() => {
          setDrawerOpen(false);
          if (callBackAction) callBackAction();
        }}
        open={drawerOpen}
        setOpen={setDrawerOpen}
        whatForm={type}
      />

      {openAddCustomers && (
        <AddUser
          id={id}
          open={openAddCustomers}
          setShowDrawer={setOpenAddCustomers}
        />
      )}

      {openAddStaff && (
        <AddStaff id={id} open={openAddStaff} setShowDrawer={setOpenAddStaff} />
      )}

      {showDialog && (
        <DialogContainer
          setDialogOpen={setShowDialog}
          title={dialogTitle}
          btnText={dialogBtnText}
          description={dialogContent}
          isLoading={
            deletePortfolioLoading ||
            deleteLeaveLoading ||
            deleteClientLoading ||
            deleteLeaveLoading
          }
          type={"delete"}
          image={"/delete.svg"}
          action={
            (dialogTitle == "Delete Work Portfolio Item" &&
              handleDeletePortfolio) ||
            (dialogTitle == "Delete Client Permanently" &&
              handleDeleteClient) ||
            (dialogTitle == "Delete Request Permanently" &&
              handleDeleteLeave) ||
            function (): void {
              throw new Error("Function not implemented.");
            }
          }
        />
      )}

      {showRemoveDialog && (
        <DialogContainer
          setDialogOpen={setShowRemoveDialog}
          title={"Remove Project from client"}
          btnText={"remove"}
          description={"This project would no longer appear under this client"}
          isLoading={isLoading}
          type={"delete"}
          image={"/delete.svg"}
          action={
            (removeAction == "project" && handleProjectRemove) ||
            function (): void {
              throw new Error("Function not implemented.");
            }
          }
        />
      )}
    </>
  );
}

export default ActionButtons;
