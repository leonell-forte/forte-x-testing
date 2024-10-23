import Input from "@/components/ui/input";
import React from "react";

const InputFields = () => {
  return (
    <div>
      <p className="text-2xl text-white font-semibold uppercase mb-2">
        Input Fields
      </p>
      <div className="flex flex-wrap gap-4">
        <Input color="primary" label="Label" />
        <Input color="success" label="Label" />
        <Input disabled color="success" label="Label" />
        <Input error color="success" label="Label" />
      </div>
    </div>
  );
};

export default InputFields;
