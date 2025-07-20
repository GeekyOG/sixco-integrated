import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import Button from "../../ui/Button";
import Dropzone from "react-dropzone";
import { cn } from "../../utils/cn";
import { Image } from "lucide-react";
import Input from "../input/Input";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import {
  useAddPortfolioMutation,
  useLazyGetPortfolioQuery,
  useUpdatePortfolioMutation,
} from "../../api/portfolio";
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
        .then(() => {});
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
          initialValues={{
            reason: data?.reason || "",
            startDate: data?.startDate || "",
            endDate: data?.startDate || "",
          }}
          onSubmit={(values, { resetForm }) => {
            if (id) {
              updateLeave({ body: values, id })
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
                  toast.error(err.message ?? "Something went wrong");
                });
            }

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
                    title="Start Date"
                    name="startDate"
                    type="date"
                    touched={touched.startDate}
                    errors={errors.startDate}
                    placeholder="Enter title"
                    width="h-[36px] w-[100%] rounded-[5px]"
                  />

                  <Input
                    title="Start Date"
                    name="endDate"
                    type="date"
                    touched={touched.endDate}
                    errors={errors.endDate}
                    placeholder="Enter title"
                    width="h-[36px] w-[100%] rounded-[5px]"
                  />
                </div>

                <Button isLoading={isLoading || updateLoading}>
                  Add Leave
                </Button>
              </Form>
            );
          }}
        </Formik>
      )}
    </div>
  );
};

export default AddLeaveForm;
