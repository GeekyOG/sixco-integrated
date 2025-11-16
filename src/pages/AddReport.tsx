import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { Form as AntForm, Select, Upload, UploadFile, UploadProps } from "antd";
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
  report: Yup.string().required("Content is required"),
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
    report: "",
    projectId: "",
    dateOfReport: "",
    timeOfReport: "",
  };

  const [addHSEReport, { isLoading }] = useAddReportMutation();

  const [getData, { data: projectOptions }] = useLazyGetAllPortfolioQuery();

  useEffect(() => {
    getData({});
  }, []);
  const handleSubmit = (values: any) => {
    const formData = new FormData();
    formData.append("report", values.report);
    formData.append("projectId", values.projectId);
    formData.append("dateOfReport", values.dateOfReport);
    formData.append("timeOfReport", values.timeOfReport);
    formData.append("title", values.title);

    formData.append(
      "files",
      fileList?.map((doc) => doc.originFileObj as Blob)
    );
    addHSEReport(formData);
    console.log("Report submitted:", values);
    // Submit to API here
  };

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleFileChange: UploadProps["onChange"] = ({
    fileList: newFileList,
  }) => setFileList(newFileList);

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
                  onChange={handleFileChange}
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
                    touched.report && errors.report ? "error" : ""
                  }
                  help={touched.report && errors.report}
                >
                  <ReactQuill
                    className="h-[400px]"
                    value={values.report}
                    modules={Editors}
                    onChange={(value) => setFieldValue("report", value)}
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
