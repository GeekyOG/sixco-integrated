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
  remove?: boolean;
  removeAction?: string;
  targetId?: string;
  totalPages?: number;
  page?: number;
  setPage?: React.Dispatch<React.SetStateAction<number>>;
}

function DashboardTable({
  columns,
  data,
  isFetching,
  type,
  callBackAction,
  remove,
  removeAction,
  targetId,
  totalPages,
  page,
  setPage,
}: DashboardTableProps) {
  const handleNext = () => {
    if (page && totalPages && page < totalPages && setPage) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (page && totalPages && setPage && page > 1) {
      setPage((prev) => prev - 1);
    }
  };
  const columnWithAction = [
    ...columns,
    {
      title: "Actions",
      dataIndex: "action",
      render: (_, record) => {
        return (
          <ActionButtons
            callBackAction={callBackAction}
            remove={remove}
            targetId={targetId}
            removeAction={removeAction}
            type={type}
            id={record.id || record.teamId}
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
        dataSource={data}
        loading={false}
        callBackAction={callBackAction}
      />
      <Table
        columns={columnWithAction}
        dataSource={data}
        className="w-[100%] border-[1px] hidden md:block"
        loading={isFetching}
        rowKey="id"
        rowClassName={() => "custom-table-row"}
        pagination={
          !totalPages
            ? {
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
              }
            : false
        }
      />
      {totalPages && page && setPage && (
        <div className="mt-6 flex justify-between items-center max-w-[200px]">
          <button
            onClick={handlePrev}
            disabled={page === 1}
            className="px-2 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            <ChevronLeft />
          </button>
          <span className="text-sm text-gray-700">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={page === totalPages}
            className="px-2 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}

export default DashboardTable;
