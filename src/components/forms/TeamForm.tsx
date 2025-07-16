import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import Button from "../../ui/Button";
import { cn } from "../../utils/cn";
import Input from "../input/Input";
import { toast } from "react-toastify";

import {
  useAddTeamMutation,
  useLazyGetTeamQuery,
  useUpdateTeamMutation,
} from "../../api/teamsApi";

interface AddTeamFormProps {
  reset: boolean;
  callBackAction?: () => void;
  id?: string;
}

const AddTeamForm: React.FC<AddTeamFormProps> = ({
  reset,
  callBackAction,
  id,
}) => {
  const [description, setDescription] = useState("");

  const [addTeam, { isLoading }] = useAddTeamMutation();

  const [getTeam, { data, isLoading: featuredLoading }] = useLazyGetTeamQuery();

  const [updateTeam, { isLoading: updateLoading }] = useUpdateTeamMutation();

  useEffect(() => {
    if (id) {
      getTeam(id)
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
            name: data?.name || "",
            description: data?.description || "",
          }}
          onSubmit={(values, { resetForm }) => {
            if (id) {
              updateTeam({ body: values, id })
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
                  toast.error(err.message ?? "Something went wrong");
                });
            }

            if (!id) {
              addTeam(values)
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
          {({ errors, touched, values }) => {
            return (
              <Form
                encType="multipart/form-data"
                className="flex flex-col gap-3"
              >
                <Input
                  title="Team Name"
                  name="name"
                  touched={touched.name}
                  errors={errors.name}
                  placeholder="Enter title"
                  width="h-[36px] w-[100%] rounded-[5px]"
                />

                <div>
                  <p className="text-[0.865rem] font-[500]">Team Description</p>
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

                <Button isLoading={isLoading || updateLoading}>Add Team</Button>
              </Form>
            );
          }}
        </Formik>
      )}
    </div>
  );
};

export default AddTeamForm;
