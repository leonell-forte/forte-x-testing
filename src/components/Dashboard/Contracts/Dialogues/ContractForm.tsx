import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import organizationService from "api/organization";
import projectService from "api/projects";
import { addDays, subDays } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import { CONTRACT_STATUS } from "lib/constants";
import useContractMutation from "lib/mutations/contracts";
import { Contracts, IsAuthorized } from "lib/role-permissions";
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
import Controller from "components/ui/custom-controller/CustomController";
import DatePicker from "components/ui/date-picker";
import Dropdown, { IOption } from "components/ui/dropdown";
import FileInput from "components/ui/file-input";
import { Form } from "components/ui/form/Form";
import Input from "components/ui/input";

import ContractOutcomeField from "../ContractOutcomeField";

interface IContractForm {
  contractDetails: IContract | null;

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
  const [isAmmending, setIsAmmending] = useState(false);

  const form = useForm<ContractFieldValues>({
    resolver: zodResolver(contracts.schema),

    defaultValues: contracts.defaultValues({
      contract: contractDetails,

      projectId,
    }),
  });

  const {
    watch,

    control,

    setValue,

    setError,

    reset,
  } = form;

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

  const { isSigned, isCompleted, isDraft } = useMemo(() => {
    const status = contractDetails?.status;

    return {
      isSigned: status === "SIGNED",

      isCompleted: status === "COMPLETED",

      isDraft: status === "DRAFT",
    };
  }, [contractDetails?.status]);

  const statusActions = useMemo(() => {
    if (isDraft) return { label: "Mark as signed" };

    if (isSigned) return { label: "Mark as completed" };

    if (isCompleted) return { label: "Mark as incomplete" };

    return null;
  }, [isDraft, isSigned, isCompleted]);

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
    <Form form={form} onSubmit={onSubmit} className="space-y-1">
      {isAmmending ? (
        <div className="space-y-1">
          <Controller
            label="Please upload ammended contract"
            required
            name="documentId"
            control={control}
            render={() => (
              <FileInput
                accept=".pdf"
                onSuccess={(data) => {
                  setValue("documentId", data.id);

                  setError("documentId", { message: "" });
                }}
                placeholder="Document"
              />
            )}
          />
        </div>
      ) : (
        <div className="space-y-4">
          <Controller
            label="Contract name"
            required
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                disabled={!onEdit || isSigned}
                placeholder="Contract name"
              />
            )}
          />
          <Controller
            label="Parties"
            required
            name="partyIds"
            control={control}
            render={({ field }) => {
              return (
                <Dropdown
                  disabled={!onEdit}
                  enableSearch
                  loading={orgLoading}
                  showAsTags
                  value={field.value.map((item: number) => item.toString())}
                  options={organizations}
                  handleSelect={(val) => {
                    setValue(
                      "partyIds",
                      (val as string[]).map((item) => Number(item))
                    );

                    setError("partyIds", { message: "" });
                  }}
                  isMultiSelect
                  placeholder="Parties"
                />
              );
            }}
          />
          <Controller
            label="Status"
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
                />
              );
            }}
          />
          <Controller
            label="Project"
            required
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
                />
              );
            }}
          />
          <Controller
            label="Target number of beneficiaries"
            labelClassName="w-[150px]"
            required
            name="targetNoOfBenefeciaries"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                wholeNumberOnly
                min={0}
                disabled={!onEdit}
                placeholder="Number of beneficiaries"
                type="number"
              />
            )}
          />
          <Controller
            label="Document"
            required
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
              />
            )}
          />
          <div className="grid grid-cols-1 gap-1 md:grid-cols-2 md:gap-6">
            <Controller
              required
              label="Start date"
              name="startDate"
              control={control}
              render={({ field }) => {
                return (
                  <DatePicker
                    disabled={!onEdit}
                    maxDate={subDays(new Date(watch("endDate")), 1)}
                    value={new Date(field.value)}
                    onChange={(date) => {
                      setValue("startDate", formatDate(date!, "LL-dd-yyyy"));

                      setError("startDate", { message: "" });
                    }}
                  />
                );
              }}
            />

            <Controller
              label="End date"
              required
              name="endDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  disabled={!onEdit}
                  minDate={addDays(new Date(watch("startDate")), 1)}
                  value={new Date(field.value)}
                  onChange={(date) => {
                    setValue("endDate", formatDate(date!, "LL-dd-yyyy"));

                    setError("endDate", { message: "" });
                  }}
                />
              )}
            />
          </div>
          <div className="space-y-10">
            {fields.map((item, index) => {
              return (
                <ContractOutcomeField
                  disabled={!onEdit}
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

                    setError(`outcomeRates.${index}.outcomeId`, {
                      message: "",
                    });
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
            })}
          </div>
        </div>
      )}

      <div className="!mt-10 flex items-center justify-between">
        {IsAuthorized([Contracts.UPDATE]) && (
          <div>
            {contractDetails && !isAmmending && (
              <Button onClick={markContract} buttonType="secondary">
                {statusActions?.label}
              </Button>
            )}
          </div>
        )}

        {!isCompleted &&
          IsAuthorized([Contracts.UPDATE]) &&
          (!onEdit ? (
            <Button onClick={() => handleEdit(true)}>
              {isSigned ? "Amend" : "Edit"}
            </Button>
          ) : (
            <div className="flex justify-end gap-4">
              {contractDetails ? (
                <Button
                  onClick={() => {
                    if (isAmmending) {
                      setIsAmmending(false);
                    } else {
                      handleEdit(false);

                      reset(
                        contracts.defaultValues({ contract: contractDetails })
                      );
                    }
                  }}
                  buttonType="secondary"
                >
                  Cancel
                </Button>
              ) : (
                <Button onClick={handleClose} buttonType="secondary">
                  Cancel
                </Button>
              )}

              {isSigned && !isAmmending ? (
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    setIsAmmending(true);
                    setValue("documentId", 0);
                    setError("documentId", { message: "" });
                  }}
                >
                  Save
                </Button>
              ) : (
                <Button type="submit" loading={isPending}>
                  Save
                </Button>
              )}
            </div>
          ))}
      </div>
    </Form>
  );
};

export default ContractForm;
