import { useEffect, useState } from "react";
import Container from "../ui/Container";
import {
  Search,
  Plus,
  Shield,
  Download,
  X,
  AlertCircle,
  CheckCircle,
  FileText,
} from "lucide-react";
import DashboardTable from "../components/dashboard/DashboardTable";
import DashboardDrawer from "../components/dashboard/Drawer";
import Button from "../ui/Button";
import BreadCrumb from "../ui/BreadCrumb";
import { useLazyGetAllReportQuery } from "../api/reportsApi";
import { useNavigate } from "react-router-dom";
import { columns } from "../modules/reports/columns";
import { Card } from "antd";
import { exportToCSV, handleExportCSV } from "../utils/export";
import { format } from "date-fns";
import { useLazyGetAllHSEReportQuery } from "../api/hseReportApi";
import PermissionAwareButton from "../components/PermissionAwareButton";

function HSEReports() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const [getALLReports, { isFetching, data }] = useLazyGetAllHSEReportQuery();

  useEffect(() => {
    getALLReports("");
  }, []);

  const handleAddPortfolio = () => {
    setDrawerOpen(true);
  };

  const handleGetPortfolio = () => {
    getALLReports("");
    setDrawerOpen(false);
  };

  // Filter reports based on search term
  const filteredReports = data?.reports?.filter((report: any) => {
    if (!searchTerm) return true;
    return (
      report.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reporter?.firstName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      report.reporter?.lastName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      report.reporter?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const reportsCount = filteredReports?.length || 0;
  const totalReports = data?.reports?.length || 0;

  const clearSearch = () => {
    setSearchTerm("");
  };

  // Calculate stats
  const reportsByStatus = {
    open: data?.reports?.filter((r: any) => r.status === "open")?.length || 0,
    closed:
      data?.reports?.filter((r: any) => r.status === "closed")?.length || 0,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Container>
        {/* Breadcrumb */}
        {/* <div className="pt-6">
          <BreadCrumb data={["Dashboard", "HSE Reports"]} />
        </div> */}

        {/* Header Section */}
        <div className="mt-6">
          <Card className="shadow-sm border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Title & Count */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Shield className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    HSE Reports
                  </h1>
                  <p className="text-sm text-gray-600">
                    {searchTerm
                      ? `${reportsCount} of ${totalReports} reports`
                      : `${totalReports} ${
                          totalReports === 1 ? "report" : "reports"
                        } total`}
                  </p>
                </div>
              </div>

              {/* Desktop Actions */}
              <div className="hidden md:flex items-center gap-3">
                {/* Export Button */}
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white border-0 shadow-sm text-sm"
                  onClick={() => exportToCSV(filteredReports, "hse-report.csv")}
                  disabled={totalReports === 0}
                >
                  <Download size={16} />
                  <span>Export ({totalReports})</span>
                </Button>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all w-64"
                    placeholder="Search reports..."
                    value={searchTerm}
                  />
                </div>

                {/* Add Report Button */}
                <PermissionAwareButton
                  permission="hse:create"
                  onClick={() => navigate("/dashboard/hse-reports/add-report")}
                  className="bg-red-600 hover:bg-red-700 text-white border-0 shadow-sm text-sm"
                >
                  <Plus size={16} />
                  <span>Add Report</span>
                </PermissionAwareButton>
              </div>

              {/* Mobile Actions */}
              <div className="md:hidden space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Search reports..."
                    value={searchTerm}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white border-0 shadow-sm text-sm"
                    onClick={() =>
                      exportToCSV(filteredReports, "hse-report.csv")
                    }
                    disabled={totalReports === 0}
                  >
                    <Download size={16} />
                    <span>Export</span>
                  </Button>

                  <PermissionAwareButton
                    permission="hse:create"
                    onClick={() =>
                      navigate("/dashboard/hse-reports/add-report")
                    }
                    className="bg-red-600 hover:bg-red-700 text-white border-0 shadow-sm text-sm"
                  >
                    <Plus size={16} />
                    <span>Add Report</span>
                  </PermissionAwareButton>
                </div>
              </div>
            </div>

            {/* Active Search Display */}
            {searchTerm && (
              <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-600 font-medium">
                  Searching:
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-md text-sm">
                  "{searchTerm}"
                  <button
                    onClick={clearSearch}
                    className="hover:bg-red-200 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </span>
                {reportsCount === 0 && (
                  <span className="text-sm text-gray-500">
                    No reports found matching your search
                  </span>
                )}
              </div>
            )}
          </Card>
        </div>

        {/* Table */}
        <div className="mt-6 pb-8">
          <DashboardTable
            columns={columns}
            data={filteredReports || []}
            isFetching={isFetching}
            type="hse-reports"
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
          whatForm={"hse-reports"}
        />
      </Container>
    </div>
  );
}

export default HSEReports;
