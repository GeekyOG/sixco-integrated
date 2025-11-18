import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  FileText,
  Calendar,
  Clock,
  Upload,
  X,
  AlertCircle,
  CheckCircle,
  Edit,
  AlertTriangle,
  Loader,
} from "lucide-react";
import {
  useGetHSEReportQuery,
  useUpdateHSEReportMutation,
} from "../api/hseReportApi";
import { useNavigate, useParams } from "react-router-dom";

// Validation schema
const ReportSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  report: Yup.string().required("Content is required"),
  dateOfReport: Yup.date().required("Date of Report is required"),
  timeOfReport: Yup.string().required("Time of Report is required"),
  status: Yup.string().required("Status is required"),
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

function EditHSEReport() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch report data using the API
  const {
    data: reportData,
    isLoading: isFetching,
    error: fetchError,
  } = useGetHSEReportQuery(id);

  // Update mutation
  const [updateHSEReport, { isLoading: isUpdating }] =
    useUpdateHSEReportMutation();

  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const initialValues = {
    title: reportData?.report?.title ?? "",
    report: reportData?.report?.report ?? "",
    dateOfReport: reportData?.report?.dateOfReport ?? "",
    timeOfReport: reportData?.report?.timeOfReport ?? "",
    status: reportData?.report?.status ?? "Open Incidents",
  };

  const handleSubmit = async (values) => {
    try {
      await updateHSEReport({ body: values, id }).unwrap();
      showNotification("HSE Report updated successfully!", "success");

      // Navigate back to details page after 1 second
      setTimeout(() => {
        navigate(`/dashboard/HSE-reports/details/${id}`);
      }, 1000);
    } catch (error) {
      showNotification(
        error?.data?.message || "Failed to update HSE Report",
        "error"
      );
      console.error("Update error:", error);
    }
  };

  // Loading state
  if (isFetching) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex flex-col items-center justify-center py-12">
              <Loader className="w-12 h-12 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-600">Loading report data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (fetchError) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="w-12 h-12 text-red-600 mb-4" />
              <p className="text-gray-900 font-medium mb-2">
                Failed to load report
              </p>
              <p className="text-gray-600 text-sm mb-4">
                {fetchError?.data?.message ||
                  "An error occurred while fetching the report"}
              </p>
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!reportData?.report) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex flex-col items-center justify-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-600">Report not found</p>
              <button
                onClick={() => navigate(-1)}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    const colors = {
      "Open Incidents": "bg-red-100 text-red-800 border-red-200",
      Closed: "bg-green-100 text-green-800 border-green-200",
      "Under Review": "bg-yellow-100 text-yellow-800 border-yellow-200",
      Pending: "bg-blue-100 text-blue-800 border-blue-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
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
            <Edit className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Edit HSE Report
            </h1>
          </div>
          <p className="text-gray-600">
            Update incident report details and status
          </p>
        </div>

        {/* Report Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="font-medium text-blue-900">
                  Report ID: {reportData?.report?.id || id}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                    reportData?.report?.status || "Open Incidents"
                  )}`}
                >
                  {reportData?.report?.status || "Open Incidents"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
          <Formik
            initialValues={initialValues}
            validationSchema={ReportSchema}
            enableReinitialize={true}
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

                {/* Date, Time, and Status Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <div className="relative">
                      <AlertTriangle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <select
                        name="status"
                        value={values.status}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none ${
                          touched.status && errors.status
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300"
                        }`}
                      >
                        <option value="">Select status</option>
                        <option value="Open Incidents">Open Incidents</option>
                        <option value="Closed">Closed</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Pending">Pending</option>
                      </select>
                    </div>
                    {touched.status && errors.status && (
                      <div className="flex items-center gap-1 mt-1 text-red-600 text-xs">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.status}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Info */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">
                        Status Definitions
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div>
                          <span className="font-medium text-red-700">
                            • Open Incidents:
                          </span>{" "}
                          Active incidents requiring immediate attention
                        </div>
                        <div>
                          <span className="font-medium text-green-700">
                            • Closed:
                          </span>{" "}
                          Resolved incidents with all actions completed
                        </div>
                        <div>
                          <span className="font-medium text-yellow-700">
                            • Under Review:
                          </span>{" "}
                          Incidents being investigated by HSE team
                        </div>
                        <div>
                          <span className="font-medium text-blue-700">
                            • Pending:
                          </span>{" "}
                          Awaiting additional information or approval
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Editor */}
                <div className="mt-4">
                  <TextEditor
                    value={values.report}
                    onChange={(value) => setFieldValue("report", value)}
                    errors={errors.report}
                    touched={touched.report}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3  pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-6 mt-[32px] py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className={`px-6 mt-[32px] py-3 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                      isUpdating
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {isUpdating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Update Report
                      </>
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>

        {/* Warning Card */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-900 mb-1">
                Important Notice
              </h3>
              <p className="text-sm text-yellow-700">
                Changes to this report will be logged in the audit trail. Ensure
                all information is accurate before submitting. Status changes
                may trigger notifications to relevant stakeholders.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditHSEReport;
