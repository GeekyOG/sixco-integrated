import React from "react";

const Loader = () => (
  <div className="fixed top-0 left-0 z-50 w-full">
    <div className="mt-16">
      <div className="bg-primary h-1 w-full animate-pulse" />
    </div>
  </div>
);

export default Loader;
