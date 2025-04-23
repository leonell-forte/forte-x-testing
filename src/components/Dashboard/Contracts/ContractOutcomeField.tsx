import { useQuery } from "@tanstack/react-query";
import projectService from "api/projects";
import { useMemo } from "react";
import { Control } from "react-hook-form";
import { HiOutlinePlusCircle } from "react-icons/hi";

import { ReactComponent as Bin } from "assets/images/icons/trash.svg";

import { ContractFieldValues, RateEnum } from "lib/types/contracts";
import { findLabelFromOptions, sortOptions } from "lib/utils";

import Controller from "components/ui/custom-controller/CustomController";
import Dropdown, { IOption } from "components/ui/dropdown";
import Input from "components/ui/input";

interface IContractOutcomeField {
  projectId: number;

  control: Control<ContractFieldValues>;

  index: number;

  perOutcome?: boolean;

  disabled?: boolean;

  handleDelete?: (index: number) => void;

  handleSelectOutcome: (id: string) => void;

  handleRadioSelect: (value: RateEnum) => void;

  handleAdd: (index: number) => void;

  isLast?: boolean;
}

const OUTCOME_TYPES = ["Per outcome", "If threshold reached"];

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

  isLast,
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
    <div className="space-y-3">
      <Controller
        label={`Outcome ${index + 1}`}
        required
        name={`outcomeRates.${index}.outcomeId`}
        control={control}
        containerClassName="w-full"
        render={({ field }) => {
          return (
            <div className="flex items-center gap-2">
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
              {handleDelete && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();

                    handleDelete(index);
                  }}
                  className="group"
                >
                  <Bin
                    width={14}
                    className="fill-white text-white transition-all group-hover:fill-mint"
                  />
                </button>
              )}
            </div>
          );
        }}
      />

      <div className="flex gap-2">
        <Controller
          name={`outcomeRates.${index}.perOutcome`}
          control={control}
          label="Outcome type"
          required
          containerClassName="w-full"
          render={({ field }) => {
            return (
              <Dropdown
                disabled={disabled}
                options={OUTCOME_TYPES.map((item) => ({
                  label: item,
                  value: item,
                }))}
                value={field.value ? "Per outcome" : "If threshold reached"}
                handleSelect={(val) => {
                  field.onChange(val);
                  handleRadioSelect(val as RateEnum);
                }}
                placeholder="Select type"
              />
            );
          }}
        />

        {perOutcome ? (
          <Controller
            label="Cost"
            required
            name={`outcomeRates.${index}.rate`}
            control={control}
            containerClassName="w-full"
            render={({ field }) => {
              return (
                <Input
                  {...field}
                  isCurrency
                  min={0}
                  disabled={disabled}
                  placeholder="XX,XXX.XX"
                  type="number"
                />
              );
            }}
          />
        ) : (
          <Controller
            name={`outcomeRates.${index}.threshold`}
            label="Threshold amount"
            containerClassName="w-full"
            control={control}
            render={({ field }) => {
              return (
                <Input
                  {...field}
                  disabled={perOutcome || disabled}
                  placeholder="Threshold"
                />
              );
            }}
          />
        )}
      </div>

      {!perOutcome && (
        <Controller
          label="Cost when threshold reached"
          required
          name={`outcomeRates.${index}.rate`}
          control={control}
          containerClassName="w-full"
          render={({ field }) => {
            return (
              <Input
                {...field}
                isCurrency
                min={0}
                disabled={disabled}
                placeholder="XX,XXX.XX"
                type="number"
              />
            );
          }}
        />
      )}

      {!disabled && isLast && (
        <div className="mt-4 space-y-3">
          <hr className="w-full" />

          <button
            onClick={(e) => {
              e.stopPropagation();

              handleAdd(index);
            }}
            type="button"
            className="group flex items-center gap-2 md:mt-0"
          >
            <HiOutlinePlusCircle className="h-auto w-8 text-white transition-all group-hover:stroke-mint" />

            <p className="font-light group-hover:text-mint">Add line item</p>
          </button>
        </div>
      )}
    </div>
  );
};

export default ContractOutcomeField;
