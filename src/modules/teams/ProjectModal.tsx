import React, { useEffect } from "react";
import { Card, Modal, Select, Input as AntInput } from "antd";
import { Formik, Form, Field } from "formik";
import {
  useAssignTeamMutation,
  useGetAllPortfolioQuery,
  useLazyGetAllPortfolioQuery,
} from "../../api/portfolio";
import { useParams } from "react-router-dom";
import Button from "../../ui/Button";
import { useLazyGetTeamQuery } from "../../api/teamsApi";
import { toast } from "react-toastify";
import SelectField from "../../components/input/SelectField";

const { Option } = Select;

interface ProjectModalProps {
  projectModalOpen: boolean;
  setProjectModalOpen: (value: React.SetStateAction<boolean>) => void;
}

function ProjectModal({
  projectModalOpen,
  setProjectModalOpen,
}: ProjectModalProps) {
  const { id } = useParams();
  const [getData, { data: projectOptions }] = useLazyGetAllPortfolioQuery();
  const [getTeam] = useLazyGetTeamQuery();
  const [assignTeam, { isLoading }] = useAssignTeamMutation();

  useEffect(() => {
    getData({});
  }, []);
  // Parse id safely
  const teamId = id ? parseInt(id) : null;

  // Only render if teamId is valid
  if (!teamId) return null;

  return (
    <Modal
      title={null}
      open={projectModalOpen}
      onCancel={() => {
        console.log("Modal closed");
        setProjectModalOpen(false);
      }}
      footer={null}
      destroyOnClose
    >
      <Formik
        initialValues={{
          teamId: teamId,
          projectId: "",
          role: "",
          note: "",
        }}
        onSubmit={(values, { setSubmitting }) => {
          assignTeam({
            teamId: id ?? "",
            projectId: values.projectId,
            role: values.role,
            note: values.note,
          })
            .unwrap()
            .then(() => {
              getTeam(id);
              toast.success("Project added successfully!");
              setTimeout(() => setProjectModalOpen(false), 100); // Safe modal close
            })
            .catch((err) => {
              toast.error(err?.data?.message || "Failed to assign project");
            })
            .finally(() => setSubmitting(false));
        }}
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
                  <SelectField
                    name="projectId"
                    placeholder="Select a project"
                    data={projectOptions?.projects ?? []}
                    fetchData={getData}
                    setFieldValue={setFieldValue}
                    searchParam="projectName"
                  />
                </div>
              </div>
            </Card>
            <div className="flex justify-end pt-4">
              <Button
                isLoading={isLoading}
                className="w-full bg-[#3b781c] rounded-md text-center flex justify-center"
                type="submit"
              >
                Submit
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}

export default ProjectModal;
