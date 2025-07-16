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

const { Option } = Select;

function TeamDetails() {
  const [open, setOpen] = useState(false);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [memberModalOpen, setMemberModalOpen] = useState(false);

  const { id } = useParams();
  const { data: teamsData, isFetching } = useGetTeamQuery(id);
  const [searchTerm, setSearchTerm] = useState("");

  const projectOptions = [
    { id: 1, name: "Project A" },
    { id: 2, name: "Project B" },
    { id: 3, name: "Project C" },
  ];

  const userOptions = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Mark Johnson" },
  ];

  const handleAddProject = (values) => {
    console.log("Project Form Data:", values);
    setProjectModalOpen(false);
  };

  const handleAddMembers = (values) => {
    console.log("Add Members Form Data:", values);
    setMemberModalOpen(false);
  };

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
              onClick={() => setOpen(!open)}
            >
              <BiTask size={14} />
              <p>Assign TasK</p>
            </Button>
          </div>
        </div>

        {/* <div className="flex gap-3 mt-5 flex-col md:flex-row">
          <DashboardBox
            title={"Total Tasks"}
            value={0}
            handleClick={() => {}}
          />
          <DashboardBox
            title={"Total Completed Tasks"}
            value={0}
            handleClick={() => {}}
          />
          <DashboardBox
            title={"Total Pending Tasks"}
            value={0}
            handleClick={() => {}}
          />
        </div> */}
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
            data={teamsData?.teams ?? []}
            type="teams"
            isFetching={false}
          />
        </Card>

        <Card className="w-[50%]">
          <div className="flex justify-between items-center">
            <p className="py-4 font-[700] text-neutral-450">
              Projects Assigned to {teamsData?.name}
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
            data={teamsData?.teams ?? []}
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

      {/* Project Modal */}
      <Modal
        title={null}
        open={projectModalOpen}
        onCancel={() => setProjectModalOpen(false)}
        footer={null}
      >
        <Formik
          initialValues={{
            teamId: parseInt(id ?? ""),
            projectId: "",
            role: "",
            note: "",
          }}
          onSubmit={handleAddProject}
        >
          {({ setFieldValue }) => (
            <Form className="space-y-4">
              <p className="text-[1.25rem] font-[600] text-neutral-400">
                Assign Project to Team
              </p>

              <Card>
                <div className="flex flex-col gap-2">
                  <div>
                    <label className="block mb-1 font-semibold">Project</label>
                    <Select
                      showSearch
                      placeholder="Select a project"
                      onChange={(value) => setFieldValue("projectId", value)}
                      filterOption={(input, option: any) =>
                        option?.children
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                    >
                      {projectOptions.map((project) => (
                        <Option key={project.id} value={project.id}>
                          {project.name}
                        </Option>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold">Role</label>
                    <Field
                      name="role"
                      as={AntInput}
                      placeholder="Enter team role"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold">Note</label>
                    <Field
                      name="note"
                      as={AntInput.TextArea}
                      placeholder="Optional note"
                      rows={4}
                    />
                  </div>
                </div>
              </Card>

              <div className="flex justify-end pt-4">
                <Button type="submit">Submit</Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>

      {/* Add Members Modal */}
      <Modal
        title={null}
        open={memberModalOpen}
        onCancel={() => setMemberModalOpen(false)}
        footer={null}
      >
        <Formik
          initialValues={{
            teamId: parseInt(id ?? ""),
            users: [{ id: "", role: "Member", note: "", projectId: null }],
          }}
          onSubmit={handleAddMembers}
        >
          {({ values, setFieldValue }) => (
            <Form className="space-y-4">
              <FieldArray name="users">
                {({ push, remove }) => (
                  <>
                    <div className="flex mt-[32px] justify-between">
                      <p className="text-[1.25rem] font-[600] text-neutral-400">
                        Add Team Members
                      </p>
                      <Button
                        className="flex bg-[#3b781c] gap-2 rounded-md items-center"
                        type="button"
                        onClick={() =>
                          push({
                            id: "",
                            role: "Member",
                            note: "",
                            projectId: null,
                          })
                        }
                      >
                        <Plus size={16} />
                        Add
                      </Button>
                    </div>
                    {values.users.map((_, index) => (
                      <Card
                        key={index}
                        className="border-b pb-4 mb-4 space-y-2"
                      >
                        <div className="flex justify-between">
                          <p className="my-6">Member {index + 1}</p>

                          <div className="flex justify-end">
                            <Button
                              className="bg-transparent text-red"
                              type="button"
                              onClick={() => remove(index)}
                            >
                              <Trash2Icon size={16} />
                            </Button>
                          </div>
                        </div>

                        <Card>
                          <div className="flex flex-col gap-2">
                            <div>
                              <p>User</p>
                              <Select
                                showSearch
                                className="w-full"
                                placeholder="Select a user"
                                onChange={(value) =>
                                  setFieldValue(`users[${index}].id`, value)
                                }
                              >
                                {userOptions.map((user) => (
                                  <Option key={user.id} value={user.id}>
                                    {user.name}
                                  </Option>
                                ))}
                              </Select>
                            </div>
                            <div>
                              <label>Role</label>
                              <Field
                                name={`users[${index}].role`}
                                as={AntInput}
                                placeholder="Enter role"
                              />
                            </div>
                            <div>
                              <label>Note</label>
                              <Field
                                name={`users[${index}].note`}
                                as={AntInput.TextArea}
                                placeholder="Optional note"
                              />
                            </div>
                          </div>
                        </Card>
                      </Card>
                    ))}
                  </>
                )}
              </FieldArray>
              <div className="flex justify-end pt-4">
                <Button
                  className="w-full bg-[#3b781c] rounded-md"
                  type="submit"
                >
                  Submit
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
}

export default TeamDetails;
