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
      return <p>{value.name}</p>;
    },
  },
];
