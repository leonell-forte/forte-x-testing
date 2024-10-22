import React from "react";
import Buttons from "./Buttons";
import Input from "@/components/ui/input";

const ComponentsPage = () => {
  return (
    <div className="p-10 bg-forest-green">
      <Buttons />
      <div>
        <p className="text-2xl text-white font-semibold uppercase mb-2">
          buttons
        </p>
        <div className="flex flex-wrap gap-4">
          <Input error color="success" label="Label" />
        </div>
      </div>
    </div>
  );
};

export default ComponentsPage;
