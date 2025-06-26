import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import type { Control } from "react-hook-form";
import { HiOutlinePlusCircle } from "react-icons/hi";

import projectService from "@/api/projects";
import Bin from "@/assets/images/icons/trash.svg?react";
import Controller from "@/components/ui/custom-controller/CustomController";
import DatePicker from "@/components/ui/date-picker";
import Dropdown, { type IOption } from "@/components/ui/dropdown";
import Input from "@/components/ui/input";
import type { ContractFieldValues, RateEnum } from "@/lib/types/contracts";
import { findLabelFromOptions, formatDate, sortOptions } from "@/lib/utils";

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

  dateType?: string;

  currency?: string;
}

const OUTCOME_TYPES = ["Per outcome", "If threshold reached"];

const DATE_TYPES = [
  { label: "By date specified", value: "date" },
  { label: "By # of days after beneficiary start date", value: "afterStart" },
  {
    label: "By # of days after beneficiary end date",
    value: "afterEnd",
  },
];

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

  dateType,

  currency,
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
                    className="group-hover:fill-mint fill-white text-white transition-all"
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
                  currency={currency}
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
                currency={currency}
                disabled={disabled}
                placeholder="XX,XXX.XX"
                type="number"
              />
            );
          }}
        />
      )}

      {/* DATE START  */}
      <Controller
        label="Due date"
        name={`outcomeRates.${index}.dateType`}
        control={control}
        containerClassName="w-full"
        render={({ field }) => {
          return (
            <div className="flex items-center gap-2">
              <Dropdown
                value={findLabelFromOptions(DATE_TYPES, field.value)}
                handleSelect={(val) => field.onChange(val)}
                options={DATE_TYPES}
                placeholder="Select an option"
              />
            </div>
          );
        }}
      />
      <div className="grid grid-cols-2">
        {dateType === "date" ? (
          <Controller
            label="Date"
            name={`outcomeRates.${index}.date`}
            control={control}
            render={({ field }) => {
              return (
                <DatePicker
                  value={new Date(field.value)}
                  onChange={(date) => {
                    field.onChange(formatDate(date!, "LL-dd-yyyy"));
                  }}
                />
              );
            }}
          />
        ) : dateType === "afterStart" || dateType === "afterEnd" ? (
          <Controller
            label={`# of days after ${dateType === "afterStart" ? "Start" : "End"} date`}
            name={`outcomeRates.${index}.date`}
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                wholeNumberOnly
                min={0}
                placeholder="Enter number of days"
                type="number"
              />
            )}
          />
        ) : null}
      </div>
      {/* DATE END  */}

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
            <HiOutlinePlusCircle className="group-hover:stroke-mint h-auto w-8 text-white transition-all" />

            <p className="group-hover:text-mint font-light">Add line item</p>
          </button>
        </div>
      )}
    </div>
  );
};

export default ContractOutcomeField;
