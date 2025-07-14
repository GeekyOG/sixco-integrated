import { Dot } from "lucide-react";
import React from "react";

export type StatusTypes =
  | "draft"
  | "pending"
  | "lapsed"
  | "expired"
  | "cancelled"
  | "completed";

const StatusPill = ({ status }: { status: StatusTypes }) => {
  const statusColorMap: Record<StatusTypes, string> = {
    draft: "#BABBBB",
    pending: "#FDB022",
    completed: "#3FA047",
    cancelled: "#D92D20",
    lapsed: "#D92D20",
    expired: "#D92D20",
  };

  return (
    <div className="flex items-center gap-2 rounded-full border border-black-100 px-3 py-1">
      <Dot size={30} color={statusColorMap[status]} />
      <span className="capitalize">{status}</span>
    </div>
  );
};

export default StatusPill;
