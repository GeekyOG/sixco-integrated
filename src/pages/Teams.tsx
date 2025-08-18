import React, { useEffect, useMemo, useState } from "react";
import DashboardTable from "../components/dashboard/DashboardTable";
import Container from "../ui/Container";
import Button from "../ui/Button";
import AddUser from "../modules/users/AddUser";
import { Search } from "lucide-react";
import { useGetAllClientsQuery } from "../api/clientApi";
import BreadCrumb from "../ui/BreadCrumb";
import { useGetAllUsersQuery } from "../api/authApi";
import AddStaff from "../modules/users/AddStaff";
import { useGetAllTeamQuery, useLazyGetAllTeamQuery } from "../api/teamsApi";
import DashboardDrawer from "../components/dashboard/Drawer";
import { columns } from "../modules/teams/columns";

function Teams() {
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(!open);
  };

  const [page, setPage] = useState(1);

  const [getAllTeams, { data: teamsData, isFetching }] =
    useLazyGetAllTeamQuery();

  useEffect(() => {
    getAllTeams({
      currentPage: page,
    });
  }, [page]);

  const handleGetTeams = () => {
    getAllTeams({
      currentPage: page,
    });
    setOpen(false);
  };

  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div>
      <div>
        <Container>
          <BreadCrumb data={["Dashboard", "Teams"]} />
          <div className="flex items-center justify-between">
            <div className="flex">
              <div className="border-[1px] px-[15px] py-[8px] flex gap-2">
                <p className="font-[600]">
                  All Teams ({teamsData?.pagination.totalItems ?? 0})
                </p>
              </div>
            </div>

            <div className="mb-[3px] flex items-center gap-[8px]">
              <div className="md:flex hidden cursor-pointer items-center gap-[3px] border-b-[1px] px-[8px] py-[8px] ">
                <Search size={16} className="text-neutral-300" />
                <input
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className=" py-[2px] text-[0.865rem]"
                  placeholder="Search by email..."
                />
              </div>
              <Button
                onClick={showDrawer}
                className="flex h-[36px] items-center"
              >
                Add Team
              </Button>
            </div>
          </div>

          <div className="flex md:hidden cursor-pointer items-center gap-[3px] border-[1px] px-[8px] py-[8px] my-3">
            <Search size={16} className="text-neutral-300" />
            <input
              onChange={(e) => setSearchTerm(e.target.value)}
              className=" py-[2px] text-[0.865rem]"
              placeholder="Search by email..."
            />
          </div>
        </Container>
      </div>
      <Container>
        <DashboardTable
          columns={columns}
          data={teamsData?.teams ?? []}
          type="teams"
          isFetching={isFetching}
          page={page}
          callBackAction={handleGetTeams}
          setPage={setPage}
          totalPages={teamsData?.pagination?.totalPages}
        />
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
