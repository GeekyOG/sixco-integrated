import { useState } from "react";
import {
  Bell,
  Download,
  GraduationCap,
  Plus,
  Edit2,
  Trash2,
  MoreVertical,
  Users,
  Calendar,
} from "lucide-react";
import { getStatusColor } from "../../utils/utils";

function TrainingTracker({
  openModal,
  trainings,
}: {
  openModal: (type: any, data?: any) => void;
  trainings: any[];
}) {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  const handleDelete = (training: any) => {
    openModal("delete-training", training);
    setActiveDropdown(null);
  };

  const handleEdit = (training: any) => {
    openModal("add-training", training);
    setActiveDropdown(null);
  };

  const handleExport = () => {
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
      "data:text/plain;charset=utf-8," + encodeURIComponent(csv)
    );
    element.setAttribute("download", "training_report.csv");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleSendReminders = () => {
    const totalAttendees = trainings?.reduce((sum, t) => sum + t.required, 0);
    alert(`✉️ Reminder emails sent to ${totalAttendees} staff members!`);
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-3 justify-between items-start md:items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Training Tracker
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {trainings?.length} training program
              {trainings?.length !== 1 ? "s" : ""} active
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => openModal("add-training")}
              className="px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm font-medium transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Training</span>
            </button>
            <button
              onClick={handleSendReminders}
              className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm font-medium transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Reminders</span>
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm font-medium transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Training Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {trainings?.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-lg shadow-sm border border-gray-200 text-center">
            <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Training Programs
            </h3>
            <p className="text-gray-600 mb-4">
              Get started by adding your first training program
            </p>
            <button
              onClick={() => openModal("add-training")}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Training
            </button>
          </div>
        ) : (
          trainings?.map((training) => (
            <div
              key={training.id}
              className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all group relative"
            >
              {/* Actions Dropdown */}
              <div className="absolute top-4 right-4">
                <button
                  onClick={() =>
                    setActiveDropdown(
                      activeDropdown === training.id ? null : training.id
                    )
                  }
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="More options"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>

                {activeDropdown === training.id && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setActiveDropdown(null)}
                    />
                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                      <button
                        onClick={() => handleEdit(training)}
                        className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span>Edit Training</span>
                      </button>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={() => handleDelete(training)}
                        className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete Training</span>
                      </button>
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-start gap-3 mb-4 pr-8">
                <div className="p-2.5 bg-green-50 rounded-lg flex-shrink-0 group-hover:bg-green-100 transition-colors">
                  <GraduationCap className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-lg mb-2 pr-4">
                    {training.courseName}
                  </h3>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      training.status
                    )}`}
                  >
                    {training.status}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              {/* <div className="mb-4">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-gray-600 font-medium">
                    Completion Rate
                  </span>
                  <span className="font-semibold text-gray-900">
                    {training.completion}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      training.completion === 100
                        ? "bg-green-600"
                        : training.completion >= 60
                        ? "bg-yellow-500"
                        : "bg-red-600"
                    }`}
                    style={{ width: `${training.completion}%` }}
                  />
                </div>
              </div> */}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-2">
                  <Users className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Attendees</p>
                    <p className="text-sm font-semibold text-gray-900">
                      <span className="text-gray-500 font-normal">
                        {training.attendeeCount}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Next Date</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(training.nextTrainingDate).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TrainingTracker;
