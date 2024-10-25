import React from "react";
import Buttons from "./Buttons";
import InputFields from "./InputFields";
import Checkboxes from "./Checkboxes";
import RadioButtons from "./RadioButtons";
import SwitchButtons from "./SwitchButtons";

const ComponentsPage = () => {
  return (
    <div className="p-10 space-y-10">
      <Buttons />
      <InputFields />
      <div className="flex flex-wrap gap-10">
        <Checkboxes />
        <RadioButtons />
        <SwitchButtons />
      </div>
    </div>
  );
};

export default ComponentsPage;
