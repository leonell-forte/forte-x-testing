import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import organizationService from "api/organization";
import projectService from "api/projects";
import { useEffect, useMemo } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";

import { CONTRACT_STATUS } from "lib/constants";
import useContractMutation from "lib/mutations/contracts";
import {
  ContractFieldValues,
  IContract,
  StatusType,
} from "lib/types/contracts";
import { IOrganization } from "lib/types/organizations";
import { IProject } from "lib/types/projects";
import { findLabelFromOptions, formatDate } from "lib/utils";
import { contracts } from "lib/validators/contracts";

import Button from "components/ui/button";
import DatePicker from "components/ui/date-picker";
import Dropdown, { IOption } from "components/ui/dropdown";
import FileInput from "components/ui/file-input";
import Input from "components/ui/input";

import ContractOutcomeField from "../ContractOutcomeField";

interface IContractForm {
  contractDetails: IContract;

  onEdit?: boolean;

  projectId: number;

  handleEdit: (val: boolean) => void;

  handleClose: () => void;

  markContract: () => void;
}

const ContractForm = ({
  contractDetails,

  onEdit,

  projectId,

  handleEdit,

  handleClose,

  markContract,
}: IContractForm) => {
  const {
    watch,

    control,

    setValue,

    setError,

    handleSubmit,

    reset,

    formState: { errors },
  } = useForm<ContractFieldValues>({
    resolver: zodResolver(contracts.schema),

    defaultValues: contracts.defaultValues({
      contract: contractDetails,

      projectId,
    }),
  });

  // sets contract form default values
  useEffect(() => {
    if (contractDetails) {
      reset(contracts.defaultValues({ contract: contractDetails }));
    }
  }, [contractDetails, reset]);

  const { fields, append, remove } = useFieldArray({
    control,

    name: "outcomeRates",
  });

  const { data: organizationList, isLoading: orgLoading } = useQuery({
    queryKey: ["organizations"],

    queryFn: () => organizationService.list({ page: 1, listAll: true }),
  });

  const { data: projectsList, isLoading: projectLoading } = useQuery({
    queryKey: ["projects"],

    queryFn: () => projectService.list({}),
  });

  const organizations: IOption[] = useMemo(
    () =>
      organizationList?.items?.map((item: IOrganization) => ({
        label: item.name,

        value: item.id?.toString() as string,
      })) || [],

    [organizationList]
  );

  const projects: IOption[] = useMemo(
    () =>
      projectsList?.items.map((item: IProject) => ({
        label: item.name,

        value: item.id.toString(),
      })) || [],

    [projectsList]
  );

  const isSigned = useMemo(
    () => contractDetails?.status === "SIGNED",

    [contractDetails?.status]
  );

  const isCompleted = useMemo(
    () => contractDetails?.status === "COMPLETED",

    [contractDetails?.status]
  );

  const close = () => {
    handleClose!();

    reset();
  };

  const { addContract, isPending } = useContractMutation({
    id: contractDetails?.id,
    successCallback: close,
  });

  const onSubmit = async (values: ContractFieldValues) => {
    await addContract(values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
      <div className="flex items-start gap-4">
        <label htmlFor="" className="w-[120px] flex-shrink-0 pt-3">
          Contract name
        </label>

        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              disabled={!onEdit || isSigned}
              placeholder="Contract name"
              error={!!errors.name?.message}
              helperText={errors.name?.message}
            />
          )}
        />
      </div>

      <div className="flex items-start gap-4">
        <label htmlFor="" className="min-w-[120px] pt-4">
          Parties
        </label>

        <Controller
          name="partyIds"
          control={control}
          render={({ field }) => {
            return (
              <Dropdown
                disabled={!onEdit}
                enableSearch
                loading={orgLoading}
                showAsTags
                value={field.value.map((item) => item.toString())}
                options={organizations}
                handleSelect={(val) => {
                  setValue(
                    "partyIds",
                    (val as string[]).map((item) => Number(item))
                  );

                  setError("partyIds", { message: "" });
                }}
                error={!!errors.partyIds?.message}
                helperText={errors.partyIds?.message}
                isMultiSelect
                placeholder="Parties"
              />
            );
          }}
        />
      </div>

      <div className="flex items-start gap-4">
        <label htmlFor="" className="min-w-[120px] pt-4">
          Status
        </label>

        <Controller
          name="status"
          control={control}
          render={({ field }) => {
            return (
              <Dropdown
                disabled={!onEdit}
                value={field.value.toLowerCase()}
                handleSelect={(val) => {
                  setValue(
                    "status",
                    val.toString().toUpperCase() as StatusType
                  );

                  setError("status", { message: "" });
                }}
                options={CONTRACT_STATUS.filter(
                  (item) => item.value !== "completed"
                )}
                placeholder="Status"
                error={!!errors.status?.message}
                helperText={errors.status?.message}
              />
            );
          }}
        />
      </div>

      <div className="flex items-start gap-4">
        <label htmlFor="" className="min-w-[120px] pt-4">
          Project
        </label>

        <Controller
          name="projectId"
          control={control}
          render={({ field }) => {
            return (
              <Dropdown
                disabled={!!projectId || !onEdit}
                loading={projectLoading}
                enableSearch
                value={findLabelFromOptions(
                  projects,

                  field.value.toString()
                )}
                options={projects}
                handleSelect={(val) => {
                  setValue("projectId", Number(val));

                  setValue("outcomeRates", [
                    {
                      outcomeId: 0,

                      rate: "",

                      perOutcome: true,

                      threshold: "",
                    },
                  ]);

                  setError("projectId", { message: "" });
                }}
                placeholder="Project"
                error={!!errors.projectId?.message}
                helperText={errors.projectId?.message}
              />
            );
          }}
        />
      </div>

      <div className="flex items-start gap-4">
        <label htmlFor="" className="w-[120px] flex-shrink-0 pt-1">
          Target number of beneficiaries
        </label>

        <Controller
          name="targetNoOfBenefeciaries"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              disabled={!onEdit}
              placeholder="Number of beneficiaries"
              type="number"
              error={!!errors.targetNoOfBenefeciaries?.message}
              helperText={errors.targetNoOfBenefeciaries?.message}
            />
          )}
        />
      </div>

      <div className="flex items-start gap-4">
        <label htmlFor="" className="min-w-[120px] pt-4">
          Document
        </label>

        <Controller
          name="documentId"
          control={control}
          render={() => (
            <FileInput
              disabled={!onEdit || isSigned}
              filename={contractDetails?.document?.filename || ""}
              accept=".pdf"
              onSuccess={(data) => {
                setValue("documentId", data.id);

                setError("documentId", { message: "" });
              }}
              placeholder="Document"
              error={!!errors.documentId?.message}
              helperText={errors.documentId?.message}
            />
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-1 md:grid-cols-2 md:gap-6">
        <div className="flex items-start gap-4">
          <label htmlFor="" className="min-w-[120px] pt-4">
            Start date
          </label>

          <Controller
            name="startDate"
            control={control}
            render={({ field }) => {
              return (
                <DatePicker
                  disabled={!onEdit}
                  value={new Date(field.value)}
                  onChange={(date) => {
                    setValue("startDate", formatDate(date!, "LL-dd-yyyy"));

                    setError("startDate", { message: "" });
                  }}
                  error={!!errors.startDate?.message}
                  helperText={errors.startDate?.message}
                />
              );
            }}
          />
        </div>

        <div className="flex items-start gap-4">
          <label htmlFor="" className="min-w-[120px] pt-4">
            End date
          </label>

          <Controller
            name="endDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                disabled={!onEdit}
                value={new Date(field.value)}
                onChange={(date) => {
                  setValue("endDate", formatDate(date!, "LL-dd-yyyy"));

                  setError("endDate", { message: "" });
                }}
                error={!!errors.endDate?.message}
                helperText={errors.endDate?.message}
              />
            )}
          />
        </div>
      </div>

      <div className="space-y-10">
        {fields
          .map((item, index) => {
            return (
              <ContractOutcomeField
                disabled={!onEdit}
                isLast={index === fields.length - 1}
                key={item.id}
                projectId={watch("projectId")}
                control={control}
                perOutcome={watch(`outcomeRates.${index}.perOutcome`)}
                index={index}
                handleDelete={() => {
                  remove(index);
                }}
                handleSelectOutcome={(val) => {
                  setValue(`outcomeRates.${index}.outcomeId`, Number(val));

                  setError(`outcomeRates.${index}.outcomeId`, { message: "" });
                }}
                handleRadioSelect={(value) => {
                  setValue(`outcomeRates.${index}.threshold`, "");

                  setError(`outcomeRates.${index}.threshold`, {
                    message: "",
                  });

                  if (value === "Per outcome") {
                    setValue(
                      `outcomeRates.${index}.perOutcome`,

                      true
                    );
                  } else {
                    setValue(
                      `outcomeRates.${index}.perOutcome`,

                      false
                    );
                  }
                }}
                handleAdd={() =>
                  append({
                    outcomeId: 0,

                    rate: "",

                    perOutcome: true,

                    threshold: "",
                  })
                }
              />
            );
          })
          .reverse()}
      </div>

      <div className="!mt-10 flex items-center justify-between">
        <div>
          {isSigned && (
            <Button onClick={markContract} buttonType="secondary">
              Mark as completed
            </Button>
          )}

          {isCompleted && (
            <Button onClick={markContract} buttonType="secondary">
              Mark as incomplete
            </Button>
          )}
        </div>

        {!isCompleted &&
          (!onEdit ? (
            <Button onClick={() => handleEdit(true)} loading={isPending}>
              {isSigned ? "Amend" : "Edit"}
            </Button>
          ) : (
            <div className="flex justify-end gap-4">
              <Button
                onClick={() => {
                  handleEdit(false);

                  reset(contracts.defaultValues({ contract: contractDetails }));
                }}
                buttonType="secondary"
              >
                Cancel
              </Button>

              <Button type="submit" loading={isPending}>
                Save
              </Button>
            </div>
          ))}
      </div>
    </form>
  );
};

export default ContractForm;
