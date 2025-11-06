import clsx from "clsx";
import { Field, FieldProps } from "formik";
import { Eye, EyeOff } from "lucide-react";
import React from "react";
import { FunctionComponent, useState } from "react";
import { cn } from "../../utils/cn";

interface InputProps extends Partial<FieldProps> {
  title: string;
  errors: unknown;
  name: string;
  touched: unknown;
  type?: string;
  placeholder?: string;
  value?: string;
  className?: string;
  fieldClassName?: string;
  width?: string;
  as?: string;
  disabled?: boolean;
  // handleChange?: (e: string | React.ChangeEvent<unknown>) => void;
  fieldChange?: React.Dispatch<React.SetStateAction<string>>;
}

const Input: FunctionComponent<InputProps> = ({
  title,
  placeholder,
  type,
  className,
  width,
  errors,
  touched,
  name,
  fieldClassName,
  disabled,
  ...rest
}) => {
  const hasError = errors && touched;

  const [isPassword, setIsPassword] = useState(false);

  const toggleType = () => {
    setIsPassword(!isPassword);
  };
  return (
    <div className={className}>
      <p
        className={cn(
          "text-[0.865rem] font-[500] text-[#28333E] text-left",
          hasError ? "text-[#f00000]" : ""
        )}
      >
        {title}
      </p>
      <div className="relative">
        <Field
          type={isPassword ? "" : type}
          name={name}
          disabled={disabled}
          placeholder={placeholder}
          className={cn(
            "bg-[#fff] border-[1px] rounded-[12px] h-[56px] mt-[8px] px-[15px] text-[0.75rem]",
            width ?? "w-[100%]",
            hasError ? "border-[#f00000]" : "",
            disabled ? "cursor-not-allowed bg-[#f9f9f9] text-[#a0a0a0]" : "",
            fieldClassName
          )}
          {...rest}
        />
        {type === "password" && (
          <div
            className="absolute top-1/2 transform -translate-y-1/2 right-[10px] cursor-pointer"
            onClick={toggleType}
          >
            {isPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </div>
        )}
      </div>
      {hasError ? (
        <div className="ml-[2px]">
          <p className="text-[12px] font-[400] text-[#f00000]">
            {String(errors || "Error")}
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default Input;
