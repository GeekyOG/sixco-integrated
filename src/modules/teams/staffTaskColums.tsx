import { ColumnsType } from "antd/es/table";
import React from "react";
import StatusPill from "../../ui/StatusPill";
import { format, formatDate } from "date-fns";
// import React from "react";

export const taskColumns: ColumnsType = [
  {
    title: "Task Title",
    dataIndex: "title",
    key: "title",
    render(_, value) {
      return <p>{value.title}</p>;
    },
  },

  {
    title: "Project",
    dataIndex: "project",
    key: "project",
    render: (value) => <p className="text-[0.75rem]">{value?.name ?? "--"}</p>,
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
    render: (value) => (
      <p className="text-[0.75rem] max-w-[200px]">
        {value.slice(0, 25) ?? "--"} {value.length > 25 && "..."}
      </p>
    ),
  },

  {
    title: "Due Date",
    dataIndex: "dueDate",
    key: "dueDate",
    render: (value) => (
      <p className="text-[0.75rem]">
        {format(value, "MMMM d, yyyy").toLocaleString()}
      </p>
    ),
  },

  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (value) => <StatusPill status={value} />,
  },
];
