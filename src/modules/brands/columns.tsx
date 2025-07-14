import { ColumnsType } from "antd/es/table";
import React from "react";
// import React from "react";

export const columns: ColumnsType = [
  {
    title: "Brand Image",
    dataIndex: "image",
    key: "image",
    render(_, value) {
      console.log(value);

      return (
        <img
          src={`https://zerosix.aoudit.com/api/v1/brands/${value.id}`}
          alt="thumbnail"
          width={60}
        />
      );
    },
  },

  {
    title: "Date added",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (item) => {
      return new Date(Date.parse(item)).toLocaleString();
    },
  },
];
