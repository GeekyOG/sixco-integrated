import { ColumnsType } from "antd/es/table";
import React from "react";
import StatusPill from "../../ui/StatusPill";
import { format } from "date-fns";
import { Avatar } from "antd";
// import React from "react";

export const columns: ColumnsType = [
  {
    title: "Team Name",
    dataIndex: "teamName",
    key: "teamName",
    render(_, value) {
      return <p>{value.teamName}</p>;
    },
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
    render: (value) => <p className="text-[0.75rem]">{value ?? "--"}</p>,
  },

  {
    title: "Team Members",
    dataIndex: "users",
    key: "users",
    render: (users: { firstName: string }[]) => {
      return (
        <div>
          {users?.length == 0 && "--"}
          {users?.slice(0, 5).map((user, i) => (
            <Avatar icon={user.firstName[0]} />
          ))}

          {users.length > 5 && `+ ${users.length - 5}`}
        </div>
      );
    },
  },
  {
    title: "Date added",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (item) => {
      return (
        <div className="capitalize">
          {format(item, "yyyy/MM/dd").toLocaleString()}
        </div>
      );
    },
  },
];
