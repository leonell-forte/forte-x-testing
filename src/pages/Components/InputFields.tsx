"use client";

import DatePicker from "components/ui/date-picker";
import FileInput from "components/ui/file-input";
import Input from "components/ui/input";

const InputFields = () => {
  return (
    <div>
      <p className="mb-2 text-2xl font-semibold uppercase text-white">
        Input Fields
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Input color="primary" label="Label" helperText="Helper Text" />
        <Input
          color="primary"
          label="Password"
          type="password"
          helperText="Helper Text"
        />
        <Input color="success" label="Label" helperText="Helper Text" />
        <Input disabled label="Label" helperText="Helper Text" />
        <Input error label="Label" helperText="Helper Text" />

        <FileInput
          placeholder="Upload file"
          onSuccess={(data) => console.log(data)}
        />

        <DatePicker label="Select date" helperText="Helper text" />

        <DatePicker error label="Select date" helperText="Helper Text" />
      </div>
    </div>
  );
};

export default InputFields;
