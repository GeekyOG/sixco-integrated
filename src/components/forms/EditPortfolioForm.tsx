import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import Button from "../../ui/Button";
import { cn } from "../../utils/cn";
import Input from "../input/Input";
import { toast } from "react-toastify";
import {
  useLazyGetPortfolioQuery,
  useUpdatePortfolioMutation,
} from "../../api/portfolio";
import { Select } from "antd";
const { Option } = Select;
interface EditPortfolioFormFormProps {
  reset: boolean;
  callBackAction?: () => void;
  id?: string;
}

const EditPortfolioFormForm: React.FC<EditPortfolioFormFormProps> = ({
  reset,
  callBackAction,
  id,
}) => {
  const [description, setDescription] = useState("");

  const [getPortfolio, { data, isLoading: featuredLoading }] =
    useLazyGetPortfolioQuery();

  const [updatePortfolio, { isLoading: updateLoading }] =
    useUpdatePortfolioMutation();

  useEffect(() => {
    if (id) {
      getPortfolio(id)
        .unwrap()
        .then(() => {
          setDescription(data.project.description);
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
          enableReinitialize={true}
          initialValues={{
            name: data?.project?.name || "",
            description: data?.project?.description || "",
            startDate: data?.project?.startDate?.split("T")[0] || "",
            endDate: data?.project?.endDate?.split("T")[0] || "",
            status: data?.project?.status || "",
          }}
          validateOnChange={true}
          validateOnBlur={true}
          onSubmit={(values, { resetForm }) => {
            updatePortfolio({ body: values, id })
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
          }}
        >
          {({ errors, touched, values, setFieldValue }) => {
            return (
              <Form
                encType="multipart/form-data"
                className="flex flex-col gap-3"
              >
                <div>
                  <label className="block mb-1 font-semibold">
                    Project Status
                  </label>
                  <Select
                    showSearch
                    className="w-full"
                    placeholder="Select a Status"
                    value={values.status}
                    onChange={(value) => setFieldValue("status", value)}
                    filterOption={(input, option: any) =>
                      option?.children
                        ?.toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  >
                    {["To Do", "In Progress", "Completed"]?.map((status, i) => (
                      <Option key={i} value={status}>
                        {status}
                      </Option>
                    ))}
                  </Select>
                </div>
                <Input
                  title="Project Name"
                  name="name"
                  touched={touched.name}
                  errors={errors.name}
                  placeholder="Enter title"
                  width="h-[36px] w-[100%] rounded-[5px]"
                />

                <div>
                  <p className="text-[0.865rem] font-[500]">
                    Project Description
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

                <Button isLoading={updateLoading}>Add Project</Button>
              </Form>
            );
          }}
        </Formik>
      )}
    </div>
  );
};

export default EditPortfolioFormForm;
