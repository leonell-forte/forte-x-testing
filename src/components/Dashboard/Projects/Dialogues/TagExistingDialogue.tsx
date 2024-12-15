import { useState } from "react";

import { ROLES } from "lib/constants";

import Button from "components/ui/button";
import Dialogue, { IDialogueProps } from "components/ui/dialogue/dialogue";
import Dropdown from "components/ui/dropdown";

interface IProp extends IDialogueProps {
  handleAdd?: () => void;
}

const TagExistingDialogue = ({ ...props }: IProp) => {
  const [values, setValues] = useState<string[]>([]);

  return (
    <Dialogue {...props}>
      <div className="space-y-6">
        <Dropdown
          value={values}
          handleSelect={(val) => setValues(val as string[])}
          isMultiSelect
          showAsTags
          options={ROLES}
        />

        <div className="flex justify-end gap-2.5">
          <Button onClick={props.handleClose} buttonType="secondary">
            Cancel
          </Button>

          <Button>Add</Button>
        </div>
      </div>
    </Dialogue>
  );
};

export default TagExistingDialogue;
