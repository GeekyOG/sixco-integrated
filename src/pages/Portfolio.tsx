import React, { useEffect, useState } from "react";
import Container from "../ui/Container";
import { ArrowRight, Search } from "lucide-react";
import DashboardTable from "../components/dashboard/DashboardTable";
import { columns } from "../modules/portfolio/columns";
import DashboardDrawer from "../components/dashboard/Drawer";
import Button from "../ui/Button";
import { useLazyGetAllPortfolioQuery } from "../api/portfolio";
import BreadCrumb from "../ui/BreadCrumb";

function Portfolio() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const handleAddPortfolio = () => {
    setDrawerOpen(true);
  };

  const [getAllPortfolio, { isFetching, data }] = useLazyGetAllPortfolioQuery();

  useEffect(() => {
    getAllPortfolio("");
  }, []);

  const handleGetPortfolio = () => {
    getAllPortfolio("");
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
                All PROJECTS ({data?.pagination.totalItems ?? 0})
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
              Add Project
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
          data={data?.projects || []}
          isFetching={isFetching}
          type="Portfolio"
          callBackAction={handleGetPortfolio}
        />
      </div>
      <DashboardDrawer
        callBackAction={handleGetPortfolio}
        open={drawerOpen}
        setOpen={setDrawerOpen}
        whatForm={"Portfolio"}
      />
    </Container>
  );
}

export default Portfolio;
