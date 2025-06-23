import { useState } from "react";

import Dropdown from "components/ui/dropdown";

const DropdownFields = () => {
  const [single, setSingle] = useState("");

  const [multiple, setMultiple] = useState<string[]>([]);
  return (
    <div>
      <p className="mb-2 text-2xl font-semibold uppercase text-white">
        Dropdown Fields
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Dropdown
          placeholder="Single dropdown"
          value={single}
          handleSelect={(val) => setSingle(val as string)}
          options={OPTIONS}
        />

        <Dropdown
          isMultiSelect
          placeholder="Multiple select"
          value={multiple}
          handleSelect={(val) => setMultiple(val as string[])}
          options={OPTIONS}
        />

        <Dropdown
          showAsTags
          placeholder="Multiple tags"
          isMultiSelect
          value={multiple}
          handleSelect={(val) => setMultiple(val as string[])}
          options={OPTIONS}
        />
      </div>
    </div>
  );
};

export default DropdownFields;

const OPTIONS = [
  {
    label: "Option 1",
    value: "Option 1",
  },
  {
    label: "Option 2",
    value: "Option 2",
  },
  {
    label: "Option 3",
    value: "Option 3",
  },
  {
    label: "Option 4",
    value: "Option 4",
  },
  {
    label: "Option 5",
    value: "Option 5",
  },
  {
    label: "Option 6",
    value: "Option 6",
  },
];
