import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, subDays } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import useOrganizationList from "lib/common/lists/useOrganizationList";
import useProjectList from "lib/common/lists/useProjectList";
import { CONTRACT_STATUS } from "lib/constants";
import { usePage } from "lib/hooks";
import useContractMutation from "lib/mutations/contracts";
import { Contracts, IsAuthorized } from "lib/role-permissions";
import {
  ContractFieldValues,
  IContract,
  StatusType,
} from "lib/types/contracts";
import { findLabelFromOptions, formatDate, sortOptions } from "lib/utils";
import { contracts } from "lib/validators/contracts";

import { useConfirmPrompt } from "components/ui/alert/confirm-prompt";
import { useCustomPrompt } from "components/ui/alert/custom-prompt";
import Button from "components/ui/button";
import Controller from "components/ui/custom-controller/CustomController";
import DatePicker from "components/ui/date-picker";
import Dropdown from "components/ui/dropdown";
import FileInput from "components/ui/file-input";
import { Form } from "components/ui/form/Form";
import { useAutoSaveForm } from "components/ui/form/useAutoSave";
import Input from "components/ui/input";

import ContractOutcomeField from "../ContractOutcomeField";
import { useContractsContext } from "./ContractContext";

interface IContractForm {
  contractDetails: IContract | null;

  onEdit?: boolean;

  projectId: number;

  handleEdit: (val: boolean) => void;

  handleClose: () => void;

  markContract: () => void;

  onSuccess?: (contract: ContractFieldValues) => void;
}

const ContractForm = ({
  contractDetails,

  onEdit,

  projectId,

  handleEdit,

  handleClose,

  markContract,

  onSuccess,
}: IContractForm) => {
  const { open } = useCustomPrompt();

  const { toShowPrompt } = useContractsContext();

  const { setPage } = usePage();

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

    formState: { isDirty },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,

    name: "outcomeRates",
  });

  const {
    organizations,
    isLoading: orgLoading,
    handleSearchOrg,
  } = useOrganizationList({
    key: ["dropdown"],
    pageSize: 100,
    filters: { type: "provider" },
  });

  const {
    projects,
    isLoading: projectLoading,
    handleSearchProject,
  } = useProjectList({
    key: ["dropdown"],
    pageSize: 100,
  });

  const { isSigned, isCompleted, isDraft, isCancelled } = useMemo(() => {
    const status = contractDetails?.status;

    return {
      isSigned: status === "SIGNED",

      isCompleted: status === "COMPLETED",

      isDraft: status === "DRAFT",

      isCancelled: status === "CANCELLED",
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
    successCallback: (contract) => {
      onSuccess?.(contract);
      setIsAmmending(false);
      setPage(1);
    },
  });

  const onSubmit = async (values: ContractFieldValues) => {
    if (contractDetails) {
      open({
        title: "Confirm email with changes",
        subText:
          "Saving edits will send an email to all Contract Party users. Click cancel to revert or send to confirm changes and send the email.",
        onYes: () => addContract(values),
        yesLabel: "Send email with changes",
      });
      return;
    }
    await addContract(values);
  };

  const { setShowPrompt } = useConfirmPrompt();

  // sets contract form default values
  useEffect(() => {
    if (contractDetails) {
      reset(contracts.defaultValues({ contract: contractDetails }));
    }
  }, [contractDetails, reset]);

  useEffect(() => {
    toShowPrompt(isDirty);
  }, [isDirty, toShowPrompt]);

  // autosave start

  useAutoSaveForm(form, {
    formId: "contract-form",

    enabled: !Boolean(contractDetails) && isDirty,
  });
  // autosave end

  return (
    <Form form={form} onSubmit={onSubmit} className="space-y-1">
      {isAmmending ? (
        <div className="space-y-1">
          <Controller
            label="Please upload ammended contract"
            required
            name="documentId"
            control={control}
            render={({ field }) => (
              <FileInput
                accept=".pdf"
                onSuccess={(data) => {
                  field.onChange(data.id);
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
            label="Provider"
            required
            name="providerId"
            control={control}
            render={({ field }) => {
              return (
                <Dropdown
                  disabled={!onEdit}
                  enableSearch
                  loading={orgLoading}
                  value={
                    organizations.find(
                      (item) => Number(item.value) === Number(field.value)
                    )?.label
                  }
                  options={organizations}
                  handleSelect={(val) => {
                    field.onChange(Number(val));
                  }}
                  placeholder="Select provider"
                  onChange={(e) => handleSearchOrg(e.target.value)}
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
                    field.onChange(val.toString().toUpperCase() as StatusType);
                  }}
                  options={CONTRACT_STATUS.filter(
                    (item) => item.value !== "completed"
                  )}
                  placeholder="Select status"
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
                  options={sortOptions(projects)}
                  handleSelect={(val) => {
                    field.onChange(Number(val));

                    setValue("outcomeRates", [
                      {
                        outcomeId: 0,

                        rate: "",

                        perOutcome: true,

                        threshold: "",
                      },
                    ]);
                  }}
                  placeholder="Select project"
                  onChange={(e) => handleSearchProject(e.target.value)}
                />
              );
            }}
          />
          <Controller
            label="Target number of beneficiaries"
            labelClassName="md:w-[150px]"
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
            render={({ field }) => (
              <FileInput
                disabled={!onEdit || isSigned}
                filename={contractDetails?.document?.filename || ""}
                accept=".pdf"
                onSuccess={(data) => {
                  field.onChange(data.id);
                }}
                placeholder="Upload document"
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
                      field.onChange(formatDate(date!, "LL-dd-yyyy"));
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
                    field.onChange(formatDate(date!, "LL-dd-yyyy"));
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
            {contractDetails && !isAmmending && !isCancelled && (
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
                <Button
                  onClick={() => {
                    if (isDirty) {
                      setShowPrompt(true);
                      return;
                    }
                    close();
                  }}
                  buttonType="secondary"
                >
                  Cancel
                </Button>
              )}

              {isSigned &&
              !isAmmending &&
              watch("status") !== "CANCELLED" &&
              watch("status") !== "DRAFT" ? (
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    setIsAmmending(true);
                    setValue("documentId", 0);
                    setError("documentId", { message: "" });
                  }}
                  disabled={!isDirty}
                >
                  {contractDetails ? "Update" : "Add"}
                </Button>
              ) : (
                <Button type="submit" loading={isPending} disabled={!isDirty}>
                  {contractDetails ? "Update" : "Add"}
                </Button>
              )}
            </div>
          ))}
      </div>
    </Form>
  );
};

export default ContractForm;
