import Bin from "@/assets/images/icons/trash.svg?react";
import Controller from "@/components/ui/custom-controller/CustomController";
import Input from "@/components/ui/input";

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
        <div className="flex w-full flex-col gap-3">
          <div className="w-full">
            <Controller
              label={`Outcome ${count}`}
              required
              name={`outcomes.${index}.name`}
              control={control}
              render={({ field }) => (
                <div className="relative flex items-center">
                  {handleDelete && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();

                        handleDelete();
                      }}
                      className="group absolute right-3 z-10 mt-[27px] md:mt-0"
                    >
                      <Bin
                        width={14}
                        className="group-hover:fill-mint fill-white text-white transition-all"
                      />
                    </button>
                  )}
                  <Input {...field} placeholder="Enter outcome name" />
                </div>
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
        </div>
      </div>
    </div>
  );
};

export default OutcomeField;
