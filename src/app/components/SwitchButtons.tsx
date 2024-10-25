"use client";
import Switch from "@/components/ui/switch";
import React, { useState } from "react";

const ToggleButtons = () => {
  const [on, setOn] = useState(false);
  return (
    <div>
      <p className="text-2xl text-white font-semibold uppercase mb-2">
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
