import React, { useEffect } from "react";
import { Card, Modal, Select, Input as AntInput } from "antd";
import { Formik, Form, Field } from "formik";
import {
  useAddClientToProjectMutation,
  useAssignTeamMutation,
  useLazyGetPortfolioQuery,
} from "../../api/portfolio";
import { useParams } from "react-router-dom";
import Button from "../../ui/Button";
import { useLazyGetTeamQuery } from "../../api/teamsApi";
import { toast } from "react-toastify";
import {
  useAddClientMutation,
  useGetAllClientsQuery,
  useLazyGetAllClientsQuery,
} from "../../api/clientApi";
import SelectField from "../../components/input/SelectField";

const { Option } = Select;

interface ClientModalProps {
  clientModalOpen: boolean;
  setClientModalOpen: (value: React.SetStateAction<boolean>) => void;
  callBackAction: () => void;
}

function ClientModal({
  clientModalOpen,
  setClientModalOpen,
  callBackAction,
}: ClientModalProps) {
  const { id } = useParams();
  const [getData, { data: clientOptions }] = useLazyGetAllClientsQuery();
  const [assignClient, { isLoading }] = useAddClientToProjectMutation();

  useEffect(() => {
    getData({});
  }, []);

  // Parse id safely
  const projectId = id ? parseInt(id) : null;

  // Only render if projectId is valid
  if (!projectId) return null;

  return (
    <Modal
      title={null}
      open={clientModalOpen}
      onCancel={() => {
        setClientModalOpen(false);
      }}
      footer={null}
      destroyOnClose
    >
      <Formik
        initialValues={{
          clientId: "",
          projectId: projectId,
        }}
        onSubmit={(values, { setSubmitting }) => {
          assignClient({
            clientId: values.clientId ?? "",
            projectId: id ?? "",
          })
            .unwrap()
            .then(() => {
              callBackAction();
              toast.success("Client added successfully!");
              setTimeout(() => setClientModalOpen(false), 100); // Safe modal close
            })
            .catch((err) => {
              toast.error(err?.data?.message || "Failed to assign project");
            })
            .finally(() => setSubmitting(false));
        }}
      >
        {({ values, setFieldValue }) => (
          <Form className="space-y-4">
            <p className="text-[1.25rem] font-[600] text-neutral-400">
              Assign Project to Client/Partner
            </p>

            <Card>
              <div className="flex flex-col gap-2">
                <div>
                  <label className="block mb-1 font-semibold">Partner</label>
                  <SelectField
                    name="clientId"
                    placeholder="Select a project"
                    data={
                      clientOptions?.clients?.map(
                        (item: { firstName: any; lastName: any; id: any }) => {
                          return {
                            name: `${item.firstName} ${item.lastName}`,
                            id: item.id,
                          };
                        }
                      ) ?? []
                    }
                    fetchData={getData}
                    setFieldValue={setFieldValue}
                    searchParam="email"
                  />
                </div>
              </div>
            </Card>

            <div className="flex justify-end pt-4">
              <Button className="w-full" type="submit" isLoading={isLoading}>
                Submit
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}

export default ClientModal;
