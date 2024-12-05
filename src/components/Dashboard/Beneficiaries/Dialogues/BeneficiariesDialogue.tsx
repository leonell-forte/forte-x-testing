import Dialogue, {
  IDialogueProps,
} from "../../../../components/ui/dialogue/dialogue";

import BeneficiariesForm from "./BeneficiariesForm";

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
      <BeneficiariesForm
        id={id}
        projectId={projectId}
        handleClose={props.handleClose}
      />
    </Dialogue>
  );
};

export default BeneficiariesDialogue;
