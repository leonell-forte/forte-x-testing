import RadioGroup from "@/components/ui/radio-group";
import React from "react";

const RadioButtons = () => {
  return (
    <div>
      <p className="text-2xl text-white font-semibold uppercase mb-2">
        Radio Groups
      </p>
      <div className="flex flex-col gap-4">
        <RadioGroup items={["Item 1", "Item 2", "Item 3"]} />
        <RadioGroup
          className="grid grid-cols-3 w-fit"
          items={["Item 1", "Item 2", "Item 3", "Item 4", "Item 5", "Item 6"]}
        />
        <RadioGroup
          className="flex flex-col"
          items={["Item 1", "Item 2", "Item 3"]}
        />
      </div>
    </div>
  );
};

export default RadioButtons;
