import { ColumnsType } from "antd/es/table";
import React from "react";
import StatusPill from "../../ui/StatusPill";
import { format } from "date-fns";
// import React from "react";

export const projectColumns: ColumnsType = [
  {
    title: "Name",
    dataIndex: "",
    key: "",
    render(_, value) {
      console.log(value);

      return <p>{value.name}</p>;
    },
  },

  {
    title: "Description",
    dataIndex: "image",
    key: "image",
    render(_, value) {
      console.log(value);

      return <p>{value.description}</p>;
    },
  },

  {
    title: "Status",
    dataIndex: "title",
    key: "title",
    render: (value) => <StatusPill status="pending" />,
  },
];
