import React from "react";
import { Spin } from "antd";

function Loader() {
  return (
    <div className="flex justify-center items-center h-[300px]">
      <Spin size="large" />
    </div>
  );
}

export default Loader;
