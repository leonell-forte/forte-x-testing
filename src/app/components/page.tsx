import React from "react";
import Buttons from "./Buttons";
import InputFields from "./InputFields";
import Checkboxes from "./Checkboxes";
import RadioButtons from "./RadioButtons";

const ComponentsPage = () => {
  return (
    <div className="p-10 space-y-10">
      <Buttons />
      <InputFields />
      <div className="flex">
        <Checkboxes />
        <RadioButtons />
      </div>
    </div>
  );
};

export default ComponentsPage;
