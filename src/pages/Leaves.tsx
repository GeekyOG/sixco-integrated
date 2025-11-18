import { useEffect, useState } from "react";
import Container from "../ui/Container";
import {
  Search,
  Plus,
  Calendar,
  Download,
  X,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import DashboardTable from "../components/dashboard/DashboardTable";
import DashboardDrawer from "../components/dashboard/Drawer";
import Button from "../ui/Button";
import BreadCrumb from "../ui/BreadCrumb";
import { useLazyGetAllLeaveQuery } from "../api/leaveApi";
import { columns } from "../modules/leaves/columns";
import { Card } from "antd";
import { exportToCSV, handleExportCSV } from "../utils/export";
import { format } from "date-fns";

function Leaves() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const [getAllLeave, { isFetching, data }] = useLazyGetAllLeaveQuery();

  useEffect(() => {
    getAllLeave({
      currentPage: page,
    });
  }, [page]);

  const handleAddPortfolio = () => {
    setDrawerOpen(true);
  };

  const handleGetPortfolio = () => {
    getAllLeave({
      currentPage: page,
    });
    setDrawerOpen(false);
  };

  // Filter leave requests based on search term
  const filteredLeaves = data?.leaves?.filter((leave: any) => {
    if (!searchTerm) return true;
    return (
      leave.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.leaveType?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const leavesCount = filteredLeaves?.length || 0;
  const totalLeaves = data?.leaves?.length || 0;

  // Enhanced export function with actual leave data

  const clearSearch = () => {
    setSearchTerm("");
  };

  // Calculate stats
  const leavesByStatus = {
    pending:
      data?.leaves?.filter((l: any) => l.status === "pending")?.length || 0,
    approved:
      data?.leaves?.filter((l: any) => l.status === "approved")?.length || 0,
    rejected:
      data?.leaves?.filter((l: any) => l.status === "rejected")?.length || 0,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Container>
        {/* Breadcrumb */}
        <div className="pt-6">
          <BreadCrumb data={["Dashboard", "Leave Requests"]} />
        </div>

        {/* Header Section */}
        <div className="mt-6">
          <Card className="shadow-sm border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Title & Count */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-teal-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Leave Requests
                  </h1>
                  <p className="text-sm text-gray-600">
                    {searchTerm
                      ? `${leavesCount} of ${totalLeaves} requests`
                      : `${totalLeaves} ${
                          totalLeaves === 1 ? "request" : "requests"
                        } total`}
                  </p>
                </div>
              </div>

              {/* Desktop Actions */}
              <div className="hidden md:flex items-center gap-3">
                {/* Export Button */}
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white border-0 shadow-sm text-sm"
                  onClick={() => exportToCSV(filteredLeaves, "leaves.csv")}
                  disabled={totalLeaves === 0}
                >
                  <Download size={16} />
                  <span>Export ({totalLeaves})</span>
                </Button>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all w-64"
                    placeholder="Search requests..."
                    value={searchTerm}
                  />
                </div>

                {/* Request Leave Button */}
                <Button
                  onClick={handleAddPortfolio}
                  className="bg-teal-600 hover:bg-teal-700 text-white border-0 shadow-sm text-sm"
                >
                  <Plus size={16} />
                  <span>Request Leave</span>
                </Button>
              </div>

              {/* Mobile Actions */}
              <div className="md:hidden space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Search requests..."
                    value={searchTerm}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white border-0 shadow-sm text-sm"
                    onClick={() => exportToCSV(filteredLeaves, "leaves.csv")}
                    disabled={totalLeaves === 0}
                  >
                    <Download size={16} />
                    <span>Export</span>
                  </Button>

                  <Button
                    onClick={handleAddPortfolio}
                    className="flex-1 bg-teal-600 hover:bg-teal-700 text-white border-0 shadow-sm text-sm"
                  >
                    <Plus size={16} />
                    <span>Request</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Active Search Display */}
            {searchTerm && (
              <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-600 font-medium">
                  Searching:
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-teal-100 text-teal-800 rounded-md text-sm">
                  "{searchTerm}"
                  <button
                    onClick={clearSearch}
                    className="hover:bg-teal-200 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </span>
                {leavesCount === 0 && (
                  <span className="text-sm text-gray-500">
                    No leave requests found matching your search
                  </span>
                )}
              </div>
            )}
          </Card>
        </div>

        {/* Stats Cards */}
        {!searchTerm && data?.leaves && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="shadow-sm border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-teal-50 rounded-lg">
                  <Calendar className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalLeaves}
                  </p>
                  <p className="text-sm text-gray-600">Total Requests</p>
                </div>
              </div>
            </Card>

            <Card className="shadow-sm border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {leavesByStatus.pending}
                  </p>
                  <p className="text-sm text-gray-600">Pending</p>
                </div>
              </div>
            </Card>

            <Card className="shadow-sm border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {leavesByStatus.approved}
                  </p>
                  <p className="text-sm text-gray-600">Approved</p>
                </div>
              </div>
            </Card>

            <Card className="shadow-sm border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-50 rounded-lg">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {leavesByStatus.rejected}
                  </p>
                  <p className="text-sm text-gray-600">Rejected</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Table */}
        <div className="mt-6 pb-8">
          <DashboardTable
            columns={columns}
            data={filteredLeaves || []}
            isFetching={isFetching}
            type="Leave"
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
          whatForm={"Leave"}
        />
      </Container>
    </div>
  );
}

export default Leaves;
