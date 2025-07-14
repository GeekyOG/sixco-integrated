import { Skeleton } from "antd";
import { ColumnGroupType, ColumnType } from "antd/es/table";
import { ChevronDown } from "lucide-react";
import React, { useState } from "react";
import { AnyObject } from "yup";
import { Collapse, Divider } from "antd";
import ActionButtons from "./ActionButtons";
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
}
function MobileTable({ dataSource, columns, loading, type }: MobileTableProps) {
  const [showDetails, setShowDetails] = useState(false);
  return (
    <div className="md:hidden flex flex-col w-full px-[24px] py-[16px] border rounded-md">
      {loading ? (
        <Skeleton className="w-[100%] h-[32px]" />
      ) : (
        <div className="flex flex-col gap-3">
          {dataSource?.map((item, i) => (
            <div>
              <Collapse
                items={[
                  {
                    key: i,
                    label: "Project Name",
                    children: (
                      <div className="flex flex-col gap-[16px] mt-[16px]">
                        <ActionButtons
                          callBackAction={() => {}}
                          type={type}
                          id={item.id}
                        />
                        {Object.entries(item).map(([key, value]) => (
                          <div
                            key={key}
                            className="flex gap-[16px] justify-between"
                          >
                            <p className="font-[600]">{key}:</p>{" "}
                            <p>{String(value)}</p>
                          </div>
                        ))}
                      </div>
                    ),
                  },
                ]}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MobileTable;
