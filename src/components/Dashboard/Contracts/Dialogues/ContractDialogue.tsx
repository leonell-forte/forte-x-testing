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
              setDatas(val as string[]);
            }}
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

          <Dropdown
            options={TESTDATA}
            placeholder="Status"
          />
        </div>

        <div className="flex items-start gap-4">
          <label
            htmlFor=""
            className="pt-4 min-w-[120px]"
          >
            Project
          </label>

          <Dropdown
            options={TESTDATA}
            placeholder="Project"
          />
        </div>

        <div className="flex items-start gap-4">
          <label
            htmlFor=""
            className="pt-1 flex-shrink-0 w-[120px]"
          >
            Target number of beneficiaries
          </label>

          <Input
            placeholder="Number of beneficiaries"
            type="number"
          />
        </div>

        <div className="flex items-start gap-4">
          <label
            htmlFor=""
            className="pt-4 min-w-[120px]"
          >
            Document
          </label>

          <Input placeholder="Organization name" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-6">
          <div className="flex items-start gap-4">
            <label
              htmlFor=""
              className="pt-4 min-w-[120px]"
            >
              Start date
            </label>

            <Input placeholder="Start date" />
          </div>

          <div className="flex items-start gap-4">
            <label
              htmlFor=""
              className="pt-4 min-w-[120px]"
            >
              End date
            </label>

            <Input placeholder="End date" />
          </div>
        </div>

        <div className="flex gap-4">
          <label
            htmlFor=""
            className="pt-4 min-w-[120px]"
          >
            Outcome
          </label>

          <Dropdown
            options={TESTDATA}
            placeholder="Outcome"
          />

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
            Rate
          </label>

          <div className="w-full">
            <Input
              placeholder="Mention here"
              type="number"
            />

            <div className="flex flex-col gap-2 md:flex-row md:items-end">
              <RadioGroup
                className="flex flex-col gap-4 md:w-[280px]"
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
            onClick={handleClose}
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
