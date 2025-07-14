import React, { useEffect, useState } from "react";
import Container from "../ui/Container";
import { Form, Formik } from "formik";
import Dropzone from "react-dropzone";
import { cn } from "../utils/cn";
import Button from "../ui/Button";
import { toast } from "react-toastify";
import { Image } from "lucide-react";
import Input from "../components/input/Input";

function Settings() {
  const [imageError, setImageError] = useState("");
  const [image, setImage] = useState<any>("");
  const [display, setDisplay] = useState("");

  const isSuccess = false;

  const isLoading = false;

  const data = [
    {
      imgUrl: "",
    },
  ];

  return (
    <Container className="pb-[200px]">
      <div className="mt-[26px]">
        <div className="flex items-center justify-between text-[0.895rem] font-[500]">
          <p className="text-[2rem] font-[700]">Settings</p>
        </div>

        <div className="mt-10">
          <p className="text-[1.25rem] font-[500]">Change Logo</p>

          <Formik
            initialValues={{
              image: "",
            }}
            onSubmit={(values, { resetForm }) => {}}
          >
            {() => (
              <Form encType="multipart/form-data" className="mt-3">
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
                    <div className="flex">
                      <section>
                        <div
                          {...getRootProps()}
                          className={cn(
                            "border-[2px] py-2 cursor-pointer rounded-[10px] items-center justify-center px-2 border-neutral-200",
                            { "border-[#80F5BD]": acceptedFiles.length > 0 }
                          )}
                        >
                          <input
                            {...getInputProps()}
                            className="absolute"
                            name="image"
                          />
                          <div className="flex items-center gap-3">
                            {isSuccess ? (
                              <img
                                src={display || data[0]?.imgUrl}
                                className="max-h-[100px] w-[100px]"
                              />
                            ) : (
                              <Image size={100} className="text-neutral-200" />
                            )}

                            <div>
                              <p className="text-[0.895rem]">Upload Logo</p>

                              {acceptedFiles.length > 0 ? (
                                <div className=" w-fit rounded-[3px] bg-neutral-200 px-3 py-2 text-xs leading-[1.4] tracking-[-0.02em]">
                                  {acceptedFiles[0].name}
                                </div>
                              ) : (
                                <div className=" w-fit rounded-[3px] bg-neutral-200 px-3 py-2 text-xs leading-[1.4] tracking-[-0.02em] text-[#808084]">
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
                <Button className="mt-[10px]" isLoading={isLoading}>
                  Update Logo
                </Button>
              </Form>
            )}
          </Formik>
        </div>

        <div className="mt-10">
          <p className="text-[1.25rem] font-[500]">Social Media Accounts</p>

          <div className=" max-w-[400px]">
            <Formik
              initialValues={{
                instagram: "",
                youtube: null,
                twitter: null,
                pinterest: null,
              }}
              onSubmit={(values) => {}}
            >
              {({ errors, touched, values }) => {
                return (
                  <Form className="flex flex-col gap-[8px] mt-5">
                    <Input
                      title="Instagram"
                      errors={errors.instagram}
                      name="instagram"
                      touched={touched.instagram}
                      placeholder="Enter your email address"
                    />

                    <Input
                      title="Youtube"
                      errors={errors.youtube}
                      name="youtube"
                      touched={touched.youtube}
                      placeholder="Enter your email address"
                    />

                    <Input
                      title="Twitter"
                      errors={errors.twitter}
                      name="twitter"
                      touched={touched.twitter}
                      placeholder="Enter your email address"
                    />
                    <Input
                      title="Pinterest"
                      errors={errors.pinterest}
                      name="pinterest"
                      touched={touched.pinterest}
                      placeholder="Enter your email address"
                    />

                    <Button
                      isLoading={false}
                      className="mt-[15px] h-[56px] w-[100%]"
                    >
                      <p>Submit</p>
                    </Button>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default Settings;
