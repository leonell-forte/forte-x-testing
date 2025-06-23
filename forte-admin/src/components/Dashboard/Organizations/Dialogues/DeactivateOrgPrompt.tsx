import { useState } from "react";

import Button from "components/ui/button";
import { useModal } from "components/ui/dialogue/v2/Modal";
import Input from "components/ui/input";

type TProps = {
  onYes: () => void;
  orgName: string;
};

export function showDeactivateOrgPrompt({ onYes, orgName }: TProps) {
  useModal.getState().open({
    component: <DeactivateOrgPrompt onYes={onYes} orgName={orgName} />,
    size: "2xl",
    title: "Are you sure you want to deactivate your organization?",
  });
}

function DeactivateOrgPrompt({ onYes, orgName }: TProps) {
  const { close } = useModal();
  const [value, setValue] = useState("");
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p>
          When you deactivate your organization, your partners and other
          organizations will no longer be able to see your organization or any
          related contracts, projects or beneficiaries.
        </p>
        <p>
          Since this action cannot be undone, please type your Organization name
          in the below field to confirm.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onYes();
          close();
        }}
        className="space-y-6"
      >
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Organization Name"
        />
        <div className="flex items-center justify-end gap-4">
          <Button buttonType="secondary" onClick={close}>
            Cancel
          </Button>
          <Button type="submit" disabled={value !== orgName}>
            Confirm deactivation
          </Button>
        </div>
      </form>
    </div>
  );
}
