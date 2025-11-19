import { useEffect, useState } from "react";
import DashboardTable from "../components/dashboard/DashboardTable";
import Container from "../ui/Container";
import Button from "../ui/Button";
import AddUser from "../modules/users/AddUser";
import { exportToCSV } from "../utils/export";
import {
  Download,
  ListFilter,
  Search,
  Plus,
  Calendar,
  X,
  UserCircle,
} from "lucide-react";
import { useLazyGetAllClientsQuery } from "../api/clientApi";
import { clientsColumns } from "../modules/clients/columns";
import BreadCrumb from "../ui/BreadCrumb";
import { DatePicker, Popover, Card } from "antd";
import { handleExportCSV } from "../utils/export";
import { format } from "date-fns";
import PermissionAwareButton from "../components/PermissionAwareButton";

function Users() {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const showDrawer = () => {
    setOpen(!open);
  };

  const [getAllClients, { data: clientsData, isFetching }] =
    useLazyGetAllClientsQuery();

  useEffect(() => {
    getAllClients({
      currentPage: page,
      email: searchTerm,
      startDate,
      endDate,
    });
  }, [page, searchTerm, startDate, endDate]);

  const handleGetClients = () => {
    getAllClients({
      currentPage: page,
    });
    setOpen(false);
  };

  const onChange = (date: any, type: string) => {
    console.log(date);

    if (type === "start") {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
  };

  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
    setSearchTerm("");
  };

  const hasActiveFilters = searchTerm || startDate || endDate;
  const clientCount = clientsData?.pagination.totalItems ?? 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Container>
        {/* Breadcrumb */}
        <div className="pt-6">
          <BreadCrumb data={["Dashboard", "Clients"]} />
        </div>

        {/* Header Section */}
        <div className="mt-6">
          <Card className="shadow-sm border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Title & Count */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <UserCircle className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
                  <p className="text-sm text-gray-600">
                    {clientCount} {clientCount === 1 ? "client" : "clients"}{" "}
                    total
                  </p>
                </div>
              </div>

              {/* Desktop Actions */}
              <div className="hidden lg:flex items-center gap-3">
                {/* Date Filter */}
                <Popover
                  content={
                    <div className="w-64 space-y-3 p-2">
                      <div>
                        <label className="text-xs font-medium text-gray-700 mb-1 block">
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
                        <label className="text-xs font-medium text-gray-700 mb-1 block">
                          End Date
                        </label>
                        <DatePicker
                          onChange={(date) => onChange(date, "end")}
                          placeholder="Select end date"
                          className="w-full"
                          value={endDate ? (endDate as any) : null}
                        />
                      </div>
                      {(startDate || endDate) && (
                        <Button
                          onClick={clearFilters}
                          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 border-0 text-sm"
                        >
                          <X size={14} />
                          Clear Dates
                        </Button>
                      )}
                    </div>
                  }
                  title={
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Filter by Date</span>
                    </div>
                  }
                  trigger="click"
                  placement="bottomLeft"
                >
                  <Button
                    className={`bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm text-sm ${
                      (startDate || endDate) && "border-purple-500 bg-purple-50"
                    }`}
                  >
                    <ListFilter size={16} />
                    <span>
                      {startDate || endDate ? "Filtered" : "Filter by Date"}
                    </span>
                  </Button>
                </Popover>

                {/* Export Button */}
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white border-0 shadow-sm text-sm"
                  onClick={() =>
                    exportToCSV(clientsData?.clients, "clients.csv")
                  }
                  disabled={clientCount === 0}
                >
                  <Download size={16} />
                  <span>Export ({clientCount})</span>
                </Button>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all w-64"
                    placeholder="Search by email..."
                    value={searchTerm}
                  />
                </div>

                {/* Add Client Button */}
                <PermissionAwareButton
                  permission="client:create"
                  onClick={showDrawer}
                  className="bg-purple-600 hover:bg-purple-700 text-white border-0 shadow-sm text-sm"
                >
                  <Plus size={16} />
                  <span>New Client</span>
                </PermissionAwareButton>
              </div>

              {/* Mobile Actions */}
              <div className="lg:hidden space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Search by email..."
                    value={searchTerm}
                  />
                </div>

                <div className="flex gap-2">
                  <Popover
                    content={
                      <div className="w-64 space-y-3 p-2">
                        <div>
                          <label className="text-xs font-medium text-gray-700 mb-1 block">
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
                          <label className="text-xs font-medium text-gray-700 mb-1 block">
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
                      exportToCSV(clientsData?.clients, "clients.csv")
                    }
                    disabled={clientCount === 0}
                  >
                    <Download size={16} />
                    <span>Export</span>
                  </Button>

                  <Button
                    onClick={showDrawer}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white border-0 shadow-sm text-sm"
                  >
                    <Plus size={16} />
                    <span>Add</span>
                  </Button>
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
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 rounded-md text-sm">
                    Search: "{searchTerm}"
                    <button
                      onClick={() => setSearchTerm("")}
                      className="hover:bg-purple-200 rounded-full p-0.5"
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
                  className="text-sm text-purple-600 hover:text-purple-800 font-medium ml-auto"
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
            columns={clientsColumns}
            data={clientsData?.clients ?? []}
            type="client"
            isFetching={isFetching}
            callBackAction={handleGetClients}
            page={page}
            setPage={setPage}
            totalPages={clientsData?.pagination?.totalPages}
          />
        </div>

        {/* Add Client Drawer */}
        <AddUser
          open={open}
          setShowDrawer={setOpen}
          callBackAction={handleGetClients}
        />
      </Container>
    </div>
  );
}

export default Users;
