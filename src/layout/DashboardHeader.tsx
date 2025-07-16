import { Dropdown, Menu } from "antd";
import React, { useState } from "react";
import { RxAvatar } from "react-icons/rx";
import { useNavigate } from "react-router-dom";

import { logout } from "../utils/logout";
import Container from "../ui/Container";
import { ChevronDown, MenuIcon } from "lucide-react";
import Button from "../ui/Button";
import MobileNav from "./MobileNav";

interface DashboardHeaderProps {
  setHideSideBar: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DashboardHeader({
  setHideSideBar,
}: DashboardHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="relative z-[10px]  w-[100%] border-b-[1px]">
      <Container className="flex h-[72px] items-center justify-between">
        <div className=" gap-4 hidden lg:flex">
          <div
            className=" text-neutral-550 rounded-sm cursor-pointer "
            onClick={() => {
              setHideSideBar((prev) => !prev);
            }}
          >
            <MenuIcon size={32} />
          </div>

          <p className="text-[1.5rem] font-[600] text-neutral-700 hidden lg:block">
            Sizco Integrated
          </p>
        </div>

        <div className="lg:hidden">
          <MobileNav />
        </div>
        <div>
          <div className="lg:hidden">{/* <MobileNav /> */}</div>
        </div>

        <div className="flex cursor-pointer items-center gap-[18px]">
          <Dropdown
            trigger={["click"]}
            overlay={
              <Menu className="flex flex-col items-center">
                <Menu.Item key="0">
                  <Button
                    className="rounded-[8px] bg-neutral-400"
                    onClick={() => {
                      navigate("./settings");
                    }}
                  >
                    Settings
                  </Button>
                </Menu.Item>
                <Menu.Item key="1">
                  <Button
                    className="rounded-[8px] bg-neutral-400"
                    onClick={() => logout()}
                  >
                    Logout
                  </Button>
                </Menu.Item>
              </Menu>
            }
          >
            <div className="flex border px-[12px] py-[4px] gap-3 rounded-md items-center">
              <RxAvatar size={24} className="text-[#8F8F8F]" />

              <ChevronDown size={16} />
            </div>
          </Dropdown>
        </div>
      </Container>
    </div>
  );
}
