import { useEffect, useState } from "react";
import {
  Shield,
  AlertTriangle,
  Calendar,
  GraduationCap,
  BarChart3,
  AlertCircle,
} from "lucide-react";
import HSEReports from "./HSEReports";
import AuditSchedule from "../modules/hse-reports/AuditSchedule";
import RiskRegister from "../modules/hse-reports/RiskRegister";
import TrainingTracker from "../modules/hse-reports/TrainingTracker";
import { Modal } from "../modules/hse-reports/Modal";
import {
  AddRiskForm,
  AddTrainingForm,
  DeleteRisk,
  DeleteScheduleAuditForm,
  DeleteTrainingForm,
  ScheduleAuditForm,
} from "../modules/hse-reports/hse-forms";
import { useLazyGetAllAuditScheduleQuery } from "../api/auditSchedule";
import { useLazyGetAllTrainingQuery } from "../api/hseTraining";
import { useLazyGetAllRiskQuery } from "../api/risksApi";
import {
  useGetHSEAnalyticsQuery,
  useLazyGetHSEAnalyticsQuery,
} from "../api/hseReportApi";

const HSEManagementSystem = () => {
  const [activeTab, setActiveTab] = useState("reports");
  const [formData, setFormData] = useState({
    hazard: "",
    severity: "",
    likelihood: "",
    mitigation: "",
    owner: "",
    auditTitle: "",
    inspector: "",
    auditDate: "",
    area: "",
    trainingCourse: "",
    requiredAttendees: "",
  });

  const [modal, setModal] = useState<{
    type?: any;
    data?: any;
  }>({
    type: null,
    data: null,
  });

  const openModal = (type: string, data = null) => setModal({ type, data });
  const closeModal = () => {
    setModal({ type: null, data: null });
    setFormData({
      hazard: "",
      severity: "Medium",
      likelihood: "Medium",
      mitigation: "",
      owner: "John Doe",
      auditTitle: "",
      inspector: "Sarah Williams",
      auditDate: "",
      area: "Building A",
      trainingCourse: "",
      requiredAttendees: "",
    });
  };

  const tabs = [
    { id: "reports", label: "Reports & Analytics", icon: BarChart3 },
    { id: "risk-register", label: "Risk Register", icon: AlertTriangle },
    { id: "audit-schedule", label: "Audit Schedule", icon: Calendar },
    { id: "training-tracker", label: "Training Tracker", icon: GraduationCap },
  ];

  const [getSchedules, { data: audits, isLoading }] =
    useLazyGetAllAuditScheduleQuery();

  const [getRisks, { data: risks }] = useLazyGetAllRiskQuery();

  const [getTrainings, { data: trainings }] = useLazyGetAllTrainingQuery();

  const { data: analytics } = useGetHSEAnalyticsQuery("");

  useEffect(() => {
    getRisks({
      limit: 50,
    });
    getTrainings({ limit: 50 });
    getSchedules({ limit: 50 });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-100 rounded-lg">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                HSE Management System
              </h1>
              <p className="text-sm text-gray-600">
                Health, Safety & Environmental Management
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* High Risk Hazards */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-red-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <span className="px-2.5 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded-full">
                High Risk
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {analytics?.data?.risks?.highRiskCount || 0}
            </p>
            <p className="text-sm text-gray-600">Active Hazards</p>
          </div>

          {/* Scheduled Audits */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">
                This Week
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {analytics?.data?.audits?.upcomingThisWeek || 0}
            </p>
            <p className="text-sm text-gray-600">Scheduled Audits</p>
          </div>

          {/* Training Compliance */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <GraduationCap className="w-5 h-5 text-green-600" />
              </div>
              <span className="px-2.5 py-1 bg-green-50 text-green-600 text-xs font-semibold rounded-full">
                Compliance
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {analytics?.data?.training?.compliancePercentage || 0}%
            </p>
            <p className="text-sm text-gray-600">Training Completed</p>
          </div>

          {/* Open Incidents */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-orange-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-orange-600" />
              </div>
              <span className="px-2.5 py-1 bg-orange-50 text-orange-600 text-xs font-semibold rounded-full">
                Open
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {analytics?.data?.incidents?.open || 0}
            </p>
            <p className="text-sm text-gray-600">Active Incidents</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-red-600 text-red-600 bg-red-50"
                      : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Risk Register Tab */}
        {activeTab === "risk-register" && (
          <RiskRegister openModal={openModal} risks={risks?.risks ?? []} />
        )}

        {/* Audit Schedule Tab */}
        {activeTab === "audit-schedule" && (
          <AuditSchedule
            openModal={openModal}
            initialAudits={audits?.audits ?? []}
          />
        )}

        {/* Training Tracker Tab */}
        {activeTab === "training-tracker" && (
          <TrainingTracker
            openModal={openModal}
            trainings={trainings?.trainings ?? []}
          />
        )}

        {/* Reports & Analytics Tab */}
        {activeTab === "reports" && (
          <div className="space-y-4">
            <HSEReports />
          </div>
        )}
        {/* Modal */}
        {modal.type && (
          <Modal title={getModalTitle()} open={true} onClose={closeModal}>
            {renderModalContent()}
          </Modal>
        )}
      </div>
    </div>
  );

  function getModalTitle() {
    const titles: Record<string, string> = {
      "add-risk": "Add New Risk",
      "edit-risk": "Edit Risk",
      "view-risk": "Risk Details",
      "schedule-audit": "Schedule Audit",
      "add-training": "Add Training",
    };
    if (!modal.type) return "";
    return titles[modal.type] || "";
  }

  function renderModalContent() {
    switch (modal.type) {
      case "add-risk":
      case "edit-risk":
        return (
          <AddRiskForm
            initialValues={modal.data}
            onSubmit={(values) => {}}
            onCancel={closeModal}
            callBack={() => {
              getRisks({});
              closeModal();
            }}
          />
        );

      case "view-risk":
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Hazard</p>
              <p className="text-gray-900 font-medium">{modal.data?.hazard}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">Severity</p>
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    modal.data?.severity === "High"
                      ? "bg-red-100 text-red-700"
                      : modal.data?.severity === "Medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {modal.data?.severity}
                </span>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">Likelihood</p>
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    modal.data?.likelihood === "High"
                      ? "bg-red-100 text-red-700"
                      : modal.data?.likelihood === "Medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {modal.data?.likelihood}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Mitigation</p>
              <p className="text-gray-900">{modal.data?.mitigation}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">Status</p>
                <p className="text-gray-900 font-medium">
                  {modal.data?.status}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">Owner</p>
                <p className="text-gray-900 font-medium">
                  {" "}
                  {modal.data["owner.firstName"]} {modal.data["owner.lastName"]}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Review Date</p>
              <p className="text-gray-900 font-medium">
                {modal.data?.reviewDate}
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                onClick={closeModal}
                className="px-6 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        );

      case "delete-risk":
        return <DeleteRisk data={modal.data} closeModal={closeModal} />;

      case "schedule-audit":
        return (
          <ScheduleAuditForm
            callBack={() => {
              getSchedules({ limit: 50 });
              closeModal();
            }}
            initialValues={modal.data}
            onSubmit={(values) => {
              if (modal.data) {
                alert(`✅ Audit "${values.auditTitle}" updated successfully!`);
              } else {
                alert(
                  `✅ Audit "${values.auditTitle}" scheduled successfully!`
                );
              }
              closeModal();
            }}
            onCancel={closeModal}
          />
        );

      case "delete-schedule-audit":
        return (
          <DeleteScheduleAuditForm
            callBack={() => {
              getSchedules({ limit: 50 });
              closeModal();
            }}
            initialValues={modal.data}
            onSubmit={(values) => {
              if (modal.data) {
                alert(`✅ Audit "${values.auditTitle}" updated successfully!`);
              } else {
                alert(
                  `✅ Audit "${values.auditTitle}" scheduled successfully!`
                );
              }
              closeModal();
            }}
            onCancel={closeModal}
          />
        );

      case "add-training":
        return (
          <AddTrainingForm
            callBack={() => {
              getTrainings({ limit: 50 });
              closeModal();
            }}
            initialValues={modal.data}
            onSubmit={(values) => {
              closeModal();
            }}
            onCancel={closeModal}
          />
        );

      case "delete-training":
        return (
          <DeleteTrainingForm
            callBack={() => {
              getTrainings({ limit: 50 });
              closeModal();
            }}
            initialValues={modal.data}
            onSubmit={(values) => {
              closeModal();
            }}
            onCancel={closeModal}
          />
        );

      default:
        return null;
    }
  }
};

export default HSEManagementSystem;
