import React from "react";
import { Form, Formik } from "formik";
import Input from "../input/Input";
import Button from "../../ui/Button";
import * as Yup from "yup";
import { emailAddressValidation } from "../../constants/validationConstants";
import {
  useLoginUserMutation,
  useRegisterUserMutation,
} from "../../api/authApi";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import { Switch } from "antd";

const loginValidation = Yup.object().shape({
  email: emailAddressValidation,
  password: Yup.string().required("Password is required"),
});

function RegisterForm() {
  const [addClient, { isLoading: clientLoading }] = useRegisterUserMutation();

  return (
    <div>
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          password: "",
          role: "admin",
          id: "",
        }}
        enableReinitialize={true}
        onSubmit={(values) => {
          addClient(values)
            .unwrap()
            .then((res) => {
              toast.success("User added successfully!");
            })
            .catch((err) => {
              toast.error(err.data?.message || "Failed to add user");
            });
        }}
      >
        {({ errors, touched }) => (
          <Form className="flex flex-col gap-[15px]">
            <div className="flex items-center gap-[10px]">
              <Switch checked={true} />

              <span>Is Staff</span>
            </div>
            <Input
              title="First Name"
              name="firstName"
              placeholder="Enter your first name"
              errors={errors.firstName}
              touched={touched.firstName}
            />
            <Input
              title="Last Name"
              name="lastName"
              placeholder="Enter your first name"
              errors={errors.lastName}
              touched={touched.lastName}
            />
            <Input
              title="Email Address"
              name="email"
              placeholder="Enter your first name"
              errors={errors.email}
              touched={touched.email}
            />

            <Input
              title="Phone Number"
              name="phoneNumber"
              placeholder="Enter your phone number"
              errors={errors.phoneNumber}
              touched={touched.phoneNumber}
            />

            <Button isLoading={clientLoading} className="h-[56px]">
              {clientLoading ? "Loading.." : "Submit"}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default RegisterForm;
