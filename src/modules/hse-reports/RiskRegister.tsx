import {
  AlertTriangle,
  Edit,
  Eye,
  Filter,
  Plus,
  Search,
  Trash,
} from "lucide-react";
import React, { useState } from "react";
import { getRiskColor, getStatusColor } from "../../utils/utils";

function RiskRegister({
  openModal,
  risks,
}: {
  openModal: (type: any, data?: any) => void;
  risks: any[];
}) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
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
                    <p className="text-gray-600 text-xs mb-1">Mitigation</p>
                    <p className="text-gray-900">{risk.mitigation}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs mb-1">Owner</p>
                    <p className="text-gray-900">
                      {risk["owner.firstName"]} {risk["owner.lastName"]}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs mb-1">Review Date</p>
                    <p className="text-gray-900">{risk.reviewDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs mb-1">Risk Level</p>
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
                  onClick={() => openModal("delete-risk", risk)}
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
  );
}

export default RiskRegister;
