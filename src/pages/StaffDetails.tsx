import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Container from "../ui/Container";
import {
  Download,
  ListFilter,
  Search,
  Mail,
  Phone,
  User,
  ListChecks,
  CheckCircle2,
  Clock,
} from "lucide-react";
import DashboardTable from "../components/dashboard/DashboardTable";
import { useGetUserQuery } from "../api/authApi";
import { useLazyGetAllTaskQuery } from "../api/tasksApi";
import { taskColumns } from "../modules/teams/staffTaskColums";
import { Popover, Card } from "antd";
import { handleExportCSV } from "../utils/export";
import Button from "../ui/Button";
import { cn } from "../utils/cn";

const status = ["To Do", "In Progress", "Review", "Done"];

const statusConfig = {
  "To Do": { color: "bg-gray-100 text-gray-700 border-gray-200", icon: "⏳" },
  "In Progress": {
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: "🔄",
  },
  Review: {
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    icon: "👀",
  },
  Done: { color: "bg-green-100 text-green-700 border-green-200", icon: "✅" },
};

function StaffDetails() {
  const { id } = useParams();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const { data } = useGetUserQuery(id);
  const [getTasks, { data: tasksData, isFetching }] = useLazyGetAllTaskQuery();

  useEffect(() => {
    if (data?.user?.email) {
      getTasks({
        assigneeEmail: data?.user?.email,
        ...(searchTerm && { title: searchTerm }),
        ...(statusFilter && { status: statusFilter }),
        page,
      });
    }
  }, [data, searchTerm, page, statusFilter]);

  const taskStats = {
    total: tasksData?.tasks?.length || 0,
    toDo:
      tasksData?.tasks?.filter((t: any) => t.status === "To Do")?.length || 0,
    inProgress:
      tasksData?.tasks?.filter((t: any) => t.status === "In Progress")
        ?.length || 0,
    review:
      tasksData?.tasks?.filter((t: any) => t.status === "Review")?.length || 0,
    done:
      tasksData?.tasks?.filter((t: any) => t.status === "Done")?.length || 0,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Container>
        {/* Header Section */}
        <div className="pt-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl lg:text-3xl font-bold shadow-lg">
                  {data?.user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                    {data?.user?.fullName || "Loading..."}
                  </h1>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                    Staff Member
                  </span>
                </div>

                {/* Contact Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Mail className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500 font-medium">
                        Email Address
                      </p>
                      <p className="text-sm text-gray-900 truncate">
                        {data?.user?.email || "--"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Phone className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500 font-medium">
                        Phone Number
                      </p>
                      <p className="text-sm text-gray-900 truncate">
                        {data?.user?.phoneNumber || "--"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Task Statistics */}
        <div className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card className="shadow-sm border-gray-200 hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <ListChecks className="w-6 h-6 text-gray-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {taskStats.total}
                </p>
                <p className="text-xs text-gray-600 mt-1">Total Tasks</p>
              </div>
            </Card>

            <Card className="shadow-sm border-gray-200 hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="text-2xl mb-2 text-center flex justify-center">
                  <Clock className="text-center" />
                </div>
                <p className="text-2xl font-bold text-gray-700">
                  {taskStats.toDo}
                </p>
                <p className="text-xs text-gray-600 mt-1">To Do</p>
              </div>
            </Card>

            <Card className="shadow-sm border-gray-200 hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="text-2xl mb-2">🔄</div>
                <p className="text-2xl font-bold text-blue-600">
                  {taskStats.inProgress}
                </p>
                <p className="text-xs text-gray-600 mt-1">In Progress</p>
              </div>
            </Card>

            {/* <Card className="shadow-sm border-gray-200 hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="text-2xl mb-2">👀</div>
                <p className="text-2xl font-bold text-yellow-600">
                  {taskStats.review}
                </p>
                <p className="text-xs text-gray-600 mt-1">Review</p>
              </div>
            </Card> */}

            <Card className="shadow-sm border-gray-200 hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="text-2xl mb-2">✅</div>
                <p className="text-2xl font-bold text-green-600">
                  {taskStats.done}
                </p>
                <p className="text-xs text-gray-600 mt-1">Done</p>
              </div>
            </Card>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="mt-6 pb-8">
          <Card className="shadow-sm border-gray-200">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-2">
                  <ListChecks className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Assigned Tasks
                  </h2>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {taskStats.total}
                  </span>
                </div>

                {/* Desktop Actions */}
                <div className="hidden lg:flex items-center gap-3">
                  {/* Status Filter */}
                  <Popover
                    content={
                      <div className="flex flex-col gap-2 py-2 min-w-[160px]">
                        {status?.map((item) => (
                          <div
                            key={item}
                            className={cn(
                              "cursor-pointer px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors",
                              statusFilter === item && "bg-blue-50"
                            )}
                            onClick={() => {
                              setStatusFilter(
                                statusFilter === item ? "" : item
                              );
                            }}
                          >
                            <div className="flex items-center justify-between gap-3">
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
                                      "text-blue-700 font-semibold"
                                  )}
                                >
                                  {item}
                                </p>
                              </div>
                              {statusFilter === item && (
                                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                              )}
                            </div>
                          </div>
                        ))}
                        {statusFilter && (
                          <>
                            <div className="border-t my-1" />
                            <button
                              onClick={() => setStatusFilter("")}
                              className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                            >
                              Clear Filter
                            </button>
                          </>
                        )}
                      </div>
                    }
                    title="Filter by Status"
                    placement="bottomLeft"
                    trigger="click"
                  >
                    <Button
                      className={cn(
                        "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm text-sm",
                        statusFilter && "border-blue-500 bg-blue-50"
                      )}
                    >
                      <ListFilter size={16} />
                      <span>
                        {statusFilter
                          ? `Filter: ${statusFilter}`
                          : "Filter Status"}
                      </span>
                    </Button>
                  </Popover>

                  {/* Export Button */}
                  <Button
                    className="bg-red-600 hover:bg-red-700 text-white border-0 shadow-sm text-sm"
                    onClick={() =>
                      handleExportCSV({
                        data: tasksData?.tasks || [],
                        fileName: `${data?.user?.fullName}_tasks.csv`,
                      })
                    }
                  >
                    <Download size={16} />
                    <span>Export</span>
                  </Button>

                  {/* Search Input */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all w-64"
                      placeholder="Search by task title..."
                      value={searchTerm}
                    />
                  </div>
                </div>
              </div>

              {/* Mobile Search & Filter */}
              <div className="lg:hidden space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Search by task title..."
                    value={searchTerm}
                  />
                </div>

                <div className="flex gap-2">
                  <Popover
                    content={
                      <div className="flex flex-col gap-2 py-2">
                        {status?.map((item) => (
                          <div
                            key={item}
                            className={cn(
                              "cursor-pointer px-3 py-2 rounded-lg",
                              statusFilter === item && "bg-blue-50"
                            )}
                            onClick={() => {
                              setStatusFilter(
                                statusFilter === item ? "" : item
                              );
                            }}
                          >
                            <p
                              className={cn(
                                "text-sm font-medium",
                                statusFilter === item && "text-blue-600"
                              )}
                            >
                              {item}
                            </p>
                          </div>
                        ))}
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
                    onClick={() =>
                      handleExportCSV({
                        data: tasksData?.tasks || [],
                        fileName: "tasks.csv",
                      })
                    }
                  >
                    <Download size={16} />
                    <span>Export</span>
                  </Button>
                </div>
              </div>

              {/* Active Filters Display */}
              {(statusFilter || searchTerm) && (
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-200">
                  <span className="text-sm text-gray-600 font-medium">
                    Active filters:
                  </span>
                  {searchTerm && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">
                      Search: "{searchTerm}"
                      <button
                        onClick={() => setSearchTerm("")}
                        className="hover:bg-blue-200 rounded-full p-0.5"
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
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("");
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium ml-auto"
                  >
                    Clear all
                  </button>
                </div>
              )}

              {/* Table */}
              <DashboardTable
                columns={taskColumns}
                data={tasksData?.tasks || []}
                callBackAction={() => {}}
                type="edit-tasks"
                isFetching={isFetching}
                page={page}
                setPage={setPage}
                totalPages={tasksData?.pagination?.totalPages}
              />
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
}

export default StaffDetails;
