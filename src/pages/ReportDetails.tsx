// Required imports
import { useEffect, useState } from "react";
import Container from "../ui/Container";
import BreadCrumb from "../ui/BreadCrumb";

import { Pencil, Upload } from "lucide-react";
import Button from "../ui/Button";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Select, Input as AntInput } from "antd";

import { useLazyGetPortfolioQuery } from "../api/portfolio";

import UploadModal from "../modules/portfolio/uploadModal";
import {
  useLazyGetAllDocumentQuery,
  useLazyGetDocumentQuery,
} from "../api/documentApi";
import { useLazyGetReportQuery } from "../api/reportsApi";
import { formatDate } from "date-fns";

const { Option } = Select;

function ReportDetails() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const [docOpen, setDocOpen] = useState(false);

  const { id } = useParams();
  const [getReport, { data: reportData, isFetching }] = useLazyGetReportQuery();
  const [searchTerm, setSearchTerm] = useState("");

  const [getDocs, { data }] = useLazyGetAllDocumentQuery();

  const getDocuments = () => {
    getDocs(id);
  };
  useEffect(() => {
    getDocs(id);
    getReport(id);
  }, [id]);

  return (
    <div>
      <Container>
        <BreadCrumb data={["Dashboard", "HSE Reports", "HSE Report details"]} />
        <div className="mt-[32px] lg:flex justify-between  items-end">
          <div>
            <p className="text-[1.5rem] font-[700] text-neutral-450">
              {reportData?.report?.title ?? "--"}
            </p>
            <div className="flex text-sm">
              <p>
                {reportData?.report?.reporter?.firstName}{" "}
                {reportData?.report?.reporter?.lastName}
              </p>
              .{" "}
              {reportData?.report?.createdAt &&
                formatDate(reportData?.report?.createdAt, "MMMM d, yyyy")}
            </div>
          </div>

          <div className="flex gap-[16px] mt-2">
            <Button
              className="bg-transparent text-[0.865rem] border text-neutral-550"
              onClick={() =>
                navigate(`/dashboard/HSE-reports/edit-report/${id}`)
              }
            >
              <Pencil size={14} />
              <p>Edit Report Details</p>
            </Button>

            <Button
              className=" text-[0.865rem] border text-neutral"
              onClick={() => setDocOpen(!open)}
            >
              <Upload size={14} />
              <p>Upload Document</p>
            </Button>
          </div>
        </div>

        <div className="lg:flex mt-4 gap-[16px] ">
          <Container className="border  rounded-md p-4">
            <p className="text-[1.25rem] font-[700] px-4  text-neutral-500 mb-6">
              Report Content
            </p>
            <div
              className="px-4"
              dangerouslySetInnerHTML={{ __html: reportData?.report?.report }}
            />
          </Container>
          <Card className="lg:w-[50%]">
            <div className="flex justify-between items-center">
              <p className="py-4 font-[700] text-neutral-450 max-w-[300px]">
                Report Documents
              </p>
            </div>
            <div className="px-4 py-2">
              {data?.documents?.length > 0 ? (
                <ul className="space-y-2">
                  {data.documents.map((doc: any, index: number) => (
                    <li
                      key={index}
                      className="flex items-center justify-between border-b pb-2"
                    >
                      <p className="text-[0.865rem] text-neutral-600">
                        {doc.name}
                      </p>
                      <a
                        href={doc.firebaseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-[0.85rem] hover:underline"
                      >
                        View
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[0.85rem] text-neutral-400">
                  No documents uploaded yet.
                </p>
              )}
            </div>
          </Card>
        </div>
      </Container>

      <UploadModal
        getDocuments={getDocuments}
        isModalOpen={docOpen}
        handleCancel={() => setDocOpen(!docOpen)}
      />
    </div>
  );
}

export default ReportDetails;
