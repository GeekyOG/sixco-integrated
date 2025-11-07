import React, { useState } from "react";
import TableActionButtons from "../../ui/dashboard/TableActionButtons";
import DashboardDrawer from "./Drawer";
import DialogContainer from "../../ui/dashboard/Modal";
import { toast } from "react-toastify";
import {
  useDeletePortfolioMutation,
  useRemoveProjectMutation,
  useRemoveTeamMutation,
} from "../../api/portfolio";
import { useDeleteLeaveMutation } from "../../api/leaveApi";
import AddUser from "../../modules/users/AddUser";
import { useDeleteClientsMutation } from "../../api/clientApi";
import { useNavigate } from "react-router-dom";
import AddStaff from "../../modules/users/AddStaff";
import { useDeleteTaskMutation } from "../../api/tasksApi";
import { useUnAssignMemberMutation } from "../../api/teamsApi";
import { useDeleteRoleMutation } from "../../api/rolesApi";
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

  const [deleteRole, { isLoading: deleteRoleLoading }] =
    useDeleteRoleMutation();

  const handleDeleteProjectDialog = () => {
    setShowDialog(true);
    setDialogTitle("Delete Project Permanently");
    setDialogContent(
      "Deleting this Project, this Project would would not longer be displayed on your website. Please note this action cannot be undone"
    );
    setDialogBtnText("Delete Project");
  };

  const handleDeleteRoleDialog = () => {
    setShowDialog(true);
    setDialogTitle("Delete Role Permanently");
    setDialogContent(
      "Deleting this Role, this Role would would not longer be displayed on your website. Please note this action cannot be undone"
    );
    setDialogBtnText("Delete Role");
  };

  const handleDeleteTeamDialog = () => {
    setShowDialog(true);
    setDialogTitle("Delete Team Permanently");
    setDialogContent(
      "Deleting this Team, this Team would would not longer be displayed on your website. Please note this action cannot be undone"
    );
    setDialogBtnText("Delete Team");
  };
  const handleDeleteStaffDialog = () => {
    setShowDialog(true);
    setDialogTitle("Delete Staff Permanently");
    setDialogContent(
      "Deleting this Staff, this Staff would would not longer be displayed on your website. Please note this action cannot be undone"
    );
    setDialogBtnText("Delete Staff");
  };
  const handleDeleteLeaveDialog = () => {
    setShowDialog(true);
    setDialogTitle("Delete Leave Permanently");
    setDialogContent(
      "Deleting this Leave, this Leave would would not longer be displayed on your website. Please note this action cannot be undone"
    );
    setDialogBtnText("Delete Featured Work");
  };
  const handleDeleteTaskDialog = () => {
    setShowDialog(true);
    setDialogTitle("Delete task Permanently");
    setDialogContent(
      "Deleting this task, this task would would not longer be displayed on your website. Please note this action cannot be undone"
    );
    setDialogBtnText("Delete task");
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

  const handleDeleteRole = () => {
    deleteRole(id)
      .then(() => {
        toast.success("Action Successful");
        callBackAction && callBackAction();
        setShowDialog(true);
      })
      .catch(() => {
        toast.error("Action Failed");
      });
  };

  const [showRemoveDialog, setShowRemoveDialog] = useState(false);

  const [removeProject, { isLoading }] = useRemoveProjectMutation();

  const handleProjectRemove = () => {
    removeProject({
      projectId: targetId,
      id,
    });
  };

  const [removeTeam, { isLoading: isRemoveTeaMLoading }] =
    useRemoveTeamMutation();

  const handleTeamRemove = () => {
    removeTeam({
      projectId: id,
      id: targetId,
    });
  };

  const [removeTask, { isLoading: isTaskLoading }] = useDeleteTaskMutation();

  const handleTaskDelete = () => {
    removeTask(id)
      .unwrap()
      .then(() => {
        setShowDialog(false);
        callBackAction ? callBackAction() : null;
      });
  };

  const handleRemoveTeamDialog = () => {
    setShowDialog(true);
    setDialogTitle("Remove Project");
    setDialogContent("This Project will no longer be attached to this team.");
    setDialogBtnText("Remove Project");
  };

  const [unassignUser, { isLoading: isUnassignLoading }] =
    useUnAssignMemberMutation();

  const handleUnassignMember = () => {
    unassignUser({
      teamId: targetId,
      userIds: [id],
    })
      .unwrap()
      .then(() => {
        setShowDialog(false);
        callBackAction ? callBackAction() : null;
      });
  };
  const handleUnassignMemberDialog = () => {
    setShowDialog(true);
    setDialogTitle("Remove Team Member");
    setDialogContent("This Staff will no longer be attached to this team.");
    setDialogBtnText("Remove Member");
  };

  return (
    <>
      {type == "hse-reports" && (
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
                : handleDeleteTeamDialog
            }
          />
        </>
      )}
      {type == "roles" && (
        <>
          <TableActionButtons
            handleEdit={() => {
              navigate(`/dashboard/roles-permissions/edit-role/${id}`);
            }}
            handleDelete={handleDeleteRoleDialog}
          />
        </>
      )}
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
                : handleDeleteTeamDialog
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
                : handleDeleteProjectDialog
            }
          />
        </>
      )}

      {type === "project" && (
        <>
          <TableActionButtons
            setShow={() => {
              navigate(`/dashboard/projects/${id}`);
            }}
            handleDelete={
              remove
                ? () => setShowRemoveDialog((prev) => !prev)
                : handleRemoveTeamDialog
            }
          />
        </>
      )}

      {type === "edit-tasks" && (
        <>
          <TableActionButtons
            setShow={() => {
              setDrawerOpen(true);
            }}
            handleDelete={
              remove
                ? () => setShowRemoveDialog((prev) => !prev)
                : handleDeleteTaskDialog
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
                : handleDeleteStaffDialog
            }
          />
        </>
      )}

      {type == "team-members" && (
        <>
          <TableActionButtons
            setShow={() => {
              navigate(`/dashboard/staffs/${id}`);
            }}
            handleDelete={() => handleUnassignMemberDialog()}
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
                : handleDeleteLeaveDialog
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
                : handleDeleteClientDialog
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
          callBackAction={callBackAction ? callBackAction : () => {}}
          id={id}
          open={openAddCustomers}
          setShowDrawer={setOpenAddCustomers}
        />
      )}

      {openAddStaff && (
        <AddStaff
          id={id}
          open={openAddStaff}
          setShowDrawer={setOpenAddStaff}
          callBackAction={callBackAction ? callBackAction : () => {}}
        />
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
            deleteLeaveLoading ||
            isRemoveTeaMLoading ||
            isTaskLoading ||
            isUnassignLoading ||
            deleteRoleLoading
          }
          type={"delete"}
          image={"/delete.svg"}
          action={
            (dialogTitle == "Remove Team Member" && handleUnassignMember) ||
            (dialogTitle == "Delete task Permanently" && handleTaskDelete) ||
            (dialogTitle == "Remove Project" && handleTeamRemove) ||
            (dialogTitle == "Delete Work Portfolio Item" &&
              handleDeletePortfolio) ||
            (dialogTitle == "Delete Client Permanently" &&
              handleDeleteClient) ||
            (dialogTitle == "Delete Request Permanently" &&
              handleDeleteLeave) ||
            (dialogTitle == "Delete Role Permanently" && handleDeleteRole) ||
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
