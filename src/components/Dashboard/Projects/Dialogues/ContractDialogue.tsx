import Dropdown from "../../../../components/ui/dropdown";
import Dialogue, {
  IDialogueProps,
} from "../../../../components/ui/dialogue/dialogue";

interface IProp extends IDialogueProps {}

const ContractDialogue = ({ isVisible, handleClose }: IProp) => {
  const close = () => {
    handleClose!();
  };

  return (
    <Dialogue
      isVisible={isVisible}
      handleClose={close}
      title="Add contract"
    >
      <form action="">
        <div className="flex items-start">
          <label
            htmlFor=""
            className="w-[180px] pt-4"
          >
            Project name
          </label>
          <Dropdown options={[]} />
        </div>
      </form>
    </Dialogue>
  );
};

export default ContractDialogue;
