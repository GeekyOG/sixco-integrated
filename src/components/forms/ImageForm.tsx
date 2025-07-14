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
import axios from "axios";

interface AddImageFormProps {
  reset: boolean;
  callBackAction?: () => void;
  id?: string;
}

const Categories = [
  "",
  "DOCUMENTARY",
  "CONCERTS",
  "EVENTS",
  "FOOD",
  "LANDSCAPE",
  "COMMERCIAL",
  "PHOTOGRAPHY",
  "FASHION",
  "LIFESTYLE",
];

const AddImageForm: React.FC<AddImageFormProps> = ({
  reset,
  callBackAction,
  id,
}) => {
  const [imageError, setImageError] = useState("");
  const [image, setImage] = useState<any>("");
  const [display, setDisplay] = useState("");
  const [description, setDescription] = useState("");

  const [getPortfolio, { data, isLoading: featuredLoading }] =
    useLazyGetPortfolioQuery();

  const [updatePortfolio, { isLoading: updateLoading }] =
    useUpdatePortfolioMutation();

  const [category, setCategory] = useState("");

  useEffect(() => {
    if (id) {
      setDescription(data?.description);
      setCategory(data?.category);

      setDisplay(`https://zerosix.aoudit.com/api/v1/portfolio/image/${id}`);

      getPortfolio(id)
        .unwrap()
        .then(() => {});
    }
  }, [id, featuredLoading, reset, data]);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [message, setMessage] = useState("");

  // Handle file selection
  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files);
  };

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
            title: data?.title || "",
            category: data?.category || "",
          }}
          onSubmit={async (values, { resetForm }) => {
            const formData = new FormData();
            formData.append("category", category);
            formData.append("name", values.title);

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
          }}
        >
          {({ errors, touched, resetForm, values }) => {
            useEffect(() => {
              values.title = data?.title;

              if (!reset) {
                resetForm();
                setDescription("");
                setImage("");
                setDisplay("");
                setImageError("");
              }
            }, [reset, resetForm, data]);

            console.log(image);

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

                <p>Category</p>
                <select
                  name="category"
                  required
                  id=""
                  className="border-[1px] px-[10px] py-[10px] outline-0"
                  onChange={(e) => {
                    setCategory(e.target.value);
                  }}
                >
                  {data?.category && (
                    <option value={data?.category}>{data?.category}</option>
                  )}
                  {Categories.map((category) => (
                    <option value={category}>{category}</option>
                  ))}
                </select>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  accept="image/*"
                />

                <Button>Add Image</Button>
              </Form>
            );
          }}
        </Formik>
      )}
    </div>
  );
};

export default AddImageForm;
