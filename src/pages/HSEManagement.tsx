import { useState } from "react";
import {
  Shield,
  AlertTriangle,
  Calendar,
  GraduationCap,
  BarChart3,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  Users,
  FileText,
  Bell,
  ChevronRight,
  ReceiptIcon,
  Delete,
  Trash,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import HSEReports from "./HSEReports";

const HSEManagementSystem = () => {
  const [activeTab, setActiveTab] = useState("reports");
  const [searchTerm, setSearchTerm] = useState("");
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

  const [modal, setModal] = useState({
    type: null, // e.g., "add-risk", "edit-risk"
    data: null, // optional data for edit/view
  });

  const openModal = (type, data = null) => setModal({ type, data });
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
  const risks = [
    {
      id: 1,
      hazard: "Electrical Equipment Failure",
      severity: "High",
      likelihood: "Medium",
      riskLevel: "High",
      mitigation: "Regular maintenance schedule",
      owner: "John Doe",
      status: "Active",
      reviewDate: "2024-02-15",
    },
    {
      id: 2,
      hazard: "Slip and Fall Hazards",
      severity: "Medium",
      likelihood: "High",
      riskLevel: "Medium",
      mitigation: "Install warning signs, regular cleaning",
      owner: "Jane Smith",
      status: "Mitigated",
      reviewDate: "2024-01-30",
    },
    {
      id: 3,
      hazard: "Chemical Spill Risk",
      severity: "High",
      likelihood: "Low",
      riskLevel: "Medium",
      mitigation: "Spill kits, staff training",
      owner: "Mike Johnson",
      status: "Active",
      reviewDate: "2024-02-20",
    },
  ];

  const audits = [
    {
      id: 1,
      title: "Fire Safety Inspection",
      date: "2024-01-25",
      inspector: "Sarah Williams",
      status: "Scheduled",
      area: "Building A",
    },
    {
      id: 2,
      title: "PPE Compliance Check",
      date: "2024-01-30",
      inspector: "Tom Brown",
      status: "In Progress",
      area: "Workshop",
    },
    {
      id: 3,
      title: "Emergency Exit Review",
      date: "2024-02-05",
      inspector: "Sarah Williams",
      status: "Scheduled",
      area: "All Buildings",
    },
  ];

  const trainings = [
    {
      id: 1,
      course: "Fire Safety Training",
      attendees: 45,
      required: 50,
      completion: 90,
      nextDate: "2024-02-10",
      status: "In Progress",
    },
    {
      id: 2,
      course: "First Aid Certification",
      attendees: 30,
      required: 30,
      completion: 100,
      nextDate: "2024-03-15",
      status: "Completed",
    },
    {
      id: 3,
      course: "Chemical Handling",
      attendees: 15,
      required: 25,
      completion: 60,
      nextDate: "2024-01-28",
      status: "Urgent",
    },
  ];

  const navigate = useNavigate();

  const getRiskColor = (level) => {
    const colors = {
      High: "bg-red-100 text-red-800 border-red-200",
      Medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Low: "bg-green-100 text-green-800 border-green-200",
    };
    return colors[level] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getStatusColor = (status) => {
    const colors = {
      Active: "bg-orange-100 text-orange-800 border-orange-200",
      Mitigated: "bg-green-100 text-green-800 border-green-200",
      Scheduled: "bg-blue-100 text-blue-800 border-blue-200",
      "In Progress": "bg-purple-100 text-purple-800 border-purple-200",
      Completed: "bg-green-100 text-green-800 border-green-200",
      Urgent: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

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
          <div className="space-y-4">
            {/* Controls */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search hazards..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm">
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                  </button>
                  <button
                    onClick={() => openModal("add-risk")}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Risk</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Risk Cards */}
            <div className="space-y-3">
              {risks.map((risk) => (
                <div
                  key={risk.id}
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="p-2 bg-red-50 rounded-lg flex-shrink-0">
                          <AlertTriangle className="w-5 h-5 text-red-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {risk.hazard}
                          </h3>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <span
                              className={`px-2 py-1 rounded-md text-xs font-medium border ${getRiskColor(
                                risk.riskLevel
                              )}`}
                            >
                              {risk.riskLevel} Risk
                            </span>
                            <span
                              className={`px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(
                                risk.status
                              )}`}
                            >
                              {risk.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-600 text-xs mb-1">
                            Mitigation
                          </p>
                          <p className="text-gray-900">{risk.mitigation}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-xs mb-1">Owner</p>
                          <p className="text-gray-900">{risk.owner}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-xs mb-1">
                            Review Date
                          </p>
                          <p className="text-gray-900">{risk.reviewDate}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-xs mb-1">
                            Risk Level
                          </p>
                          <p className="text-gray-900">
                            {risk.severity} / {risk.likelihood}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex md:flex-col gap-2">
                      <button
                        onClick={() => openModal("view-risk", risk)}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openModal("edit-risk", risk)}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openModal("view-risk", risk)}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Audit Schedule Tab */}
        {activeTab === "audit-schedule" && (
          <div className="space-y-4">
            {/* Controls */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex flex-col md:flex-row gap-3 justify-between">
                <div className="flex gap-2">
                  <button
                    onClick={() => openModal("schedule-audit")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Schedule Audit</span>
                  </button>
                </div>
                <button
                  onClick={() => {
                    const csv =
                      "id,title,date,inspector,status,area\n" +
                      audits
                        .map(
                          (a) =>
                            `${a.id},"${a.title}","${a.date}","${a.inspector}","${a.status}","${a.area}"`
                        )
                        .join("\n");
                    const element = document.createElement("a");
                    element.setAttribute(
                      "href",
                      "data:text/plain;charset=utf-8," + encodeURIComponent(csv)
                    );
                    element.setAttribute("download", "audit_schedule.csv");
                    element.style.display = "none";
                    document.body.appendChild(element);
                    element.click();
                    document.body.removeChild(element);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Schedule</span>
                </button>
              </div>
            </div>

            {/* Audit Cards */}
            <div className="space-y-3">
              {audits.map((audit) => (
                <div
                  key={audit.id}
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <Calendar className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {audit.title}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(
                              audit.status
                            )}`}
                          >
                            {audit.status}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div>
                          <p className="text-gray-600 text-xs mb-1">Date</p>
                          <p className="text-gray-900 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {audit.date}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-xs mb-1">
                            Inspector
                          </p>
                          <p className="text-gray-900 flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {audit.inspector}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-xs mb-1">Area</p>
                          <p className="text-gray-900">{audit.area}</p>
                        </div>
                      </div>
                    </div>

                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Training Tracker Tab */}
        {activeTab === "training-tracker" && (
          <div className="space-y-4">
            {/* Controls */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex flex-col md:flex-row gap-3 justify-between">
                <button
                  onClick={() => openModal("add-training")}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Training</span>
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      alert("✉️ Reminder emails sent to 120 staff members!")
                    }
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm"
                  >
                    <Bell className="w-4 h-4" />
                    <span>Send Reminders</span>
                  </button>
                  <button
                    onClick={() => {
                      const csv =
                        "id,course,attendees,required,completion,nextDate,status\n" +
                        trainings
                          .map(
                            (t) =>
                              `${t.id},"${t.course}",${t.attendees},${t.required},${t.completion}%,"${t.nextDate}","${t.status}"`
                          )
                          .join("\n");
                      const element = document.createElement("a");
                      element.setAttribute(
                        "href",
                        "data:text/plain;charset=utf-8," +
                          encodeURIComponent(csv)
                      );
                      element.setAttribute("download", "training_report.csv");
                      element.style.display = "none";
                      document.body.appendChild(element);
                      element.click();
                      document.body.removeChild(element);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Training Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trainings.map((training) => (
                <div
                  key={training.id}
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <GraduationCap className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {training.course}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(
                          training.status
                        )}`}
                      >
                        {training.status}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">Completion</span>
                      <span className="font-medium text-gray-900">
                        {training.completion}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          training.completion === 100
                            ? "bg-green-600"
                            : training.completion >= 60
                            ? "bg-yellow-600"
                            : "bg-red-600"
                        }`}
                        style={{ width: `${training.completion}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600 text-xs mb-1">Attendees</p>
                      <p className="text-gray-900 font-medium">
                        {training.attendees} / {training.required}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs mb-1">Next Date</p>
                      <p className="text-gray-900">{training.nextDate}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reports & Analytics Tab */}
        {activeTab === "reports" && (
          <div className="space-y-4">
            {/* <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">
                Monthly Safety KPIs
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <p className="text-3xl font-bold text-red-600">3</p>
                  <p className="text-sm text-gray-600 mt-1">Incidents</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-3xl font-bold text-blue-600">12</p>
                  <p className="text-sm text-gray-600 mt-1">Audits Completed</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-3xl font-bold text-green-600">95%</p>
                  <p className="text-sm text-gray-600 mt-1">Compliance</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-3xl font-bold text-purple-600">45</p>
                  <p className="text-sm text-gray-600 mt-1">Staff Trained</p>
                </div>
              </div>
            </div> */}
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
    return titles[modal.type as keyof typeof titles] || "";
  }

  function renderModalContent() {
    switch (modal.type) {
      case "add-risk":
        return (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              alert(
                `✅ Risk "${formData.hazard}" added successfully with mitigation: "${formData.mitigation}"`
              );
              closeModal();
            }}
          >
            <input
              className="w-full border p-2 rounded"
              placeholder="Hazard"
              value={formData.hazard}
              onChange={(e) =>
                setFormData({ ...formData, hazard: e.target.value })
              }
            />
            <select
              className="w-full border p-2 rounded"
              value={formData.severity}
              onChange={(e) =>
                setFormData({ ...formData, severity: e.target.value })
              }
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
            <select
              className="w-full border p-2 rounded"
              value={formData.likelihood}
              onChange={(e) =>
                setFormData({ ...formData, likelihood: e.target.value })
              }
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
            <textarea
              className="w-full border p-2 rounded"
              placeholder="Mitigation"
              value={formData.mitigation}
              onChange={(e) =>
                setFormData({ ...formData, mitigation: e.target.value })
              }
            />
            <button
              type="submit"
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Save Risk
            </button>
          </form>
        );

      case "edit-risk":
        return (
          <>
            <p className="mb-3 font-medium">{modal.data?.hazard}</p>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                alert(
                  `✅ Risk updated: ${formData.hazard}\nMitigation: ${formData.mitigation}`
                );
                closeModal();
              }}
            >
              <input
                className="w-full border p-2 rounded"
                defaultValue={modal.data?.hazard}
                onChange={(e) =>
                  setFormData({ ...formData, hazard: e.target.value })
                }
              />
              <textarea
                className="w-full border p-2 rounded"
                defaultValue={modal.data?.mitigation}
                onChange={(e) =>
                  setFormData({ ...formData, mitigation: e.target.value })
                }
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Update
              </button>
            </form>
          </>
        );

      case "view-risk":
        return (
          <div className="space-y-2 text-gray-700">
            <p>
              <strong>Hazard:</strong> {modal.data?.hazard}
            </p>
            <p>
              <strong>Severity:</strong> {modal.data?.severity}
            </p>
            <p>
              <strong>Likelihood:</strong> {modal.data?.likelihood}
            </p>
            <p>
              <strong>Mitigation:</strong> {modal.data?.mitigation}
            </p>
            <p>
              <strong>Status:</strong> {modal.data?.status}
            </p>
            <p>
              <strong>Owner:</strong> {modal.data?.owner}
            </p>
            <p>
              <strong>Review Date:</strong> {modal.data?.reviewDate}
            </p>
          </div>
        );

      case "schedule-audit":
        return (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              alert(
                `✅ Audit Scheduled!\nTitle: ${formData.auditTitle}\nDate: ${formData.auditDate}\nInspector: ${formData.inspector}\nArea: ${formData.area}`
              );
              closeModal();
            }}
          >
            <input
              className="w-full border p-2 rounded"
              placeholder="Audit Title"
              value={formData.auditTitle}
              onChange={(e) =>
                setFormData({ ...formData, auditTitle: e.target.value })
              }
            />
            <input
              className="w-full border p-2 rounded"
              placeholder="Inspector"
              value={formData.inspector}
              onChange={(e) =>
                setFormData({ ...formData, inspector: e.target.value })
              }
            />
            <input
              className="w-full border p-2 rounded"
              type="date"
              value={formData.auditDate}
              onChange={(e) =>
                setFormData({ ...formData, auditDate: e.target.value })
              }
            />
            <input
              className="w-full border p-2 rounded"
              placeholder="Area"
              value={formData.area}
              onChange={(e) =>
                setFormData({ ...formData, area: e.target.value })
              }
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Schedule Audit
            </button>
          </form>
        );

      case "add-training":
        return (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              alert(
                `✅ Training Added!\nCourse: ${formData.trainingCourse}\nRequired Attendees: ${formData.requiredAttendees}`
              );
              closeModal();
            }}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Training Course
                </label>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter course name"
                  value={formData.trainingCourse}
                  onChange={(e) =>
                    setFormData({ ...formData, trainingCourse: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Attendees
                </label>
                <div className="border border-gray-300 rounded-lg p-4 max-h-64 overflow-y-auto">
                  <div className="space-y-2">
                    {users.map((user) => (
                      <label
                        key={user.id}
                        className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.requiredAttendees.includes(user.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                requiredAttendees: [
                                  ...formData.requiredAttendees,
                                  user.id,
                                ],
                              });
                            } else {
                              setFormData({
                                ...formData,
                                requiredAttendees:
                                  formData.requiredAttendees.filter(
                                    (id) => id !== user.id
                                  ),
                              });
                            }
                          }}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {user.department}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                {formData.requiredAttendees.length > 0 && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>
                      {formData.requiredAttendees.length} attendee
                      {formData.requiredAttendees.length !== 1 ? "s" : ""}{" "}
                      selected
                    </span>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Next Training Date
                </label>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  type="date"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const selectedUsers = users
                      .filter((u) => formData.requiredAttendees.includes(u.id))
                      .map((u) => u.name)
                      .join(", ");
                    alert(
                      `✅ Training "${formData.trainingCourse}" added successfully\nRequired Attendees (${formData.requiredAttendees.length}): ${selectedUsers}`
                    );
                    closeModal();
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add Training
                </button>
              </div>
            </div>
          </form>
        );

      default:
        return null;
    }
  }
};

const Modal = ({ open, title, children, onClose }: any) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg relative">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        {children}
        <button
          onClick={onClose}
          className="mt-6 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default HSEManagementSystem;
