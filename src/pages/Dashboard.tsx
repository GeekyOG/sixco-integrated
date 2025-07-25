import { useEffect, useState } from "react";
import DashboardBox from "../ui/dashboard/DashboardBox";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import DashboardTable from "../components/dashboard/DashboardTable";
import { columns } from "../modules/portfolio/columns";
import { useLazyGetAllPortfolioQuery } from "../api/portfolio";
import DashboardDrawer from "../components/dashboard/Drawer";
import AddUser from "../modules/users/AddUser";
import { useLazyGetAllClientsQuery } from "../api/clientApi";
import { clientsColumns } from "../modules/clients/columns";

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

  const handleGetClients = () => {
    setDrawerOpen(false);
    getClients("");
  };

  const handleAddPortfolio = () => {
    setOpenAddCustomers(true);
    setWhatForm("Portfolio");
  };

  return (
    <div className="pb-[200px]">
      <h1 className="font-[600] text-[1.25rem]">Welcome !</h1>
      <p>Get Started Managing projects.</p>
      <div className="flex gap-3 mt-5 flex-col md:flex-row">
        <DashboardBox
          title={"Total Projects"}
          value={portfolioData?.pagination?.totalItems ?? 0}
          handleClick={handleAddPortfolio}
        />
        <DashboardBox
          title={"Total Completed Projects"}
          value={0}
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
          callBackAction={handleGetClients}
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
