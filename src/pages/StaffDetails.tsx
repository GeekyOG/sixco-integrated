import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Container from "../ui/Container";
import { Download, ListFilter, Search } from "lucide-react";
import DashboardTable from "../components/dashboard/DashboardTable";
import { useGetUserQuery, useLazyGetUserQuery } from "../api/authApi";
import { useLazyGetAllTaskQuery } from "../api/tasksApi";
import { taskColumns } from "../modules/teams/staffTaskColums";
import { Popover } from "antd";
import { handleExportCSV } from "../utils/export";
import Button from "../ui/Button";
import { cn } from "../utils/cn";

const status = ["To Do", "In Progress", "Review", "Done"];

function StaffDetails() {
  const { id } = useParams();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const { data } = useGetUserQuery(id);

  const [getTasks, { data: tasksData, isFetching }] = useLazyGetAllTaskQuery();

  useEffect(() => {
    if (data?.user?.email) {
      getTasks({
        assigneeEmail: data?.user?.email,
        ...(searchTerm && { title: searchTerm }),
        ...(statusFilter && { status: statusFilter }),
        page,
      });
    }
  }, [data, searchTerm, page, statusFilter]);

  return (
    <div>
      <div className="border py-4 px-2 rounded-md">
        <Container>
          <h1 className="text-[1.45rem] font-[700] text-neutral-500">
            Staff Details
          </h1>

          <div className="flex flex-col gap-6 border-b-[1px] pb-[16px] mt-[24px] text-[0.865rem]">
            <div className="flex gap-[16px]">
              <p className="text-neutral-400 font-[600] w-[120px]">
                Full Name:
              </p>
              <p>{data?.user?.fullName}</p>
            </div>

            <div className="flex gap-[16px]">
              <p className="text-neutral-400 font-[600] w-[120px]">
                Email Address:
              </p>
              <p>{data?.user?.email}</p>
            </div>
            <div className="flex gap-[16px]">
              <p className="text-neutral-400 font-[600] w-[120px]">
                Phone Number:
              </p>
              <p>{data?.user?.phoneNumber}</p>
            </div>
          </div>
        </Container>

        <Container className="lg:hidden mt-5">
          <h1 className="lg:hidden text-[1.35rem] font-[700] text-neutral-500">
            Tasks
          </h1>

          <div className="lg:hidden flex cursor-pointer items-center gap-[3px] border-b-[1px] px-[8px] py-[8px] ">
            <Search size={16} className="text-neutral-300" />
            <input
              onChange={(e) => setSearchTerm(e.target.value)}
              className=" py-[2px] text-[0.865rem]"
              placeholder="Search by product name"
            />
          </div>
        </Container>
        <Container className="hidden lg:flex items-center justify-between">
          <h1 className="text-[1.35rem] font-[700] text-neutral-500">Tasks</h1>

          <div className="mb-[3px] flex items-center gap-[8px]">
            <div className="lg:flex hidden cursor-pointer items-center gap-[3px]  px-[8px] py-[8px] my-3">
              <Popover
                content={
                  <div className="flex flex-col gap-3 px-[4px] py-[16px]">
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
            </div>
            <div className="lg:flex hidden cursor-pointer items-center gap-[3px] border-b-[1px] px-[8px] py-[8px] ">
              <Search size={16} className="text-neutral-300" />
              <input
                onChange={(e) => setSearchTerm(e.target.value)}
                className=" py-[2px] text-[0.865rem]"
                placeholder="Search by task title"
              />
            </div>
          </div>
        </Container>
        <Container>
          <DashboardTable
            columns={taskColumns}
            data={tasksData?.tasks || []}
            callBackAction={() => {}}
            type="edit-tasks"
            isFetching={isFetching}
            page={page}
            setPage={setPage}
            totalPages={tasksData?.pagination.totalPages}
          />
        </Container>
      </div>
    </div>
  );
}

export default StaffDetails;
