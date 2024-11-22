import Dropdown from "../../../../components/ui/dropdown";
import Dialogue, {
  IDialogueProps,
} from "../../../../components/ui/dialogue/dialogue";
import Input from "../../../../components/ui/input";
import add from "../../../../assets/images/icons/add.svg";

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
      <form
        action=""
        className="space-y-[22px]"
      >
        <div className="flex items-start gap-4">
          <label
            htmlFor=""
            className="min-w-[120px] pt-3"
          >
            Project name
          </label>
          <Dropdown options={[]} />
        </div>

        <div className="flex items-start gap-4">
          <label
            htmlFor=""
            className="min-w-[120px] pt-3"
          >
            Project name
          </label>
          <Dropdown options={[]} />
        </div>

        <div className="flex items-start gap-4">
          <label
            htmlFor=""
            className="min-w-[120px] pt-3"
          >
            Project name
          </label>
          <Dropdown options={[]} />
        </div>

        <div className="flex items-start gap-4">
          <label
            htmlFor=""
            className="min-w-[120px] pt-3"
          >
            Project name
          </label>
          <Input />
        </div>

        <div className="flex items-start gap-4">
          <label
            htmlFor=""
            className="min-w-[120px] pt-3"
          >
            Project name
          </label>
          <Input />
        </div>

        <div className="flex flex-col md:flex-row gap-[22px] md:gap-[38.75px]">
          <div className="flex items-start gap-4">
            <label
              htmlFor=""
              className="min-w-[120px] md:min-w-[120px] pt-3"
            >
              Start date
            </label>
            <Input />
          </div>

          <div className="flex items-start gap-4">
            <label
              htmlFor=""
              className="min-w-[120px] pt-3"
            >
              End date
            </label>
            <Input />
          </div>
        </div>

        <div className="flex gap-4">
          <label
            htmlFor=""
            className="pt-3 min-w-[120px]"
          >
            Outcome
          </label>

          <Dropdown
            options={[]}
            placeholder="Outcome"
          />

          <button
            type="button"
            className="!w-8 !h-8 bg-white rounded-full flex-shrink-0 text-forest-green flex items-center justify-center hover:scale-[1.05] transition-all hover:opacity-80 mt-2"
          >
            <img
              src={add}
              alt=""
            />
          </button>
        </div>
      </form>
    </Dialogue>
  );
};

export default ContractDialogue;
