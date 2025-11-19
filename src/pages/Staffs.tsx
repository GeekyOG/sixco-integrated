import React, { useEffect, useState } from "react";
import DashboardTable from "../components/dashboard/DashboardTable";
import Container from "../ui/Container";
import Button from "../ui/Button";
import {
  Download,
  ListFilter,
  Search,
  Plus,
  Calendar,
  X,
  Users,
} from "lucide-react";
import { clientsColumns } from "../modules/clients/columns";
import BreadCrumb from "../ui/BreadCrumb";
import { useLazyGetAllUsersQuery } from "../api/authApi";
import AddStaff from "../modules/users/AddStaff";
import { DatePicker, Popover, Card } from "antd";
import { exportToCSV } from "../utils/export";
import { format } from "date-fns";
import PermissionAwareButton from "../components/PermissionAwareButton";

function Staffs() {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);

  const [getStaffs, { data: staffsData, isFetching }] =
    useLazyGetAllUsersQuery();

  useEffect(() => {
    getStaffs({
      currentPage: page,
      email: searchTerm,
      startDate,
      endDate,
    });
  }, [page, searchTerm, startDate, endDate]);

  const showDrawer = () => {
    setOpen(!open);
  };

  const handleGetStaffs = () => {
    getStaffs({
      currentPage: page,
    });
    setOpen(false);
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
    setSearchTerm("");
  };

  const hasActiveFilters = searchTerm || startDate || endDate;
  const staffCount = staffsData?.pagination.totalItems ?? 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Container>
        {/* Breadcrumb */}
        <div className="pt-6">
          <BreadCrumb data={["Dashboard", "Staff Members"]} />
        </div>

        {/* Header Section */}
        <div className="mt-6">
          <Card className="shadow-sm border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Title & Count */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Staff Members
                  </h1>
                  <p className="text-sm text-gray-600">
                    {staffCount} {staffCount === 1 ? "member" : "members"} total
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
                      (startDate || endDate) && "border-green-500 bg-green-50"
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
                  onClick={() => exportToCSV(staffsData?.users, "staffs.csv")}
                  disabled={staffCount === 0}
                >
                  <Download size={16} />
                  <span>Export ({staffCount})</span>
                </Button>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all w-64"
                    placeholder="Search by email..."
                    value={searchTerm}
                  />
                </div>

                {/* Add Staff Button */}
                <PermissionAwareButton
                  permission="user:create"
                  onClick={showDrawer}
                  className="bg-green-600 hover:bg-green-700 text-white border-0 shadow-sm text-sm"
                >
                  <Plus size={16} />
                  <span>Add Staff</span>
                </PermissionAwareButton>
              </div>

              {/* Mobile Actions */}
              <div className="lg:hidden space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                    onClick={() => exportToCSV(staffsData?.users, "staffs.csv")}
                    disabled={staffCount === 0}
                  >
                    <Download size={16} />
                    <span>Export</span>
                  </Button>

                  <PermissionAwareButton
                    permission="user:create"
                    onClick={showDrawer}
                    className="bg-green-600 hover:bg-green-700 text-white border-0 shadow-sm text-sm"
                  >
                    <Plus size={16} />
                    <span>Add</span>
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
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-md text-sm">
                    Search: "{searchTerm}"
                    <button
                      onClick={() => setSearchTerm("")}
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
                  className="text-sm text-green-600 hover:text-green-800 font-medium ml-auto"
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
            data={staffsData?.users ?? []}
            type="staff"
            isFetching={isFetching}
            page={page}
            setPage={setPage}
            totalPages={staffsData?.pagination?.totalPages}
          />
        </div>

        {/* Add Staff Drawer */}
        <AddStaff
          open={open}
          setShowDrawer={setOpen}
          callBackAction={handleGetStaffs}
        />
      </Container>
    </div>
  );
}

export default Staffs;
