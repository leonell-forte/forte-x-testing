import { useState } from "react";

import Switch from "components/ui/switch";

const ToggleButtons = () => {
  const [on, setOn] = useState(false);
  return (
    <div>
      <p className="mb-2 text-2xl font-semibold uppercase text-white">
        Switch Buttons
      </p>
      <div className="flex flex-col gap-4">
        <Switch on={on} handleSwitch={() => setOn((prev) => !prev)} />
        <Switch on={true} handleSwitch={() => {}} />
        <Switch disabled on={true} handleSwitch={() => {}} />
        <Switch disabled on={false} handleSwitch={() => {}} />
      </div>
    </div>
  );
};

export default ToggleButtons;
