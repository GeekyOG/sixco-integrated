import React, { useState } from "react";

import { useLocation } from "react-router-dom";

import SidebarTab from "./SidebarTab";
import {
  ArrowLeftRight,
  ChevronLeft,
  File,
  History,
  LayoutGrid,
  LogOutIcon,
  ReceiptText,
  Settings,
  Store,
  UserCheck,
  Users,
} from "lucide-react";
import Button from "../ui/Button";
import { FcCollaboration } from "react-icons/fc";
import { BsPeople } from "react-icons/bs";
import { GoReport } from "react-icons/go";

export const mainMenuOptions = [
  { text: "Overview", url: "/dashboard", icon: <LayoutGrid size={16} /> },
  {
    text: "Manage Clients",
    url: "/dashboard/users",
    icon: <Users size={16} />,
  },

  {
    text: "Manage Staffs",
    url: "/dashboard/staffs",
    icon: <Users size={16} />,
  },
  {
    text: "Roles & Permissions",
    url: "/dashboard/roles-permissions",
    icon: <Users size={16} />,
  },
  {
    text: "Manage Teams",
    url: "/dashboard/teams",
    icon: <BsPeople size={16} />,
  },
  {
    text: "Manage Projects",
    url: "/dashboard/projects",
    icon: <File size={16} />,
  },

  {
    text: "Manage Reports",
    url: "/dashboard/reports",
    icon: <GoReport size={16} />,
  },
  {
    text: "Manage HSE Reports",
    url: "/dashboard/hse-management",
    icon: <File size={16} />,
  },
  {
    text: "Leave Requests",
    url: "/dashboard/leaves",
    icon: <ArrowLeftRight size={16} />,
  },
  {
    text: "Messages",
    url: "/dashboard/chat",
    icon: <File size={16} />,
  },
  {
    text: "Finance",
    url: "/dashboard/finance",
    icon: <File size={16} />,
  },
  {
    text: "Audit",
    url: "/dashboard/audit",
    icon: <History size={16} />,
  },
  {
    text: "Settings",
    url: "/dashboard/settings",
    icon: <Settings size={16} />,
  },
  ,
];

interface SidebarProps {
  setHideSideBar: React.Dispatch<React.SetStateAction<boolean>>;
}

function Sidebar({ setHideSideBar }: SidebarProps) {
  const location = useLocation();
  const { pathname } = location;
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeUrl, setActiveUrl] = useState("/dashboard");

  if (isCollapsed) {
    return (
      <div className="hidden lg:block h-screen w-20 bg-zinc-950 border-r border-zinc-800 relative">
        <button
          onClick={() => setIsCollapsed(false)}
          className="absolute right-4 top-6 text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft size={24} className="rotate-180" />
        </button>
      </div>
    );
  }
  return (
    <div className="hidden h-[100vh] w-[200px]  flex-none border-r-[1px] lg:block relative z-[1000] ">
      <div className="fixed bottom-0 top-0 w-[280px] bg-[#090909] overflow-scroll">
        <div
          onClick={() => {
            setHideSideBar((prev) => !prev);
          }}
          className="absolute right-4 top-5"
        >
          <ChevronLeft color="#fff" size={32} />
        </div>

        <div className="border-b-[1px] px-[28px] pb-[20px] pt-[44px]"></div>

        <div className="border-b-[1px] px-[20px] py-[17px]">
          <div className="flex h-[76px] w-[100%] items-center gap-[8px] rounded-[12px] px-[12px]">
            <img src="/SizcoLogo1.png" />
          </div>
        </div>
        <div className="border-b-[1px] pb-[10px] text-neutral-100">
          <div className="px-[28px] py-[14px]">
            <p className="text-[0.625rem] font-[700]">MAIN MENU</p>
          </div>
          {mainMenuOptions.map((item: any) => (
            <SidebarTab
              key={item.text}
              item={item.text}
              activeOption={pathname}
              url={item.url}
              icon={item.icon}
            />
          ))}
        </div>

        <div className=" bottom-5 ml-[24px] mt-auto text-[#fff]">
          <Button className="flex items-center gap-[10px] bg-transparent">
            <LogOutIcon size={16} />
            <p className="text-[0.813rem] leading-[22.4px]">Logout</p>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
