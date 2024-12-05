import Dialogue, {
  IDialogueProps,
} from "../../../../components/ui/dialogue/dialogue";

import BeneficiariesForm from "./BeneficiariesForm";
import Evidences from "./Evidences";

interface IBeneficiariesDialogueProps extends IDialogueProps {
  id?: number;

  projectId?: number;
}

const BeneficiariesDialogue = ({
  id,

  projectId,

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

        {id && <Evidences />}
      </div>
    </Dialogue>
  );
};

export default BeneficiariesDialogue;
