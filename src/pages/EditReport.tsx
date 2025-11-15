import React, { useState } from "react";
import { Formik, Form } from "formik";
import { Form as AntForm, Select, Upload, UploadFile } from "antd";
import * as Yup from "yup";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useGetAllPortfolioQuery } from "../api/portfolio";
import Button from "../ui/Button";
import { Plus } from "lucide-react";
import Input from "../components/input/Input";

const { Item: FormItem } = AntForm;
const { Option } = Select;
// Validation schema
const ReportSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  content: Yup.string().required("Content is required"),
  projectId: Yup.string().required("Project ID is required"),
  userId: Yup.string().required("User ID is required"),
  reportURL: Yup.string().url("Must be a valid URL").nullable(),
});

const Editors = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    [{ color: [] }, { background: [] }], // text & background color
    [{ align: [] }], // text alignment
    ["link", "image", "video"],
    ["clean"],
    ["table"], // requires table module
  ],
  clipboard: {
    matchVisual: false,
  },
};
function EditReport() {
  const initialValues = {
    title: "",
    content: "",
    projectId: "",
    userId: "",
    reportURL: "",
  };
  const { data: projectOptions } = useGetAllPortfolioQuery("");

  const handleSubmit = (values) => {
    console.log("Report submitted:", values);
    // Submit to API here
  };

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  return (
    <div>
      <p className="text-2xl">Add Report</p>
      <p className="text-[0.865rem]">Enter report details</p>

      <div className="mt-8 border p-8">
        <Formik
          initialValues={initialValues}
          validationSchema={ReportSchema}
          enableReinitialize={true}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, setFieldValue }) => (
            <Form>
              <Input
                title="Report Title"
                name="title"
                type=""
                touched={touched.title}
                errors={errors.title}
                placeholder="Enter title"
                width="h-[36px] w-[100%] rounded-[5px]"
              />

              <div>
                <p className="block mb-1 font- text-[1rem]">Project</p>

                <Select
                  showSearch
                  className="w-full"
                  placeholder="Select a project"
                  onChange={(value) => setFieldValue("projectId", value)}
                  filterOption={(input, option: any) =>
                    option?.children
                      ?.toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {projectOptions?.projects?.map((project) => (
                    <Option key={project.id} value={project.id}>
                      {project.name}
                    </Option>
                  ))}
                </Select>
              </div>

              <div className="mt-4">
                <p className="block mb-1 font- text-[1rem]">
                  Upload Report File (Optional)
                </p>
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onChange={handleChange}
                >
                  {fileList.length >= 1 ? null : (
                    <button
                      style={{ border: 0, background: "none" }}
                      type="button"
                      className="flex flex-col justify-center items-center"
                    >
                      <Plus />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </button>
                  )}
                </Upload>
              </div>

              <div className="mt-4">
                <p className="block mb-1 font- text-[1rem]">Content</p>

                <FormItem
                  validateStatus={
                    touched.content && errors.content ? "error" : ""
                  }
                  help={touched.content && errors.content}
                >
                  <ReactQuill
                    className="h-[400px]"
                    value={values.content}
                    modules={Editors}
                    onChange={(value) => setFieldValue("content", value)}
                  />
                </FormItem>
              </div>

              <div className="pt-4">
                <Button className="mt-8">Submit Report</Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default EditReport;
