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

        <div className="mt-10"></div>
      </div>
    </Container>
  );
}

export default Settings;
