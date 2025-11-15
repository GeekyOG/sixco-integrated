import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { Form as AntForm, Select, Upload, UploadFile } from "antd";
import * as Yup from "yup";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  useGetAllPortfolioQuery,
  useLazyGetAllPortfolioQuery,
} from "../api/portfolio";
import Button from "../ui/Button";
import { Plus } from "lucide-react";
import SelectField from "../components/input/SelectField";
import { useAddHSEReportMutation } from "../api/hseReportApi";
import Input from "../components/input/Input";
import { useAddReportMutation } from "../api/reportsApi";

const { Item: FormItem } = AntForm;
const { Option } = Select;
// Validation schema
const ReportSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  content: Yup.string().required("Content is required"),
  projectId: Yup.string().required("Project ID is required"),
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
function AddReport() {
  const userDataRaw = localStorage.getItem("userData");
  const userData = userDataRaw ? JSON.parse(userDataRaw) : null;

  const initialValues = {
    title: "",
    content: "",
    projectId: "",
    userId: userData.id,
    reportURL: "",
    dateOfReport: "",
    timeOfReport: "",
  };

  const [addHSEReport, { isLoading }] = useAddReportMutation();

  const [getData, { data: projectOptions }] = useLazyGetAllPortfolioQuery();

  useEffect(() => {
    getData({});
  }, []);
  const handleSubmit = (values: any) => {
    addHSEReport(values);
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
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, setFieldValue }) => (
            <Form className="flex flex-col gap-4">
              <Input
                title="Report Title"
                name="title"
                type=""
                touched={touched.title}
                errors={errors.title}
                placeholder="Enter title"
                width="h-[36px] w-[100%] rounded-[5px]"
              />

              <Input
                name="dateOfReport"
                type="date"
                touched={touched.dateOfReport}
                errors={errors.dateOfReport}
                placeholder="Enter Date of Report"
                width="h-[36px] w-[100%] rounded-[5px]"
                title={"Report Date"}
              />

              <Input
                name="timeOfReport"
                type="time"
                touched={touched.timeOfReport}
                errors={errors.timeOfReport}
                placeholder="Enter Time of Report"
                width="h-[36px] w-[100%] rounded-[5px]"
                title={"Time of Report"}
              />

              <div>
                <p className="block mb-1 font- text-[1rem]">Project</p>

                <SelectField
                  name="projectId"
                  placeholder="Select a project"
                  data={projectOptions?.projects ?? []}
                  fetchData={getData}
                  setFieldValue={setFieldValue}
                  searchParam="projectName"
                />
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
                <Button isLoading={isLoading} className="mt-8">
                  Submit Report
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default AddReport;
