import React from "react";
import { hasPermission } from "../utils/permissionUtils";
import { cn } from "../utils/cn";

interface PermissionAwareButtonProps {
  permission: string;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const PermissionAwareButton: React.FC<PermissionAwareButtonProps> = ({
  permission,
  onClick,
  children,
  className = "",
  disabled = false,
}) => {
  // Hide button if user doesn't have permission
  if (!hasPermission(permission)) {
    return null;
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "text-[#fff] text-[0.865rem] rounded-md outline-none border-0 bg-[#3b781c] justify-center py-2 px-4 flex items-center gap-2 leading-0",
        className
      )}
    >
      {children}
    </button>
  );
};

export default PermissionAwareButton;
