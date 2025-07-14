import { ColumnsType } from "antd/es/table";
import React from "react";
import { useGetImageByWorkIdQuery } from "../../api/imageApi";
// import React from "react";

export const columns: ColumnsType = [
  // {
  //   title: "Thumbnail Image",
  //   dataIndex: "image",
  //   key: "image",
  //   render(_, value) {
  //     console.log(value);

  //     return (
  //       <img
  //         src={`http://localhost:5000/api/v1/image/5/work/${value.id}`}
  //         alt="thumbnail"
  //         width={60}
  //       />
  //     );
  //   },
  // },
  {
    title: "Title",
    dataIndex: "name",
    key: "name",
    render: (value) => <p>{value ?? ""}</p>,
  },

  {
    title: "Category",
    dataIndex: "category",
    key: "category",
    render: (value) => <p>{value ?? ""}</p>,
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
