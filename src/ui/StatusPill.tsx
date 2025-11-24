import { Dot } from "lucide-react";
import React from "react";
import { cn } from "../utils/cn";

export type StatusTypes =
  | "draft"
  | "pending"
  | "lapsed"
  | "expired"
  | "cancelled"
  | "completed"
  | "To Do"
  | "closed"
  | "In Progress";

const StatusPill = ({ status }: { status: StatusTypes }) => {
  const statusColorMap: Record<StatusTypes, string> = {
    draft: "#BABBBB",
    pending: "#FDB022",
    "To Do": "#FDB022",
    "In Progress": "#FDB022",
    closed: "#3FA047",
    completed: "#3FA047",
    cancelled: "#D92D20",
    lapsed: "#D92D20",
    expired: "#D92D20",
  };

  return (
    <div
      className={cn(
        "flex items-center gap-[5px] rounded-full border  px-3 py-1 max-w-[150px]",
        `border-[${statusColorMap}]`
      )}
    >
      <Dot size={30} color={statusColorMap[status]} />
      <span className="capitalize">{status}</span>
    </div>
  );
};

export default StatusPill;
