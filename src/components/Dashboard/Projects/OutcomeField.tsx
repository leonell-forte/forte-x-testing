import minus from "assets/images/icons/minus.svg";

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
        <label htmlFor="" className="w-[180px] pt-3">
          Outcome {count} name
        </label>

        <div className="flex w-full gap-[17px]">
          <Controller
            name={`outcomes.${index}.name`}
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="Enter outcome name" />
            )}
          />

          {handleDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();

                handleDelete();
              }}
              className="mt-2 flex !h-8 !w-8 flex-shrink-0 items-center justify-center rounded-full bg-white text-forest-green transition-all hover:scale-[1.05] hover:opacity-80"
            >
              <img src={minus} alt="" />
            </button>
          )}
        </div>
      </div>

      <div className="flex">
        <label htmlFor="" className="mt-3.5 w-[180px]">
          Description
        </label>

        <Controller
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
    </div>
  );
};

export default OutcomeField;
