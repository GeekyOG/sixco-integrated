import React, { useEffect, useMemo, useState } from "react";
import DashboardTable from "../components/dashboard/DashboardTable";
import Container from "../ui/Container";
import Button from "../ui/Button";
import AddUser from "../modules/users/AddUser";
import { Search } from "lucide-react";
import { columns } from "../modules/users/columns";

function Users() {
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(!open);
  };

  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div>
      <div>
        <Container>
          <div className="flex items-center justify-between">
            <div className="flex">
              <div className="border-[1px] px-[15px] py-[8px]">
                <p className="font-[600]">All CLIENTS</p>
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
                onClick={showDrawer}
                className="flex h-[36px] items-center"
              >
                Add User
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
        </Container>
      </div>
      <Container>
        <DashboardTable
          columns={columns}
          data={[]}
          type={"users"}
          isFetching={false}
        />
        <AddUser open={open} setShowDrawer={setOpen} />
      </Container>
    </div>
  );
}

export default Users;
