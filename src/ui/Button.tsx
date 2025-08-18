import React, { FunctionComponent } from "react";

import Spinner from "./Spinner";
import { cn } from "../utils/cn";

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
  onClick?: () => void;
  type?: "submit" | "reset" | "button";
}

const Button: FunctionComponent<ButtonProps> = ({
  children,
  className,
  isLoading,
  onClick,
  type = "submit",
  ...props
}) => {
  return (
    <button
      disabled={isLoading}
      onClick={onClick || (() => {})}
      type={type}
      className={cn(
        "text-[#fff] text-[0.865rem] rounded-md outline-none border-0 bg-[#3b781c] justify-center py-2 px-4 flex items-center gap-2 leading-0",
        className
      )}
      {...props}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  );
};

export default Button;
