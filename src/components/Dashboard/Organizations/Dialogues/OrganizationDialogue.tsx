import { useState } from "react";

import { useAppDispatch } from "lib/hooks";
import { clearPartners, setPartnersToAdd } from "lib/slice/partners";
import { OrganizationFieldTypes } from "lib/types/organizations";

import { IDialogueProps } from "components/ui/dialogue/dialogue";

import AddPartnerForm from "../Forms/AddPartnerForm";
import OrganizationForm from "../Forms/OrganizationForm";

export interface IOrganizationDialogueProps extends IDialogueProps {
  orgId?: string;

  addSuccessCallback?: (id: number) => void;
}

type ModalType = "organization" | "partner";

const OrganizationDialogue = ({
  handleClose,

  addSuccessCallback,

  isVisible,

  orgId,
}: IOrganizationDialogueProps) => {
  const dispatch = useAppDispatch();
  const [modal, setModal] = useState<ModalType>("organization");
  const [formData, setFormData] = useState<OrganizationFieldTypes | null>(null);

  const renderModal = (modal: ModalType) => {
    switch (modal) {
      case "organization":
        return (
          <OrganizationForm
            handleClose={() => {
              handleClose?.();
              dispatch(clearPartners());
              setFormData(null);
            }}
            orgId={orgId}
            addSuccessCallback={addSuccessCallback}
            isVisible={isVisible}
            handleAddPartner={() => setModal("partner")}
            savedFormData={formData}
            onFormDataChange={setFormData}
          />
        );

      case "partner":
        return (
          <AddPartnerForm
            handleClose={() => setModal("organization")}
            orgId={orgId}
            handleStorePartner={(partner) =>
              dispatch(setPartnersToAdd(partner))
            }
          />
        );
    }
  };
  return renderModal(modal);
};

export default OrganizationDialogue;
