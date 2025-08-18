import { useEffect, useState } from "react";
import { useGetClientsQuery } from "../api/clientApi";
import { useParams } from "react-router-dom";
import Container from "../ui/Container";
import { Search } from "lucide-react";
import DashboardTable from "../components/dashboard/DashboardTable";
import { columns } from "../modules/portfolio/columns";
import { useLazyGetClientProjectQuery } from "../api/portfolio";
import { useGetUserQuery, useLazyGetUserQuery } from "../api/authApi";

function StaffDetails() {
  const { id } = useParams();

  const [searchTerm, setSearchTerm] = useState("");

  const { data } = useGetUserQuery(id);

  const [getClient, { data: projectsData }] = useLazyGetUserQuery();

  useEffect(() => {
    getClient(id);
  }, [id]);

  return (
    <div>
      <div className="">
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
        <Container className="py-[20px]">
          <h1 className="text-[1.35rem] font-[700] text-neutral-500">Tasks</h1>
        </Container>
        <Container>
          <div className="lg:hidden flex cursor-pointer items-center gap-[3px] border-b-[1px] px-[8px] py-[8px] ">
            <Search size={16} className="text-neutral-300" />
            <input
              onChange={(e) => setSearchTerm(e.target.value)}
              className=" py-[2px] text-[0.865rem]"
              placeholder="Search by product name"
            />
          </div>
        </Container>
        <Container className="flex items-center justify-between">
          <div className="flex gap-[5px]"></div>

          <div className="mb-[3px] flex items-center gap-[8px]">
            <div className="lg:flex hidden cursor-pointer items-center gap-[3px] border-b-[1px] px-[8px] py-[8px] ">
              <Search size={16} className="text-neutral-300" />
              <input
                onChange={(e) => setSearchTerm(e.target.value)}
                className=" py-[2px] text-[0.865rem]"
                placeholder="Search by product name"
              />
            </div>
          </div>
        </Container>
      </div>
      <Container>
        <DashboardTable
          columns={columns}
          data={projectsData?.projects || []}
          isFetching={false}
          targetId={id}
          remove
          removeAction="project"
          type={"Portfolio"}
          callBackAction={() => {
            getClient(id);
          }}
        />
      </Container>
    </div>
  );
}

export default StaffDetails;
