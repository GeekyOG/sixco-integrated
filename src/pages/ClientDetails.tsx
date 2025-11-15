import { useEffect, useState } from "react";
import {
  useGetClientsQuery,
  useLazyGetClientProjectQuery,
} from "../api/clientApi";
import { useParams } from "react-router-dom";
import Container from "../ui/Container";
import {
  Search,
  Mail,
  Phone,
  User,
  UserCircle,
  Briefcase,
  Building2,
} from "lucide-react";
import DashboardTable from "../components/dashboard/DashboardTable";
import { columns } from "../modules/portfolio/columns";
import { Card } from "antd";

function ClientDetails() {
  const { id } = useParams();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const { data } = useGetClientsQuery(id);
  const [getClient, { data: projectsData, isFetching }] =
    useLazyGetClientProjectQuery();

  useEffect(() => {
    getClient({ id, args: { projectName: searchTerm, currentPage: page } });
  }, [id, page, searchTerm]);

  const projectCount = projectsData?.projects?.length || 0;
  const clientName = data?.client
    ? `${data.client.firstName} ${data.client.lastName}`
    : "Loading...";
  const initials = data?.client
    ? `${data.client.firstName?.charAt(0) || ""}${
        data.client.lastName?.charAt(0) || ""
      }`
    : "CL";

  return (
    <div className="min-h-screen bg-gray-50">
      <Container>
        {/* Header Section */}
        <div className="pt-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl lg:text-3xl font-bold shadow-lg">
                  {initials.toUpperCase()}
                </div>
              </div>

              {/* Client Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                    {clientName}
                  </h1>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    Client
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
                        {data?.client?.email || "--"}
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
                        {data?.client?.phoneNumber || "--"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="flex flex-wrap gap-3 mt-4">
                  <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-lg">
                    <Briefcase className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {projectCount} Project{projectCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                  {data?.client?.approvalStatus && (
                    <div
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                        data.client.approvalStatus === "approved"
                          ? "bg-green-50"
                          : data.client.approvalStatus === "pending"
                          ? "bg-yellow-50"
                          : "bg-red-50"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          data.client.approvalStatus === "approved"
                            ? "bg-green-600"
                            : data.client.approvalStatus === "pending"
                            ? "bg-yellow-600"
                            : "bg-red-600"
                        }`}
                      />
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {data.client.approvalStatus}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="mt-6 pb-8">
          <Card className="shadow-sm border-gray-200">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-purple-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Client Projects
                  </h2>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {projectCount}
                  </span>
                </div>

                {/* Desktop Search */}
                <div className="hidden sm:block">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all w-64"
                      placeholder="Search by project name..."
                      value={searchTerm}
                    />
                  </div>
                </div>
              </div>

              {/* Mobile Search */}
              <div className="sm:hidden">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Search by project name..."
                    value={searchTerm}
                  />
                </div>
              </div>

              {/* Active Search Display */}
              {searchTerm && (
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-200">
                  <span className="text-sm text-gray-600 font-medium">
                    Searching:
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 rounded-md text-sm">
                    "{searchTerm}"
                    <button
                      onClick={() => setSearchTerm("")}
                      className="hover:bg-purple-200 rounded-full p-0.5"
                    >
                      ×
                    </button>
                  </span>
                </div>
              )}

              {/* Table */}
              <DashboardTable
                columns={columns}
                data={projectsData?.projects || []}
                isFetching={isFetching}
                targetId={id}
                remove
                removeAction="project"
                type={"Portfolio"}
                callBackAction={() => {
                  getClient({
                    id,
                    args: { projectName: searchTerm, currentPage: page },
                  });
                }}
                hidePagination
                page={page}
                setPage={setPage}
                totalPages={projectsData?.pagination?.totalPages}
              />

              {/* Empty State */}
              {!isFetching && projectCount === 0 && (
                <div className="text-center py-12">
                  <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">No projects found</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {searchTerm
                      ? "Try adjusting your search"
                      : "This client hasn't been assigned to any projects yet"}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
}

export default ClientDetails;
