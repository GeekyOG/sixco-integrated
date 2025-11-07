import React, { useEffect, useState } from "react";
import Container from "../ui/Container";
import { ArrowRight, Download, ListFilter, Search } from "lucide-react";
import DashboardTable from "../components/dashboard/DashboardTable";
import { columns } from "../modules/portfolio/columns";
import DashboardDrawer from "../components/dashboard/Drawer";
import Button from "../ui/Button";
import { useLazyGetAllPortfolioQuery } from "../api/portfolio";
import BreadCrumb from "../ui/BreadCrumb";
import { DatePicker, Popover } from "antd";
import { handleExportCSV } from "../utils/export";
import { cn } from "../utils/cn";

function Portfolio() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const handleAddPortfolio = () => {
    setDrawerOpen(true);
  };
  const [page, setPage] = useState(1);

  const [searchTerm, setSearchTerm] = useState("");
  const status = ["To Do", "In Progress", "Review", "Done"];

  const [statusFilter, setStatusFilter] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const onChange = (date: any, type: string) => {
    if (type === "start") {
      setStartDate(date ? date.toDate() : null);
    } else {
      setEndDate(date ? date.toDate() : null);
    }
  };

  const [getAllPortfolio, { isFetching, data }] = useLazyGetAllPortfolioQuery();

  useEffect(() => {
    getAllPortfolio({
      projectName: searchTerm,
      currentPage: page,
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
      ...(statusFilter && { status: statusFilter }),
    });
  }, [page, searchTerm, startDate, endDate, statusFilter]);

  const handleGetPortfolio = () => {
    getAllPortfolio("");
    setDrawerOpen(false);
  };

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
            <div className="lg:flex hidden cursor-pointer items-center gap-[3px]  px-[8px] py-[8px] my-3">
              <Popover
                content={
                  <>
                    <p>Filter by</p>
                    <div className="flex flex-col gap-3 px-[4px] py-[16px]">
                      <p>Status</p>
                      {status?.map((item) => (
                        <div
                          className="cursor-pointer border-b flex flex-col gap-2"
                          onClick={() => {
                            if (statusFilter == item) {
                              setStatusFilter("");
                            } else {
                              setStatusFilter(item);
                            }
                          }}
                        >
                          <p
                            className={cn(
                              "text-[0.865rem] font-[700]",
                              statusFilter == item && "text-green-550"
                            )}
                          >
                            {item}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col gap-3 px-[4px] py-[16px]">
                      <p>Date</p>
                      <DatePicker
                        onChange={(date) => onChange(date, "start")}
                        placeholder="Start Date"
                      />
                      <DatePicker
                        onChange={(date) => onChange(date, "end")}
                        placeholder="End Date"
                      />

                      <Button className="items-center gap-3 bg-[#093aa4] text-[0.865rem]">
                        Apply
                      </Button>
                    </div>
                  </>
                }
                title=""
                placement="bottomLeft"
                showArrow={false}
              >
                <div className="flex cursor-pointer items-center gap-[3px] rounded-md px-[8px] py-[8px] text-neutral-300 hover:text-[#093aa4]">
                  <ListFilter size={16} className="" />
                </div>
              </Popover>

              <Button
                className="flex items-center gap-3 bg-[#a40909] text-[0.865rem]  h-[36px]"
                onClick={() =>
                  handleExportCSV({ data: [], fileName: "sales.csv" })
                }
              >
                <p>Export</p>
                <Download size={16} />
              </Button>

              <div className="flex items-center border max-w-[300px] w-[100%] px-6 py-1 rounded-md">
                <Search size={16} className="text-neutral-300" />
                <input
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className=" py-[2px] text-[0.865rem]"
                  placeholder="Search by project name"
                />
              </div>
            </div>
            <Button
              onClick={handleAddPortfolio}
              className="flex h-[36px] items-center"
            >
              Add Project
            </Button>
          </div>
        </div>

        <div className="flex lg:hidden  cursor-pointer items-center gap-[3px]  px-[8px] py-[8px] my-3">
          <Popover
            content={
              <div className="flex flex-col gap-3 px-[4px] py-[16px]">
                <DatePicker
                  onChange={(date) => onChange(date, "start")}
                  placeholder="Start Date"
                />
                <DatePicker
                  onChange={(date) => onChange(date, "end")}
                  placeholder="End Date"
                />

                <Button className="items-center gap-3 bg-[#093aa4] text-[0.865rem]">
                  Apply
                </Button>
              </div>
            }
            title=""
            placement="bottomLeft"
            showArrow={false}
          >
            <div className="flex cursor-pointer items-center gap-[3px] rounded-md px-[8px] py-[8px] text-neutral-300 hover:text-[#093aa4]">
              <ListFilter size={16} className="" />
            </div>
          </Popover>

          <Button
            className="flex items-center gap-3 bg-[#a40909] text-[0.865rem]  h-[36px]"
            onClick={() => handleExportCSV({ data: [], fileName: "sales.csv" })}
          >
            <p>Export</p>
            <Download size={16} />
          </Button>

          <div className="flex items-center border max-w-[300px] w-[100%] px-6 py-1 rounded-md">
            <Search size={16} className="text-neutral-300" />
            <input
              onChange={(e) => setSearchTerm(e.target.value)}
              className=" py-[2px] text-[0.865rem]"
              placeholder="Search by project name"
            />
          </div>
        </div>
      </div>
      <div>
        <DashboardTable
          columns={columns}
          data={data?.projects || []}
          isFetching={isFetching}
          type="Portfolio"
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
        whatForm={"Portfolio"}
      />
    </Container>
  );
}

export default Portfolio;
