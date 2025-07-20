import { Drawer, Switch } from "antd";
import { Field, Form, Formik } from "formik";
import React, { useEffect } from "react";
import Input from "../../components/input/Input";
import Button from "../../ui/Button";
import Toggle from "react-toggle";
import { toast } from "react-toastify";
import {
  useLazyGetUserQuery,
  useRegisterUserMutation,
  useUpdateUserMutation,
} from "../../api/authApi";
import {
  useAddClientMutation,
  useLazyGetClientsQuery,
  useUpdateClientsMutation,
} from "../../api/clientApi";

interface AddStaffProps {
  id?: string;
  open: boolean;
  setShowDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}

function AddStaff({ open, setShowDrawer, id }: AddStaffProps) {
  const onClose = () => {
    setShowDrawer(false);
  };

  const [addClient, { isLoading: clientLoading }] = useRegisterUserMutation();
  const [updateClients, { isLoading: updateClientLoading }] =
    useUpdateUserMutation();
  const [getClient, { data }] = useLazyGetUserQuery();

  useEffect(() => {
    if (id) {
      getClient(id);
    }
  }, [id]);

  const [isClient, setIsClient] = React.useState(false);
  const handleTofuChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsClient(e.target.checked);
  };

  return (
    <Drawer title="Add Staff" onClose={onClose} open={open}>
      <div>
        <Formik
          initialValues={{
            firstName: data?.firstName ?? "",
            lastName: data?.lastName ?? "",
            email: data?.email ?? "",
            phoneNumber: "",
            password: "",
            id: "",
          }}
          enableReinitialize={true}
          onSubmit={(values) => {
            if (id) {
              updateClients({
                id: id,
                body: {
                  firstName: data?.firstName ?? "",
                  lastName: data?.lastName ?? "",
                  email: data?.email ?? "",
                  role: "admin",
                },
              });
            } else {
              addClient(values)
                .unwrap()
                .then((res) => {
                  toast.success("User added successfully!");
                  setShowDrawer(false);
                })
                .catch((err) => {
                  toast.error(err.data?.message || "Failed to add user");
                });
            }
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

              <Button
                isLoading={clientLoading || updateClientLoading}
                className="h-[56px]"
              >
                {clientLoading || updateClientLoading ? "Loading.." : "Submit"}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </Drawer>
  );
}

export default AddStaff;
