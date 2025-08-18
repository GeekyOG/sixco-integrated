import React from "react";
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
} from "../../api/clientApi";

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
  const { data: clientOptions } = useGetAllClientsQuery("");
  const [assignClient, { isLoading }] = useAddClientToProjectMutation();

  // Parse id safely
  const projectId = id ? parseInt(id) : null;

  // Only render if projectId is valid
  if (!projectId) return null;

  return (
    <Modal
      title={null}
      open={clientModalOpen}
      onCancel={() => {
        console.log("Modal closed");
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
          console.log({ clientId: values.clientId ?? "", projectId: id ?? "" });

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
                  <Select
                    showSearch
                    className="w-full"
                    placeholder="Select a Client/Partner"
                    value={values.clientId}
                    onChange={(value) => setFieldValue("clientId", value)}
                    filterOption={(input, option) => {
                      const children = option?.children;
                      const label =
                        typeof children === "string"
                          ? children
                          : Array.isArray(children)
                          ? children.join(" ")
                          : "";

                      return label.toLowerCase().includes(input.toLowerCase());
                    }}
                  >
                    {clientOptions?.clients?.map((client) => (
                      <Option key={client.id} value={client.id}>
                        {client.firstName} {client.lastName}
                      </Option>
                    ))}
                  </Select>
                </div>

                {/* <div>
                  <label className="block mb-1 font-semibold">Note</label>
                  <Field
                    name="note"
                    as={AntInput.TextArea}
                    placeholder="Optional note"
                    rows={4}
                  />
                </div> */}
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
