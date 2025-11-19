import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import Button from "../../ui/Button";
import { cn } from "../../utils/cn";
import Input from "../input/Input";
import { toast } from "react-toastify";

import {
  useAddLeaveMutation,
  useLazyGetAllLeaveQuery,
  useLazyGetLeaveQuery,
  useUpdateLeaveMutation,
} from "../../api/leaveApi";

interface AddLeaveFormProps {
  reset: boolean;
  callBackAction?: () => void;
  id?: string;
}

const AddLeaveForm: React.FC<AddLeaveFormProps> = ({
  reset,
  callBackAction,
  id,
}) => {
  const [description, setDescription] = useState("");

  const [addLeave, { isLoading }] = useAddLeaveMutation();

  const [getLeaves] = useLazyGetAllLeaveQuery();

  const [getLeave, { data, isLoading: featuredLoading }] =
    useLazyGetLeaveQuery();

  const [updateLeave, { isLoading: updateLoading }] = useUpdateLeaveMutation();

  useEffect(() => {
    if (id) {
      getLeave(id)
        .unwrap()
        .then(() => {
          setDescription(data.leave.reason);
        });
    }
  }, [id, featuredLoading, reset, data]);

  return (
    <div>
      {featuredLoading && id && (
        <img
          src="/dark-spinner.svg"
          alt=""
          className={cn("h-[30px] w-[30px] mx-auto mt-[100px]")}
        />
      )}
      {!featuredLoading && (
        <Formik
          enableReinitialize
          initialValues={{
            reason: data?.leave?.reason || "",
            startDate: data?.leave?.startDate?.split("T")[0] || "",
            endDate: data?.leave?.startDate?.split("T")[0] || "",
          }}
          onSubmit={(values, { resetForm }) => {
            if (!id) {
              addLeave(values)
                .unwrap()
                .then(() => {
                  resetForm();
                  getLeaves("");
                  setDescription("");
                  toast.success("Action successful");
                  if (callBackAction) {
                    callBackAction();
                  }
                })
                .catch((err) => {
                  toast.error(err.data.message ?? "Something went wrong");
                });
            }
          }}
        >
          {({ errors, touched, values }) => {
            return (
              <Form
                encType="multipart/form-data"
                className="flex flex-col gap-3"
              >
                <div>
                  <p className="text-[0.865rem] font-[500]">Reason</p>
                  <textarea
                    disabled={!!id}
                    className="h-[200px] w-[100%] rounded-[5px] p-[5px] border-[1px]"
                    name="reason"
                    placeholder="Enter Reason.."
                    onChange={(e) => {
                      values.reason = e.target.value;
                      setDescription(e.target.value);
                    }}
                    value={description}
                  ></textarea>
                </div>

                <div className="flex justify-center items-center gap-4">
                  <Input
                    disabled={!!id}
                    title="Start Date"
                    name="startDate"
                    type="date"
                    touched={touched.startDate}
                    errors={errors.startDate}
                    placeholder="Enter title"
                    width="h-[36px] w-[100%] rounded-[5px]"
                  />

                  <Input
                    disabled={!!id}
                    title="End Date"
                    name="endDate"
                    type="date"
                    touched={touched.endDate}
                    errors={errors.endDate}
                    placeholder="Enter title"
                    width="h-[36px] w-[100%] rounded-[5px]"
                  />
                </div>
                {id ? (
                  <div className="flex gap-4">
                    <Button
                      isLoading={isLoading || updateLoading}
                      onClick={() => {
                        updateLeave({
                          id,
                          body: {
                            status: "approved",
                          },
                        })
                          .unwrap()
                          .then(() => {
                            getLeaves("");
                            setDescription("");
                            toast.success("Action successful");
                            if (callBackAction) {
                              callBackAction();
                            }
                          })
                          .catch((err) => {
                            toast.error(
                              err.data.message ?? "Something went wrong"
                            );
                          });
                      }}
                    >
                      Approve Leave
                    </Button>

                    <Button
                      onClick={() => {
                        updateLeave({
                          id,
                          body: {
                            status: "rejected",
                          },
                        })
                          .unwrap()
                          .then(() => {
                            getLeaves("");
                            setDescription("");
                            toast.success("Action successful");
                            if (callBackAction) {
                              callBackAction();
                            }
                          })
                          .catch((err) => {
                            toast.error(
                              err.data.message ?? "Something went wrong"
                            );
                          });
                      }}
                      className="bg-red-600"
                      isLoading={isLoading || updateLoading}
                    >
                      Reject Leave
                    </Button>
                  </div>
                ) : (
                  <Button isLoading={isLoading || updateLoading}>
                    Submit Request
                  </Button>
                )}
              </Form>
            );
          }}
        </Formik>
      )}
    </div>
  );
};

export default AddLeaveForm;
