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

import { useCustomPrompt } from "components/ui/alert/custom-prompt";
import Button from "components/ui/button";
import Controller from "components/ui/custom-controller/CustomController";
import DatePicker from "components/ui/date-picker";
import { useModal } from "components/ui/dialogue/v2/Modal";
import Dropdown from "components/ui/dropdown";
import FileInput from "components/ui/file-input";
import { Form } from "components/ui/form/Form";
import { useAutoSaveForm } from "components/ui/form/useAutoSave";
import Input from "components/ui/input";
import {
  StepContent,
  StepTrigger,
  Stepper,
} from "components/ui/stepper/Stepper";

import ContractOutcomeField from "../ContractOutcomeField";
import { useContractsContext } from "./ContractContext";

interface IContractForm {
  contractDetails: IContract | null;

  onEdit?: boolean;

  projectId?: number;

  providerId?: string;

  funderId?: string;

  handleEdit: (val: boolean) => void;

  handleClose: () => void;

  onSuccess?: (contract: IContract) => void;

  activeStep?: number;
}

const ContractForm = ({
  contractDetails,

  onEdit,

  projectId,

  handleClose,

  onSuccess,

  providerId,

  funderId,

  activeStep: step,
}: IContractForm) => {
  const { open } = useCustomPrompt();

  const { setShowPromptOnClose } = useModal();

  const { toShowPrompt } = useContractsContext();

  const { setPage } = usePage();

  const [isAmmending, setIsAmmending] = useState(false);

  const form = useForm<ContractFieldValues>({
    resolver: zodResolver(contracts.schema),

    defaultValues: contracts.defaultValues({
      contract: contractDetails,

      projectId,

      providerId,
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
    filter: { funder: funderId || "" },
    pageSize: 100,
  });

  const { isSigned, isCompleted } = useMemo(() => {
    const status = contractDetails?.status;

    return {
      isSigned: status === "signed",

      isCompleted: status === "completed",

      isDraft: status === "draft",

      isCancelled: status === "cancelled",
    };
  }, [contractDetails?.status]);

  const close = () => {
    handleClose!();

    reset();
  };

  const { addContract, isPending } = useContractMutation({
    id: contractDetails?.id,
    providerId: providerId ? +providerId : undefined,
    successCallback: (contract) => {
      onSuccess?.(contract);
      setIsAmmending(false);
      setPage(1);
      close();
    },
    projectId,
  });

  const onSubmit = async (values: ContractFieldValues) => {
    if (contractDetails) {
      open({
        title: "Confirm email with changes",
        subText:
          "Saving edits will send an email to all Contract Party users. Click cancel to revert or send to confirm changes and send the email.",
        onYes: async () => {
          await addContract(values);
          close();
        },
        yesLabel: "Send email with changes",
      });
      return;
    }
    await addContract(values);
    close();
  };

  // const { setShowPrompt } = useConfirmPrompt();

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

    enabled: !contractDetails && isDirty,
  });
  // autosave end

  useEffect(() => {
    if (!isDirty) return;
    setShowPromptOnClose(true);
    return () => {
      setShowPromptOnClose(false);
    };
  }, [isDirty, setShowPromptOnClose]);

  const [activeStep, setActiveStep] = useState(step || 1);

  // Watch required fields for validation
  const contractName = watch("name");
  const selectedProjectId = watch("projectId");
  const selectedProviderId = watch("providerId");
  const targetBeneficiaries = watch("targetNoOfBenefeciaries");
  const documentId = watch("documentId");
  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const status = watch("status");

  // Validate step 1 required fields
  const isStep1Valid = useMemo(() => {
    return (
      contractName &&
      selectedProjectId &&
      selectedProviderId &&
      targetBeneficiaries &&
      documentId &&
      startDate &&
      endDate &&
      status
    );
  }, [
    contractName,
    selectedProjectId,
    selectedProviderId,
    targetBeneficiaries,
    documentId,
    startDate,
    endDate,
    status,
  ]);

  // Validate step 2 required fields

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
        <>
          <Stepper activeStep={activeStep}>
            {step !== 2 && (
              <>
                <StepTrigger stepNumber={1}>1. Contract details</StepTrigger>
                <StepTrigger stepNumber={2}>2. Linked outcomes</StepTrigger>
              </>
            )}
            <StepContent contentNumber={1}>
              <div className="space-y-8 pt-10">
                <div className="space-y-3">
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

                  {!projectId && (
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
                            onChange={(e) =>
                              handleSearchProject(e.target.value)
                            }
                          />
                        );
                      }}
                    />
                  )}

                  <Controller
                    label="Provider"
                    required
                    name="providerId"
                    control={control}
                    render={({ field }) => {
                      return (
                        <Dropdown
                          disabled={!onEdit || !!providerId}
                          enableSearch
                          loading={orgLoading}
                          value={
                            organizations.find(
                              (item) =>
                                Number(item.value) === Number(field.value)
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
                    label="Target # of beneficiaries"
                    labelClassName="md:w-[150px]"
                    required
                    containerClassName="max-w-[203px]"
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
                    label="Contract document"
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
                        placeholder="Choose file"
                      />
                    )}
                  />

                  <div className="flex gap-2">
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

                  <Controller
                    label="Status"
                    name="status"
                    containerClassName="max-w-[203px]"
                    control={control}
                    render={({ field }) => {
                      return (
                        <Dropdown
                          disabled={!onEdit}
                          value={field.value.toLowerCase()}
                          handleSelect={(val) => {
                            field.onChange(
                              val.toString().toUpperCase() as StatusType
                            );
                          }}
                          options={CONTRACT_STATUS.filter(
                            (item) => item.value !== "completed"
                          )}
                          placeholder="Select status"
                        />
                      );
                    }}
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={() => setActiveStep(2)}
                    className="w-[147px]"
                    disabled={!isStep1Valid}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </StepContent>

            <StepContent contentNumber={2}>
              <div className="pt-10">
                <div className="mx-auto max-w-[365px] space-y-4">
                  {fields.map((item, index) => {
                    return (
                      <ContractOutcomeField
                        isLast={index === fields.length - 1}
                        disabled={!onEdit}
                        key={item.id}
                        projectId={watch("projectId")}
                        control={control}
                        perOutcome={watch(`outcomeRates.${index}.perOutcome`)}
                        index={index}
                        handleDelete={
                          fields.length === 1
                            ? undefined
                            : () => {
                                remove(index);
                              }
                        }
                        handleSelectOutcome={(val) => {
                          setValue(
                            `outcomeRates.${index}.outcomeId`,
                            Number(val)
                          );

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

                <div className="!mt-10 flex w-full items-center justify-between">
                  {!isCompleted && IsAuthorized([Contracts.UPDATE]) && (
                    <div className="flex w-full justify-between gap-4">
                      <Button
                        onClick={() => setActiveStep(1)}
                        className="w-[147px]"
                        buttonType="secondary"
                      >
                        Back
                      </Button>

                      {isSigned &&
                      !isAmmending &&
                      watch("status") !== "cancelled" &&
                      watch("status") !== "draft" ? (
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            setIsAmmending(true);
                            setValue("documentId", 0);
                            setError("documentId", { message: "" });
                          }}
                          className="w-[147px]"
                        >
                          {contractDetails ? "Update" : "Add"}
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          loading={isPending}
                          className="w-[147px]"
                        >
                          {contractDetails ? "Update" : "Add"}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </StepContent>
          </Stepper>
        </>
      )}
    </Form>
  );
};

export default ContractForm;
