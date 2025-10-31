import { useEffect, useState } from "react";
import Container from "../ui/Container";
import { Search } from "lucide-react";
import DashboardTable from "../components/dashboard/DashboardTable";
import DashboardDrawer from "../components/dashboard/Drawer";
import Button from "../ui/Button";
import BreadCrumb from "../ui/BreadCrumb";
import { useLazyGetAllReportQuery } from "../api/reportsApi";
import { useLazyGetAllRoleQuery } from "../api/rolesApi";
import { columns } from "../modules/roles/columns";
import { Link } from "react-router-dom";

function RolesAndPermissions() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const handleAddPortfolio = () => {
    setDrawerOpen(true);
  };

  const [page, setPage] = useState(1);

  const [getALLRoles, { isFetching, data }] = useLazyGetAllRoleQuery();

  useEffect(() => {
    getALLRoles("");
  }, []);

  const handleGetPortfolio = () => {
    getALLRoles("");
    setDrawerOpen(false);
  };

  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Container className="pb-[200px]">
      <BreadCrumb data={["Dashboard", "Manage Projects"]} />
      <div>
        <div className="flex items-center justify-between">
          <div className="flex">
            <div className="border-[1px] px-[15px] py-[8px]">
              <p className="font-[600]">
                All Roles ({data?.roles.length ?? 0})
              </p>
            </div>
          </div>

          <div className="mb-[3px] flex items-center gap-[8px]">
            <div className="md:flex hidden cursor-pointer items-center gap-[3px] border-b-[1px] px-[8px] py-[8px] ">
              <Search size={16} className="text-neutral-300" />
              <input
                onChange={(e) => setSearchTerm(e.target.value)}
                className=" py-[2px] text-[0.865rem]"
                placeholder="Search roles"
              />
            </div>
            <Button className="flex h-[36px] items-center">
              <Link to="/dashboard/roles-permissions/add-role">Add Role</Link>
            </Button>
          </div>
        </div>

        <div className="flex md:hidden cursor-pointer items-center gap-[3px] border-[1px] px-[8px] py-[8px] my-3">
          <Search size={16} className="text-neutral-300" />
          <input
            onChange={(e) => setSearchTerm(e.target.value)}
            className=" py-[2px] text-[0.865rem]"
            placeholder="Search by roles"
          />
        </div>
      </div>
      <div>
        <DashboardTable
          columns={columns}
          data={data?.roles || []}
          isFetching={isFetching}
          type="roles"
          callBackAction={handleGetPortfolio}
          page={page}
          setPage={setPage}
          totalPages={data?.pagination?.totalPages}
        />
      </div>
      <DashboardDrawer
        callBackAction={handleGetPortfolio}
        open={drawerOpen}
        setOpen={setDrawerOpen}
        whatForm={"roles"}
      />
    </Container>
  );
}

export default RolesAndPermissions;
