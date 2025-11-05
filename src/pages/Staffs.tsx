import React, { useEffect, useMemo, useState } from "react";
import DashboardTable from "../components/dashboard/DashboardTable";
import Container from "../ui/Container";
import Button from "../ui/Button";
import AddUser from "../modules/users/AddUser";
import { Download, ListFilter, Search } from "lucide-react";
import { useGetAllClientsQuery } from "../api/clientApi";
import { clientsColumns } from "../modules/clients/columns";
import BreadCrumb from "../ui/BreadCrumb";
import { useGetAllUsersQuery, useLazyGetAllUsersQuery } from "../api/authApi";
import AddStaff from "../modules/users/AddStaff";
import { DatePicker, Popover } from "antd";
import { handleExportCSV } from "../utils/export";

function Staffs() {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const onChange = (date: any, type: string) => {
    if (type === "start") {
      setStartDate(date ? date.toDate() : null);
    } else {
      setEndDate(date ? date.toDate() : null);
    }
  };

  const showDrawer = () => {
    setOpen(!open);
  };

  const [getStaffs, { data: clientsData, isFetching }] =
    useLazyGetAllUsersQuery();
  const [page, setPage] = useState(1);

  useEffect(() => {
    getStaffs({
      currentPage: page,
      email: searchTerm,
      startDate,
      endDate,
    });
  }, [page, searchTerm, startDate, endDate]);

  const handleGetStaffs = () => {
    getStaffs({
      currentPage: page,
    });
    setOpen(false);
  };

  return (
    <div>
      <div>
        <Container>
          <BreadCrumb data={["Dashboard", "Staffs"]} />
          <div className="flex items-center justify-between">
            <div className="flex">
              <div className="border-[1px] px-[15px] py-[8px] flex gap-2">
                <p className="font-[600]">
                  All Staffs ({clientsData?.pagination.totalItems ?? 0})
                </p>
              </div>
            </div>

            <div className="mb-[3px] flex items-center gap-[8px]">
              <div className="lg:flex hidden cursor-pointer items-center gap-[3px]  px-[8px] py-[8px] my-3">
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
                    placeholder="Search by email..."
                  />
                </div>
              </div>
              <Button
                onClick={showDrawer}
                className="flex h-[36px] items-center"
              >
                Add Staff
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
                placeholder="Search by email..."
              />
            </div>
          </div>
        </Container>
      </div>
      <Container>
        <DashboardTable
          columns={clientsColumns}
          data={clientsData?.users ?? []}
          type="staff"
          isFetching={isFetching}
          page={page}
          setPage={setPage}
          totalPages={clientsData?.pagination?.totalPages}
        />
        <AddStaff
          open={open}
          setShowDrawer={setOpen}
          callBackAction={handleGetStaffs}
        />
      </Container>
    </div>
  );
}

export default Staffs;
