// FormComponents.tsx
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AlertCircle, Users, Calendar, Clock, Plus } from "lucide-react";

export const riskValidationSchema = Yup.object({
  hazard: Yup.string()
    .required("Hazard description is required")
    .min(10, "Hazard description must be at least 10 characters"),
  severity: Yup.string().required("Severity is required"),
  likelihood: Yup.string().required("Likelihood is required"),
  mitigation: Yup.string()
    .required("Mitigation plan is required")
    .min(20, "Mitigation plan must be at least 20 characters"),
  owner: Yup.string().required("Risk owner is required"),
});

export const auditValidationSchema = Yup.object({
  auditTitle: Yup.string()
    .required("Audit title is required")
    .min(5, "Audit title must be at least 5 characters"),
  inspector: Yup.string().required("Inspector is required"),
  auditDate: Yup.date()
    .required("Audit date is required")
    .min(new Date(), "Audit date must be in the future"),
  area: Yup.string().required("Area is required"),
});

export const trainingValidationSchema = Yup.object({
  trainingCourse: Yup.string()
    .required("Training course name is required")
    .min(5, "Course name must be at least 5 characters"),
  requiredAttendees: Yup.array()
    .min(1, "At least one attendee must be selected")
    .required("Required attendees are required"),
  trainingDate: Yup.date()
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
}: {
  onSubmit: (values: any) => void;
  onCancel: () => void;
  initialValues?: any;
}) => (
  <Formik
    initialValues={
      initialValues || {
        hazard: "",
        severity: "Medium",
        likelihood: "Medium",
        mitigation: "",
        owner: "",
      }
    }
    validationSchema={riskValidationSchema}
    onSubmit={(values, { setSubmitting }) => {
      onSubmit(values);
      setSubmitting(false);
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

        <FormInput
          label="Risk Owner"
          name="owner"
          placeholder="Enter risk owner name"
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
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting
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

// Schedule Audit Form
export const ScheduleAuditForm = ({
  onSubmit,
  onCancel,
  initialValues,
}: {
  onSubmit: (values: any) => void;
  onCancel: () => void;
  initialValues?: any;
}) => (
  <Formik
    initialValues={
      initialValues || {
        auditTitle: "",
        inspector: "",
        auditDate: "",
        area: "",
      }
    }
    validationSchema={auditValidationSchema}
    onSubmit={(values, { setSubmitting }) => {
      onSubmit(values);
      setSubmitting(false);
    }}
  >
    {({ isSubmitting }) => (
      <Form className="space-y-6">
        <FormInput
          label="Audit Title"
          name="auditTitle"
          placeholder="e.g., Quarterly Safety Inspection"
        />

        <FormInput
          label="Inspector Name"
          name="inspector"
          placeholder="Enter inspector name"
        />

        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Audit Date"
            name="auditDate"
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
            disabled={isSubmitting}
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

// Add Training Form
export const AddTrainingForm = ({
  onSubmit,
  onCancel,
  users,
  initialValues,
}: {
  onSubmit: (values: any) => void;
  onCancel: () => void;
  users: Array<{ id: number; name: string; department: string }>;
  initialValues?: any;
}) => (
  <Formik
    initialValues={
      initialValues || {
        trainingCourse: "",
        requiredAttendees: [],
        trainingDate: "",
      }
    }
    validationSchema={trainingValidationSchema}
    onSubmit={(values, { setSubmitting }) => {
      onSubmit(values);
      setSubmitting(false);
    }}
  >
    {({ values, setFieldValue, isSubmitting }) => (
      <Form className="space-y-6">
        <FormInput
          label="Training Course"
          name="trainingCourse"
          placeholder="Enter course name"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Required Attendees *
          </label>
          <div className="border border-gray-300 rounded-lg p-4 max-h-64 overflow-y-auto bg-gray-50">
            <div className="space-y-2">
              {users.map((user) => (
                <label
                  key={user.id}
                  className="flex items-center gap-3 p-3 hover:bg-white rounded-lg cursor-pointer transition-colors border border-transparent hover:border-gray-200"
                >
                  <input
                    type="checkbox"
                    checked={values?.requiredAttendees?.includes(user.id)}
                    onChange={(e) => {
                      const newAttendees = e.target.checked
                        ? [...values.requiredAttendees, user.id]
                        : values.requiredAttendees.filter(
                            (id: number) => id !== user.id
                          );
                      setFieldValue("requiredAttendees", newAttendees);
                    }}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500">{user.department}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
          {values?.requiredAttendees?.length > 0 && (
            <div className="mt-3 flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
              <Users className="w-4 h-4" />
              <span className="font-medium">
                {values?.requiredAttendees?.length} attendee
                {values?.requiredAttendees?.length !== 1 ? "s" : ""} selected
              </span>
            </div>
          )}
          <FormError name="requiredAttendees" />
        </div>

        <FormInput
          label="Next Training Date"
          name="trainingDate"
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
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? "Adding..."
              : initialValues
              ? "Update Training"
              : "Add Training"}
          </button>
        </div>
      </Form>
    )}
  </Formik>
);
