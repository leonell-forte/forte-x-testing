import { HiMinusCircle } from "react-icons/hi";

import Controller from "components/ui/custom-controller/CustomController";
import Input from "components/ui/input";

interface IOutcomeFieldProps {
  count: number;

  handleDelete?: () => void;

  index: number;

  control: any;
}

const OutcomeField = ({
  handleDelete,

  count,

  index,

  control,
}: IOutcomeFieldProps) => {
  return (
    <div className="space-y-[22px]">
      <div className="flex">
        <div className="flex w-full gap-[17px]">
          <div className="w-full">
            <Controller
              label={`Outcome ${count}`}
              required
              name={`outcomes.${index}.name`}
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter outcome name" />
              )}
            />
          </div>
          <div className="w-full">
            <Controller
              label="Description"
              required
              name={`outcomes.${index}.description`}
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  multiline
                  placeholder="Enter outcome description"
                />
              )}
            />
          </div>

          {handleDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();

                handleDelete();
              }}
              className="group mt-[27px] md:mt-0"
            >
              <HiMinusCircle className="mt-6 h-auto w-8 text-white transition-all group-hover:fill-mint" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OutcomeField;
