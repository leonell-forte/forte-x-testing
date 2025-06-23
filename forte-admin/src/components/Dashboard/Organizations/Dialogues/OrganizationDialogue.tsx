import { useState } from "react";

import { OrgTypes, OrganizationFieldTypes } from "lib/types/organizations";

import { IDialogueProps } from "components/ui/dialogue/dialogue";
import { useModal } from "components/ui/dialogue/v2/Modal";

import OrganizationForm from "../Forms/OrganizationForm";

export interface IOrganizationDialogueProps extends IDialogueProps {
  orgId?: string;

  addSuccessCallback?: (id: number) => void;

  type?: OrgTypes;
}

export const showOrganizationDialogue = ({
  orgId,
  type,
}: IOrganizationDialogueProps) => {
  useModal.getState().open({
    component: <OrganizationDialogue isVisible orgId={orgId} type={type} />,
    title: orgId ? `Edit ${type}` : `Add ${type}`,
    panelClassName: "!max-w-[664px]",
  });
};

const OrganizationDialogue = ({
  handleClose,

  addSuccessCallback,

  isVisible,

  orgId,

  type,
}: IOrganizationDialogueProps) => {
  const [formData, setFormData] = useState<OrganizationFieldTypes | null>(null);

  return (
    <OrganizationForm
      handleClose={() => {
        handleClose?.();

        setFormData(null);
      }}
      orgId={orgId}
      addSuccessCallback={(id) => {
        addSuccessCallback?.(id);
      }}
      isVisible={isVisible}
      savedFormData={formData}
      onFormDataChange={setFormData}
      type={type}
    />
  );
};

export default OrganizationDialogue;
