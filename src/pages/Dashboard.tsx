import { useEffect, useState } from "react";
import DashboardBox from "../ui/dashboard/DashboardBox";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  UserCircle,
  Plus,
  TrendingUp,
  Calendar,
} from "lucide-react";
import DashboardTable from "../components/dashboard/DashboardTable";
import { columns } from "../modules/portfolio/columns";
import { useLazyGetAllPortfolioQuery } from "../api/portfolio";
import DashboardDrawer from "../components/dashboard/Drawer";
import AddUser from "../modules/users/AddUser";
import { useLazyGetAllClientsQuery } from "../api/clientApi";
import { clientsColumns } from "../modules/clients/columns";
import { format } from "date-fns";
import { Card } from "antd";
import Container from "../ui/Container";
import Button from "../ui/Button";

function Dashboard() {
  const [getClients, { data: clientsData, isFetching: clientsFetching }] =
    useLazyGetAllClientsQuery();

  const [getAllPortfolio, { data: portfolioData, isFetching }] =
    useLazyGetAllPortfolioQuery();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [whatForm, setWhatForm] = useState("");
  const [openAddCustomers, setOpenAddCustomers] = useState(false);

  useEffect(() => {
    getAllPortfolio("");
    getClients("");
  }, []);

  const handleGetOverview = () => {
    setDrawerOpen(false);
    getAllPortfolio("");
  };

  const handleGetPortfolio = () => {
    getAllPortfolio("");
    setDrawerOpen(false);
  };

  const handleGetClients = () => {
    setDrawerOpen(false);
    getClients("");
  };

  const handleAddPortfolio = () => {
    setDrawerOpen(true);
    setWhatForm("Portfolio");
  };

  const formattedDate = format(new Date(), "EEEE, MMMM do, yyyy");
  const userDataRaw = localStorage.getItem("userData");
  const userData = userDataRaw ? JSON.parse(userDataRaw) : null;

  function getGreeting() {
    const now = new Date();
    const hour = now.getHours();

    if (hour < 12) {
      return "Good Morning";
    } else if (hour < 18) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  }

  const totalProjects = portfolioData?.pagination?.totalItems ?? 0;
  const completedProjects =
    portfolioData?.projects?.filter((p: any) => p.status === "Done")?.length ??
    0;
  const totalClients = clientsData?.pagination?.totalItems ?? 0;
  const inProgressProjects =
    portfolioData?.projects?.filter((p: any) => p.status === "In Progress")
      ?.length ?? 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Container>
        {/* Welcome Section */}
        <div className="pt-6 pb-8">
          <Card className="shadow-sm border-gray-200 bg-gradient-to-br from-green-100 to-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <p className="text-sm text-green-600 font-medium">
                    {formattedDate}
                  </p>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  {getGreeting()},{" "}
                  <span className="capitalize text-green-600">
                    {userData?.firstName || "User"}
                  </span>
                </h1>
                <p className="text-gray-600 mt-2">
                  Welcome back! Here's what's happening today.
                </p>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={handleAddPortfolio}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white border-0 shadow-sm text-sm"
                >
                  <Plus size={16} />
                  <span>New Project</span>
                </Button>
                <Button
                  onClick={() => setOpenAddCustomers(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white border-0 shadow-sm text-sm"
                >
                  <Plus size={16} />
                  <span>New Client</span>
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Projects */}
          <Card className="shadow-sm border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600 font-medium mb-1">
                  Total Projects
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {totalProjects}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-green-600 font-medium">
                    Active portfolio
                  </span>
                </div>
              </div>
              <div className="p-3 bg-indigo-50 rounded-lg">
                <Briefcase className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </Card>

          {/* Completed Projects */}
          <Card className="shadow-sm border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600 font-medium mb-1">
                  Completed Projects
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {completedProjects}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-xs text-gray-500">
                    {totalProjects > 0
                      ? `${Math.round(
                          (completedProjects / totalProjects) * 100
                        )}% completion rate`
                      : "No projects yet"}
                  </span>
                </div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          {/* In Progress */}
          <Card className="shadow-sm border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600 font-medium mb-1">
                  In Progress
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {inProgressProjects}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-xs text-blue-600 font-medium">
                    Currently active
                  </span>
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          {/* Total Clients */}
          <Card className="shadow-sm border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600 font-medium mb-1">
                  Clients & Partners
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {totalClients}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-xs text-purple-600 font-medium">
                    Active relationships
                  </span>
                </div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <UserCircle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Recently Added Projects */}
        <div className="mb-8">
          <Card className="shadow-sm border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <Briefcase className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Recently Added Projects
                  </h2>
                  <p className="text-sm text-gray-600">
                    Your latest project additions
                  </p>
                </div>
              </div>

              <Link
                to="/dashboard/projects"
                className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium text-sm transition-colors group"
              >
                <span>View all</span>
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>

            <DashboardTable
              columns={columns}
              data={portfolioData?.projects?.slice(0, 5) ?? []}
              isFetching={isFetching}
              type="Portfolio"
              callBackAction={handleGetOverview}
              hidePagination
            />

            {/* Empty State */}
            {!isFetching && portfolioData?.projects?.length === 0 && (
              <div className="text-center py-12">
                <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 font-medium mb-2">
                  No projects yet
                </p>
                <p className="text-sm text-gray-400 mb-4">
                  Get started by creating your first project
                </p>
                <Button
                  onClick={handleAddPortfolio}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white border-0 shadow-sm text-sm"
                >
                  <Plus size={16} />
                  <span>Create Project</span>
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Recently Added Clients */}
        <div className="pb-8">
          <Card className="shadow-sm border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <UserCircle className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Recently Added Clients & Partners
                  </h2>
                  <p className="text-sm text-gray-600">
                    Your newest client relationships
                  </p>
                </div>
              </div>

              <Link
                to="/dashboard/users"
                className="flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors group"
              >
                <span>View all</span>
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>

            <DashboardTable
              columns={clientsColumns}
              data={clientsData?.clients?.slice(0, 5) ?? []}
              isFetching={clientsFetching}
              type="client"
              callBackAction={handleGetClients}
              hidePagination
            />

            {/* Empty State */}
            {!clientsFetching && clientsData?.clients?.length === 0 && (
              <div className="text-center py-12">
                <UserCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 font-medium mb-2">No clients yet</p>
                <p className="text-sm text-gray-400 mb-4">
                  Add your first client to get started
                </p>
                <Button
                  onClick={() => setOpenAddCustomers(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white border-0 shadow-sm text-sm"
                >
                  <Plus size={16} />
                  <span>Add Client</span>
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Modals */}
        <DashboardDrawer
          callBackAction={handleGetPortfolio}
          open={drawerOpen}
          setOpen={setDrawerOpen}
          whatForm={whatForm}
        />

        <AddUser
          open={openAddCustomers}
          setShowDrawer={setOpenAddCustomers}
          callBackAction={handleGetClients}
        />
      </Container>
    </div>
  );
}

export default Dashboard;
