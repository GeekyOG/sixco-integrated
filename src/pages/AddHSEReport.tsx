import React, { useState } from "react";
import { Formik, Form } from "formik";
import { Form as AntForm, Select, Upload, UploadFile, UploadProps } from "antd";
import * as Yup from "yup";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Button from "../ui/Button";
import { Plus } from "lucide-react";
import { useAddHSEReportMutation } from "../api/hseReportApi";
import Input from "../components/input/Input";
import { useAddDocumentMutation } from "../api/hsedocumentApi";

const { Item: FormItem } = AntForm;
const { Option } = Select;
// Validation schema
const ReportSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  report: Yup.string().required("Content is required"),

  dateOfReport: Yup.date().required("Date of Report is required"),
  timeOfReport: Yup.string().required("Time of Report is required"),
});

const Editors = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image", "video"],
    ["clean"],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
};

function AddHSEReport() {
  const initialValues = {
    title: "",
    report: "",
    projectId: "",
    reportURL: "",
    dateOfReport: "",
    timeOfReport: "",
  };
  const [addHSEReport, { isLoading }] = useAddHSEReportMutation();
  const [upload, { isLoading: uploading }] = useAddDocumentMutation();

  const handleSubmit = async (values: any) => {
    console.log("Report submitted:", values);
    addHSEReport(values).then(async (data) => {
      await Promise.all(
        fileList.map((doc) => {
          const formData = new FormData();
          formData.append("reportId", data.data.id as string);
          formData.append("files", doc.originFileObj as Blob);

          return upload({
            formData,
          });
        })
      );
    });
  };

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const handleFileChange: UploadProps["onChange"] = ({
    fileList: newFileList,
  }) => setFileList(newFileList);
  return (
    <div>
      <p className="text-2xl">Add HSE Report</p>
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

              {/* <div>
                <p className="block mb-1 font- text-[1rem]">Project</p>
                <SelectField
                  name="projectId"
                  placeholder="Select a project"
                  data={projectOptions?.projects ?? []}
                  fetchData={getData}
                  setFieldValue={setFieldValue}
                  searchParam="projectName"
                />
              </div> */}

              <div>
                <p className="block mb-1 font- text-[1rem]">
                  Upload Report File (Optional)
                </p>
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onChange={handleFileChange}
                >
                  {fileList.length >= 6 ? null : (
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
                <Button className="mt-8" isLoading={isLoading || uploading}>
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

export default AddHSEReport;
