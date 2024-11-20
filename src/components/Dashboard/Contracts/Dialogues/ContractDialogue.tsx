import Input from "../../../../components/ui/input";
import Dialogue, {
  IDialogueProps,
} from "../../../../components/ui/dialogue/dialogue";
import add from "../../../../assets/images/icons/add.svg";
import RadioGroup from "../../../../components/ui/radio-group";
import Button from "../../../../components/ui/button";
import Dropdown from "../../../../components/ui/dropdown";
import { useState } from "react";

interface IContractDialogueProps extends IDialogueProps {}

const ContractDialogue = ({
  isVisible,

  handleClose,
}: IContractDialogueProps) => {
  const [datas, setDatas] = useState<string[]>([]);
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

          <Dropdown
            showAsTags
            value={datas}
            options={TESTDATA}
            handleSelect={(val) => {
              setDatas((prev: string[]) => {
                return prev.includes(val)
                  ? prev.filter((item) => item !== val)
                  : [...prev, val];
              });
            }}
            handleRemoveTag={(val, index) =>
              setDatas((prev) => prev.filter((item) => item !== val))
            }
            isMultiSelect
            placeholder="Parties"
          />
        </div>

        <div className="flex items-start gap-4">
          <label
            htmlFor=""
            className="pt-4 min-w-[120px]"
          >
            Status
          </label>

          <Input placeholder="Select" />
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

const TESTDATA = [
  {
    label: "1",
    value: "1",
  },
  {
    label: "2",
    value: "2",
  },
  {
    label: "3",
    value: "3",
  },
  {
    label: "4",
    value: "4",
  },
  {
    label: "5",
    value: "5",
  },
  {
    label: "6",
    value: "6",
  },
  {
    label: "7",
    value: "7",
  },
  {
    label: "8",
    value: "8",
  },
  {
    label: "9",
    value: "9",
  },
  {
    label: "10",
    value: "10",
  },
  {
    label: "11",
    value: "11",
  },
  {
    label: "12",
    value: "12",
  },
  {
    label: "1",
    value: "1",
  },
  {
    label: "2",
    value: "2",
  },
  {
    label: "3",
    value: "3",
  },
];
