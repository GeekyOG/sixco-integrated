import React from "react";
import { IoIosAdd } from "react-icons/io";
import { Link } from "react-router-dom";

interface DashboardBoxProps {
  title: string;
  value: number;
  handleClick: () => void;
}

function DashboardBox({ title, value, handleClick }: DashboardBoxProps) {
  return (
    <div className="shadow-sm p-[20px] border-[1px] rounded-[8px] w-[100%]">
      <div className="flex justify-between">
        <p>{title}</p>

        <button
          onClick={handleClick}
          className="bg-[#65CC33] p-[10px] rounded-[8px]"
        >
          <IoIosAdd className="text-[2rem] text-[#fff]" />
        </button>
      </div>

      <p className="text-[2rem]">{value}</p>
    </div>
  );
}

export default DashboardBox;
