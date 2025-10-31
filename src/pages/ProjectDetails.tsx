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
  Trash,
  Trash2,
  Trash2Icon,
  Upload,
} from "lucide-react";
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
import {
  useGetPortfolioQuery,
  useLazyGetPortfolioQuery,
} from "../api/portfolio";
import { teamColumns } from "../modules/portfolio/teamsColumms";
import { clientsColumns } from "../modules/portfolio/clientsColumns";
import { taskColumns } from "../modules/teams/taskColumns";
import TeamModal from "../modules/portfolio/TeamModal";
import ClientModal from "../modules/portfolio/ClientModal";
import UploadModal from "../modules/portfolio/uploadModal";
import { useLazyGetDocumentQuery } from "../api/documentApi";

const { Option } = Select;

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

  return (
    <div>
      <Container>
        <BreadCrumb data={["Dashboard", "Teams", "Team details"]} />
        <div className="mt-[32px] lg:flex justify-between  items-end">
          <div>
            <p className="text-[1.5rem] font-[700] text-neutral-450">
              {projectData?.project?.name ?? "--"}
            </p>
          </div>

          <div className="flex gap-[16px] mt-2">
            <Button
              className="bg-transparent text-[0.865rem] border text-neutral-550"
              onClick={() => setOpen(!open)}
            >
              <Pencil size={14} />
              <p>Edit Project Details</p>
            </Button>

            <Button
              className=" text-[0.865rem] border text-neutral"
              onClick={() => setDocOpen(!open)}
            >
              <Upload size={14} />
              <p>Upload Document</p>
            </Button>
          </div>
        </div>

        <div className="lg:flex mt-4 gap-[16px] ">
          <p className="max-w-[450px] text-neutral-550 lg:w-[50%] border p-[12px] rounded-sm">
            {projectData?.project?.description ?? "--"}
          </p>

          <Card className="lg:w-[50%]">
            <div className="flex justify-between items-center">
              <p className="py-4 font-[700] text-neutral-450 max-w-[300px]">
                Project Documents
              </p>
            </div>
            <div className="px-4 py-2">
              {data?.documents?.length > 0 ? (
                <ul className="space-y-2">
                  {data.documents.map((doc, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between border-b pb-2"
                    >
                      <p className="text-[0.865rem] text-neutral-600">
                        {doc.name}
                      </p>
                      <a
                        href={doc.firebaseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-[0.85rem] hover:underline"
                      >
                        View
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[0.85rem] text-neutral-400">
                  No documents uploaded yet.
                </p>
              )}
            </div>
          </Card>
        </div>
      </Container>

      <Container className="lg:flex gap-6 mt-[16px]">
        <Card className="lg:w-[50%]">
          <div className="flex justify-between items-center">
            <p className="py-4 font-[700] text-neutral-450">Teams</p>
            <Button
              className="bg-transparent border text-neutral-550 flex"
              onClick={() => setTeamModalOpen(true)}
            >
              <Plus size={14} />
              <p>Assign Team</p>
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
            columns={teamColumns}
            data={projectData?.project?.teams ?? []}
            type="teams"
            isFetching={false}
          />
        </Card>

        <Card className="lg:w-[50%]">
          <div className="flex justify-between items-center">
            <p className="py-4 font-[700] text-neutral-450 max-w-[300px]">
              Clients
            </p>
            <Button
              className="bg-transparent border text-neutral-550 flex rounded-md gap-3 items-center"
              onClick={() => setProjectModalOpen(true)}
            >
              <Plus size={14} />
              <p>Add Client</p>
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
            columns={clientsColumns}
            data={projectData?.project.clients || []}
            type="client"
            isFetching={false}
          />
        </Card>
      </Container>

      <Container>
        <Card className="w-[100%]">
          <div className="flex justify-between items-center">
            <p className="py-4 font-[700] text-neutral-450 max-w-[300px]">
              Project Tasks
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
            data={[]}
            type="tasks"
            isFetching={false}
          />
        </Card>
      </Container>

      <DashboardDrawer
        callBackAction={() => {}}
        open={open}
        setOpen={setOpen}
        whatForm={"Portfolio"}
        id={id}
      />

      <DashboardDrawer
        callBackAction={() => {}}
        open={taskModalOpen}
        setOpen={setTaskModalOpen}
        whatForm={"tasks"}
      />

      {/* Project Modal */}
      <ClientModal
        callBackAction={handleCallBack}
        clientModalOpen={projectModalOpen}
        setClientModalOpen={setProjectModalOpen}
      />

      {/* Add Members Modal */}
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
