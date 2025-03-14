import { useQuery } from "@tanstack/react-query";
import projectService from "api/projects";
import { useMemo } from "react";
import { Control } from "react-hook-form";
import { HiMinusCircle, HiPlusCircle } from "react-icons/hi";

import { ContractFieldValues, RateEnum } from "lib/types/contracts";
import { findLabelFromOptions, sortOptions } from "lib/utils";

import Controller from "components/ui/custom-controller/CustomController";
import Dropdown, { IOption } from "components/ui/dropdown";
import Input from "components/ui/input";
import RadioGroup from "components/ui/radio-group";

interface IContractOutcomeField {
  projectId: number;

  control: Control<ContractFieldValues>;

  index: number;

  perOutcome?: boolean;

  disabled?: boolean;

  handleDelete: (index: number) => void;

  handleSelectOutcome: (id: string) => void;

  handleRadioSelect: (value: RateEnum) => void;

  handleAdd: (index: number) => void;
}

const ContractOutcomeField = ({
  projectId,

  control,

  index,

  perOutcome,

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
    <div className="space-y-4">
      <div className="flex gap-4">
        <Controller
          label={`Outcome ${index + 1}`}
          required
          name={`outcomeRates.${index}.outcomeId`}
          control={control}
          render={({ field }) => {
            return (
              <Dropdown
                disabled={!projectId || disabled}
                loading={isProjectLoading}
                value={findLabelFromOptions(outcomes, field.value?.toString())}
                handleSelect={(val) => {
                  handleSelectOutcome(val as string);
                }}
                options={sortOptions(outcomes)}
                placeholder="Select outcome"
              />
            );
          }}
        />

        {!disabled && (
          <button
            onClick={(e) => {
              e.stopPropagation();

              if (!index) {
                handleAdd(index);
              } else {
                handleDelete(index);
              }
            }}
            type="button"
            className="mt-[27px] transition-all hover:scale-[1.05] hover:opacity-80 md:mt-0"
          >
            {!index ? (
              <HiPlusCircle className="h-auto w-8 text-white" />
            ) : (
              <HiMinusCircle className="h-auto w-8 text-white" />
            )}
          </button>
        )}
      </div>

      <div className="w-full space-y-4">
        <Controller
          label="Rate"
          required
          name={`outcomeRates.${index}.rate`}
          control={control}
          render={({ field }) => {
            return (
              <Input
                {...field}
                min={0}
                disabled={disabled}
                placeholder="Rate"
                type="number"
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

          <div className="w-full">
            <Controller
              name={`outcomeRates.${index}.threshold`}
              control={control}
              render={({ field }) => {
                return (
                  <Input
                    {...field}
                    disabled={perOutcome}
                    placeholder="Threshold"
                  />
                );
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractOutcomeField;
