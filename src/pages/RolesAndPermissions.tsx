import { useEffect, useState } from "react";
import Container from "../ui/Container";
import { Search, Plus, Shield, Download, X } from "lucide-react";
import DashboardTable from "../components/dashboard/DashboardTable";
import DashboardDrawer from "../components/dashboard/Drawer";
import Button from "../ui/Button";
import BreadCrumb from "../ui/BreadCrumb";
import {
  useGetAllPermissionsQuery,
  useLazyGetAllRoleQuery,
} from "../api/rolesApi";
import { columns } from "../modules/roles/columns";
import { Link } from "react-router-dom";
import { Card } from "antd";
import { handleExportCSV } from "../utils/export";
import { format } from "date-fns";
import PermissionAwareButton from "../components/PermissionAwareButton";

function RolesAndPermissions() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: permissions } = useGetAllPermissionsQuery("");

  const [getALLRoles, { isFetching, data }] = useLazyGetAllRoleQuery();

  useEffect(() => {
    getALLRoles("");
  }, []);

  const handleAddPortfolio = () => {
    setDrawerOpen(true);
  };

  const handleGetPortfolio = () => {
    getALLRoles("");
    setDrawerOpen(false);
  };

  // Filter roles based on search term
  const filteredRoles = data?.roles?.filter((role: any) => {
    if (!searchTerm) return true;
    return (
      role.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const rolesCount = filteredRoles?.length || 0;
  const totalRoles = data?.roles?.length || 0;

  // Enhanced export function with actual roles data
  const handleExportRoles = () => {
    if (!data?.roles || data.roles.length === 0) {
      alert("No data available to export");
      return;
    }

    // Transform the data for CSV export
    const exportData = data.roles.map((role: any) => ({
      "Role Name": role.name || "",
      Description: role.description || "",
      "Permission Count": role.permissions?.length || 0,
      Permissions: role.permissions
        ? role.permissions.map((p: any) => p.name || p).join("; ")
        : "",
      Status: role.status || "Active",
      "Created At": role.createdAt
        ? format(new Date(role.createdAt), "yyyy-MM-dd HH:mm:ss")
        : "",
    }));

    // Generate filename with timestamp
    const timestamp = format(new Date(), "yyyy-MM-dd_HHmmss");
    const fileName = `roles_permissions_export_${timestamp}.csv`;

    handleExportCSV({ data: exportData, fileName });
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Container>
        {/* Breadcrumb */}
        <div className="pt-6">
          <BreadCrumb data={["Dashboard", "Roles & Permissions"]} />
        </div>

        {/* Header Section */}
        <div className="mt-6">
          <Card className="shadow-sm border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Title & Count */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Shield className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Roles & Permissions
                  </h1>
                  <p className="text-sm text-gray-600">
                    {searchTerm
                      ? `${rolesCount} of ${totalRoles} roles`
                      : `${totalRoles} ${
                          totalRoles === 1 ? "role" : "roles"
                        } total`}
                  </p>
                </div>
              </div>

              {/* Desktop Actions */}
              <div className="hidden md:flex items-center gap-3">
                {/* Export Button */}
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white border-0 shadow-sm text-sm"
                  onClick={handleExportRoles}
                  disabled={totalRoles === 0}
                >
                  <Download size={16} />
                  <span>Export ({totalRoles})</span>
                </Button>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all w-64"
                    placeholder="Search roles..."
                    value={searchTerm}
                  />
                </div>

                {/* Add Role Button */}
                <Link to="/dashboard/roles-permissions/add-role">
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white border-0 shadow-sm text-sm">
                    <Plus size={16} />
                    <span>Add Role</span>
                  </Button>
                </Link>
              </div>

              {/* Mobile Actions */}
              <div className="md:hidden space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Search roles..."
                    value={searchTerm}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white border-0 shadow-sm text-sm"
                    onClick={handleExportRoles}
                    disabled={totalRoles === 0}
                  >
                    <Download size={16} />
                    <span>Export</span>
                  </Button>

                  <Link
                    to="/dashboard/roles-permissions/add-role"
                    className="flex-1"
                  >
                    <PermissionAwareButton
                      permission="role:create"
                      onClick={() => {}}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white border-0 shadow-sm text-sm"
                    >
                      <Plus size={16} />
                      <span>Add Role</span>
                    </PermissionAwareButton>
                  </Link>
                </div>
              </div>
            </div>

            {/* Active Search Display */}
            {searchTerm && (
              <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-600 font-medium">
                  Searching:
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-800 rounded-md text-sm">
                  "{searchTerm}"
                  <button
                    onClick={clearSearch}
                    className="hover:bg-indigo-200 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </span>
                {rolesCount === 0 && (
                  <span className="text-sm text-gray-500">
                    No roles found matching your search
                  </span>
                )}
              </div>
            )}
          </Card>
        </div>

        {/* Stats Cards */}
        {!searchTerm && data?.roles && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="shadow-sm border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <Shield className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalRoles}
                  </p>
                  <p className="text-sm text-gray-600">Total Roles</p>
                </div>
              </div>
            </Card>

            <Card className="shadow-sm border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-50 rounded-lg">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalRoles}
                  </p>
                  <p className="text-sm text-gray-600">Active Roles</p>
                </div>
              </div>
            </Card>

            <Card className="shadow-sm border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {permissions?.permissions.length || 0}
                  </p>
                  <p className="text-sm text-gray-600">Total Permissions</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Table */}
        <div className="mt-6 pb-8">
          <DashboardTable
            columns={columns}
            data={filteredRoles || []}
            isFetching={isFetching}
            type="roles"
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
          whatForm={"roles"}
        />
      </Container>
    </div>
  );
}

export default RolesAndPermissions;
