import { ColumnsType } from "antd/es/table";
import React from "react";
import StatusPill from "../../ui/StatusPill";
import { format } from "date-fns";
// import React from "react";

export const columns: ColumnsType = [
  {
    title: "Team Name",
    dataIndex: "name",
    key: "name",
    render(_, value) {
      return <p>{value.name}</p>;
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
    dataIndex: "Users",
    key: "Users",
    render: (value) => <p className="text-[0.75rem]">{"--"}</p>,
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
