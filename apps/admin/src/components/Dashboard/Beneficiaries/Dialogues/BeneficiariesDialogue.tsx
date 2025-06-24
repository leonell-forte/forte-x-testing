import { useEffect, useState } from "react";

import AddDialogue from "@/components/Dashboard/Beneficiaries/Dialogues/AddDialogue";
import { BeneficiariesProvider } from "@/components/Dashboard/Beneficiaries/Dialogues/BeneficiariesContext";
import type { IDialogueProps } from "@/components/ui/dialogue/dialogue";

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

  const [beneficiaryId, setBeneficiaryId] = useState<number>(id!);

  // const [evidenceId, setEvidenceId] = useState<number | null>(null);

  useEffect(() => {
    if (id) setBeneficiaryId(id);
  }, [id]);

  const close = () => {
    props.handleClose?.();

    // setEvidenceId(null);
  };

  const renderModal = (modal: ModalLabelType) => {
    switch (modal) {
      case "beneficiaries":
        return (
          <AddDialogue
            {...props}
            editMode={editMode}
            handleClose={close}
            beneficiaryId={beneficiaryId}
            setBeneficiaryId={setBeneficiaryId}
            projectId={projectId}
            handleAddOrViewEvidence={() => {
              setModal("evidence");

              // if (id) setEvidenceId(id);
            }}
          />
        );

      // case "evidence":
      //   return (
      //     <EvidencesDialogue
      //       {...props}
      //       id={evidenceId as number}
      //       setId={setEvidenceId}
      //       handleClose={() => {
      //         setModal("beneficiaries");

      //         setEvidenceId(null);
      //       }}
      //     />
      //   );

      default:
        return null;
    }
  };

  return <BeneficiariesProvider>{renderModal(modal)}</BeneficiariesProvider>;
};

export default BeneficiariesDialogue;
