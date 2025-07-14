import React from "react";
import { Form, Formik } from "formik";
import Input from "../input/Input";
import Button from "../../ui/Button";
import * as Yup from "yup";
import { emailAddressValidation } from "../../constants/validationConstants";
import { useLoginUserMutation } from "../../api/authApi";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";

const loginValidation = Yup.object().shape({
  email: emailAddressValidation,
  password: Yup.string().required("Password is required"),
});

function LoginForm() {
  const navigate = useNavigate();
  const [loginUser, { isLoading }] = useLoginUserMutation();
  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
      }}
      validationSchema={loginValidation}
      onSubmit={(values) => {
        loginUser(values)
          .unwrap()
          .then((response) => {
            toast.success("Logged in successful");

            const accessToken = response.token;
            const refreshToken = response.token;

            Cookies.set("authToken", accessToken, {
              sameSite: "Strict",
              secure: true,
            });

            Cookies.set("refreshToken", refreshToken, {
              sameSite: "Strict",
              secure: true,
            });

            setTimeout(() => {
              navigate("/dashboard");
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
            placeholder="Enter your email address"
          />

          <Input
            title="Password"
            errors={errors.password}
            name="password"
            touched={touched.password}
            placeholder="Enter your password"
            type="password"
          />

          <Button isLoading={isLoading} className="mt-[15px] h-[56px] w-[100%]">
            <p>Submit</p>
          </Button>

          <Link
            to="/forgot-password"
            className="text-[0.875rem] text-[#093aa4] mt-[10px]"
          >
            Forgot Password?
          </Link>
        </Form>
      )}
    </Formik>
  );
}

export default LoginForm;
