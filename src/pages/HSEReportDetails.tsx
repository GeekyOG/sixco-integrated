// Required imports
import { useEffect, useState } from "react";
import Container from "../ui/Container";
import BreadCrumb from "../ui/BreadCrumb";
import {
  Pencil,
  Upload,
  FileText,
  User,
  Calendar,
  AlertCircle,
  Shield,
  CheckCircle,
} from "lucide-react";
import Button from "../ui/Button";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "antd";
import { useLazyGetHSEReportQuery } from "../api/hseReportApi";
import { useLazyGetAllDocumentQuery } from "../api/hsedocumentApi";
import { formatDate } from "date-fns";
import UploadModal from "../modules/reports/uploadModal";

const statusConfig = {
  open: {
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: AlertCircle,
    label: "Open",
  },
  closed: {
    color: "bg-green-100 text-green-700 border-green-200",
    icon: CheckCircle,
    label: "Closed",
  },
};

function HSEReportDetails() {
  const [docOpen, setDocOpen] = useState(false);
  const navigate = useNavigate();

  const { id } = useParams();
  const [getReport, { data: reportData, isFetching }] =
    useLazyGetHSEReportQuery();
  const [getDocs, { data }] = useLazyGetAllDocumentQuery();

  const getDocuments = () => {
    getDocs(id);
  };

  useEffect(() => {
    getDocs(id);
    getReport(id);
  }, [id]);

  const reportStatus = reportData?.report?.status || "open";
  const StatusIcon =
    statusConfig[reportStatus as keyof typeof statusConfig]?.icon ||
    AlertCircle;

  return (
    <div className="min-h-screen bg-gray-50">
      <Container>
        {/* Breadcrumb */}
        <div className="pt-6">
          <BreadCrumb data={["Dashboard", "HSE Reports", "Report Details"]} />
        </div>

        {/* Header Section */}
        <div className="mt-8 space-y-6">
          {/* Report Title & Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 bg-red-100 rounded-lg flex-shrink-0">
                    <Shield className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                        {reportData?.report?.title || "Loading..."}
                      </h1>
                      {reportData?.report?.status && (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${
                            statusConfig[
                              reportStatus as keyof typeof statusConfig
                            ]?.color
                          }`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {
                            statusConfig[
                              reportStatus as keyof typeof statusConfig
                            ]?.label
                          }
                        </span>
                      )}
                    </div>

                    {/* Report Meta Info */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      {reportData?.report?.reporter && (
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>
                            {reportData.report.reporter.firstName}{" "}
                            {reportData.report.reporter.lastName}
                          </span>
                        </div>
                      )}
                      {reportData?.report?.createdAt && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {formatDate(
                              new Date(reportData.report.createdAt),
                              "MMMM d, yyyy"
                            )}
                          </span>
                        </div>
                      )}
                      {reportData?.report?.dateOfReport && (
                        <div className="flex items-center gap-2 px-2 py-1 bg-gray-100 rounded-md">
                          <span className="text-xs font-medium">
                            Report Date:{" "}
                            {formatDate(
                              new Date(reportData.report.dateOfReport),
                              "MMM d, yyyy"
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button
                  className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm transition-colors duration-200"
                  onClick={() =>
                    navigate(`/dashboard/HSE-reports/edit-report/${id}`)
                  }
                >
                  <Pencil size={16} />
                  <span className="hidden sm:inline">Edit Report</span>
                  <span className="sm:hidden">Edit</span>
                </Button>

                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-sm transition-colors duration-200"
                  onClick={() => setDocOpen(!docOpen)}
                >
                  <Upload size={16} />
                  <span className="hidden sm:inline">Upload Document</span>
                  <span className="sm:hidden">Upload</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Content & Documents Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Report Content Card */}
            <div className="lg:col-span-2">
              <Card className="shadow-sm border-gray-200 hover:shadow-md transition-shadow duration-200 h-full">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-4 border-b border-gray-200">
                    <FileText className="w-5 h-5 text-indigo-600" />
                    <h2 className="text-lg font-semibold text-gray-900">
                      Report Content
                    </h2>
                  </div>

                  {/* Report Content */}
                  <div className="prose prose-sm max-w-none">
                    {reportData?.report?.report ? (
                      <div
                        className="text-gray-700 leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: reportData.report.report,
                        }}
                      />
                    ) : (
                      <div className="text-center py-12">
                        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-400 italic">
                          No report content available
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>

            {/* Documents Card */}
            <div className="lg:col-span-1">
              <Card className="shadow-sm border-gray-200 hover:shadow-md transition-shadow duration-200 h-full">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-purple-600" />
                      <h2 className="text-lg font-semibold text-gray-900">
                        Documents
                      </h2>
                    </div>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {data?.documents?.length || 0} files
                    </span>
                  </div>

                  <div className="max-h-[500px] overflow-y-auto">
                    {data?.documents?.length > 0 ? (
                      <ul className="space-y-2">
                        {data.documents.map((doc: any, index: number) => (
                          <li
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-150 group"
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <FileText className="w-4 h-4 text-gray-400 flex-shrink-0 group-hover:text-gray-600 transition-colors" />
                              <p className="text-sm text-gray-700 truncate">
                                {doc.name}
                              </p>
                            </div>
                            <a
                              href={doc.firebaseUrls[0]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 text-sm hover:text-blue-700 font-medium ml-2 flex-shrink-0 hover:underline"
                            >
                              View
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-center py-12">
                        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-400">
                          No documents uploaded yet
                        </p>
                        <Button
                          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-sm text-sm"
                          onClick={() => setDocOpen(true)}
                        >
                          <Upload size={14} />
                          <span>Upload First Document</span>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Additional Report Details Card */}
          {(reportData?.report?.dateOfReport ||
            reportData?.report?.timeOfReport) && (
            <Card className="shadow-sm border-gray-200">
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-4 border-b border-gray-200">
                  <Calendar className="w-5 h-5 text-orange-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Report Timeline
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reportData?.report?.dateOfReport && (
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Calendar className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">
                          Report Date
                        </p>
                        <p className="text-sm text-gray-900 font-semibold">
                          {formatDate(
                            new Date(reportData.report.dateOfReport),
                            "MMMM d, yyyy"
                          )}
                        </p>
                      </div>
                    </div>
                  )}

                  {reportData?.report?.timeOfReport && (
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Calendar className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">
                          Report Time
                        </p>
                        <p className="text-sm text-gray-900 font-semibold">
                          {reportData.report.timeOfReport}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}
        </div>
      </Container>

      {/* Upload Modal */}
      <UploadModal
        getDocuments={getDocuments}
        isModalOpen={docOpen}
        handleCancel={() => setDocOpen(!docOpen)}
      />
    </div>
  );
}

export default HSEReportDetails;
