import Dialogue, { IDialogueProps } from "components/ui/dialogue/dialogue";

import BeneficiariesForm from "./BeneficiariesForm";
import Evidences from "./Evidences";

interface IBeneficiariesDialogueProps extends IDialogueProps {
  id?: number;

  projectId?: number;

  handleAddOrViewEvidence?: (id?: number) => void;
}

const AddDialogue = ({
  id,

  projectId,

  handleAddOrViewEvidence,

  ...props
}: IBeneficiariesDialogueProps) => {
  return (
    <Dialogue
      {...props}
      handleClose={props.handleClose}
      title={`${id ? "Edit" : "Add"} beneficiaries`}
    >
      <div className="space-y-5">
        <BeneficiariesForm
          id={id}
          projectId={projectId}
          handleClose={props.handleClose}
        />

        {id && <Evidences handleAddOrViewEvidence={handleAddOrViewEvidence} />}
      </div>
    </Dialogue>
  );
};

export default AddDialogue;
