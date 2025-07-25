import { ColumnsType } from "antd/es/table";
import React from "react";
import StatusPill from "../../ui/StatusPill";
import { format } from "date-fns";
import { Avatar } from "antd";
import { cn } from "../../utils/cn";
// import React from "react";

export const teamColumns: ColumnsType = [
  {
    title: "Team Name",
    dataIndex: "teamName",
    key: "teamName",
    render(_, value) {
      return <p>{value.teamName}</p>;
    },
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
            <Avatar
              icon={user.firstName[0]}
              className={cn(
                i !== 1 && "-mr-3",
                `z-[${i}] bg-neutral-450 border border-neutral-50`
              )}
            />
          ))}

          {users.length > 5 && `+ ${users.length - 5}`}
        </div>
      );
    },
  },
];
