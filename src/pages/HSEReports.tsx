import { useEffect, useState } from "react";
import Container from "../ui/Container";
import { Search } from "lucide-react";
import DashboardTable from "../components/dashboard/DashboardTable";
import { columns } from "../modules/portfolio/columns";
import DashboardDrawer from "../components/dashboard/Drawer";
import Button from "../ui/Button";
import BreadCrumb from "../ui/BreadCrumb";
import { useLazyGetAllReportQuery } from "../api/reportsApi";
import { useNavigate } from "react-router-dom";

function HSEReports() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const handleAddPortfolio = () => {
    setDrawerOpen(true);
  };

  const [page, setPage] = useState(1);

  const [getALLReports, { isFetching, data }] = useLazyGetAllReportQuery();

  useEffect(() => {
    getALLReports("");
  }, []);

  const handleGetPortfolio = () => {
    getALLReports("");
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
                All Reports ({data?.pagination.totalItems ?? 0})
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
              onClick={() => navigate("/dashboard/HSE-reports/add-report")}
              className="flex h-[36px] items-center"
            >
              Add Report
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
          data={data?.reports || []}
          isFetching={isFetching}
          type="reports"
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
        whatForm={"reports"}
      />
    </Container>
  );
}

export default HSEReports;
