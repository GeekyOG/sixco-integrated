import { useEffect, useState } from "react";
import Container from "../ui/Container";
import { Search } from "lucide-react";
import DashboardTable from "../components/dashboard/DashboardTable";
import DashboardDrawer from "../components/dashboard/Drawer";
import Button from "../ui/Button";
import BreadCrumb from "../ui/BreadCrumb";
import { useLazyGetAllLeaveQuery } from "../api/leaveApi";
import { columns } from "../modules/leaves/columns";

function Leaves() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const handleAddPortfolio = () => {
    setDrawerOpen(true);
  };
  const [page, setPage] = useState(1);

  const [getAllLeave, { isFetching, data }] = useLazyGetAllLeaveQuery();

  useEffect(() => {
    getAllLeave({
      currentPage: page,
    });
  }, [page]);

  const handleGetPortfolio = () => {
    getAllLeave({
      currentPage: page,
    });
    setDrawerOpen(false);
  };

  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Container className="pb-[200px]">
      <BreadCrumb data={["Dashboard", "Manage Leaves"]} />
      <div>
        <div className="flex items-center justify-between">
          <div className="flex">
            <div className="border-[1px] px-[15px] py-[8px]">
              <p className="font-[600]">
                Leave Requests ({data?.pagination.totalItems ?? 0})
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
              onClick={handleAddPortfolio}
              className="flex h-[36px] items-center"
            >
              Request Leave
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
      </div>
      <div>
        <DashboardTable
          columns={columns}
          data={data?.leaves || []}
          isFetching={isFetching}
          type="Leave"
          callBackAction={handleGetPortfolio}
          page={page}
          setPage={setPage}
          totalPages={data?.pagination.totalPages}
        />
      </div>
      <DashboardDrawer
        callBackAction={handleGetPortfolio}
        open={drawerOpen}
        setOpen={setDrawerOpen}
        whatForm={"Leave"}
      />
    </Container>
  );
}

export default Leaves;
