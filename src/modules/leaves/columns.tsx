import { ColumnsType } from "antd/es/table";
import React from "react";
import StatusPill from "../../ui/StatusPill";
import { format } from "date-fns";
// import React from "react";

export const columns: ColumnsType = [
  {
    title: "Request By",
    dataIndex: "name",
    key: "name",
    render(_, value) {
      return (
        <div className="font-[400] text-neutral-400">
          <p>
            <span className="font-[600] text-neutral-700">Name</span> :
            {value.User.firstName} {value.User.lastName}{" "}
          </p>
          <p>
            {" "}
            <span className="font-[600] text-neutral-700">Reason</span> :
            {value.reason}{" "}
          </p>
        </div>
      );
    },
  },

  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (value) => <StatusPill status={value} />,
  },

  {
    title: "Start Date",
    dataIndex: "startDate",
    key: "startDate",
    render: (item) => {
      return (
        <div className="capitalize">
          {format(item, "yyyy/MM/dd").toLocaleString()}
        </div>
      );
    },
  },

  {
    title: "End Date",
    dataIndex: "endDate",
    key: "endDate",
    render: (item) => {
      return (
        <div className="capitalize">
          {format(item, "yyyy/MM/dd").toLocaleString()}
        </div>
      );
    },
  },
];
