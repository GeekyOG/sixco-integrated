// Required imports
import { useEffect, useState } from "react";
import Container from "../ui/Container";
import BreadCrumb from "../ui/BreadCrumb";
import DashboardDrawer from "../components/dashboard/Drawer";
import DashboardTable from "../components/dashboard/DashboardTable";
import {
  Pencil,
  Plus,
  Search,
  Users,
  Briefcase,
  ListChecks,
  UserPlus,
  FolderPlus,
} from "lucide-react";
import Button from "../ui/Button";
import { useLazyGetTeamQuery } from "../api/teamsApi";
import { useParams } from "react-router-dom";
import { Card } from "antd";
import { projectColumns } from "../modules/teams/projectColumns";
import { membersColumns } from "../modules/teams/membersColumns";
import { taskColumns } from "../modules/teams/taskColumns";
import ProjectModal from "../modules/teams/ProjectModal";
import MemberModal from "../modules/teams/MemberModal";

function TeamDetails() {
  const [open, setOpen] = useState(false);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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

  const tasksWithProjectNames =
    teamsData?.projects?.flatMap((item: any) =>
      item.tasks.map((task: any) => ({
        name: item.name,
        ...task,
      }))
    ) || [];

  const memberCount = teamsData?.users?.length || 0;
  const projectCount = teamsData?.projects?.length || 0;
  const taskCount = tasksWithProjectNames?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Container>
        {/* Breadcrumb */}
        <div className="pt-6">
          <BreadCrumb data={["Dashboard", "Teams", "Team Details"]} />
        </div>

        {/* Header Section */}
        <div className="mt-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                      {teamsData?.teamName || "Loading..."}
                    </h1>
                  </div>
                </div>

                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-600 leading-relaxed">
                    {teamsData?.description || (
                      <span className="text-gray-400 italic">
                        No description provided
                      </span>
                    )}
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {memberCount} Members
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-lg">
                    <Briefcase className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {projectCount} Projects
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg">
                    <ListChecks className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {taskCount} Tasks
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button
                  className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm transition-colors duration-200"
                  onClick={() => setOpen(!open)}
                >
                  <Pencil size={16} />
                  <span className="hidden sm:inline">Edit Team</span>
                  <span className="sm:hidden">Edit</span>
                </Button>

                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-sm transition-colors duration-200"
                  onClick={() => setTaskModalOpen(!taskModalOpen)}
                >
                  <Plus size={16} />
                  <span className="hidden sm:inline">Assign Task</span>
                  <span className="sm:hidden">Task</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Members & Projects Section */}
      <Container className="mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Team Members Card */}
          <Card className="shadow-sm border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Team Members
                  </h2>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {memberCount}
                  </span>
                </div>
                <Button
                  className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm text-sm"
                  onClick={() => setMemberModalOpen(true)}
                >
                  <UserPlus size={14} />
                  <span>Add Member</span>
                </Button>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Search members..."
                />
              </div>

              <DashboardTable
                callBackAction={handleCallBack}
                columns={membersColumns}
                data={
                  teamsData?.users?.map(
                    (item: {
                      email: any;
                      firstName: any;
                      lastName: any;
                      note: any;
                      userId: any;
                    }) => ({
                      email: item.email,
                      firstName: item.firstName,
                      lastName: item.lastName,
                      note: item.note,
                      id: item.userId,
                    })
                  ) ?? []
                }
                type="team-members"
                targetId={id}
                isFetching={isFetching}
              />
            </div>
          </Card>

          {/* Projects Assigned Card */}
          <Card className="shadow-sm border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-purple-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Projects Assigned
                  </h2>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {projectCount}
                  </span>
                </div>
                <Button
                  className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm text-sm"
                  onClick={() => setProjectModalOpen(true)}
                >
                  <FolderPlus size={14} />
                  <span>Add Project</span>
                </Button>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Search projects..."
                />
              </div>

              <DashboardTable
                columns={projectColumns}
                data={teamsData?.projects ?? []}
                type="project"
                targetId={id}
                removeAction="project"
                callBackAction={handleCallBack}
                isFetching={isFetching}
              />
            </div>
          </Card>
        </div>
      </Container>

      {/* Tasks Section */}
      <Container className="mt-6 pb-8">
        <Card className="shadow-sm border-gray-200 hover:shadow-md transition-shadow duration-200">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2">
                <ListChecks className="w-5 h-5 text-green-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Team Tasks
                </h2>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {taskCount}
                </span>
              </div>
              <Button
                className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm text-sm"
                onClick={() => setTaskModalOpen(true)}
              >
                <Plus size={14} />
                <span>Add Task</span>
              </Button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Search tasks..."
              />
            </div>

            <DashboardTable
              columns={taskColumns}
              data={tasksWithProjectNames || []}
              callBackAction={handleCallBack}
              type="edit-tasks"
              isFetching={isFetching}
            />
          </div>
        </Card>
      </Container>

      {/* Modals */}
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

      <ProjectModal
        projectModalOpen={projectModalOpen}
        setProjectModalOpen={setProjectModalOpen}
      />

      <MemberModal
        callBackAction={handleCallBack}
        memberModalOpen={memberModalOpen}
        setMemberModalOpen={setMemberModalOpen}
      />
    </div>
  );
}

export default TeamDetails;
