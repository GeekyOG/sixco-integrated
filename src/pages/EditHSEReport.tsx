import React, { useState } from "react";
import { Formik, Form } from "formik";
import { Form as AntForm, Select, Upload, UploadFile, UploadProps } from "antd";
import * as Yup from "yup";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Button from "../ui/Button";
import { Plus } from "lucide-react";
import {
  useAddHSEReportMutation,
  useGetHSEReportQuery,
  useUpdateHSEReportMutation,
} from "../api/hseReportApi";
import Input from "../components/input/Input";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

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

function AddHSEReport() {
  const { id } = useParams();

  const { data: reportData } = useGetHSEReportQuery(id);

  const initialValues = {
    title: reportData?.report.title ?? "",
    report: reportData?.report.report ?? "",

    reportURL: "",
    dateOfReport: reportData?.report.dateOfReport ?? "",
    timeOfReport: reportData?.report.timeOfReport ?? "",
  };

  const [updateHSEReport, { isLoading }] = useUpdateHSEReportMutation();
  const navigate = useNavigate();
  const handleSubmit = async (values: any) => {
    console.log("Report submitted:", values);
    updateHSEReport({ body: values, id })
      .unwrap()
      .then(() => {
        toast.success("HSE Report updated successfully");
        navigate(`/dashboard/HSE-reports/details/${id}`);
      })
      .catch((error) => {
        toast.error(error?.data?.message || "Failed to update HSE Report");
      });
  };

  return (
    <div>
      <p className="text-2xl">Edit HSE Report</p>
      <p className="text-[0.865rem]">Enter report details</p>

      <div className="mt-8 border p-8">
        <Formik
          initialValues={initialValues}
          validationSchema={ReportSchema}
          enableReinitialize={true}
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
                <Button className="mt-8" isLoading={isLoading}>
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
