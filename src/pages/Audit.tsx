import React, { useEffect, useRef, useState } from "react";
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
  X,
} from "lucide-react";
import { useGetAllAuditQuery, useLazyGetAllAuditQuery } from "../api/audit";
import { useGetAllUsersQuery } from "../api/authApi";

const AuditLogViewer = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterUser, setFilterUser] = useState("");
  const [filterAction, setFilterAction] = useState("ALL");
  const [filterModel, setFilterModel] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data: staffsData, isFetching } = useGetAllUsersQuery({
    limit: 10000000,
  });
  const users = staffsData?.users ?? [];
  const models = [
    "HSEReport",
    "Report",
    "User",
    "Leave",
    "Client",
    "Project",
    "Task",
    "Team",
  ];

  const [getData, { data: auditData }] = useLazyGetAllAuditQuery();
  const [page, setPage] = useState(1);

  useEffect(() => {
    getData({
      model: filterModel,
      page,
      limit: 50,
      userId: filterUser,
    });
  }, [page, searchTerm, filterModel, filterUser]);

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
              {auditData?.pagination?.totalItems}
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

            <div className="flex flex-row gap-4 flex-wrap">
              {/* Action filter */}

              <div className="flex items-center gap-2">
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
                <SearchableSelect
                  value={filterUser}
                  onChange={setFilterUser}
                  options={users?.map((user) => {
                    return {
                      label: `${user.firstName} ${user.lastName}`,
                      value: user.id,
                    };
                  })}
                  placeholder="Select user..."
                />
              </div>

              {/* Model filter */}
              <div className="flex items-center gap-2">
                <SearchableSelect
                  value={filterModel}
                  onChange={setFilterModel}
                  options={models?.map((model) => {
                    return {
                      label: model,
                      value: model,
                    };
                  })}
                  placeholder="Select model..."
                />
              </div>
            </div>
          </div>

          {/* Date range filter */}
          <div className="hidden md:flex flex-col md:flex-row md:items-center gap-2 mt-2">
            <p>Filter by Date range</p>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="text-gray-500 text-center">to</span>
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

// Searchable Select Component
const SearchableSelect = ({
  value,
  onChange,
  options,
  placeholder = "Select...",
  label = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  // Get selected option label
  const selectedOption = options.find((opt) => opt.value === value);
  const selectedLabel = selectedOption ? selectedOption.label : placeholder;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selected value display */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-left flex items-center justify-between gap-2"
      >
        <span className={value === "ALL" ? "text-gray-500" : "text-gray-900"}>
          {selectedLabel}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-hidden flex flex-col">
          {/* Search input */}
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search..."
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Options list */}
          <div className="overflow-y-auto max-h-60">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 transition-colors ${
                    value === option.value
                      ? "bg-blue-100 text-blue-700 font-medium"
                      : "text-gray-700"
                  }`}
                >
                  {option.label}
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-sm text-gray-500">
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
