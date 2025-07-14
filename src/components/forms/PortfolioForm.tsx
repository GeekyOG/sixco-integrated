import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import Button from "../../ui/Button";
import Dropzone from "react-dropzone";
import { cn } from "../../utils/cn";
import { Image } from "lucide-react";
import Input from "../input/Input";
import { toast } from "react-toastify";

import {
  useAddPortfolioMutation,
  useLazyGetPortfolioQuery,
  useUpdatePortfolioMutation,
} from "../../api/portfolio";

interface AddPortfolioFormProps {
  reset: boolean;
  callBackAction?: () => void;
  id?: string;
}

const Categories = ["Pending", "Completed"];

const AddPortfolioForm: React.FC<AddPortfolioFormProps> = ({
  reset,
  callBackAction,
  id,
}) => {
  const [imageError, setImageError] = useState("");
  const [image, setImage] = useState<any>("");
  const [display, setDisplay] = useState("");
  const [description, setDescription] = useState("");

  const [addPortfolio, { isLoading }] = useAddPortfolioMutation();

  const [getPortfolio, { data, isLoading: featuredLoading }] =
    useLazyGetPortfolioQuery();

  const [updatePortfolio, { isLoading: updateLoading }] =
    useUpdatePortfolioMutation();

  const [category, setCategory] = useState("");

  const [type, setType] = useState("youtube");

  useEffect(() => {
    if (id) {
      setDescription(data?.description);
      setCategory(data?.category);
      setType(data?.type);
      setDisplay(`https://zerosix.aoudit.com/api/v1/portfolio/image/${id}`);

      getPortfolio(id)
        .unwrap()
        .then(() => {});
    }
  }, [id, featuredLoading, reset, data]);

  return (
    <div>
      {featuredLoading && id && (
        <img
          src="/dark-spinner.svg"
          alt=""
          className={cn("h-[30px] w-[30px] mx-auto mt-[100px]")}
        />
      )}
      {!featuredLoading && (
        <Formik
          initialValues={{
            image: "",
            title: data?.title || "",
            description: data?.description || "",
            videoUrl: data?.videoUrl || "",
            category: data?.category || "",
          }}
          onSubmit={(values, { resetForm }) => {
            console.log(values);

            const formData = new FormData();
            formData.append("image", image);
            formData.append("title", values.title);
            formData.append("description", description);
            formData.append("videoUrl", values.videoUrl);
            formData.append("category", category);
            formData.append("type", type);

            if (id) {
              updatePortfolio({ body: formData, id })
                .unwrap()
                .then(() => {
                  resetForm();
                  setDisplay("");
                  setDescription("");
                  toast.success("Action successful");
                  if (callBackAction) {
                    callBackAction();
                  }
                })
                .catch((err) => {
                  toast.error(err.message ?? "Something went wrong");
                });
            }

            if (!id) {
              addPortfolio(formData)
                .unwrap()
                .then(() => {
                  resetForm();
                  setDisplay("");
                  setDescription("");
                  toast.success("Action successful");
                  if (callBackAction) {
                    callBackAction();
                  }
                })
                .catch((err) => {
                  toast.error(err.data.msg ?? "Something went wrong");
                });
            }
          }}
        >
          {({ errors, touched, resetForm, values }) => {
            useEffect(() => {
              values.title = data?.title;
              values.description = data?.description;
              values.videoUrl = data?.videoUrl;

              if (!reset) {
                resetForm();
                setDescription("");
                setImage("");
                setDisplay("");
                setImageError("");
              }
            }, [reset, resetForm, data]);

            return (
              <Form
                encType="multipart/form-data"
                className="flex flex-col gap-3"
              >
                <Input
                  title="Title"
                  name="title"
                  touched={touched.title}
                  errors={errors.title}
                  placeholder="Enter title"
                  width="h-[36px] w-[100%] rounded-[5px]"
                />

                <div>
                  <p className="text-[0.865rem] font-[500]">
                    Project Description
                  </p>
                  <textarea
                    className="h-[200px] w-[100%] rounded-[5px] p-[5px] border-[1px]"
                    name="description"
                    placeholder="Description"
                    onChange={(e) => {
                      values.description = e.target.value;
                      setDescription(e.target.value);
                    }}
                    value={description}
                  ></textarea>
                </div>

                <Dropzone
                  accept={{
                    "image/*": [".jpg", ".jpeg", ".png"],
                  }}
                  onDropAccepted={(files) => {
                    setImageError("");
                    const file = files[0];
                    setImage(file);
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onloadend = () => {
                      const base64String = reader.result;
                      setDisplay(base64String as string);
                    };
                  }}
                  onDropRejected={() => {
                    setImageError("File size exceeds 3MB or not supported");
                  }}
                  maxSize={3000000}
                >
                  {({ getRootProps, getInputProps, acceptedFiles }) => (
                    <div className="">
                      <section>
                        <p className="text-[0.865rem] font-[500]">
                          Project Document
                        </p>
                        <div
                          {...getRootProps()}
                          className={cn(
                            "border-[1px] py-2  cursor-pointer rounded-[10px] items-center justify-center px-2 border-neutral-200 w-[100%]",
                            { "border-[#80F5BD] ": acceptedFiles.length > 0 }
                          )}
                        >
                          <input
                            {...getInputProps()}
                            className="absolute"
                            name="image"
                          />
                          <div className="flex items-center gap-3">
                            {display || data?.imgUrl ? (
                              <img
                                src={display || (data?.imgUrl ?? "")}
                                className="max-h-[100px] w-[100px]"
                              />
                            ) : (
                              ""
                              // <Image size={60} className="text-neutral-400" />
                            )}

                            <div>
                              <p className="text-[0.895rem]">
                                Upload Project Document
                              </p>

                              {display ? (
                                <div className=" w-fit rounded-[5px] bg-neutral-200 px-3 py-2 text-xs leading-[1.4] tracking-[-0.02em]">
                                  {acceptedFiles[0]?.name}
                                </div>
                              ) : (
                                <div className=" w-fit rounded-[10px] bg-neutral-200 px-3 py-2 text-xs leading-[1.4] tracking-[-0.02em] text-[#808084] mt-2">
                                  No file Selected Yet
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {imageError && (
                          <div className="mt-2 text-sm text-red-600">
                            {imageError}
                          </div>
                        )}
                      </section>
                    </div>
                  )}
                </Dropzone>

                <Dropzone
                  accept={{
                    "image/*": [".jpg", ".jpeg", ".png"],
                  }}
                  onDropAccepted={(files) => {
                    setImageError("");
                    const file = files[0];
                    setImage(file);
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onloadend = () => {
                      const base64String = reader.result;
                      setDisplay(base64String as string);
                    };
                  }}
                  onDropRejected={() => {
                    setImageError("File size exceeds 3MB or not supported");
                  }}
                  maxSize={3000000}
                >
                  {({ getRootProps, getInputProps, acceptedFiles }) => (
                    <div className="">
                      <section>
                        <p className="text-[0.865rem] font-[500]">
                          Project Images
                        </p>
                        <div
                          {...getRootProps()}
                          className={cn(
                            "border-[1px] py-2  cursor-pointer rounded-[10px] items-center justify-center px-2 border-neutral-200 w-[100%]",
                            { "border-[#80F5BD] ": acceptedFiles.length > 0 }
                          )}
                        >
                          <input
                            {...getInputProps()}
                            className="absolute"
                            name="image"
                          />
                          <div className="flex items-center gap-3">
                            {display || data?.imgUrl ? (
                              <img
                                src={display || (data?.imgUrl ?? "")}
                                className="max-h-[100px] w-[100px]"
                              />
                            ) : (
                              <Image size={60} className="text-neutral-400" />
                            )}

                            <div>
                              <p className="text-[0.895rem]">
                                Upload Project Images
                              </p>

                              {display ? (
                                <div className=" w-fit rounded-[5px] bg-neutral-200 px-3 py-2 text-xs leading-[1.4] tracking-[-0.02em]">
                                  {acceptedFiles[0]?.name}
                                </div>
                              ) : (
                                <div className=" w-fit rounded-[10px] bg-neutral-200 px-3 py-2 text-xs leading-[1.4] tracking-[-0.02em] text-[#808084] mt-2">
                                  No file Selected Yet
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {imageError && (
                          <div className="mt-2 text-sm text-red-600">
                            {imageError}
                          </div>
                        )}
                      </section>
                    </div>
                  )}
                </Dropzone>
                <Button isLoading={isLoading || updateLoading}>
                  Add Project
                </Button>
              </Form>
            );
          }}
        </Formik>
      )}
    </div>
  );
};

export default AddPortfolioForm;
