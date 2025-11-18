import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  FileText,
  Calendar,
  Clock,
  Upload as UploadIcon,
  X,
  AlertCircle,
  CheckCircle,
  Image as ImageIcon,
} from "lucide-react";
import { useAddHSEReportMutation } from "../api/hseReportApi";
import ReactQuill from "react-quill";
import { useAddDocumentMutation } from "../api/hsedocumentApi";

// Validation schema
const ReportSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  report: Yup.string().required("Content is required"),
  dateOfReport: Yup.date().required("Date of Report is required"),
  timeOfReport: Yup.string().required("Time of Report is required"),
});

const Input = ({
  title,
  name,
  type,
  placeholder,
  errors,
  touched,
  value,
  onChange,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {title}
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
          touched && errors ? "border-red-300 bg-red-50" : "border-gray-300"
        }`}
      />
      {touched && errors && (
        <div className="flex items-center gap-1 mt-1 text-red-600 text-xs">
          <AlertCircle className="w-3 h-3" />
          <span>{errors}</span>
        </div>
      )}
    </div>
  );
};

const TextEditor = ({ value, onChange, errors, touched }) => {
  const modules = {
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
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ["link"],
      ["clean"],
    ],
    clipboard: {
      matchVisual: false,
    },
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Report Content
      </label>
      <div
        className={`border rounded-lg ${
          touched && errors ? "border-red-300" : "border-gray-300"
        }`}
      >
        <ReactQuill
          value={value}
          onChange={onChange}
          modules={modules}
          theme="snow"
          placeholder="Enter detailed report content..."
          className="bg-white rounded-lg"
          style={{ height: "400px" }}
        />
      </div>
      {touched && errors && (
        <div className="flex items-center gap-1 mt-1 text-red-600 text-xs">
          <AlertCircle className="w-3 h-3" />
          <span>{errors}</span>
        </div>
      )}
    </div>
  );
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

  const [fileList, setFileList] = useState([]);
  const [notification, setNotification] = useState(null);

  const [upload, { isLoading: documentLoading }] = useAddDocumentMutation();
  const [addHSEReport, { isLoading }] = useAddHSEReportMutation();
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map((file, index) => ({
      id: Date.now() + index,
      file: file,
      name: file.name,
      size: file.size,
      preview: URL.createObjectURL(file),
    }));
    setFileList([...fileList, ...newFiles]);
  };

  const removeFile = (id) => {
    setFileList(fileList.filter((file) => file.id !== id));
  };

  const handleSubmit = async (values, { resetForm }) => {
    const formData = new FormData();
    formData.append("report", values.report);
    formData.append("projectId", values.projectId);
    formData.append("dateOfReport", values.dateOfReport);
    formData.append("timeOfReport", values.timeOfReport);
    formData.append("title", values.title);

    addHSEReport(formData)
      .unwrap()
      .then((data) => {
        showNotification("HSE Report submitted successfully!", "success");

        const docFormData = new FormData();
        formData.append("reportId", data?.report.id);

        fileList?.map((doc) => {
          formData.append("files", doc.originFileObj as Blob);
          upload(docFormData);
        });

        resetForm();
        setFileList([]);
      });
    console.log("Report submitted:", values);
    console.log("Files:", fileList);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Notification */}
        {notification && (
          <div
            className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
              notification.type === "success"
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{notification.message}</span>
            <button onClick={() => setNotification(null)}>
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Add HSE Report
            </h1>
          </div>
          <p className="text-gray-600">
            Enter detailed information about the HSE incident or observation
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
          <Formik
            initialValues={initialValues}
            validationSchema={ReportSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleChange, setFieldValue }) => (
              <Form className="space-y-6">
                {/* Report Title */}
                <Input
                  title="Report Title"
                  name="title"
                  type="text"
                  touched={touched.title}
                  errors={errors.title}
                  placeholder="e.g., Near Miss - Equipment Malfunction"
                  value={values.title}
                  onChange={handleChange}
                />

                {/* Date and Time Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Report Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        name="dateOfReport"
                        type="date"
                        value={values.dateOfReport}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          touched.dateOfReport && errors.dateOfReport
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300"
                        }`}
                      />
                    </div>
                    {touched.dateOfReport && errors.dateOfReport && (
                      <div className="flex items-center gap-1 mt-1 text-red-600 text-xs">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.dateOfReport}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time of Report
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        name="timeOfReport"
                        type="time"
                        value={values.timeOfReport}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          touched.timeOfReport && errors.timeOfReport
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300"
                        }`}
                      />
                    </div>
                    {touched.timeOfReport && errors.timeOfReport && (
                      <div className="flex items-center gap-1 mt-1 text-red-600 text-xs">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.timeOfReport}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Report Files (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*,.pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <UploadIcon className="w-12 h-12 text-gray-400 mb-2" />
                      <p className="text-sm font-medium text-gray-700">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Images, PDF, DOC up to 10MB
                      </p>
                    </label>
                  </div>

                  {/* File List */}
                  {fileList.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {fileList.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            {file.file.type.startsWith("image/") ? (
                              <img
                                src={file.preview}
                                alt={file.name}
                                className="w-10 h-10 rounded object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
                                <FileText className="w-5 h-5 text-blue-600" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {file.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatFileSize(file.size)}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(file.id)}
                            className="ml-2 p-1 hover:bg-red-100 rounded transition-colors"
                          >
                            <X className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Content Editor */}
                <TextEditor
                  value={values.report}
                  onChange={(value) => setFieldValue("report", value)}
                  errors={errors.report}
                  touched={touched.report}
                />

                {/* Submit Button */}
                <div className="flex justify-end pt-4 mt-[100px]">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`px-6 py-3 mt-[54px] md:mt-[32px] rounded-lg font-medium flex items-center gap-2 transition-colors ${
                      isLoading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {isLoading || documentLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Submit Report
                      </>
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 mb-1">
                Important Guidelines
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Provide accurate date and time of the incident</li>
                <li>• Include all relevant details in the report content</li>
                <li>• Upload supporting photos or documents if available</li>
                <li>• Reports are reviewed by the HSE team within 24 hours</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddHSEReport;
