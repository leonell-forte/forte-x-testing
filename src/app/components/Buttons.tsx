import Button from "@/components/ui/button";
import React from "react";

const Buttons = () => {
  return (
    <div>
      <p className="text-2xl text-white font-semibold uppercase mb-2">
        buttons
      </p>
      <div className="flex flex-wrap gap-4">
        <Button buttonType="primary">Button</Button>
        <Button buttonType="secondary">Button</Button>
        <Button buttonType="tertiary">Button</Button>
        <Button buttonType="primary" active>
          Button
        </Button>
        <Button buttonType="secondary" active>
          Button
        </Button>
        <Button buttonType="tertiary" active>
          Button
        </Button>
      </div>
    </div>
  );
};

export default Buttons;
