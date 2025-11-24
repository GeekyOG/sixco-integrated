import { ColumnsType } from "antd/es/table";
import React from "react";
import StatusPill from "../../ui/StatusPill";
import { format } from "date-fns";
// import React from "react";

export const columns: ColumnsType = [
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
    render(_, value) {
      return <p>{value.title}</p>;
    },
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

  {
    title: "Reporter",
    dataIndex: "reporter",
    key: "reporter",
    render(_, value) {
      return (
        <p>
          {value.reporter?.lastName} {value.reporter?.firstName}
        </p>
      );
    },
  },

  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (value) => <StatusPill status={value} />,
  },
];
