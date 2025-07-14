import React, { useEffect, useState } from "react";
import Container from "../ui/Container";
import DashboardTable from "../components/dashboard/DashboardTable";
import DashboardDrawer from "../components/dashboard/Drawer";
import Button from "../ui/Button";
import { useLazyGetAllWorkQuery } from "../api/imageApi";
import { columns } from "../modules/image/columns";

function Images() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const handleAddPortfolio = () => {
    setDrawerOpen(true);
  };

  const [getAllWork, { isFetching, data }] = useLazyGetAllWorkQuery();

  useEffect(() => {
    getAllWork("");
  }, []);

  const handleGetPortfolio = () => {
    getAllWork("");
    setDrawerOpen(false);
  };
  return (
    <Container className="pb-[200px]">
      <div className="mt-[26px]">
        <div className="flex items-center justify-between text-[0.895rem] font-[500]">
          <p className="text-[1.2rem] font-[400]">Images</p>

          <div className="flex cursor-pointer items-center mt-3">
            <Button onClick={handleAddPortfolio}>Add Image</Button>
          </div>
        </div>

        <DashboardTable
          columns={columns}
          data={data || []}
          isFetching={isFetching}
          type="image"
          callBackAction={handleGetPortfolio}
        />
      </div>
      <DashboardDrawer
        callBackAction={handleGetPortfolio}
        open={drawerOpen}
        setOpen={setDrawerOpen}
        whatForm={"image"}
      />
    </Container>
  );
}

export default Images;
