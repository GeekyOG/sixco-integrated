import React from "react";
import { Form, Formik } from "formik";
import Input from "../input/Input";
import Button from "../../ui/Button";
import * as Yup from "yup";
import { emailAddressValidation } from "../../constants/validationConstants";
import {
  useForgotPasswordMutation,
  useLoginUserMutation,
} from "../../api/authApi";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";

const loginValidation = Yup.object().shape({
  email: emailAddressValidation,
});

function ForgotPasswordForm() {
  const navigate = useNavigate();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  return (
    <Formik
      initialValues={{
        email: "",
      }}
      validationSchema={loginValidation}
      onSubmit={(values) => {
        values;
        forgotPassword(values)
          .unwrap()
          .then((response) => {
            toast.success(
              "Request sent successfully! Please check your email."
            );

            setTimeout(() => {
              navigate("/reset-password");
            }, 1000);
          })
          .catch((error) => {
            toast.error(error.msg ?? "Something went wrong");
          });
      }}
    >
      {({ errors, touched }) => (
        <Form className="flex flex-col gap-[8px]">
          <Input
            title="Email"
            errors={errors.email}
            name="email"
            touched={touched.email}
            width="w-[100%] lg:w-[450px]"
            placeholder="Enter your email address"
          />

          <Button isLoading={isLoading} className="mt-[15px] h-[56px] w-[100%]">
            <p>Submit</p>
          </Button>

          <Link to="/" className="text-[0.875rem] text-[#093aa4] mt-[10px]">
            Go back to login
          </Link>
        </Form>
      )}
    </Formik>
  );
}

export default ForgotPasswordForm;
