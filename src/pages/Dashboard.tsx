import React, { useEffect, useState } from "react";
import DashboardBox from "../ui/dashboard/DashboardBox";
import Container from "../ui/Container";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import DashboardTable from "../components/dashboard/DashboardTable";
import { columns } from "../modules/portfolio/columns";
import Cookies from "js-cookie";

import {
  useGetOverviewQuery,
  useLazyGetOverviewQuery,
} from "../api/overviewApi";
import {
  useGetAllPortfolioQuery,
  useLazyGetAllPortfolioQuery,
} from "../api/portfolio";
import DashboardDrawer from "../components/dashboard/Drawer";
import { jwtDecode } from "jwt-decode";
import AddUser from "../modules/users/AddUser";
import { useGetAllClientsQuery } from "../api/clientApi";
import { clientsColumns } from "../modules/clients/columns";

function Dashboard() {
  const navigate = useNavigate();

  const [getOverview, { isFetching: overviewLoading, data: overviewData }] =
    useLazyGetOverviewQuery();

  const { data: clientsData, isFetching: clientsFetching } =
    useGetAllClientsQuery("");

  const [getAllPortfolio, { data: portfolioData, isFetching }] =
    useLazyGetAllPortfolioQuery();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [whatForm, setWhatForm] = useState("");
  const [openAddCustomers, setOpenAddCustomers] = useState(false);

  useEffect(() => {
    getAllPortfolio("");
    getOverview("");
  }, []);

  const handleGetOverview = () => {
    setDrawerOpen(false);
    getOverview("");
    getAllPortfolio("");
  };

  const handleAddPortfolio = () => {
    setDrawerOpen(true);
    setWhatForm("Portfolio");
  };

  return (
    <div className="pb-[200px]">
      <h1 className="font-[600] text-[1.25rem]">Welcome Oghomena!</h1>
      <div className="flex gap-3 mt-5 flex-col md:flex-row">
        <DashboardBox
          title={"Total Projects"}
          value={portfolioData?.pagination?.totalItems ?? 0}
          handleClick={handleAddPortfolio}
        />
        <DashboardBox
          title={"Total Completed Projects"}
          value={overviewData?.portfolios ?? 0}
          handleClick={handleAddPortfolio}
        />
        <DashboardBox
          title={"Total Clients & Partners"}
          value={clientsData?.pagination?.totalItems ?? 0}
          handleClick={() => setOpenAddCustomers(!openAddCustomers)}
        />
      </div>
      <div className="mt-[26px]">
        <div className="flex items-center justify-between text-[0.895rem] font-[500]">
          <p className="text-[0.865rem] font-[600]">Recently Added Projects</p>

          <div className="flex cursor-pointer items-center mt-3">
            <Link
              to="/dashboard/projects"
              className="font-[300] text-[#3b761e]"
            >
              View all
            </Link>
            <ArrowRight size={16} className="text-[#3b761e]" />
          </div>
        </div>

        <DashboardTable
          columns={columns}
          data={portfolioData?.projects ?? []}
          isFetching={isFetching}
          type="Portfolio"
          callBackAction={handleGetOverview}
        />
      </div>

      <div className="mt-[26px]">
        <div className="flex items-center justify-between text-[0.895rem] font-[500]">
          <p className="text-[0.865rem] font-[600]">
            Recently Added Clients & Partners
          </p>

          <div className="flex cursor-pointer items-center mt-3">
            <Link to="/dashboard/users" className="font-[300] text-[#3b761e]">
              View all
            </Link>
            <ArrowRight size={16} className="text-[#488e25]" />
          </div>
        </div>

        <DashboardTable
          columns={clientsColumns}
          data={clientsData?.clients ?? []}
          isFetching={clientsFetching}
          type="client"
          callBackAction={handleGetOverview}
        />
      </div>
      <DashboardDrawer
        callBackAction={handleGetOverview}
        open={drawerOpen}
        setOpen={setDrawerOpen}
        whatForm={whatForm}
      />

      <AddUser open={openAddCustomers} setShowDrawer={setOpenAddCustomers} />
    </div>
  );
}

export default Dashboard;
