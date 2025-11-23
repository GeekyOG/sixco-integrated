import { useState } from "react";
import {
  Calendar,
  ChevronRight,
  Clock,
  Download,
  Plus,
  Users,
  Edit2,
  Trash2,
  MoreVertical,
} from "lucide-react";
import { getStatusColor } from "../../utils/utils";

function AuditSchedule({
  openModal,
  initialAudits,
}: {
  openModal: (type: any, data?: any) => void;
  initialAudits: any[];
}) {
  const [audits, setAudits] = useState(initialAudits);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  const handleDelete = (audit: any) => {
    openModal("delete-schedule-audit", audit);
    setActiveDropdown(null);
  };

  const handleEdit = (audit: any) => {
    openModal("schedule-audit", audit);
    setActiveDropdown(null);
  };

  const handleExport = () => {
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
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-3 justify-between items-start md:items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Audit Schedule
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {audits.length} audit{audits.length !== 1 ? "s" : ""} scheduled
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => openModal("schedule-audit")}
              className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm font-medium transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Audit</span>
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

      {/* Audit Cards */}
      <div className="space-y-3">
        {initialAudits.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Audits Scheduled
            </h3>
            <p className="text-gray-600 mb-4">
              Get started by scheduling your first audit
            </p>
            <button
              onClick={() => openModal("schedule-audit")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Schedule Audit
            </button>
          </div>
        ) : (
          initialAudits.map((audit) => (
            <div
              key={audit.id}
              className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="p-2.5 bg-blue-50 rounded-lg flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {audit.title}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${getStatusColor(
                            audit.status
                          )}`}
                        >
                          {audit.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pl-12">
                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Date</p>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(audit.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Users className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">
                          Inspector
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {audit.inspectors[0]}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Area</p>
                        <p className="text-sm font-medium text-gray-900">
                          {audit.area}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions Dropdown */}
                <div className="relative">
                  <button
                    onClick={() =>
                      setActiveDropdown(
                        activeDropdown === audit.id ? null : audit.id
                      )
                    }
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="More options"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>

                  {activeDropdown === audit.id && (
                    <>
                      {/* Backdrop */}
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setActiveDropdown(null)}
                      />
                      {/* Dropdown Menu */}
                      <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                        <button
                          onClick={() => handleEdit(audit)}
                          className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                          <span>Edit Audit</span>
                        </button>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button
                          onClick={() => handleDelete(audit)}
                          className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete Audit</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AuditSchedule;
