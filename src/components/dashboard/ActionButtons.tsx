import React, { useState } from "react";
import TableActionButtons from "../../ui/dashboard/TableActionButtons";
import DashboardDrawer from "./Drawer";
import DialogContainer from "../../ui/dashboard/Modal";
import { toast } from "react-toastify";
import { useDeletePortfolioMutation } from "../../api/portfolio";
import { useDeleteLeaveMutation } from "../../api/leaveApi";
import AddUser from "../../modules/users/AddUser";
import { useDeleteClientsMutation } from "../../api/clientApi";
import { useNavigate } from "react-router-dom";
// import EditCategory from "../../modules/products/EditCategory";
interface ActionButtonsProps {
  id: string;
  type: string;
  callBackAction?: () => void;
}

function ActionButtons({ id, type, callBackAction }: ActionButtonsProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogContent, setDialogContent] = useState("");
  const [dialogBtnText, setDialogBtnText] = useState("");
  const [openAddCustomers, setOpenAddCustomers] = useState(false);

  const navigate = useNavigate();

  const [deletePortfolio, { isLoading: deletePortfolioLoading }] =
    useDeletePortfolioMutation();

  const [deleteLeave, { isLoading: deleteLeaveLoading }] =
    useDeleteLeaveMutation();

  const handleDeleteBrandDialog = () => {
    setShowDialog(true);
    setDialogTitle("Delete Brand Permanently");
    setDialogContent(
      "Deleting this brand shows this brand would would not longer be displayed on your website. Please note this action cannot be undone"
    );
    setDialogBtnText("Delete Brand");
  };

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

  const handleDeleteImageDialog = () => {
    setShowDialog(true);
    setDialogTitle("Delete Work Image Item");
    setDialogContent(
      "Deleting this Image item, this Image item would would not longer be displayed on your website. Please note this action cannot be undone"
    );
    setDialogBtnText("Delete Image Item");
  };

  const handleDeleteImage = () => {
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
            handleDelete={handleDeleteFeaturedDialog}
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
            handleDelete={handleDeletePortfolioDialog}
          />
        </>
      )}

      {type === "client" && (
        <>
          <TableActionButtons
            handleEdit={() => {
              setOpenAddCustomers(true);
            }}
            handleDelete={handleDeleteClientDialog}
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

      {showDialog && (
        <DialogContainer
          setDialogOpen={setShowDialog}
          title={dialogTitle}
          btnText={dialogBtnText}
          description={dialogContent}
          isLoading={
            deletePortfolioLoading || deleteLeaveLoading || deleteClientLoading
          }
          type={"delete"}
          image={"/delete.svg"}
          action={
            (dialogTitle == "Delete Work Portfolio Item" &&
              handleDeletePortfolio) ||
            (dialogTitle == "Delete Client Permanently" &&
              handleDeleteClient) ||
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
