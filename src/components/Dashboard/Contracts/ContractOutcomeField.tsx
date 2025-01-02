import { useQuery } from "@tanstack/react-query";
import projectService from "api/projects";
import { useMemo } from "react";
import { Control, Controller } from "react-hook-form";

import add from "assets/images/icons/add.svg";
import minus from "assets/images/icons/minus.svg";

import { ContractFieldValues, RateEnum } from "lib/types/contracts";
import { findLabelFromOptions } from "lib/utils";

import Dropdown, { IOption } from "components/ui/dropdown";
import Input from "components/ui/input";
import RadioGroup from "components/ui/radio-group";

interface IContractOutcomeField {
  projectId: number;

  control: Control<ContractFieldValues>;

  index: number;

  perOutcome?: boolean;

  isLast?: boolean;

  disabled?: boolean;

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

  disabled,

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
    [project]
  );

  return (
    <div className="space-y-1">
      <div className="flex gap-4">
        <label htmlFor="" className="min-w-[120px] pt-4">
          Outcome
        </label>

        <Controller
          name={`outcomeRates.${index}.outcomeId`}
          control={control}
          render={({ field, fieldState }) => {
            const { error } = fieldState;

            return (
              <Dropdown
                disabled={!projectId || disabled}
                loading={isProjectLoading}
                value={findLabelFromOptions(outcomes, field.value?.toString())}
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

        {!disabled && (
          <button
            onClick={isLast ? handleAdd : handleDelete}
            type="button"
            className="mt-3 flex !h-8 !w-8 flex-shrink-0 items-center justify-center rounded-full bg-white text-forest-green transition-all hover:scale-[1.05] hover:opacity-80"
          >
            <img src={isLast ? add : minus} alt="" />
          </button>
        )}
      </div>

      <div className="flex items-start gap-4">
        <label htmlFor="" className="min-w-[120px] pt-4">
          Rate
        </label>

        <div className="w-full">
          <Controller
            name={`outcomeRates.${index}.rate`}
            control={control}
            render={({ field, fieldState }) => {
              const { error } = fieldState;

              return (
                <Input
                  {...field}
                  min={0}
                  disabled={disabled}
                  placeholder="Rate"
                  type="number"
                  error={!!error?.message}
                  helperText={error?.message}
                />
              );
            }}
          />

          <div className="flex flex-col gap-2 md:flex-row md:items-end">
            <Controller
              name={`outcomeRates.${index}.perOutcome`}
              control={control}
              render={({ field }) => {
                return (
                  <RadioGroup
                    disabled={disabled}
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
                name={`outcomeRates.${index}.threshold`}
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
