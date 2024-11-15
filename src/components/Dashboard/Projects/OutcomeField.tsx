import Input from "../../../components/ui/input";
import minus from "../../../assets/images/icons/minus.svg";
import { Controller } from "react-hook-form";

interface IOutcomeFieldProps {
  count: number;

  handleDelete?: () => void;

  nameError?: string;

  descriptionError?: string;

  index: number;

  control: any;
}

const OutcomeField = ({
  handleDelete,

  count,

  nameError,

  descriptionError,

  index,

  control,
}: IOutcomeFieldProps) => {
  return (
    <div className="space-y-[22px]">
      <div className="flex items-center">
        <label htmlFor="" className="w-[180px]">
          Outcome {count} name
        </label>

        <div className=" flex w-full items-center gap-[17px]">
          <Controller
            name={`outcomes.${index}.name`}
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter outcome name"
                error={!!nameError}
                helperText={nameError}
              />
            )}
          />

          {handleDelete && (
            <button
              type="button"
              onClick={handleDelete}
              className="!w-8 !h-8 bg-white rounded-full flex-shrink-0 text-forest-green flex items-center justify-center hover:scale-[1.05] transition-all hover:opacity-80"
            >
              <img src={minus} alt="" />
            </button>
          )}
        </div>
      </div>

      <div className="flex">
        <label htmlFor="" className="w-[180px] mt-3">
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
              error={!!descriptionError}
              helperText={descriptionError}
            />
          )}
        />
      </div>
    </div>
  );
};

export default OutcomeField;
