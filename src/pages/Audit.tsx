import React, { useEffect, useState } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  User,
  Clock,
  Activity,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useGetAllAuditQuery, useLazyGetAllAuditQuery } from "../api/audit";

const AuditLogViewer = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterUser, setFilterUser] = useState("ALL");
  const [filterAction, setFilterAction] = useState("ALL");
  const [filterModel, setFilterModel] = useState("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const users = [{ id: "1", firstName: "Alice", lastName: "Smith" }];
  const models = [{ id: "m1", name: "Model A" }];

  const [getData, { data: auditData }] = useLazyGetAllAuditQuery();
  const [page, setPage] = useState(1);

  useEffect(() => {
    getData({
      model: searchTerm,
      page,
      limit: 10,
    });
  }, [page, searchTerm]);

  console.log(auditData?.audits);

  const totalPages = auditData?.pagination?.totalPages;

  const handleNext = () => {
    if (page && totalPages && page < totalPages && setPage) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (page && totalPages && setPage && page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const getActionColor = (action) => {
    const colors = {
      CREATE: "bg-green-100 text-green-800 border-green-200",
      UPDATE: "bg-blue-100 text-blue-800 border-blue-200",
      DELETE: "bg-red-100 text-red-800 border-red-200",
      LOGIN: "bg-purple-100 text-purple-800 border-purple-200",
    };
    return colors[action] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const parseJsonSafely = (jsonString) => {
    try {
      return JSON.parse(jsonString);
    } catch {
      return null;
    }
  };

  const filteredAudits = auditData?.audits.filter((audit) => {
    const matchesSearch =
      audit.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      audit.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      audit.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterAction === "ALL" || audit.action === filterAction;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Audit Log
          </h1>
          <p className="text-gray-600">
            Track all system activities and changes
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">
              {auditData?.audits?.length}
            </div>
            <div className="text-sm text-gray-600">Total Events</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-green-600">
              {auditData?.audits.filter((a) => a.action === "CREATE")?.length}
            </div>
            <div className="text-sm text-gray-600">Creates</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">
              {auditData?.audits.filter((a) => a.action === "UPDATE")?.length}
            </div>
            <div className="text-sm text-gray-600">Updates</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-purple-600">
              {auditData?.audits.filter((a) => a.action === "LOGIN")?.length}
            </div>
            <div className="text-sm text-gray-600">Logins</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by model, user, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Action filter */}
            <div className="flex items-center gap-2">
              <Filter className="text-gray-400 w-5 h-5" />
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">All Actions</option>
                <option value="CREATE">Create</option>
                <option value="UPDATE">Update</option>
                <option value="DELETE">Delete</option>
                <option value="LOGIN">Login</option>
              </select>
            </div>

            {/* User filter */}
            <div className="flex items-center gap-2">
              <select
                value={filterUser}
                onChange={(e) => setFilterUser(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">All Users</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.firstName} {user.lastName}
                  </option>
                ))}
              </select>
            </div>

            {/* Model filter */}
            <div className="flex items-center gap-2">
              <select
                value={filterModel}
                onChange={(e) => setFilterModel(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">All Models</option>
                {models.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date range filter */}
          <div className="flex items-center gap-2 mt-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Audit List */}
        <div className="space-y-3">
          {filteredAudits?.map((audit) => {
            const isExpanded = expandedId === audit.id;
            const newValues = parseJsonSafely(audit.newValues);

            return (
              <div
                key={audit.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all"
              >
                <div
                  className="p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => setExpandedId(isExpanded ? null : audit.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold border ${getActionColor(
                            audit.action
                          )}`}
                        >
                          {audit.action}
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {audit.model}
                        </span>
                        {audit.recordId && (
                          <span className="text-xs text-gray-500">
                            ID: {audit.recordId}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span className="truncate">
                            {audit.user
                              ? `${audit.user.firstName} ${audit.user.lastName}`
                              : "System"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatDate(audit.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    <button className="text-gray-400 hover:text-gray-600">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-gray-200 p-4 bg-gray-50">
                    <div className="space-y-3">
                      {audit.user && (
                        <div>
                          <h4 className="text-xs font-semibold text-gray-700 uppercase mb-1">
                            User Details
                          </h4>
                          <div className="bg-white p-3 rounded border border-gray-200">
                            <p className="text-sm">
                              <span className="font-medium">Email:</span>{" "}
                              {audit.user.email}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">User ID:</span>{" "}
                              {audit.user.id}
                            </p>
                          </div>
                        </div>
                      )}

                      {audit.ipAddress && (
                        <div>
                          <h4 className="text-xs font-semibold text-gray-700 uppercase mb-1">
                            Connection Info
                          </h4>
                          <div className="bg-white p-3 rounded border border-gray-200">
                            <p className="text-sm">
                              <span className="font-medium">IP Address:</span>{" "}
                              {audit.ipAddress}
                            </p>
                            <p className="text-sm break-all">
                              <span className="font-medium">User Agent:</span>{" "}
                              {audit.userAgent}
                            </p>
                          </div>
                        </div>
                      )}

                      {newValues && (
                        <div>
                          <h4 className="text-xs font-semibold text-gray-700 uppercase mb-1">
                            Details
                          </h4>
                          <div className="bg-white p-3 rounded border border-gray-200">
                            <pre className="text-xs overflow-x-auto whitespace-pre-wrap break-words">
                              {JSON.stringify(newValues, null, 2)}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredAudits?.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">
              No audit logs found matching your criteria
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-between items-center max-w-[200px]">
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className="px-2 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          <ChevronLeft />
        </button>
        <span className="text-sm text-gray-700">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={page === auditData?.pagination?.totalPages}
          className="px-2 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default AuditLogViewer;
