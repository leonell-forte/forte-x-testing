import { useState } from "react";
import { IDialogueProps } from "../../../../components/ui/dialogue/dialogue";
import AddDialogue from "./AddDialogue";
import EvidencesDialogue from "./EvidencesDialogue";

type ModalLabelType = "beneficiaries" | "evidence";

interface IBeneficiariesDialogueProps extends IDialogueProps {
  id?: number;

  projectId?: number;
}

const BeneficiariesDialogue = ({
  id,

  projectId,

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
            handleClose={close}
          />
        );

      default:
        return null;
    }
  };

  return renderModal(modal);
};

export default BeneficiariesDialogue;
