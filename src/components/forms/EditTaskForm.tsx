import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import Button from "../../ui/Button";
import { cn } from "../../utils/cn";
import Input from "../input/Input";
import { toast } from "react-toastify";
import { Select } from "antd";

import { useLazyGetTaskQuery, useUpdateTaskMutation } from "../../api/tasksApi";
import SelectField from "../input/SelectField";

interface EditTaskFormProps {
  reset: boolean;
  callBackAction?: () => void;
  id?: string;
}

const status = ["To Do", "In Progress", "Review", "Done"];

const EditTaskForm: React.FC<EditTaskFormProps> = ({
  reset,
  callBackAction,
  id,
}) => {
  const [getTask, { data, isLoading: featuredLoading }] = useLazyGetTaskQuery();

  const [updateTask, { isLoading: updateLoading }] = useUpdateTaskMutation();

  useEffect(() => {
    if (id) {
      getTask(id)
        .unwrap()
        .then(() => {});
    }
  }, [id, featuredLoading, reset, data]);

  function convertToCustomDate(isoDate: string): string {
    const date = new Date(isoDate);

    return date.toISOString().split("T")[0];
  }

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
          enableReinitialize={true}
          initialValues={{
            projectName: data?.task?.project.name ?? "",
            userName: data?.task?.assignee?.name ?? "",
            title: data?.task?.title ?? "",
            description: data?.task?.description ?? "",
            dueDate: data?.task?.dueDate
              ? convertToCustomDate(data?.task?.dueDate)
              : "",
            projectId: data?.task?.projectId ?? "",
            assignedTo: data?.task?.assignedTo ?? "",
            status: data?.task?.status ?? "",
          }}
          onSubmit={(values, { resetForm }) => {
            updateTask({
              body: {
                title: values.title,
                description: values.description,
                dueDate: values.dueDate,
                projectId: values.projectId,
                assignedTo: values.assignedTo,
                status: values.status,
              },
              id,
            })
              .unwrap()
              .then(() => {
                getTask(id);
                resetForm();

                toast.success("Action successful");

                if (callBackAction) {
                  callBackAction();
                }
              })
              .catch((err) => {
                toast.error(err.message ?? "Something went wrong");
              });
          }}
        >
          {({ errors, touched, setFieldValue, values }) => {
            return (
              <Form
                encType="multipart/form-data"
                className="flex flex-col gap-3"
              >
                <div>
                  <Input
                    title="User Name"
                    name="userName"
                    touched={touched.title}
                    errors={errors.title}
                    placeholder="Enter title"
                    width="h-[36px] w-[100%] rounded-[5px]"
                    disabled={true}
                  />
                </div>

                <div>
                  <Input
                    title="Project"
                    name="projectName"
                    touched={touched.title}
                    errors={errors.title}
                    placeholder="Enter title"
                    width="h-[36px] w-[100%] rounded-[5px]"
                    disabled
                  />
                </div>
                <Input
                  title="Task Title"
                  name="title"
                  touched={touched.title}
                  errors={errors.title}
                  placeholder="Enter title"
                  width="h-[36px] w-[100%] rounded-[5px]"
                />

                <Input
                  title="Due Date"
                  name="dueDate"
                  type="date"
                  touched={touched.dueDate}
                  errors={errors.dueDate}
                  placeholder="Enter title"
                  width="h-[36px] w-[100%] rounded-[5px]"
                  value={values.dueDate}
                />

                <div>
                  <p>Task Status</p>
                  <SelectField
                    name="status"
                    setFieldValue={setFieldValue}
                    data={status?.map((stat) => ({ name: stat, id: stat }))}
                    placeholder="Select Status"
                    className="w-[100%] h-[36px]"
                    value={values.status}
                  />
                </div>

                <Input
                  title="Description"
                  name="description"
                  type="textarea"
                  as="textarea"
                  touched={touched.description}
                  errors={errors.description}
                  placeholder="Enter title"
                  width="min-h-[200px] w-[100%] rounded-[5px]"
                />

                <Button isLoading={updateLoading}>Update Task</Button>
              </Form>
            );
          }}
        </Formik>
      )}
    </div>
  );
};

export default EditTaskForm;
