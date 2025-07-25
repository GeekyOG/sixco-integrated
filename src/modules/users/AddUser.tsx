import { Drawer, Switch } from "antd";
import { Field, Form, Formik } from "formik";
import React, { useEffect } from "react";
import Input from "../../components/input/Input";
import Button from "../../ui/Button";
import Toggle from "react-toggle";
import { toast } from "react-toastify";
import {
  useRegisterUserMutation,
  useUpdateUserMutation,
} from "../../api/authApi";
import {
  useAddClientMutation,
  useLazyGetClientsQuery,
  useUpdateClientsMutation,
} from "../../api/clientApi";

interface AddUserProps {
  id?: string;
  open: boolean;
  setShowDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}

function AddUser({ open, setShowDrawer, id }: AddUserProps) {
  const onClose = () => {
    setShowDrawer(false);
  };

  const [getClients] = useLazyGetClientsQuery();
  const [addClient, { isLoading: clientLoading }] = useAddClientMutation();
  const [updateClients, { isLoading: updateClientLoading }] =
    useUpdateUserMutation();
  const [getClient, { data }] = useLazyGetClientsQuery();

  useEffect(() => {
    if (id) {
      getClient(id);
    }
  }, [id]);

  const [isClient, setIsClient] = React.useState(false);
  const handleTofuChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsClient(e.target.checked);
  };

  console.log(id, isClient);

  return (
    <Drawer title="Add Client" onClose={onClose} open={open}>
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
                  phoneNumber: data?.phoneNumber ?? "",
                },
              });
            } else {
              addClient(values)
                .unwrap()
                .then((res) => {
                  getClients("");
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
              <div className="flex items-center gap-[10px]"></div>
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

export default AddUser;
