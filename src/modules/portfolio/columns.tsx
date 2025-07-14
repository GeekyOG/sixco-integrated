import { ColumnsType } from "antd/es/table";
import React from "react";
import StatusPill from "../../ui/StatusPill";
import { format } from "date-fns";
// import React from "react";

export const columns: ColumnsType = [
  {
    title: "Thumbnail Image",
    dataIndex: "image",
    key: "image",
    render(_, value) {
      console.log(value);

      return (
        <img
          src={`https://zerosix.aoudit.com/api/v1/portfolio/image/${value.id}`}
          alt="thumbnail"
          width={60}
        />
      );
    },
  },
  {
    title: "Project Title",
    dataIndex: "title",
    key: "title",
    render: (value) => <p className="text-[0.75rem]">{value ?? ""}</p>,
  },

  {
    title: "Status",
    dataIndex: "title",
    key: "title",
    render: (value) => <StatusPill status="pending" />,
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
