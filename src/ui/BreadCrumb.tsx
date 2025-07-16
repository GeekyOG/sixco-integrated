import { ChevronRight } from "lucide-react";
import React from "react";

interface BreadCrumbProps {
  data: string[];
}
function BreadCrumb({ data }: BreadCrumbProps) {
  return (
    <div className="flex py-5">
      {data?.map((item, i) => (
        <div className="flex text-[0.865rem] items-center ">
          <p>{item.toUpperCase()}</p>{" "}
          {i + 1 !== data.length && (
            <ChevronRight
              className="text-neutral-400 font-[200] mx-1"
              size={16}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default BreadCrumb;
