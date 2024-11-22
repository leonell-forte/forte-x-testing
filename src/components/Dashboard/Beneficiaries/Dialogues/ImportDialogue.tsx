import Dialogue, {
  IDialogueProps,
} from "../../../../components/ui/dialogue/dialogue";

interface IImportDialogueProps extends IDialogueProps {}

const ImportDialogue = ({ ...props }: IImportDialogueProps) => {
  return (
    <Dialogue
      {...props}
      title="Import beneficiaries"
    >
      ImportDialogue
    </Dialogue>
  );
};

export default ImportDialogue;
