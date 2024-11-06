import { IProject } from "@/pages/Projects/types";
import Dialogue, {
  IDialogueProps,
} from "../../../../components/ui/dialogue/dialogue";
import React from "react";
import Input from "../../../../components/ui/input";
import Button from "../../../../components/ui/button";

interface IProjectDialogueProps extends IDialogueProps {
  project?: IProject | null;
}

const ProjectDialogue = ({
  isVisible,
  handleClose,
  project,
}: IProjectDialogueProps) => {
  return (
    <Dialogue
      isVisible={isVisible}
      handleClose={handleClose}
      title={project ? "Edit project" : "Add project"}
    >
      <form action="" className="space-y-2.5">
        <p>USER ID: ##### (MODAL)</p>
        <div className="flex items-center">
          <label htmlFor="" className="w-[140px]">
            Email
          </label>
          <Input
            value={project?.project}
            type="email"
            autoComplete="email"
            placeholder="email@email.com"
          />
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

export default ProjectDialogue;
