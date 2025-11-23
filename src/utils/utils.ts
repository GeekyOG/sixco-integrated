export const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    Active: "bg-orange-100 text-orange-800 border-orange-200",
    Mitigated: "bg-green-100 text-green-800 border-green-200",
    Scheduled: "bg-blue-100 text-blue-800 border-blue-200",
    "In Progress": "bg-purple-100 text-purple-800 border-purple-200",
    Completed: "bg-green-100 text-green-800 border-green-200",
    Urgent: "bg-red-100 text-red-800 border-red-200",
  };
  return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
};

export const getRiskColor = (level: string) => {
  const colors: Record<string, string> = {
    High: "bg-red-100 text-red-800 border-red-200",
    Medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Low: "bg-green-100 text-green-800 border-green-200",
  };
  return colors[level] || "bg-gray-100 text-gray-800 border-gray-200";
};
