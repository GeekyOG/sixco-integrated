import { useEffect } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import {
  Input,
  Checkbox,
  Skeleton,
  Typography,
  Form as AntForm,
  Collapse,
} from "antd";

import * as Yup from "yup";
import Button from "../ui/Button";
import {
  useGetAllPermissionsQuery,
  useGetRoleQuery,
  useLazyGetRoleQuery,
  useUpdateRoleMutation,
} from "../api/rolesApi";
import { useParams } from "react-router-dom";

const { Title, Text } = Typography;

interface CreateRoleFormData {
  name: string;
  permissionNames: string[];
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Role name is required"),
  permissionNames: Yup.array().min(1, "Select at least one permission"),
});

const EditRole = () => {
  const { data, isFetching, isSuccess } = useGetAllPermissionsQuery("");

  const { id } = useParams();

  const [getRole, { data: roleData }] = useLazyGetRoleQuery();

  const initialValues: CreateRoleFormData = {
    name: roleData?.role.name,
    permissionNames: roleData?.role.permissions,
  };

  console.log(roleData?.role);

  useEffect(() => {
    getRole(id);
  }, [id]);

  console.log(id);

  const [createRole, { isLoading, isError, isSuccess: isCreateSuccess }] =
    useUpdateRoleMutation();

  const { Panel } = Collapse;
  const groupedPermissions = data?.permissions?.reduce((acc, permission) => {
    const [module] = permission.name.split(":");
    if (!acc[module]) acc[module] = [];
    acc[module].push(permission);
    return acc;
  }, {} as Record<string, typeof data.permissions>);

  return (
    <div className="mt-8 max-w-3xl">
      <p className="font-[800] text-[1.25rem]">Edit Role</p>
      <p className="text-[0.865rem] text-neutral-400">
        Enter role name and select permissions
      </p>
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          console.log("Form submitted:", values);
          createRole({ body: values, id });
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleSubmit,
          setFieldValue,
        }) => (
          <Form
            onSubmit={handleSubmit}
            className="flex mt-4 flex-col gap-6 max-w-[500px]"
          >
            <AntForm.Item
              validateStatus={touched.name && errors.name ? "error" : ""}
              help={touched.name && errors.name}
            >
              <p className="text-[700]">Role Name</p>
              <Input
                className="max-w-[300px]"
                name="name"
                placeholder="Enter Name"
                value={values.name}
                onChange={handleChange}
              />
            </AntForm.Item>

            <AntForm.Item
              validateStatus={
                touched.permissionNames && errors.permissionNames ? "error" : ""
              }
              help={touched.permissionNames && errors.permissionNames}
            >
              <p className="text-[700]">Permissions</p>
              <Text type="secondary" className="text-[0.813rem]">
                Select at least one permission
              </Text>

              {isFetching && (
                <div className="mt-[14px]">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton.Input key={i} active className="mt-2 w-[50%]" />
                  ))}
                </div>
              )}

              {!isFetching && isSuccess && (
                <div className="mt-[14px] flex flex-col gap-6">
                  <Collapse accordion className="mt-[14px]">
                    {Object.entries(groupedPermissions).map(
                      ([module, permissions]) => {
                        const allChecked = permissions?.every((perm) =>
                          values.permissionNames?.includes(perm.name)
                        );

                        return (
                          <Panel
                            header={
                              <div className="flex justify-between items-start w-full">
                                <span className="capitalize font-medium">
                                  {module}
                                </span>
                                <Button
                                  size="small"
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation(); // prevent accordion toggle
                                    const newPermissions = allChecked
                                      ? values.permissionNames.filter(
                                          (name) =>
                                            !permissions.some(
                                              (perm) => perm.name === name
                                            )
                                        )
                                      : Array.from(
                                          new Set([
                                            ...values.permissionNames,
                                            ...permissions.map(
                                              (perm) => perm.name
                                            ),
                                          ])
                                        );
                                    setFieldValue(
                                      "permissionNames",
                                      newPermissions
                                    );
                                  }}
                                >
                                  {allChecked ? "Uncheck All" : "Check All"}
                                </Button>
                              </div>
                            }
                            key={module}
                          >
                            <div className="flex flex-col gap-3">
                              {permissions.map((item) => (
                                <Checkbox
                                  key={item.id}
                                  checked={values.permissionNames?.includes(
                                    item.name
                                  )}
                                  onChange={(e) => {
                                    const checked = e.target.checked;
                                    if (checked) {
                                      setFieldValue("permissions", [
                                        ...values.permissionNames,
                                        item.name,
                                      ]);
                                    } else {
                                      setFieldValue(
                                        "permissionNames",
                                        values.permissionNames.filter(
                                          (name) => name !== item.name
                                        )
                                      );
                                    }
                                  }}
                                >
                                  <p className="text-[0.75rem]">
                                    {item.description}
                                  </p>
                                </Checkbox>
                              ))}
                            </div>
                          </Panel>
                        );
                      }
                    )}
                  </Collapse>
                </div>
              )}
            </AntForm.Item>

            <Button className="max-w-[200px]">Update Role</Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditRole;
