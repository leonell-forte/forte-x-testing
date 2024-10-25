"use client";
import Input from "@/components/ui/input";

import React from "react";

const InputFields = () => {
  return (
    <div>
      <p className="text-2xl text-white font-semibold uppercase mb-2">
        Input Fields
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
      </div>
    </div>
  );
};

export default InputFields;
