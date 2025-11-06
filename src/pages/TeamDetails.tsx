// Required imports
import { useEffect, useState } from "react";
import Container from "../ui/Container";
import BreadCrumb from "../ui/BreadCrumb";
import DashboardDrawer from "../components/dashboard/Drawer";
import DashboardTable from "../components/dashboard/DashboardTable";
import { Pencil, Plus, Search } from "lucide-react";
import Button from "../ui/Button";
import { useGetTeamQuery, useLazyGetTeamQuery } from "../api/teamsApi";
import { useParams } from "react-router-dom";
import { Card } from "antd";
import { projectColumns } from "../modules/teams/projectColumns";
import { membersColumns } from "../modules/teams/membersColumns";
import { BiTask } from "react-icons/bi";
import ProjectModal from "../modules/teams/ProjectModal";
import MemberModal from "../modules/teams/MemberModal";
import { taskColumns } from "../modules/teams/taskColumns";

function TeamDetails() {
  const [open, setOpen] = useState(false);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);

  const [memberModalOpen, setMemberModalOpen] = useState(false);

  const { id } = useParams();

  const [getTeam, { data: teamsData, isFetching }] = useLazyGetTeamQuery();
  useEffect(() => {
    getTeam(id);
  }, [id]);

  const handleCallBack = () => {
    getTeam(id);
    setOpen(false);
    setTaskModalOpen(false);
  };
  const [searchTerm, setSearchTerm] = useState("");
  const tasksWithProjectNames =
    teamsData?.projects?.flatMap((item: any) =>
      item.tasks.map((task: any) => ({
        name: item.name,
        ...task,
      }))
    ) || [];

  return (
    <div>
      <Container>
        <BreadCrumb data={["Dashboard", "Teams", "Team details"]} />
        <div className="mt-[32px] lg:flex justify-between  items-end">
          <div>
            <p className="text-[1.5rem] font-[700] text-neutral-450">
              {teamsData?.teamName ?? "--"}
            </p>
            <p className="max-w-[450px]">{teamsData?.description ?? "--"}</p>
          </div>

          <div className="flex gap-[16px]">
            <Button
              className="bg-transparent border text-neutral-550"
              onClick={() => setOpen(!open)}
            >
              <Pencil size={14} />
              <p>Edit Team Details</p>
            </Button>

            <Button
              className="border"
              onClick={() => setTaskModalOpen(!taskModalOpen)}
            >
              <BiTask size={14} />
              <p>Assign Task</p>
            </Button>
          </div>
        </div>
      </Container>

      <Container className="lg:flex gap-6 mt-[16px] ">
        <Card className="lg:w-[50%]">
          <div className="flex justify-between items-center">
            <p className="py-4 font-[700] text-neutral-450">
              Team Members ({teamsData?.users.length ?? 0})
            </p>
            <Button
              className="bg-transparent border text-neutral-550 flex rounded-md lg:gap-3 items-center px-2"
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
            callBackAction={handleCallBack}
            columns={membersColumns}
            data={
              teamsData?.users?.map((item) => {
                return {
                  email: item.email,
                  firstName: item.firstName,
                  lastName: item.lastName,
                  note: item.note,
                  id: item.userId,
                };
              }) ?? []
            }
            type="team-members"
            targetId={id}
            isFetching={false}
          />
        </Card>

        <Card className="lg:w-[50%]">
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
            data={teamsData?.projects ?? []}
            type="project"
            targetId={id}
            removeAction="project"
            callBackAction={handleCallBack}
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
            columns={taskColumns}
            data={tasksWithProjectNames || []}
            callBackAction={handleCallBack}
            type="tasks"
            isFetching={false}
          />
        </Card>
      </Container>

      <DashboardDrawer
        callBackAction={handleCallBack}
        open={open}
        setOpen={setOpen}
        whatForm={"teams"}
        id={id}
      />

      {taskModalOpen && (
        <DashboardDrawer
          callBackAction={handleCallBack}
          open={taskModalOpen}
          setOpen={setTaskModalOpen}
          whatForm={"tasks"}
        />
      )}

      {/* Project Modal */}
      <ProjectModal
        projectModalOpen={projectModalOpen}
        setProjectModalOpen={setProjectModalOpen}
      />

      {/* Add Members Modal */}
      <MemberModal
        callBackAction={handleCallBack}
        memberModalOpen={memberModalOpen}
        setMemberModalOpen={setMemberModalOpen}
      />
    </div>
  );
}

export default TeamDetails;
