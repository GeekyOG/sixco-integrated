import { ColumnGroupType, ColumnType } from "antd/es/table";
import React from "react";
import { AnyObject } from "yup";
import { Collapse } from "antd";
import ActionButtons from "./ActionButtons";
import { format } from "date-fns";
import Loader from "../../ui/dashboard/Loader";
import EmptyState from "../../ui/dashboard/Empty";
import {
  ChevronRight,
  Users,
  UserCircle,
  Briefcase,
  Calendar,
  Mail,
  Phone,
  FileText,
} from "lucide-react";

interface MobileTableProps {
  columns: (
    | ColumnGroupType<AnyObject>
    | ColumnType<AnyObject>
    | {
        title: string;
        dataIndex: string;
        render: (_: any, record: any) => React.JSX.Element;
      }
  )[];
  dataSource: any[];
  type: string;
  loading: boolean;
  callBackAction?: () => void;
}

function MobileTable({
  dataSource,
  loading,
  type,
  callBackAction,
}: MobileTableProps) {
  // Keys to hide from display
  const hiddenKeys = [
    "id",
    "teamId",
    "userId",
    "projectId",
    "clientId",
    "report",
    "createdAt",
    "updatedAt",
  ];

  // Format key names for better display
  const formatKeyName = (key: string): string => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  // Get icon based on key name
  const getFieldIcon = (key: string) => {
    const lowerKey = key.toLowerCase();
    if (lowerKey.includes("email"))
      return <Mail className="w-4 h-4 text-blue-500" />;
    if (lowerKey.includes("phone"))
      return <Phone className="w-4 h-4 text-green-500" />;
    if (lowerKey.includes("date"))
      return <Calendar className="w-4 h-4 text-purple-500" />;
    if (lowerKey.includes("name"))
      return <FileText className="w-4 h-4 text-gray-500" />;
    return null;
  };

  // Get header icon based on type
  const getHeaderIcon = (type: string) => {
    switch (type) {
      case "teams":
        return <Users className="w-5 h-5 text-blue-600" />;
      case "client":
      case "staff":
        return <UserCircle className="w-5 h-5 text-purple-600" />;
      default:
        return <Briefcase className="w-5 h-5 text-indigo-600" />;
    }
  };

  // Get item title
  const getItemTitle = (item: any, type: string): string => {
    if (type === "teams") return item.teamName || "Unnamed Team";
    if (type === "client" || type === "staff")
      return (
        `${item.firstName || ""} ${item.lastName || ""}`.trim() || "Unnamed"
      );
    return item.name || item.title || "Unnamed Item";
  };

  // Get color scheme based on type
  const getColorScheme = (type: string) => {
    switch (type) {
      case "teams":
        return "blue";
      case "client":
        return "purple";
      case "staff":
        return "green";
      default:
        return "indigo";
    }
  };

  const colorScheme = getColorScheme(type);

  return (
    <div className="md:hidden w-full">
      {dataSource.length === 0 && !loading && (
        <div className="px-6 py-8">
          <EmptyState />
        </div>
      )}

      {loading ? (
        <div className="px-6 py-8">
          <Loader />
        </div>
      ) : (
        <div className="space-y-3 px-4 py-4">
          {dataSource?.map((item: any, i) => {
            const itemTitle = getItemTitle(item, type);

            return (
              <div
                key={i}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <Collapse
                  ghost
                  expandIconPosition="end"
                  expandIcon={({ isActive }) => (
                    <div
                      className={`transform transition-transform duration-200 ${
                        isActive ? "rotate-90" : ""
                      }`}
                    >
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                  items={[
                    {
                      key: i,
                      label: (
                        <div className="flex items-center gap-3 py-2">
                          <div
                            className={`p-2 bg-${colorScheme}-50 rounded-lg flex-shrink-0`}
                          >
                            {getHeaderIcon(type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate text-base">
                              {itemTitle}
                            </p>
                            {item.email && (
                              <p className="text-xs text-gray-500 truncate mt-0.5">
                                {item.email}
                              </p>
                            )}
                          </div>
                        </div>
                      ),
                      children: (
                        <div className="px-4 pb-4 space-y-3">
                          {/* Action Buttons */}
                          <div className="pt-2 pb-3 border-b border-gray-200">
                            <ActionButtons
                              callBackAction={callBackAction}
                              type={type}
                              id={item.id || item.teamId}
                            />
                          </div>

                          {/* Item Details */}
                          <div className="space-y-2">
                            {Object.entries(item).map(([key, value]) => {
                              // Hide specified keys and objects
                              if (
                                hiddenKeys.includes(key) ||
                                (typeof value === "object" && value !== null)
                              ) {
                                return null;
                              }

                              // Format date values
                              let displayValue = value;
                              if (
                                key.toLowerCase().includes("date") &&
                                value &&
                                String(value) !== "--"
                              ) {
                                try {
                                  displayValue = format(
                                    new Date(String(value)),
                                    "MMMM d, yyyy"
                                  );
                                } catch (e) {
                                  displayValue = String(value);
                                }
                              }

                              const formattedKey = formatKeyName(key);
                              const icon = getFieldIcon(key);

                              return (
                                <div
                                  key={key}
                                  className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg"
                                >
                                  {icon && (
                                    <div className="flex-shrink-0 mt-0.5">
                                      {icon}
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs text-gray-500 font-medium mb-0.5">
                                      {formattedKey}
                                    </p>
                                    <p className="text-sm text-gray-900 break-words">
                                      {String(displayValue) || "--"}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Empty state if no fields */}
                          {Object.entries(item).filter(
                            ([key, value]) =>
                              !hiddenKeys.includes(key) &&
                              !(typeof value === "object" && value !== null)
                          ).length === 0 && (
                            <div className="text-center py-6">
                              <FileText className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                              <p className="text-sm text-gray-400">
                                No additional details available
                              </p>
                            </div>
                          )}
                        </div>
                      ),
                    },
                  ]}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MobileTable;
