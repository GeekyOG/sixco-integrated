import React, { useEffect, useState } from "react";
import DashboardTable from "../components/dashboard/DashboardTable";
import Container from "../ui/Container";
import Button from "../ui/Button";
import { Search, Plus, Users, Download, X } from "lucide-react";
import BreadCrumb from "../ui/BreadCrumb";
import { useLazyGetAllTeamQuery } from "../api/teamsApi";
import DashboardDrawer from "../components/dashboard/Drawer";
import { columns } from "../modules/teams/columns";
import { Card } from "antd";
import { handleExportCSV } from "../utils/export";
import { format } from "date-fns";

function Teams() {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const [getAllTeams, { data: teamsData, isFetching }] =
    useLazyGetAllTeamQuery();

  useEffect(() => {
    getAllTeams({
      search: searchTerm,
      currentPage: page,
    });
  }, [page, searchTerm]);

  const showDrawer = () => {
    setOpen(!open);
  };

  const handleGetTeams = () => {
    getAllTeams({
      search: searchTerm,
      currentPage: page,
    });
    setOpen(false);
  };

  // Filter teams based on search term
  const filteredTeams = teamsData?.teams?.filter((team: any) => {
    if (!searchTerm) return true;
    return (
      team.teamName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const teamsCount = filteredTeams?.length || 0;
  const totalTeams = teamsData?.teams?.length || 0;

  // Enhanced export function with actual teams data
  const handleExportTeams = () => {
    if (!teamsData?.teams || teamsData.teams.length === 0) {
      alert("No data available to export");
      return;
    }

    // Transform the data for CSV export
    const exportData = teamsData.teams.map((team: any) => ({
      "Team Name": team.teamName || "",
      Description: team.description || "",
      "Member Count": team.users?.length || 0,
      Members: team.users
        ? team.users
            .map((u: any) => `${u.firstName || ""} ${u.lastName || ""}`.trim())
            .join("; ")
        : "",
      "Project Count": team.projects?.length || 0,
      Projects: team.projects
        ? team.projects.map((p: any) => p.name || "").join("; ")
        : "",
      Status: team.status || "Active",
      "Created At": team.createdAt
        ? format(new Date(team.createdAt), "yyyy-MM-dd HH:mm:ss")
        : "",
    }));

    // Generate filename with timestamp
    const timestamp = format(new Date(), "yyyy-MM-dd_HHmmss");
    const fileName = `teams_export_${timestamp}.csv`;

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
          <BreadCrumb data={["Dashboard", "Teams"]} />
        </div>

        {/* Header Section */}
        <div className="mt-6">
          <Card className="shadow-sm border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Title & Count */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Teams</h1>
                  <p className="text-sm text-gray-600">
                    {searchTerm
                      ? `${teamsCount} of ${totalTeams} teams`
                      : `${totalTeams} ${
                          totalTeams === 1 ? "team" : "teams"
                        } total`}
                  </p>
                </div>
              </div>

              {/* Desktop Actions */}
              <div className="hidden md:flex items-center gap-3">
                {/* Export Button */}
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white border-0 shadow-sm text-sm"
                  onClick={handleExportTeams}
                  disabled={totalTeams === 0}
                >
                  <Download size={16} />
                  <span>Export ({totalTeams})</span>
                </Button>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all w-64"
                    placeholder="Search teams..."
                    value={searchTerm}
                  />
                </div>

                {/* Add Team Button */}
                <Button
                  onClick={showDrawer}
                  className="bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-sm text-sm"
                >
                  <Plus size={16} />
                  <span>Add Team</span>
                </Button>
              </div>

              {/* Mobile Actions */}
              <div className="md:hidden space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Search teams..."
                    value={searchTerm}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white border-0 shadow-sm text-sm"
                    onClick={handleExportTeams}
                    disabled={totalTeams === 0}
                  >
                    <Download size={16} />
                    <span>Export</span>
                  </Button>

                  <Button
                    onClick={showDrawer}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-sm text-sm"
                  >
                    <Plus size={16} />
                    <span>Add Team</span>
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
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">
                  "{searchTerm}"
                  <button
                    onClick={clearSearch}
                    className="hover:bg-blue-200 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </span>
                {teamsCount === 0 && (
                  <span className="text-sm text-gray-500">
                    No teams found matching your search
                  </span>
                )}
              </div>
            )}
          </Card>
        </div>

        {/* Stats Cards */}
        {!searchTerm && teamsData?.teams && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="shadow-sm border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalTeams}
                  </p>
                  <p className="text-sm text-gray-600">Total Teams</p>
                </div>
              </div>
            </Card>

            <Card className="shadow-sm border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-50 rounded-lg">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {teamsData.teams.reduce(
                      (sum: number, team: any) =>
                        sum + (team.users?.length || 0),
                      0
                    )}
                  </p>
                  <p className="text-sm text-gray-600">Total Members</p>
                </div>
              </div>
            </Card>

            <Card className="shadow-sm border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {teamsData.teams.reduce(
                      (sum: number, team: any) =>
                        sum + (team.projects?.length || 0),
                      0
                    )}
                  </p>
                  <p className="text-sm text-gray-600">Total Projects</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Table */}
        <div className="mt-6 pb-8">
          <DashboardTable
            columns={columns}
            data={filteredTeams || []}
            type="teams"
            isFetching={isFetching}
            page={page}
            callBackAction={handleGetTeams}
            setPage={setPage}
            totalPages={teamsData?.pagination?.totalPages}
          />
        </div>

        {/* Drawer */}
        <DashboardDrawer
          callBackAction={handleGetTeams}
          open={open}
          setOpen={setOpen}
          whatForm={"teams"}
        />
      </Container>
    </div>
  );
}

export default Teams;
