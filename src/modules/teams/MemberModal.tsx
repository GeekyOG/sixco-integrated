import React, { useEffect } from "react";
import { Card, Modal, Select, Input as AntInput } from "antd";
import { Formik, Form, Field, FieldArray } from "formik";
import {
  useGetAllPortfolioQuery,
  useLazyGetAllPortfolioQuery,
} from "../../api/portfolio";
import { useParams } from "react-router-dom";
import Button from "../../ui/Button";
import { Plus, Trash2Icon } from "lucide-react";
import {
  useGetAllUsersQuery,
  useLazyGetAllUsersQuery,
} from "../../api/authApi";
import { useAssignMemberMutation } from "../../api/teamsApi";
import { toast } from "react-toastify";
import SelectField from "../../components/input/SelectField";
const { Option } = Select;

interface MemberModalProps {
  memberModalOpen: boolean;
  setMemberModalOpen: (value: React.SetStateAction<boolean>) => void;
  callBackAction: () => void;
}

function MemberModal({
  memberModalOpen,
  setMemberModalOpen,
  callBackAction,
}: MemberModalProps) {
  const [getUsers, { data: userOptions, isFetching }] =
    useLazyGetAllUsersQuery();

  useEffect(() => {
    getUsers({});
  }, []);
  const { id } = useParams();

  const [assignMember, { isLoading }] = useAssignMemberMutation();
  return (
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
        onSubmit={(values) => {
          assignMember({
            teamId: id,
            users: values.users,
          })
            .unwrap()
            .then((res) => {
              callBackAction();
              toast.success("User added successfully!");
              setMemberModalOpen(false);
            })
            .catch((err) => {
              toast.error(err.data?.message || "Failed to add user");
            });
        }}
      >
        {({ values, setFieldValue }) => (
          <Form className="space-y-4">
            <FieldArray name="users">
              {({ push, remove }) => (
                <>
                  <div className="flex mt-[32px] justify-between">
                    <p className="text-[1.25rem] font-[600] text-neutral-400">
                      Add Team Member(s)
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
                    <Card key={index} className="border-b pb-4 mb-4 space-y-2">
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
                            <SelectField
                              searchParam="email"
                              data={
                                userOptions?.users?.map(
                                  (item: {
                                    id: string;
                                    firstName: string;
                                    lastName: string;
                                  }) => {
                                    return {
                                      id: item.id,
                                      name:
                                        item.firstName + " " + item.lastName,
                                    };
                                  }
                                ) || []
                              }
                              name={`users[${index}].id`}
                              setFieldValue={setFieldValue}
                              placeholder="Search by email address"
                              fetchData={getUsers}
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
                isLoading={isLoading}
                className="w-full bg-[#3b781c] text-center flex justify-center"
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

export default MemberModal;
