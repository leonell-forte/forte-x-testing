import Dialogue, { IDialogueProps } from "components/ui/dialogue/dialogue";

import BeneficiariesForm from "./BeneficiariesForm";
import Evidences from "./Evidences";

interface IBeneficiariesDialogueProps extends IDialogueProps {
  id?: number;

  projectId?: number;

  editMode?: boolean;

  handleAddOrViewEvidence?: (id?: number) => void;
}

const AddDialogue = ({
  id,

  projectId,

  editMode,

  handleAddOrViewEvidence,

  ...props
}: IBeneficiariesDialogueProps) => {
  return (
    <Dialogue
      {...props}
      handleClose={props.handleClose}
      title={`${id ? `Beneficiary ID #${id}` : "Add beneficiary"}`}
    >
      <div className="space-y-[22px]">
        <BeneficiariesForm
          id={id}
          editMode={editMode}
          projectId={projectId}
          handleClose={props.handleClose}
        />

        {id && <Evidences handleAddOrViewEvidence={handleAddOrViewEvidence} />}
      </div>
    </Dialogue>
  );
};

export default AddDialogue;
