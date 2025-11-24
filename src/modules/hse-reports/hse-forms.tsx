// FormComponents.tsx
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  AlertCircle,
  Users,
  Calendar,
  Clock,
  Plus,
  Search,
} from "lucide-react";
import {
  useAddAuditScheduleMutation,
  useDeleteAuditScheduleMutation,
  useUpdateAuditScheduleMutation,
} from "../../api/auditSchedule";
import { toast } from "react-toastify";
import {
  useAddTrainingMutation,
  useDeleteTrainingMutation,
  useLazyGetTrainingQuery,
  useUpdateTrainingMutation,
} from "../../api/hseTraining";
import { useLazyGetAllUsersQuery } from "../../api/authApi";
import { useEffect, useState } from "react";
import {
  useAddRiskMutation,
  useDeleteRiskMutation,
  useUpdateRiskMutation,
} from "../../api/risksApi";

export const riskValidationSchema = Yup.object({
  hazard: Yup.string()
    .required("Hazard description is required")
    .min(10, "Hazard description must be at least 10 characters"),
  severity: Yup.string().required("Severity is required"),
  likelihood: Yup.string().required("Likelihood is required"),
  mitigation: Yup.string()
    .required("Mitigation plan is required")
    .min(20, "Mitigation plan must be at least 20 characters"),
  ownerId: Yup.string().required("Risk owner is required"),
  reviewDate: Yup.string(),
});

export const auditValidationSchema = Yup.object({
  title: Yup.string()
    .required("Audit title is required")
    .min(5, "Audit title must be at least 5 characters"),
  inspectors: Yup.string().required("Inspector is required"),
  date: Yup.date()
    .required("Audit date is required")
    .min(new Date(), "Audit date must be in the future"),
  area: Yup.string().required("Area is required"),
});

export const trainingValidationSchema = Yup.object({
  courseName: Yup.string()
    .required("Training course name is required")
    .min(5, "Course name must be at least 5 characters"),
  attendeeIds: Yup.array()
    .min(1, "At least one attendee must be selected")
    .required("Required attendees are required"),
  nextTrainingDate: Yup.date()
    .required("Training date is required")
    .min(new Date(), "Training date must be in the future"),
});

// ==================== REUSABLE COMPONENTS ====================

// Error Message Component
export const FormError = ({ name }: { name: string }) => (
  <ErrorMessage name={name}>
    {(msg) => (
      <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
        <AlertCircle className="w-4 h-4" />
        <span>{msg}</span>
      </div>
    )}
  </ErrorMessage>
);

