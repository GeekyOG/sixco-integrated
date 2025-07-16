import { ColumnsType } from "antd/es/table";
import React from "react";
import StatusPill from "../../ui/StatusPill";
import { format } from "date-fns";
// import React from "react";

export const clientsColumns: ColumnsType = [
  {
    title: "Full Name",
    dataIndex: "firstName",
    key: "firstName",
    render(_, value) {
      return (
        <p>
          {value.firstName} {value.lastName}
        </p>
      );
    },
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    render: (value) => <p className="text-[0.75rem]">{value ?? "--"}</p>,
  },
  {
    title: "Phone Number",
    dataIndex: "phoneNumber",
    key: "phoneNumber",
    render: (value) => <p className="text-[0.75rem]">{value ?? "--"}</p>,
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
