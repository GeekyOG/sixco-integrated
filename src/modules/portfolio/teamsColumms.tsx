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
    dataIndex: "members",
    key: "members",
    render: (members: { firstName: string }[]) => {
      return (
        <div>
          {members?.length == 0 && "--"}
          {members?.slice(0, 3).map((user, i) => (
            <Avatar
              icon={user.firstName[0]}
              className={cn(
                "-mr-3",
                `z-[${i}] bg-neutral-450 border border-neutral-50`
              )}
            />
          ))}

          {members.length > 3 && `+ ${members.length - 3}`}
        </div>
      );
    },
  },
];
