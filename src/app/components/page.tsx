import React from "react";
import Buttons from "./Buttons";
import InputFields from "./InputFields";
import Checkboxes from "./Checkboxes";

const ComponentsPage = () => {
  return (
    <div className="p-10 space-y-10">
      <Buttons />
      <InputFields />
      <Checkboxes />
    </div>
  );
};

export default ComponentsPage;
