import clsx from "clsx";
import {
  ArrowLeftRight,
  File,
  LayoutGrid,
  MenuIcon,
  Settings,
  Users,
} from "lucide-react";
import React, { ReactNode, useState } from "react";
import { BsPeople } from "react-icons/bs";
import { GoReport } from "react-icons/go";
import { IoArrowBackSharp } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";

const NavOptions: { text: string; url: string; icon: ReactNode }[] = [
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
    text: "Leave Requests",
    url: "/dashboard/leaves",
    icon: <ArrowLeftRight size={16} />,
  },

  {
    text: "Settings",
    url: "/dashboard/settings",
    icon: <Settings size={16} />,
  },
];

function MobileNav() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleClose = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    url: string
  ) => {
    event.preventDefault();

    if (location.pathname === "/portfolio") {
      navigate(url);
    }

    window.history.pushState({}, "", url);

    const hash = url.split("#")[1];
    if (hash) {
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(url);
      setShowMobileMenu(false);
    }
  };

  return (
    <div className="p-[20px]">
      <div className="">
        <div className="bg-[#65CC33] p-3">
          <MenuIcon
            className="lg:hidden"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          />
        </div>

        <div
          className={clsx(
            "fixed right-0 left-0 top-0 bottom-0 bg-[#FFFFFF4E]",
            showMobileMenu ? "" : ""
          )}
          style={{
            zIndex: 100,
            position: "fixed",
            right: 0,
            left: 0,
            bottom: 0,
            top: 0,
            transform: `translateX(${showMobileMenu ? "0" : "-130vw"})`,
            transition: "all 0.5s ease-in-out ",
          }}
        >
          <div
            className={clsx(
              "z-40 flex flex-col bg-[#000] w-[60%] border-r-[2px] border-[#65CC33]"
            )}
            style={{
              zIndex: 100,
              position: "fixed",
              right: 0,
              left: 0,
              bottom: 0,
              top: 0,
              transform: `translateX(${showMobileMenu ? "0" : "-130vh"})`,
              transition: "all 0.5s ease-in-out ",
              animationDelay: "2s",
            }}
          >
            <div className="flex justify-between px-[20px] py-[20px]">
              <div onClick={handleClose}>
                <IoArrowBackSharp className="text-[30px] text-[#fff]" />
              </div>
            </div>
            <div className="flex-col  items-start mt-[32px]">
              {NavOptions.map((option, index) => (
                <div
                  key={index}
                  className={clsx(
                    "text-[#fff] font-[400] py-[16px] px-[28px] text-[0.865rem]",
                    option?.url == location.pathname &&
                      "text-secondary_dark bg-[#37691e] border-r-[8px] border-primary_dark"
                  )}
                  onClick={(e) => handleClick(e, option.url)}
                >
                  {option?.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MobileNav;
