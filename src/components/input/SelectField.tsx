import { Spin } from "antd";

import { Select } from "antd";

import { FunctionComponent, useState } from "react";
import { FormikErrors } from "formik";

const { Option } = Select;
interface SelectFieldProps {
  fetchData?: any;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => Promise<void | FormikErrors<any>>;
  placeholder?: string;
  name: string;
  data: any[];
  isLoading?: boolean;
}

const SelectField: FunctionComponent<SelectFieldProps> = ({
  setFieldValue,
  fetchData,
  placeholder,
  name,
  data,
  isLoading,
}) => {
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (value: string) => {
    setSearchValue(value);

    if (fetchData) {
      fetchData({ search: value });
    }
  };

  return (
    <Select
      showSearch
      className="w-full"
      placeholder={placeholder}
      onSearch={handleSearch}
      searchValue={searchValue}
      onChange={(value) => setFieldValue(name, value)}
      filterOption={(input, option: any) =>
        option?.children?.toLowerCase().includes(input.toLowerCase())
      }
    >
      {isLoading ? (
        <Option disabled>
          <div className="flex justify-center items-center py-4">
            <Spin size="large" className="mx-auto w-[100px]" />
          </div>
        </Option>
      ) : (
        data?.map((item) => (
          <Option key={item.id} value={item.id}>
            {item.name}
          </Option>
        ))
      )}
    </Select>
  );
};

export default SelectField;
