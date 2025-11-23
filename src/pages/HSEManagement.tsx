import { useState } from "react";
import {
  Shield,
  AlertTriangle,
  Calendar,
  GraduationCap,
  BarChart3,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import HSEReports from "./HSEReports";
import AuditSchedule from "../modules/hse-reports/AuditSchedule";
import RiskRegister from "../modules/hse-reports/RiskRegister";
import TrainingTracker from "../modules/hse-reports/TrainingTracker";
import { Modal } from "../modules/hse-reports/Modal";
import {
  AddRiskForm,
  AddTrainingForm,
  ScheduleAuditForm,
} from "../modules/hse-reports/hse-forms";

const HSEManagementSystem = () => {
  const [activeTab, setActiveTab] = useState("reports");
  const [formData, setFormData] = useState({
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

  const users = [
    { id: 1, name: "John Doe", department: "Operations" },
    { id: 2, name: "Jane Smith", department: "Safety" },
    { id: 3, name: "Mike Johnson", department: "Maintenance" },
    { id: 4, name: "Sarah Williams", department: "HSE" },
    { id: 5, name: "Tom Brown", department: "Engineering" },
    { id: 6, name: "Lisa Davis", department: "Operations" },
    { id: 7, name: "Robert Wilson", department: "Safety" },
    { id: 8, name: "Emily Taylor", department: "Admin" },
  ];

  // Mock data

  const navigate = useNavigate();

  const tabs = [
    { id: "reports", label: "Reports & Analytics", icon: BarChart3 },
    { id: "risk-register", label: "Risk Register", icon: AlertTriangle },
    { id: "audit-schedule", label: "Audit Schedule", icon: Calendar },
    { id: "training-tracker", label: "Training Tracker", icon: GraduationCap },
  ];

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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="text-xs text-red-600 font-medium">
                High Risk
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">3</p>
            <p className="text-xs text-gray-600">Active Hazards</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span className="text-xs text-blue-600 font-medium">
                This Week
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">3</p>
            <p className="text-xs text-gray-600">Scheduled Audits</p>
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
          <RiskRegister openModal={openModal} />
        )}

        {/* Audit Schedule Tab */}
        {activeTab === "audit-schedule" && (
          <AuditSchedule openModal={openModal} />
        )}

        {/* Training Tracker Tab */}
        {activeTab === "training-tracker" && (
          <TrainingTracker openModal={openModal} />
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
    const users = [
      { id: 1, name: "John Doe", department: "Operations" },
      { id: 2, name: "Jane Smith", department: "Safety" },
      { id: 3, name: "Mike Johnson", department: "Maintenance" },
      { id: 4, name: "Sarah Williams", department: "HSE" },
      { id: 5, name: "Tom Brown", department: "Engineering" },
      { id: 6, name: "Lisa Davis", department: "Operations" },
      { id: 7, name: "Robert Wilson", department: "Safety" },
      { id: 8, name: "Emily Taylor", department: "Admin" },
    ];

    switch (modal.type) {
      case "add-risk":
      case "edit-risk":
        return (
          <AddRiskForm
            initialValues={modal.data}
            onSubmit={(values) => {
              if (modal.type === "add-risk") {
                alert(`✅ Risk "${values.hazard}" added successfully!`);
              } else {
                alert(`✅ Risk "${values.hazard}" updated successfully!`);
              }
              closeModal();
            }}
            onCancel={closeModal}
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
                <p className="text-gray-900 font-medium">{modal.data?.owner}</p>
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

      case "schedule-audit":
        return (
          <ScheduleAuditForm
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
            users={users}
            initialValues={modal.data}
            onSubmit={(values) => {
              // const selectedUsers = users
              //   .filter((u) => values.requiredAttendees.includes(u.id))
              //   .map((u) => u.name)
              //   .join(", ");
              // alert(
              //   `✅ Training "${values.trainingCourse}" added successfully!\nAttendees (${values.requiredAttendees.length}): ${selectedUsers}`
              // );
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
