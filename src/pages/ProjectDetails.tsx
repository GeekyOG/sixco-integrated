// Required imports
import { useState } from "react";
import Container from "../ui/Container";
import BreadCrumb from "../ui/BreadCrumb";
import DashboardDrawer from "../components/dashboard/Drawer";
import DashboardTable from "../components/dashboard/DashboardTable";
import { Pencil, Plus, Search, Trash, Trash2, Trash2Icon } from "lucide-react";
import Button from "../ui/Button";
import { useGetTeamQuery } from "../api/teamsApi";
import { useParams } from "react-router-dom";
import { Card, Modal, Select, Input as AntInput } from "antd";
import { projectColumns } from "../modules/teams/projectColumns";
import { membersColumns } from "../modules/teams/membersColumns";
import { Formik, Form, Field, FieldArray } from "formik";
import DashboardBox from "../ui/dashboard/DashboardBox";
import { BiTask } from "react-icons/bi";
import ProjectModal from "../modules/teams/ProjectModal";
import MemberModal from "../modules/teams/MemberModal";
import { useGetPortfolioQuery } from "../api/portfolio";

const { Option } = Select;

function ProjectDetails() {
  const [open, setOpen] = useState(false);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);

  const [memberModalOpen, setMemberModalOpen] = useState(false);

  const { id } = useParams();
  const { data: teamsData, isFetching } = useGetPortfolioQuery(id);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div>
      <Container>
        <BreadCrumb data={["Dashboard", "Teams", "Team details"]} />
        <div className="mt-[32px] flex justify-between ">
          <div>
            <p className="text-[1.5rem] font-[700] text-neutral-450">
              {teamsData?.name ?? "--"}
            </p>
            <p className="max-w-[450px]">{teamsData?.description ?? "--"}</p>
          </div>

          <div className="flex gap-[16px]">
            <Button
              className="bg-transparent border text-neutral-550 flex rounded-md gap-3 items-center py-0"
              onClick={() => setOpen(!open)}
            >
              <Pencil size={14} />
              <p>Edit Team Details</p>
            </Button>

            <Button
              className="border flex rounded-md gap-3 items-center py-0"
              onClick={() => setTaskModalOpen(!taskModalOpen)}
            >
              <BiTask size={14} />
              <p>Assign Task</p>
            </Button>
          </div>
        </div>
      </Container>

      <Container className="flex gap-6 mt-[16px]">
        <Card className="w-[50%]">
          <div className="flex justify-between items-center">
            <p className="py-4 font-[700] text-neutral-450">
              Team Members ({teamsData?.Users.length ?? 0})
            </p>
            <Button
              className="bg-transparent border text-neutral-550 flex rounded-md gap-3 items-center"
              onClick={() => setMemberModalOpen(true)}
            >
              <Plus size={14} />
              <p>Add Team Member</p>
            </Button>
          </div>
          <div className="px-4 py-2 rounded-sm w-full mt-4 border flex items-center gap-2">
            <Search size={14} />
            <input
              onChange={(e) => setSearchTerm(e.target.value)}
              className=" py-[2px] text-[0.865rem] "
              placeholder="Search members"
            />
          </div>
          <DashboardTable
            columns={membersColumns}
            data={teamsData?.Users ?? []}
            type="teams"
            isFetching={false}
          />
        </Card>

        <Card className="w-[50%]">
          <div className="flex justify-between items-center">
            <p className="py-4 font-[700] text-neutral-450 max-w-[300px]">
              Projects Assigned
            </p>
            <Button
              className="bg-transparent border text-neutral-550 flex rounded-md gap-3 items-center"
              onClick={() => setProjectModalOpen(true)}
            >
              <Plus size={14} />
              <p>Add Project</p>
            </Button>
          </div>
          <div className="px-4 py-2 rounded-sm w-full mt-4 border flex items-center gap-2">
            <Search size={14} />
            <input
              onChange={(e) => setSearchTerm(e.target.value)}
              className="py-[2px] text-[0.865rem]"
              placeholder="Search teams"
            />
          </div>
          <DashboardTable
            columns={projectColumns}
            data={teamsData?.Projects ?? []}
            type="teams"
            isFetching={false}
          />
        </Card>
      </Container>

      <Container>
        <Card className="w-[100%]">
          <div className="flex justify-between items-center">
            <p className="py-4 font-[700] text-neutral-450 max-w-[300px]">
              Team Tasks
            </p>
            <Button
              className="bg-transparent border text-neutral-550 flex rounded-md gap-3 items-center "
              onClick={() => setTaskModalOpen(true)}
            >
              <Plus size={14} />
              <p>Add Task</p>
            </Button>
          </div>
          <div className="px-4 py-2 rounded-sm w-full mt-4 border flex items-center gap-2">
            <Search size={14} />
            <input
              onChange={(e) => setSearchTerm(e.target.value)}
              className="py-[2px] text-[0.865rem]"
              placeholder="Search teams"
            />
          </div>
          <DashboardTable
            columns={projectColumns}
            data={[]}
            type="teams"
            isFetching={false}
          />
        </Card>
      </Container>

      <DashboardDrawer
        callBackAction={() => {}}
        open={open}
        setOpen={setOpen}
        whatForm={"teams"}
        id={id}
      />

      <DashboardDrawer
        callBackAction={() => {}}
        open={taskModalOpen}
        setOpen={setTaskModalOpen}
        whatForm={"tasks"}
      />

      {/* Project Modal */}
      <ProjectModal
        projectModalOpen={projectModalOpen}
        setProjectModalOpen={setProjectModalOpen}
      />

      {/* Add Members Modal */}
      <MemberModal
        memberModalOpen={memberModalOpen}
        setMemberModalOpen={setMemberModalOpen}
      />
    </div>
  );
}

export default ProjectDetails;
