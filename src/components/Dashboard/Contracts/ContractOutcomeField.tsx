import Dropdown, { IOption } from "../../../components/ui/dropdown";
import add from "../../../assets/images/icons/add.svg";
import minus from "../../../assets/images/icons/minus.svg";
import RadioGroup from "../../../components/ui/radio-group";
import Input from "../../../components/ui/input";
import { useQuery } from "@tanstack/react-query";
import projectService from "../../../api/projects";
import { useMemo } from "react";
import { Control, Controller } from "react-hook-form";
import { ContractFieldValues, RateEnum } from "../../../lib/types/contracts";

interface IContractOutcomeField {
  projectId: number;

  control: Control<ContractFieldValues>;

  index: number;

  perOutcome?: boolean;

  isLast?: boolean;

  handleDelete?: () => void;

  handleSelectOutcome: (id: string) => void;

  handleRadioSelect: (value: RateEnum) => void;

  handleAdd?: () => void;
}

const ContractOutcomeField = ({
  projectId,

  control,

  index,

  perOutcome,

  isLast,

  handleDelete,

  handleSelectOutcome,

  handleRadioSelect,

  handleAdd,
}: IContractOutcomeField) => {
  const { data: project, isLoading: isProjectLoading } = useQuery({
    queryKey: ["specific-project", projectId],

    queryFn: () => projectService.getOne(projectId.toString()),

    enabled: !!projectId,

    refetchOnMount: true,
  });

  const outcomes: IOption[] = useMemo(
    () =>
      project?.outcomes.map((item) => ({
        label: item.name,

        value: item.id.toString(),
      })) || [],
    [project],
  );

  return (
    <div className="space-y-1">
      <div className="flex gap-4">
        <label
          htmlFor=""
          className="pt-4 min-w-[120px]"
        >
          Outcome
        </label>

        <Controller
          name={`contractOutcomeRates.${index}.projectOutcomeId`}
          control={control}
          render={({ field, fieldState }) => {
            const { error } = fieldState;

            return (
              <Dropdown
                disabled={!projectId}
                loading={isProjectLoading}
                value={
                  outcomes.find(
                    (item: IOption) => item.value == field.value.toString(), //eslint-disable-line eqeqeq,
                  )?.label
                }
                handleSelect={(val) => {
                  handleSelectOutcome(val as string);
                }}
                options={outcomes}
                placeholder="Outcome"
                error={!!error?.message}
                helperText={error?.message}
              />
            );
          }}
        />

        <button
          onClick={isLast ? handleAdd : handleDelete}
          type="button"
          className="!w-8 !h-8 bg-white rounded-full flex-shrink-0 text-forest-green flex items-center justify-center hover:scale-[1.05] transition-all hover:opacity-80 mt-3"
        >
          <img
            src={isLast ? add : minus}
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
          <Controller
            name={`contractOutcomeRates.${index}.rate`}
            control={control}
            render={({ field, fieldState }) => {
              const { error } = fieldState;

              return (
                <Input
                  {...field}
                  placeholder="Mention here"
                  type="number"
                  error={!!error?.message}
                  helperText={error?.message}
                />
              );
            }}
          />

          <div className="flex flex-col gap-2 md:flex-row md:items-end">
            <Controller
              name={`contractOutcomeRates.${index}.perOutcome`}
              control={control}
              render={({ field }) => {
                return (
                  <RadioGroup
                    className="flex flex-col gap-4 md:w-[280px]"
                    items={["Per outcome", "If threshold reached"]}
                    value={field.value ? "Per outcome" : "If threshold reached"}
                    onChange={(e) => {
                      handleRadioSelect(e.target.value as RateEnum);
                    }}
                  />
                );
              }}
            />

            <div className="w-full translate-y-7">
              <Controller
                name={`contractOutcomeRates.${index}.threshold`}
                control={control}
                render={({ field, fieldState }) => {
                  const { error } = fieldState;

                  return (
                    <Input
                      {...field}
                      disabled={perOutcome}
                      error={!!error}
                      helperText={error?.message}
                      placeholder="Threshold"
                    />
                  );
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractOutcomeField;
