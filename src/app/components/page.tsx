import React from "react";
import Buttons from "./Buttons";
import Input from "@/components/ui/input";
import InputFields from "./InputFields";

const ComponentsPage = () => {
  return (
    <div className="p-10 bg-black space-y-10">
      <Buttons />
      <InputFields />
    </div>
  );
};

export default ComponentsPage;
