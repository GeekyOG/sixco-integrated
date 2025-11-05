import { ColumnsType } from "antd/es/table";
import React from "react";
import StatusPill from "../../ui/StatusPill";
import { format } from "date-fns";
// import React from "react";

export const columns: ColumnsType = [
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
    dataIndex: "status",
    key: "status",
    render: (value) => <StatusPill status={value} />,
  },

  {
    title: "Report Date",
    dataIndex: "dateOfReport",
    key: "dateOfReport",
    render: (item) => {
      return <div className="capitalize">{format(item, "MMMM d, yyyy")}</div>;
    },
  },

  {
    title: "Time of Report",
    dataIndex: "timeOfReport",
    key: "timeOfReport",
    render: (item) => {
      return <div className="capitalize">{item}</div>;
    },
  },
];
