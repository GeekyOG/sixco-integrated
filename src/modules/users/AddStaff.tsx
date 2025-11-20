import { Drawer, Switch } from "antd";
import { Field, Form, Formik } from "formik";
import React, { useEffect } from "react";
import Input from "../../components/input/Input";
import Button from "../../ui/Button";
import { toast } from "react-toastify";
import {
  useLazyGetUserQuery,
  useRegisterUserMutation,
  useUpdateUserMutation,
  useUpdateUserRoleMutation,
} from "../../api/authApi";
import SelectField from "../../components/input/SelectField";
import { useLazyGetAllRoleQuery } from "../../api/rolesApi";

interface AddStaffProps {
  id?: string;
  open: boolean;
  setShowDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  callBackAction: () => void;
}

function AddStaff({ open, setShowDrawer, id, callBackAction }: AddStaffProps) {
  const onClose = () => {
    setShowDrawer(false);
  };

  const [getALLRoles, { isFetching, data: rolesData }] =
    useLazyGetAllRoleQuery();

  useEffect(() => {
    getALLRoles("");
  }, []);
  const [addClient, { isLoading: clientLoading }] = useRegisterUserMutation();
  const [updateClients, { isLoading: updateClientLoading }] =
    useUpdateUserMutation();

  const [updateUserRole, { isLoading: updateRoleLoading }] =
    useUpdateUserRoleMutation();
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
    <Drawer
      title={id ? "Edit Staff Details" : "Add Staff"}
      onClose={onClose}
      open={open}
    >
      <div>
        <Formik
          initialValues={{
            firstName: data?.user?.firstName ?? "",
            lastName: data?.user?.lastName ?? "",
            email: data?.user?.email ?? "",
            phoneNumber: data?.user?.phoneNumber ?? "",
            roleId: data?.user?.roleId ?? "",
          }}
          enableReinitialize={true}
          onSubmit={(values) => {
            if (id) {
              updateClients({
                id: id,
                body: {
                  ...values,
                },
              })
                .unwrap()
                .then((res) => {
                  updateUserRole({
                    id,
                    body: { roleId: values.roleId },
                  });
                  callBackAction();
                  toast.success("Action successful!");
                  setShowDrawer(false);
                })
                .catch((err) => {
                  toast.error(err.data?.message || "Failed to add user");
                });
            } else {
              addClient(values)
                .unwrap()
                .then((res) => {
                  callBackAction();
                  toast.success("User added successfully!");
                  setShowDrawer(false);
                })
                .catch((err) => {
                  toast.error(err.data?.message || "Failed to add user");
                });
            }
          }}
        >
          {({ errors, touched, setFieldValue }) => (
            <Form className="flex flex-col gap-[15px]">
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

              <SelectField
                className="h-[32px]"
                fetchData={getALLRoles}
                setFieldValue={setFieldValue}
                name="roleId"
                data={rolesData?.roles}
                searchParam="name"
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
