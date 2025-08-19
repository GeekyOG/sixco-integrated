import { Skeleton } from "antd";
import { ColumnGroupType, ColumnType } from "antd/es/table";
import { ChevronDown } from "lucide-react";
import React, { useState } from "react";
import { AnyObject } from "yup";
import { Collapse, Divider } from "antd";
import ActionButtons from "./ActionButtons";
import { format } from "date-fns";
import Loader from "../../ui/dashboard/Loader";
import EmptyState from "../../ui/dashboard/Empty";
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
  return (
    <div className="md:hidden flex flex-col w-full px-[24px] py-[16px] border rounded-md">
      {dataSource.length == 0 && !loading && <EmptyState />}
      {loading ? (
        <Loader />
      ) : (
        <div className="flex flex-col gap-3">
          {dataSource?.map((item: any, i) => {
            return (
              <div>
                <Collapse
                  items={[
                    {
                      key: i,
                      label:
                        type == "teams"
                          ? item.teamName
                          : type === "client" || type == "staff"
                          ? `${item.firstName} ${item.lastName}`
                          : item.name,
                      children: (
                        <div className="flex flex-col gap-[16px] mt-[16px]">
                          <ActionButtons
                            callBackAction={callBackAction}
                            type={type}
                            id={item.id || item.teamId}
                          />
                          {Object.entries(item).map(([key, value]) => {
                            if (
                              key === "id" ||
                              (typeof value === "object" && value !== null)
                            ) {
                              return null;
                            }

                            if (
                              key.toLowerCase().includes("date") ||
                              key.toLowerCase().includes("created")
                            ) {
                              value = format(String(value), "MMMM d, yyyy");
                            }

                            return (
                              <div
                                key={key}
                                className="flex gap-[16px] justify-between"
                              >
                                <p className="font-[600]">{key}:</p>{" "}
                                <p className="text-right">{String(value)}</p>
                              </div>
                            );
                          })}
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
