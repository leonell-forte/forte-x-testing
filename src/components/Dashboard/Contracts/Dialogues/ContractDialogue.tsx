import Input from "../../../../components/ui/input";
import Dialogue, {
  IDialogueProps,
} from "../../../../components/ui/dialogue/dialogue";
import add from "../../../../assets/images/icons/add.svg";
import RadioGroup from "../../../../components/ui/radio-group";
import Button from "../../../../components/ui/button";

interface IContractDialogueProps extends IDialogueProps {}

const ContractDialogue = ({
  isVisible,
  handleClose,
}: IContractDialogueProps) => {
  return (
    <Dialogue
      isVisible={isVisible}
      handleClose={handleClose}
      title="Add contract"
    >
      <form action="">
        <div className="flex items-start gap-4">
          <label
            htmlFor=""
            className="pt-4 min-w-[120px]"
          >
            Parties
          </label>

          <Input placeholder="Organization name" />
        </div>

        <div className="flex items-start gap-4">
          <label
            htmlFor=""
            className="pt-4 min-w-[120px]"
          >
            Parties
          </label>

          <Input placeholder="Organization name" />
        </div>

        <div className="flex items-start gap-4">
          <label
            htmlFor=""
            className="pt-4 min-w-[120px]"
          >
            Parties
          </label>

          <Input placeholder="Organization name" />
        </div>

        <div className="flex items-start gap-4">
          <label
            htmlFor=""
            className="pt-4 min-w-[120px]"
          >
            Parties
          </label>

          <Input placeholder="Organization name" />
        </div>

        <div className="flex items-start gap-4">
          <label
            htmlFor=""
            className="pt-4 min-w-[120px]"
          >
            Parties
          </label>

          <Input placeholder="Organization name" />
        </div>

        <div className="flex items-center gap-[38.75px]">
          <div className="flex items-start gap-4">
            <label
              htmlFor=""
              className="pt-4 min-w-[120px]"
            >
              Parties
            </label>

            <Input placeholder="Organization name" />
          </div>
          <div className="flex items-start gap-4">
            <label
              htmlFor=""
              className="pt-4 min-w-[120px]"
            >
              Parties
            </label>

            <Input placeholder="Organization name" />
          </div>
        </div>

        <div className="flex gap-4">
          <label
            htmlFor=""
            className="pt-4 min-w-[120px]"
          >
            Parties
          </label>

          <Input placeholder="Organization name" />

          <button
            type="button"
            className="!w-8 !h-8 bg-white rounded-full flex-shrink-0 text-forest-green flex items-center justify-center hover:scale-[1.05] transition-all hover:opacity-80 mt-3"
          >
            <img
              src={add}
              alt=""
            />
          </button>
        </div>

        <div className="flex items-start gap-4">
          <label
            htmlFor=""
            className="pt-4 min-w-[120px]"
          >
            Parties
          </label>

          <div className="w-full">
            <Input placeholder="Organization name" />
            <div className="flex items-end w-full">
              <RadioGroup
                className="flex flex-col gap-4 w-[280px]"
                items={["Per outcome", "If threshold reached"]}
              />
              <Input
                small
                noHelperText
                className="max-w-32"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 !mt-10">
          <Button
            onClick={() => {}}
            buttonType="secondary"
          >
            Cancel
          </Button>

          <Button type="submit">Save</Button>
        </div>
      </form>
    </Dialogue>
  );
};

export default ContractDialogue;
