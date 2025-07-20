import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import Button from "../../ui/Button";
import { cn } from "../../utils/cn";
import Input from "../input/Input";
import { toast } from "react-toastify";
import { Select } from "antd";

const { Option } = Select;

import { useGetTeamQuery } from "../../api/teamsApi";
import {
  useAddTaskMutation,
  useLazyGetTaskQuery,
  useUpdateTaskMutation,
} from "../../api/tasksApi";
import { useParams } from "react-router-dom";

interface TaskFormProps {
  reset: boolean;
  callBackAction?: () => void;
  id?: string;
}

const TaskForm: React.FC<TaskFormProps> = ({ reset, callBackAction, id }) => {
  const [description, setDescription] = useState("");
  const { id: teamId } = useParams();
  const [addTask, { isLoading }] = useAddTaskMutation();
  const [getTask, { data, isLoading: featuredLoading }] = useLazyGetTaskQuery();
  const [updateTask, { isLoading: updateLoading }] = useUpdateTaskMutation();
  const { data: teamsData, isFetching } = useGetTeamQuery(teamId);

  useEffect(() => {
    if (id) {
      getTask(id)
        .unwrap()
        .then(() => {
          setDescription(data.description);
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
          initialValues={{
            title: "",
            description: "",
            dueDate: "",
            projectId: "",
            assignedTo: "",
            status: "",
          }}
          onSubmit={(values, { resetForm }) => {
            if (id) {
              updateTask({ body: values, id })
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
            }

            if (!id) {
              addTask(values)
                .unwrap()
                .then(() => {
                  resetForm();

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
          {({ errors, touched, values, setFieldValue }) => {
            useEffect(() => {
              values.title = data?.title;
              values.projectId = data?.projectId;
              values.assignedTo = data?.assignedTo;
              values.dueDate = data?.dueDate;
            }, [data]);
            return (
              <Form
                encType="multipart/form-data"
                className="flex flex-col gap-3"
              >
                <div>
                  <p>Select Team Member</p>
                  <Select
                    showSearch
                    className="w-full"
                    placeholder="Select a user"
                    optionFilterProp="children"
                    onChange={(value) => setFieldValue("assignedTo", value)}
                    filterOption={(input, option) =>
                      (option?.children ?? "")
                        .toString()
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  >
                    {teamsData?.users?.map((user) => (
                      <Option key={user.id} value={user.id}>
                        {user.firstName} {user.lastName}
                      </Option>
                    ))}
                  </Select>
                </div>

                <div>
                  <p>Select Project</p>
                  <Select
                    showSearch
                    className="w-full"
                    placeholder="Select a user"
                    onChange={(value) => setFieldValue("projectId", value)}
                  >
                    {teamsData?.projects?.map((user) => (
                      <Option key={user.id} value={user.id}>
                        {user.name}
                      </Option>
                    ))}
                  </Select>
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
                  title="Start Date"
                  name="dueDate"
                  type="date"
                  touched={touched.dueDate}
                  errors={errors.dueDate}
                  placeholder="Enter title"
                  width="h-[36px] w-[100%] rounded-[5px]"
                />

                <div>
                  <p className="text-[0.865rem] font-[500]">
                    Title Description
                  </p>
                  <textarea
                    className="h-[200px] w-[100%] rounded-[5px] p-[5px] border-[1px]"
                    name="description"
                    placeholder="Description"
                    onChange={(e) => {
                      values.description = e.target.value;
                      setDescription(e.target.value);
                    }}
                    value={description}
                  ></textarea>
                </div>

                <Button isLoading={isLoading || updateLoading}>Add Task</Button>
              </Form>
            );
          }}
        </Formik>
      )}
    </div>
  );
};

export default TaskForm;
