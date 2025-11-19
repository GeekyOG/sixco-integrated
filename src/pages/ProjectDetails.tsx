// Required imports
import { useEffect, useMemo, useState } from "react";
import Container from "../ui/Container";
import BreadCrumb from "../ui/BreadCrumb";
import DashboardDrawer from "../components/dashboard/Drawer";
import DashboardTable from "../components/dashboard/DashboardTable";
import {
  Pencil,
  Plus,
  Search,
  Upload,
  FileText,
  Users,
  UserCircle,
  ListChecks,
  Calendar,
  ChevronDown,
} from "lucide-react";
import Button from "../ui/Button";
import { useParams } from "react-router-dom";
import { Card } from "antd";
import { teamColumns } from "../modules/portfolio/teamsColumms";
import { clientsColumns } from "../modules/portfolio/clientsColumns";
import { taskColumns } from "../modules/teams/taskColumns";
import TeamModal from "../modules/portfolio/TeamModal";
import ClientModal from "../modules/portfolio/ClientModal";
import UploadModal from "../modules/portfolio/uploadModal";
import { useLazyGetPortfolioQuery } from "../api/portfolio";
import { useLazyGetDocumentQuery } from "../api/documentApi";
import PermissionAwareButton from "../components/PermissionAwareButton";

function ProjectDetails() {
  const [open, setOpen] = useState(false);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [docOpen, setDocOpen] = useState(false);
  const [teamModalOpen, setTeamModalOpen] = useState(false);

  const { id } = useParams();
  const [getProject, { data: projectData, isFetching }] =
    useLazyGetPortfolioQuery();
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedAssignee, setSelectedAssignee] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // Get unique assignees
  const assignees = useMemo(() => {
    const uniqueAssignees = new Set();
    projectData?.project?.tasks?.forEach(
      (task: {
        assignee: {
          firstName: string;
          lastName: string;
        };
      }) => {
        if (task.assignee) {
          uniqueAssignees.add(
            `${task.assignee.firstName} ${task.assignee.lastName}`
          );
        }
      }
    );
    return Array.from(uniqueAssignees);
  }, [projectData]);

  // Get unique statuses
  const statuses = useMemo(() => {
    return ["To Do", "In Progress", "Review", "Done"];
  }, [projectData]);

  // Filter tasks based on search, assignee, and status
  const filteredTasks = useMemo(() => {
    let tasks: {
      id: string;
      title: string;
      description: string;
      status: string;
      dueDate: string;
      assignee: {
        firstName: string;
        lastName: string;
      };
    }[] =
      projectData?.project.tasks?.map(
        (item: {
          id: string;
          title: string;
          description: string;
          status: string;
          dueDate: string;
          assignee: {};
        }) => {
          return {
            id: item.id,
            title: item.title,
            name: projectData?.project?.name,
            description: item.description,
            status: item.status,
            dueDate: item.dueDate,
            assignee: item.assignee,
          };
        }
      ) || [];

    // Filter by search term
    if (searchTerm) {
      tasks = tasks.filter(
        (task: { title: string; description: string }) =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by assignee
    if (selectedAssignee) {
      tasks = tasks.filter((task) => {
        const fullName = `${task.assignee.firstName} ${task.assignee.lastName}`;
        return fullName === selectedAssignee;
      });
    }

    // Filter by status
    if (selectedStatus) {
      tasks = tasks.filter((task) => task.status === selectedStatus);
    }

    return tasks.map((item) => ({
      id: item.id,
      title: item.title,
      name: projectData?.project.name,
      description: item.description,
      status: item.status,
      dueDate: item.dueDate,
      assignee: item.assignee,
    }));
  }, [projectData, searchTerm, selectedAssignee, selectedStatus]);

  const [getDocs, { data }] = useLazyGetDocumentQuery();

  const getDocuments = () => {
    getDocs(id);
  };

  useEffect(() => {
    getDocs(id);
    getProject(id);
  }, [id]);

  const handleCallBack = () => {
    getProject(id);
    setOpen(false);
    setTaskModalOpen(false);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "--";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      "To Do": "bg-gray-100 text-gray-700 border-gray-200",
      "In Progress": "bg-blue-100 text-blue-700 border-blue-200",
      Review: "bg-yellow-100 text-yellow-700 border-yellow-200",
      Done: "bg-green-100 text-green-700 border-green-200",
    };
    return colors[status] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Container>
        {/* Breadcrumb */}
        <div className="pt-6">
          <BreadCrumb data={["Dashboard", "Projects", "Project Details"]} />
        </div>

        {/* Header Section */}
        <div className="mt-8 space-y-6">
          {/* Project Title & Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                    {projectData?.project?.name ?? "Loading..."}
                  </h1>
                  {projectData?.project?.status && (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                        projectData.project.status
                      )}`}
                    >
                      {projectData.project.status}
                    </span>
                  )}
                </div>

                {/* Project Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  {projectData?.project?.startDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {formatDate(projectData.project.startDate)} -{" "}
                        {formatDate(projectData.project.endDate)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <PermissionAwareButton
                  permission="project:update"
                  className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm transition-colors duration-200"
                  onClick={() => setOpen(!open)}
                >
                  <Pencil size={16} />
                  <span className="hidden sm:inline">Edit Project</span>
                  <span className="sm:hidden">Edit</span>
                </PermissionAwareButton>

                <PermissionAwareButton
                  permission="project:update"
                  className="bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-sm transition-colors duration-200"
                  onClick={() => setDocOpen(!docOpen)}
                >
                  <Upload size={16} />
                  <span className="hidden sm:inline">Upload Document</span>
                  <span className="sm:hidden">Upload</span>
                </PermissionAwareButton>
              </div>
            </div>
          </div>

          {/* Description & Documents Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Description Card */}
            <Card className="shadow-sm border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Project Description
                  </h2>
                </div>
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-600 leading-relaxed">
                    {projectData?.project?.description || (
                      <span className="text-gray-400 italic">
                        No description provided
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </Card>

            {/* Documents Card */}
            <Card className="shadow-sm border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-600" />
                    <h2 className="text-lg font-semibold text-gray-900">
                      Project Documents
                    </h2>
                  </div>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {data?.documents?.length || 0} files
                  </span>
                </div>

                <div className="max-h-[200px] overflow-y-auto">
                  {data?.documents?.length > 0 ? (
                    <ul className="space-y-2">
                      {data.documents.map((doc: any, index: number) => (
                        <li
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-150"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <p className="text-sm text-gray-700 truncate">
                              {doc.name}
                            </p>
                          </div>
                          <a
                            href={doc.firebaseUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 text-sm hover:text-blue-700 font-medium ml-2 flex-shrink-0"
                          >
                            View
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">
                        No documents uploaded yet
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Container>

      {/* Teams & Clients Section */}
      <Container className="mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Teams Card */}
          <Card className="shadow-sm border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Teams</h2>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {projectData?.project?.teams?.length || 0}
                  </span>
                </div>

                <PermissionAwareButton
                  permission="project:update"
                  className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm text-sm"
                  onClick={() => setTeamModalOpen(true)}
                >
                  <Plus size={14} />
                  <span>Assign Team</span>
                </PermissionAwareButton>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Search teams..."
                />
              </div>

              <DashboardTable
                columns={teamColumns}
                data={projectData?.project?.teams ?? []}
                type="teams"
                isFetching={isFetching}
              />
            </div>
          </Card>

          {/* Clients Card */}
          <Card className="shadow-sm border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2">
                  <UserCircle className="w-5 h-5 text-orange-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Clients
                  </h2>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {projectData?.project?.clients?.length || 0}
                  </span>
                </div>
                <PermissionAwareButton
                  permission="project:update"
                  className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm text-sm"
                  onClick={() => setProjectModalOpen(true)}
                >
                  <Plus size={14} />
                  <span>Add Client</span>
                </PermissionAwareButton>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Search clients..."
                />
              </div>

              <DashboardTable
                columns={clientsColumns}
                data={projectData?.project?.clients || []}
                type="client"
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
                <ListChecks className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Project Tasks
                </h2>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  0
                </span>
              </div>
              <PermissionAwareButton
                permission="task:create"
                className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm text-sm"
                onClick={() => setTaskModalOpen(true)}
              >
                <Plus size={14} />
                <span>Add Task</span>
              </PermissionAwareButton>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[250px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Search tasks..."
                  />
                </div>

                <FilterDropdown
                  label="User"
                  value={selectedAssignee}
                  onChange={setSelectedAssignee}
                  options={assignees}
                />

                <FilterDropdown
                  label="Status"
                  value={selectedStatus}
                  onChange={setSelectedStatus}
                  options={statuses}
                />
              </div>

              <DashboardTable
                columns={taskColumns}
                data={filteredTasks}
                type="edit-tasks"
                isFetching={isFetching}
              />
            </div>
          </div>
        </Card>
      </Container>

      {/* Modals */}
      <DashboardDrawer
        callBackAction={handleCallBack}
        open={open}
        setOpen={setOpen}
        whatForm={"Portfolio"}
        id={id}
      />

      <DashboardDrawer
        callBackAction={handleCallBack}
        open={taskModalOpen}
        setOpen={setTaskModalOpen}
        whatForm={"project-tasks"}
      />

      <ClientModal
        callBackAction={handleCallBack}
        clientModalOpen={projectModalOpen}
        setClientModalOpen={setProjectModalOpen}
      />

      <TeamModal
        teamModalOpen={teamModalOpen}
        setTeamModalOpen={setTeamModalOpen}
        callBackAction={handleCallBack}
      />

      <UploadModal
        getDocuments={getDocuments}
        isModalOpen={docOpen}
        handleCancel={() => setDocOpen(!docOpen)}
      />
    </div>
  );
}

export default ProjectDetails;

const FilterDropdown = ({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: any;
  options: any;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-all bg-white"
      >
        <span className="text-gray-700">{label}:</span>
        <span className="font-medium">{value || "All"}</span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full mt-1 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[200px]">
            <button
              onClick={() => {
                onChange("");
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
            >
              All
            </button>
            {options.map((option: string) => (
              <button
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
              >
                {option}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
