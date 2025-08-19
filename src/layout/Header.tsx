import React from "react";
import Container from "../ui/Container";
import { Link } from "react-router-dom";

function Header() {
  return (
    <div className="h-[100px] border-b-[2px] bg-[#fff]">
      <Container className="flex h-[100%] items-center justify-between">
        <img src="/SizcoLogo1.png" className="invert -ml-[30px]" />
        <div className="flex gap-[5px] text-[1.05rem]">
          {/* <p className="text-neutral-400">Got Account?</p>
          <Link to="/" className="font-[600]  text-secondary-600">
            Sign in
          </Link> */}
        </div>
      </Container>
    </div>
  );
}

export default Header;