// Custom Input Component
export const FormInput = ({
  label,
  name,
  type = "text",
  placeholder,
  icon: Icon,
  disabled = false,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  icon?: any;
  disabled?: boolean;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Icon className="w-5 h-5" />
        </div>
      )}
      <Field
        name={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full ${
          Icon ? "pl-10" : "pl-4"
        } pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed`}
      />
    </div>
    <FormError name={name} />
  </div>
);

// Custom Select Component
export const FormSelect = ({
  label,
  name,
  options,
  icon: Icon,
}: {
  label: string;
  name: string;
  options: Array<{ value: string; label: string }>;
  icon?: any;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Icon className="w-5 h-5" />
        </div>
      )}
      <Field
        as="select"
        name={name}
        className={`w-full ${
          Icon ? "pl-10" : "pl-4"
        } pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white cursor-pointer`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </Field>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
    <FormError name={name} />
  </div>
);

// Custom Textarea Component
export const FormTextarea = ({
  label,
  name,
  placeholder,
  rows = 4,
}: {
  label: string;
  name: string;
  placeholder?: string;
  rows?: number;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <Field
      as="textarea"
      name={name}
      rows={rows}
      placeholder={placeholder}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
    />
    <FormError name={name} />
  </div>
);

// ==================== FORM COMPONENTS ====================

// Add/Edit Risk Form
export const AddRiskForm = ({
  onSubmit,
  onCancel,
  initialValues,
  callBack,
}: {
  onSubmit: (values: any) => void;
  onCancel: () => void;
  initialValues?: any;
  callBack: () => void;
}) => {
  const userDataRaw = localStorage.getItem("userData");
  const userData = userDataRaw ? JSON.parse(userDataRaw) : null;
  const [addRisk, { isLoading }] = useAddRiskMutation();
  const [updateRisk, { isLoading: updating }] = useUpdateRiskMutation();

  return (
    <Formik
      initialValues={
        initialValues || {
          hazard: "",
          severity: "Medium",
          likelihood: "Medium",
          status: "Identified",
          mitigation: "",
          ownerId: userData.id,
          reviewDate: new Date(),
        }
      }
      validationSchema={riskValidationSchema}
      onSubmit={(values) => {
        if (initialValues) {
          updateRisk({ id: initialValues.id, body: values })
            .unwrap()
            .then(() => {
              toast.success("Operation Successful");
              callBack();
            })
            .catch((err) => {
              toast.error(err.data.error ?? "Something went wrong");
            });
        } else {
          addRisk(values)
            .unwrap()
            .then(() => {
              toast.success("Operation Successful");
              callBack();
            })
            .catch((err) => {
              toast.error(err.data.error ?? "Something went wrong");
            });
        }

        onSubmit(values);
      }}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-6">
          <FormTextarea
            label="Hazard Description"
            name="hazard"
            placeholder="Describe the identified hazard in detail..."
            rows={3}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              label="Severity Level"
              name="severity"
              options={[
                { value: "Low", label: "Low" },
                { value: "Medium", label: "Medium" },
                { value: "High", label: "High" },
                { value: "Critical", label: "Critical" },
              ]}
            />

            <FormSelect
              label="Likelihood"
              name="likelihood"
              options={[
                { value: "Low", label: "Low" },
                { value: "Medium", label: "Medium" },
                { value: "High", label: "High" },
              ]}
            />
          </div>

          <FormTextarea
            label="Mitigation Strategy"
            name="mitigation"
            placeholder="Outline the steps to mitigate this risk..."
            rows={4}
          />

          {/* <FormInput
            label="Risk Owner"
            name="owner"
            placeholder="Enter risk owner name"
          /> */}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || updating}
              className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading || updating
                ? "Saving..."
                : initialValues
                ? "Update Risk"
                : "Save Risk"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export const DeleteRisk = ({
  data,
  closeModal,
}: {
  data: any;
  closeModal: () => void;
}) => {
  const [deleteRisk, { isLoading }] = useDeleteRiskMutation();
  return (
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-500 mb-1">Hazard</p>
        <p className="text-gray-900 font-medium">{data?.hazard}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-500 mb-1">Severity</p>
          <span
            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
              data?.severity === "High"
                ? "bg-red-100 text-red-700"
                : data?.severity === "Medium"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {data?.severity}
          </span>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-500 mb-1">Likelihood</p>
          <span
            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
              data?.likelihood === "High"
                ? "bg-red-100 text-red-700"
                : data?.likelihood === "Medium"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {data?.likelihood}
          </span>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-500 mb-1">Mitigation</p>
        <p className="text-gray-900">{data?.mitigation}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-500 mb-1">Status</p>
          <p className="text-gray-900 font-medium">{data?.status}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-500 mb-1">Owner</p>
          <p className="text-gray-900 font-medium">
            {" "}
            {data["owner.firstName"]} {data["owner.lastName"]}
          </p>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-500 mb-1">Review Date</p>
        <p className="text-gray-900 font-medium">{data?.reviewDate}</p>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          disabled={isLoading}
          onClick={() => {
            deleteRisk(data.id)
              .unwrap()
              .then(() => {
                closeModal();
              });
          }}
          className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
        >
          Delete
        </button>
        <button
          onClick={closeModal}
          className="px-6 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
        >
          Close
        </button>
      </div>
    </div>
  );
};

// Schedule Audit Form
export const ScheduleAuditForm = ({
  callBack,
  onSubmit,
  onCancel,
  initialValues,
}: {
  onSubmit: (values: any) => void;
  onCancel: () => void;
  initialValues?: any;
  callBack: () => void;
}) => {
  const [addSchedule, { isLoading }] = useAddAuditScheduleMutation();
  const [updateSchedule, { isLoading: updateLoading }] =
    useUpdateAuditScheduleMutation();

  return (
    <Formik
      initialValues={
        initialValues || {
          title: "",
          inspectors: "",
          date: "",
          area: "",
        }
      }
      validationSchema={auditValidationSchema}
      onSubmit={(values, { setSubmitting }) => {
        if (initialValues) {
          updateSchedule({ id: initialValues.id, body: values })
            .unwrap()
            .then(() => {
              toast.success("Operation Successful");
              callBack();
            })
            .catch((err) => {
              toast.error(err.error ?? "Something went wrong");
            });
        } else {
          addSchedule(values)
            .unwrap()
            .then(() => {
              toast.success("Operation Successful");
              callBack();
            })
            .catch((err) => {
              toast.error(err.error ?? "Something went wrong");
            });
        }

        setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-6">
          <FormInput
            label="Audit Title"
            name="title"
            placeholder="e.g., Quarterly Safety Inspection"
          />

          <FormInput
            label="Inspector Name"
            name="inspectors"
            placeholder="Enter inspector name"
          />

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Audit Date"
              name="date"
              type="date"
              icon={Calendar}
            />

            <FormInput
              label="Area/Location"
              name="area"
              placeholder="e.g., Building A"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isLoading || updateLoading}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? "Scheduling..."
                : initialValues
                ? "Update Audit"
                : "Schedule Audit"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export const DeleteScheduleAuditForm = ({
  callBack,
  onCancel,
  initialValues,
}: {
  onSubmit: (values: any) => void;
  onCancel: () => void;
  initialValues?: any;
  callBack: () => void;
}) => {
  const [deleteSchedule, { isLoading }] = useDeleteAuditScheduleMutation();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[1.25rem] font-[700] py-3">
          Delete {initialValues.title}
        </h2>
        <p className="text-neutral-450">
          Are you sure you want to this Audit Schedule?
        </p>
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            deleteSchedule(initialValues.id)
              .unwrap()
              .then(() => {
                toast.success("Operation Successful");
                callBack();
              })
              .catch((err) => {
                toast.error(err.error ?? "Something went wrong");
              });
          }}
          type="submit"
          disabled={isLoading}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Loading..." : "Delete Audit"}
        </button>
      </div>
    </div>
  );
};

// Add Training Form
export const AddTrainingForm = ({
  onSubmit,
  onCancel,
  initialValues,
  callBack,
}: {
  onSubmit: (values: any) => void;
  onCancel: () => void;
  initialValues?: any;
  callBack: () => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [addTraining, { isLoading }] = useAddTrainingMutation();
  const [updateTraining, { isLoading: updating }] = useUpdateTrainingMutation();

  const [getStaffs, { data: staffsData, isFetching }] =
    useLazyGetAllUsersQuery();

  const [getTraining, { data }] = useLazyGetTrainingQuery();

  useEffect(() => {
    if (initialValues?.id) {
      getTraining(initialValues.id);
    }
  }, [initialValues?.id, getTraining]);

  useEffect(() => {
    getStaffs({
      firstName: searchTerm,
      limit: 50,
    });
  }, [searchTerm]);

  const users = staffsData?.users ?? [];

  return (
    <Formik
      initialValues={
        initialValues || {
          courseName: "",
          attendeeIds: [],
          nextTrainingDate: "",
        }
      }
      validationSchema={trainingValidationSchema}
      onSubmit={(values, { setSubmitting }) => {
        if (initialValues) {
          updateTraining({ id: initialValues.id, body: values })
            .unwrap()
            .then(() => {
              toast.success("Operation Successful");
              callBack();
            })
            .catch((err) => {
              toast.error(err.data.error ?? "Something went wrong");
            });
        } else {
          addTraining(values)
            .unwrap()
            .then(() => {
              toast.success("Operation Successful");
              callBack();
            })
            .catch((err) => {
              toast.error(err.data.error ?? "Something went wrong");
            });
        }

        onSubmit(values);
      }}
    >
      {({ values, setFieldValue }) => {
        useEffect(() => {
          if (data?.attendees) {
            setFieldValue(
              "attendeeIds",
              data.attendees.map((item: { id: string }) => item.id)
            );
          }
        }, [data?.attendees]);

        return (
          <Form className="space-y-6">
            <FormInput
              label="Training Course"
              name="courseName"
              placeholder="Enter course name"
            />

            {initialValues && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <Field
                  as="select"
                  name="status"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                >
                  <option value="">Select status</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </Field>
                <FormError name="status" />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Required Attendees *
              </label>
              <div className="border border-gray-300 rounded-lg p-4 max-h-64 overflow-y-auto bg-gray-50">
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all w-64"
                      placeholder="Search by email..."
                      value={searchTerm}
                    />
                  </div>
                  {users.map((user: any) => (
                    <label
                      key={user.id}
                      className="flex items-center gap-3 p-3 hover:bg-white rounded-lg cursor-pointer transition-colors border border-transparent hover:border-gray-200"
                    >
                      <input
                        type="checkbox"
                        checked={values?.attendeeIds?.includes(user.id)}
                        onChange={(e) => {
                          const newAttendees = e.target.checked
                            ? [...values.attendeeIds, user.id]
                            : values.attendeeIds.filter(
                                (id: number) => id !== user.id
                              );
                          setFieldValue("attendeeIds", newAttendees);
                        }}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              {values?.attendeeIds?.length > 0 && (
                <div className="mt-3 flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                  <Users className="w-4 h-4" />
                  <span className="font-medium">
                    {values?.attendeeIds?.length} attendee
                    {values?.attendeeIds?.length !== 1 ? "s" : ""} selected
                  </span>
                </div>
              )}
              <FormError name="attendeeIds" />
            </div>

            <FormInput
              label="Next Training Date"
              name="nextTrainingDate"
              type="date"
              icon={Calendar}
            />

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || updating || isFetching}
                className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading
                  ? "Adding..."
                  : initialValues
                  ? "Update Training"
                  : "Add Training"}
              </button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};
export const DeleteTrainingForm = ({
  callBack,
  onCancel,
  initialValues,
}: {
  onSubmit: (values: any) => void;
  onCancel: () => void;
  initialValues?: any;
  callBack: () => void;
}) => {
  const [deleteTraining, { isLoading }] = useDeleteTrainingMutation();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[1.25rem] font-[700] py-3">
          Delete {initialValues.courseName}
        </h2>
        <p className="text-neutral-450">
          Are you sure you want to this traing?
        </p>
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            deleteTraining(initialValues.id)
              .unwrap()
              .then(() => {
                toast.success("Operation Successful");
                callBack();
              })
              .catch((err) => {
                toast.error(err.error ?? "Something went wrong");
              });
          }}
          type="submit"
          disabled={isLoading}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Loading..." : "Delete Audit"}
        </button>
      </div>
    </div>
  );
};
