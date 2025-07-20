import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import React from "react";
// import TableActionButtons from "../../ui/dashboard/TableActionButtons";
import ActionButtons from "./ActionButtons";
import MobileTable from "./MobileTable";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DashboardTableProps {
  columns: ColumnsType;
  data: [];
  isFetching: boolean;
  isError?: boolean;
  type: string;
  callBackAction?: () => void;
}

function DashboardTable({
  columns,
  data,
  isFetching,
  type,
  callBackAction,
}: DashboardTableProps) {
  const columnWithAction = [
    ...columns,
    {
      title: "Actions",
      dataIndex: "action",
      render: (_, record) => {
        return (
          <ActionButtons
            callBackAction={callBackAction}
            type={type}
            id={record.id}
          />
        );
      },
    },
  ];

  return (
    <div>
      <MobileTable
        type={type}
        columns={columnWithAction}
        dataSource={[
          {
            coverageType: "Third-party",
            riskDetailCode: "code",
          },
          {
            coverageType: "Third-party",
            riskDetailCode: "code",
          },
          {
            coverageType: "Third-party",
            riskDetailCode: "code",
          },
        ]}
        loading={false}
      />
      <Table
        columns={columnWithAction}
        dataSource={data}
        className="w-[100%] border-[1px] hidden md:block"
        loading={isFetching}
        rowKey="id"
        rowClassName={() => "custom-table-row"}
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
          itemRender: (page, type, originalElement) => {
            if (type === "prev") {
              return (
                <a className="custom-prev">
                  <ChevronLeft />
                </a>
              );
            }
            if (type === "next") {
              return (
                <a className="custom-next">
                  <ChevronRight />
                </a>
              );
            }
            return originalElement;
          },
          className: "custom-pagination",
        }}
      />
    </div>
  );
}

export default DashboardTable;
