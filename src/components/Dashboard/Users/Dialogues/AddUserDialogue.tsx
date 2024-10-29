import Button from "@/components/ui/button";
import Dialogue, { IDialogueProps } from "@/components/ui/dialogue/dialogue";
import Dropdown from "@/components/ui/dropdown";
import Input from "@/components/ui/input";
import { ROLES } from "@/lib/constants";
import React from "react";

const AddUserDialogue = ({ isVisible, handleClose }: IDialogueProps) => {
  return (
    <Dialogue isVisible={isVisible} handleClose={handleClose} title="Add user">
      <form action="" className="space-y-2.5">
        <p>USER ID: ##### (MODAL)</p>
        <div className="flex items-center">
          <label htmlFor="" className="w-[140px]">
            Email
          </label>
          <Input
            type="email"
            autoComplete="email"
            placeholder="email@email.com"
          />
        </div>
        <div className="flex items-center">
          <label htmlFor="" className="w-[140px]">
            Full name
          </label>
          <Input autoComplete="name" placeholder="James Potter" />
        </div>
        <div className="flex items-center">
          <label htmlFor="" className="w-[140px]">
            Phone number
          </label>
          <Input autoComplete="tel" placeholder="+61 4567323423" />
        </div>
        <div className="flex items-center">
          <label htmlFor="" className="w-[140px]">
            Organization
          </label>
          <Dropdown options={[]} placeholder="Select organization" />
        </div>
        <div className="flex items-center">
          <label htmlFor="" className="w-[140px]">
            Role
          </label>
          <Dropdown options={ROLES} placeholder="Select role" />
        </div>

        <div className="flex justify-end gap-4 !mt-10">
          <Button onClick={handleClose} buttonType="secondary">
            Cancel
          </Button>
          <Button>Save</Button>
        </div>
      </form>
    </Dialogue>
  );
};

export default AddUserDialogue;
