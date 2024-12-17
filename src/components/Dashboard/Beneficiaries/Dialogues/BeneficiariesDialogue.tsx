import { useState } from "react";

import { IDialogueProps } from "components/ui/dialogue/dialogue";

import AddDialogue from "./AddDialogue";
import EvidencesDialogue from "./EvidencesDialogue";

type ModalLabelType = "beneficiaries" | "evidence";

interface IBeneficiariesDialogueProps extends IDialogueProps {
  id?: number;

  projectId?: number;

  editMode?: boolean;
}

const BeneficiariesDialogue = ({
  id,

  projectId,

  editMode,

  ...props
}: IBeneficiariesDialogueProps) => {
  const [modal, setModal] = useState<ModalLabelType>("beneficiaries");

  const [evidenceId, setEvidenceId] = useState<number | null>(null);

  const close = () => {
    props.handleClose?.();

    setEvidenceId(null);
  };

  const renderModal = (modal: ModalLabelType) => {
    switch (modal) {
      case "beneficiaries":
        return (
          <AddDialogue
            {...props}
            editMode={editMode}
            handleClose={close}
            id={id}
            projectId={projectId}
            handleAddOrViewEvidence={(id) => {
              setModal("evidence");

              if (id) setEvidenceId(id);
            }}
          />
        );

      case "evidence":
        return (
          <EvidencesDialogue
            {...props}
            id={evidenceId as number}
            handleClose={() => {
              setModal("beneficiaries");

              setEvidenceId(null);
            }}
          />
        );

      default:
        return null;
    }
  };

  return renderModal(modal);
};

export default BeneficiariesDialogue;
