import React, { useEffect, useState } from "react";
import Container from "../ui/Container";
import {
  Download,
  ListFilter,
  Search,
  Plus,
  Briefcase,
  X,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import DashboardTable from "../components/dashboard/DashboardTable";
import { columns } from "../modules/portfolio/columns";
import DashboardDrawer from "../components/dashboard/Drawer";
import Button from "../ui/Button";
import { useLazyGetAllPortfolioQuery } from "../api/portfolio";
import BreadCrumb from "../ui/BreadCrumb";
import { DatePicker, Popover, Card } from "antd";
import { exportToCSV, handleExportCSV } from "../utils/export";
import { cn } from "../utils/cn";
import { format } from "date-fns";
import PermissionAwareButton from "../components/PermissionAwareButton";

const status = ["To Do", "In Progress", "Review", "Done"];

const statusConfig = {
  "To Do": { color: "bg-gray-100 text-gray-700 border-gray-200", icon: "🔄" },
  "In Progress": {
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: "🔄",
  },
  Review: {
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    icon: "🔄",
  },
  Done: { color: "bg-green-100 text-green-700 border-green-200", icon: "✅" },
};

function Portfolio() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [getAllPortfolio, { isFetching, data }] = useLazyGetAllPortfolioQuery();

  useEffect(() => {
    getAllPortfolio({
      projectName: searchTerm,
      currentPage: page,
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
      ...(statusFilter && { status: statusFilter }),
    });
  }, [page, searchTerm, startDate, endDate, statusFilter]);

  const handleAddPortfolio = () => {
    setDrawerOpen(true);
  };

  const handleGetPortfolio = () => {
    getAllPortfolio("");
    setDrawerOpen(false);
  };

  const onChange = (date: any, type: string) => {
    if (type === "start") {
      setStartDate(date ? date : null);
    } else {
      setEndDate(date ? date : null);
    }
  };

  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
    setStatusFilter("");
    setSearchTerm("");
  };

  const hasActiveFilters = searchTerm || startDate || endDate || statusFilter;
  const projectCount = data?.pagination.totalItems ?? 0;

  // Calculate stats
  const projectsByStatus = {
    toDo: data?.projects?.filter((p: any) => p.status === "To Do")?.length || 0,
    inProgress:
      data?.projects?.filter((p: any) => p.status === "In Progress")?.length ||
      0,
    review:
      data?.projects?.filter((p: any) => p.status === "Review")?.length || 0,
    done: data?.projects?.filter((p: any) => p.status === "Done")?.length || 0,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Container>
        {/* Breadcrumb */}
        <div className="pt-6">
          <BreadCrumb data={["Dashboard", "Projects"]} />
        </div>

        {/* Header Section */}
        <div className="mt-6">
          <Card className="shadow-sm border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Title & Count */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Briefcase className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
                  <p className="text-sm text-gray-600">
                    {projectCount} {projectCount === 1 ? "project" : "projects"}{" "}
                    total
                  </p>
                </div>
              </div>

              {/* Desktop Actions */}
              <div className="hidden lg:flex items-center gap-3">
                {/* Combined Filter Popover */}
                <Popover
                  content={
                    <div className="w-72 space-y-4 p-2">
                      {/* Status Filter */}
                      <div>
                        <label className="text-xs font-semibold text-gray-700 mb-2 block uppercase">
                          Filter by Status
                        </label>
                        <div className="space-y-1">
                          {status.map((item) => (
                            <div
                              key={item}
                              className={cn(
                                "cursor-pointer px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors",
                                statusFilter === item && "bg-indigo-50"
                              )}
                              onClick={() => {
                                setStatusFilter(
                                  statusFilter === item ? "" : item
                                );
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span>
                                    {
                                      statusConfig[
                                        item as keyof typeof statusConfig
                                      ]?.icon
                                    }
                                  </span>
                                  <p
                                    className={cn(
                                      "text-sm font-medium text-gray-700",
                                      statusFilter === item &&
                                        "text-indigo-700 font-semibold"
                                    )}
                                  >
                                    {item}
                                  </p>
                                </div>
                                {statusFilter === item && (
                                  <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Date Filter */}
                      <div className="pt-3 border-t border-gray-200">
                        <label className="text-xs font-semibold text-gray-700 mb-2 block uppercase">
                          Filter by Date Range
                        </label>
                        <div className="space-y-2">
                          <div>
                            <label className="text-xs text-gray-600 mb-1 block">
                              Start Date
                            </label>
                            <DatePicker
                              onChange={(date) => onChange(date, "start")}
                              placeholder="Select start date"
                              className="w-full"
                              value={startDate ? (startDate as any) : null}
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-600 mb-1 block">
                              End Date
                            </label>
                            <DatePicker
                              onChange={(date) => onChange(date, "end")}
                              placeholder="Select end date"
                              className="w-full"
                              value={endDate ? (endDate as any) : null}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Clear Button */}
                      {(statusFilter || startDate || endDate) && (
                        <Button
                          onClick={() => {
                            setStatusFilter("");
                            setStartDate("");
                            setEndDate("");
                          }}
                          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 border-0 text-sm"
                        >
                          <X size={14} />
                          Clear Filters
                        </Button>
                      )}
                    </div>
                  }
                  title={
                    <div className="flex items-center gap-2 pb-2 border-b">
                      <ListFilter className="w-4 h-4" />
                      <span>Filter Projects</span>
                    </div>
                  }
                  trigger="click"
                  placement="bottomLeft"
                >
                  <Button
                    className={`bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm text-sm ${
                      (statusFilter || startDate || endDate) &&
                      "border-indigo-500 bg-indigo-50"
                    }`}
                  >
                    <ListFilter size={16} />
                    <span>
                      {statusFilter || startDate || endDate
                        ? "Filtered"
                        : "Filter"}
                    </span>
                  </Button>
                </Popover>

                {/* Export Button */}
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white border-0 shadow-sm text-sm"
                  onClick={() => exportToCSV(data?.projects, "projects.csv")}
                  disabled={projectCount === 0}
                >
                  <Download size={16} />
                  <span>Export ({projectCount})</span>
                </Button>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all w-64"
                    placeholder="Search projects..."
                    value={searchTerm}
                  />
                </div>

                {/* Add Project Button */}
                <PermissionAwareButton
                  permission="project:create"
                  onClick={handleAddPortfolio}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white border-0 shadow-sm text-sm"
                >
                  <Plus size={16} />
                  <span>Add Project</span>
                </PermissionAwareButton>
              </div>

              {/* Mobile Actions */}
              <div className="lg:hidden space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Search projects..."
                    value={searchTerm}
                  />
                </div>

                <div className="flex gap-2">
                  <Popover
                    content={
                      <div className="w-64 space-y-3 p-2">
                        <div>
                          <label className="text-xs font-medium text-gray-700 mb-1 block">
                            Status
                          </label>
                          {status.map((item) => (
                            <div
                              key={item}
                              className="cursor-pointer px-2 py-1.5 hover:bg-gray-50 rounded"
                              onClick={() => {
                                setStatusFilter(
                                  statusFilter === item ? "" : item
                                );
                              }}
                            >
                              <p
                                className={cn(
                                  "text-sm",
                                  statusFilter === item &&
                                    "text-indigo-600 font-semibold"
                                )}
                              >
                                {item}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    }
                    trigger="click"
                  >
                    <Button className="flex-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm text-sm">
                      <ListFilter size={16} />
                      <span>Filter</span>
                    </Button>
                  </Popover>

                  <Button
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white border-0 shadow-sm text-sm"
                    onClick={() => exportToCSV(data?.projects, "projects.csv")}
                    disabled={projectCount === 0}
                  >
                    <Download size={16} />
                    <span>Export</span>
                  </Button>

                  <PermissionAwareButton
                    permission="project:create"
                    onClick={handleAddPortfolio}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white border-0 shadow-sm text-sm"
                  >
                    <Plus size={16} />
                    <span>Add </span>
                  </PermissionAwareButton>
                </div>
              </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-600 font-medium">
                  Active filters:
                </span>
                {searchTerm && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-800 rounded-md text-sm">
                    Search: "{searchTerm}"
                    <button
                      onClick={() => setSearchTerm("")}
                      className="hover:bg-indigo-200 rounded-full p-0.5"
                    >
                      ×
                    </button>
                  </span>
                )}
                {statusFilter && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-md text-sm">
                    Status: {statusFilter}
                    <button
                      onClick={() => setStatusFilter("")}
                      className="hover:bg-green-200 rounded-full p-0.5"
                    >
                      ×
                    </button>
                  </span>
                )}
                {startDate && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">
                    From: {format(new Date(startDate), "MMM d, yyyy")}
                    <button
                      onClick={() => setStartDate("")}
                      className="hover:bg-blue-200 rounded-full p-0.5"
                    >
                      ×
                    </button>
                  </span>
                )}
                {endDate && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">
                    To: {format(new Date(endDate), "MMM d, yyyy")}
                    <button
                      onClick={() => setEndDate("")}
                      className="hover:bg-blue-200 rounded-full p-0.5"
                    >
                      ×
                    </button>
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium ml-auto"
                >
                  Clear all
                </button>
              </div>
            )}
          </Card>
        </div>

        {/* Table */}
        <div className="mt-6 pb-8">
          <DashboardTable
            columns={columns}
            data={data?.projects || []}
            isFetching={isFetching}
            type="Portfolio"
            callBackAction={handleGetPortfolio}
            page={page}
            setPage={setPage}
            totalPages={data?.pagination?.totalPages}
          />
        </div>

        {/* Drawer */}
        <DashboardDrawer
          callBackAction={handleGetPortfolio}
          open={drawerOpen}
          setOpen={setDrawerOpen}
          whatForm={"Portfolio"}
        />
      </Container>
    </div>
  );
}

export default Portfolio;
