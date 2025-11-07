import React, { useEffect } from "react";
import { Card, Modal, Select, Input as AntInput } from "antd";
import { Formik, Form, Field } from "formik";
import {
  useAssignTeamMutation,
  useGetAllPortfolioQuery,
  useLazyGetPortfolioQuery,
} from "../../api/portfolio";
import { useParams } from "react-router-dom";
import Button from "../../ui/Button";
import {
  useGetAllTeamQuery,
  useLazyGetAllTeamQuery,
  useLazyGetTeamQuery,
} from "../../api/teamsApi";
import { toast } from "react-toastify";
import SelectField from "../../components/input/SelectField";

const { Option } = Select;

interface TeamModalProps {
  teamModalOpen: boolean;
  setTeamModalOpen: (value: React.SetStateAction<boolean>) => void;
  callBackAction: () => void;
}

function TeamModal({
  teamModalOpen,
  setTeamModalOpen,
  callBackAction,
}: TeamModalProps) {
  const { id } = useParams();
  const [getData, { data: teamOptions }] = useLazyGetAllTeamQuery();
  const [getProject] = useLazyGetPortfolioQuery();
  const [assignTeam, { isLoading }] = useAssignTeamMutation();

  useEffect(() => {
    getData({});
  }, []);

  // Parse id safely
  const projectId = id ? parseInt(id) : null;

  // Only render if teamId is valid
  if (!projectId) return null;

  return (
    <Modal
      title={null}
      open={teamModalOpen}
      onCancel={() => {
        console.log("Modal closed");
        setTeamModalOpen(false);
      }}
      footer={null}
      destroyOnClose
    >
      <Formik
        initialValues={{
          teamId: "",
          projectId: "",
          note: "",
        }}
        onSubmit={(values, { setSubmitting }) => {
          assignTeam({
            teamId: values.teamId,
            projectId: id,
            note: values.note,
          })
            .unwrap()
            .then(() => {
              callBackAction();
              toast.success("Team added successfully!");
              setTimeout(() => setTeamModalOpen(false), 100); // Safe modal close
            })
            .catch((err) => {
              toast.error(err?.data?.message || "Failed to assign Team");
            })
            .finally(() => setSubmitting(false));
        }}
      >
        {({ setFieldValue }) => (
          <Form className="space-y-4">
            <p className="text-[1.25rem] font-[600] text-neutral-400">
              Assign Team to Project
            </p>

            <Card>
              <div className="flex flex-col gap-2">
                <div>
                  <label className="block mb-1 font-semibold">Team</label>
                  <SelectField
                    name="teamId"
                    placeholder="Select a team"
                    data={
                      teamOptions?.teams?.map(
                        (item: { teamName: any; teamId: any }) => {
                          return {
                            name: item.teamName,
                            id: item.teamId,
                          };
                        }
                      ) ?? []
                    }
                    fetchData={getData}
                    setFieldValue={setFieldValue}
                  />
                </div>
              </div>
            </Card>

            <div className="flex justify-end pt-4">
              <Button type="submit" isLoading={isLoading}>
                Submit
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}

export default TeamModal;
