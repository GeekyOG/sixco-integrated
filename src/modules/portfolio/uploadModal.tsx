import { Image, Modal, Upload, UploadFile, UploadProps } from "antd";
import React, { useState } from "react";
import Button from "../../ui/Button";
import { FieldNamesType } from "antd/es/cascader";
import { Plus } from "lucide-react";
import { useAddDocumentMutation } from "../../api/documentApi";
import { useParams } from "react-router-dom";

function UploadModal({
  isModalOpen,
  handleCancel,
  getDocuments,
}: {
  isModalOpen: boolean;
  handleCancel: () => void;
  getDocuments: () => void;
}) {
  const { id } = useParams();

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FieldNamesType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const [upload, { isLoading }] = useAddDocumentMutation();

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <Plus />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("projectId", id as string);
    formData.append("files", fileList[0].originFileObj as Blob);

    upload({ id, body: formData })
      .unwrap()
      .then(() => {
        getDocuments();
        handleCancel();
      });
  };
  return (
    <Modal
      title="Upload Project Documents"
      closable={{ "aria-label": "Custom Close Button" }}
      open={isModalOpen}
      onCancel={handleCancel}
      footer={
        <div className="flex gap-[6px]">
          <Button isLoading={isLoading} onClick={handleSubmit}>
            {isLoading ? "Loading" : "Upload"}
          </Button>

          <Button className="bg-red-600" onClick={handleCancel}>
            Close
          </Button>
        </div>
      }
    >
      <>
        <Upload
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
        >
          {fileList.length >= 1 ? null : uploadButton}
        </Upload>
        {previewImage && (
          <Image
            wrapperStyle={{ display: "none" }}
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => !visible && setPreviewImage(""),
            }}
            src={previewImage}
          />
        )}
      </>
    </Modal>
  );
}

export default UploadModal;
