import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import organizationService from "api/organization";
import { add, sub } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import useContractList from "lib/common/lists/useContractList";
import {
  BENEFICIARY_STATUS,
  CONFIRM,
  GENDER,
  HIGHEST_EDUCATION_LEVEL,
  LANGUAGES,
  RISK_LEVEL,
  filterStatus,
} from "lib/constants";
import { useBeneficiaryMutation } from "lib/mutations/beneficiaries";
import { Beneficiaries, IsAuthorized } from "lib/role-permissions";
import {
  IBeneficiaries,
  IBeneficiariesFieldValues,
} from "lib/types/beneficiaries";
import { findLabelFromOptions, sortOptions } from "lib/utils";
import { beneficiaries } from "lib/validators/beneficiaries";

import { useProfile } from "components/ProfileContext";
import { useCustomPrompt } from "components/ui/alert/custom-prompt";
import Button from "components/ui/button";
import Controller from "components/ui/custom-controller/CustomController";
import DatePicker from "components/ui/date-picker";
import { useModal } from "components/ui/dialogue/v2/Modal";
import Dropdown, { IOption } from "components/ui/dropdown";
import { Form } from "components/ui/form/Form";
import InputMobile from "components/ui/form/InputMobile";
import { useAutoSaveForm } from "components/ui/form/useAutoSave";
import Input from "components/ui/input";
import {
  StepContent,
  StepTrigger,
  Stepper,
} from "components/ui/stepper/Stepper";

const alertConfig = {
  "Pending evidence review": {
    title: "Request review",
    subText:
      "Changing a beneficiary status to Pending evidence review will send an email to Forte or your Funder asking them to review this Beneficiary’s evidence. Click cancel to revert or send request to send the email.",
  },
};

type BeneficiaryModal = {
  beneficiaryDetails?: IBeneficiaries;
  contractId?: string;
  funderId?: string;
  providerId?: string;
  projectId?: string;
};

export function showSetupBeneficiaryModal({
  beneficiaryDetails,
  contractId,
  funderId,
  providerId,
  projectId,
}: BeneficiaryModal) {
  const isEdit = Boolean(beneficiaryDetails);
  useModal.getState().open({
    component: (
      <SetupBeneficiaryModal
        beneficiaryDetails={beneficiaryDetails}
        contractId={contractId}
        funderId={funderId}
        providerId={providerId}
        projectId={projectId}
      />
    ),
    size: "2xl",
    title: `${isEdit ? "Edit" : "Add"} Beneficiary ${isEdit ? "ID: " + beneficiaryDetails?.id : ""}`,
    titleClassName: "text-center",
    panelClassName: "!max-w-[760px]",
  });
}

export function SetupBeneficiaryModal({
  beneficiaryDetails,
  contractId,
  funderId,
  providerId,
  projectId,
}: {
  beneficiaryDetails?: IBeneficiaries;
  contractId?: string;
  funderId?: string;
  providerId?: string;
  projectId?: string;
}) {
  const { profile } = useProfile();
  const { close, setShowPromptOnClose } = useModal();
  const { open } = useCustomPrompt();

  const form = useForm<IBeneficiariesFieldValues>({
    resolver: zodResolver(beneficiaries.schema),

    defaultValues: beneficiaries.defaultValues({}),
  });

  const {
    control,
    setValue,
    setError,
    watch,
    reset,
    formState: { isDirty, errors },
  } = form;

  const {
    rawList: contractList,
    isLoading: contractsLoading,
    handleSearchContract,
  } = useContractList({
    key: ["dropdown"],
    pageSize: 100,
  });

  useEffect(() => {
    reset(
      beneficiaries.defaultValues({
        beneficiary: beneficiaryDetails,
        contractId: Number(contractId),
      })
    );

    if (contractId && contractList?.items) {
      const contract = contractList?.items.find(
        (item) => item.id === Number(contractId)
      );
      setValue("providerId", contract?.provider.id as number);
      setValue("projectId", contract?.projectId as number);
    }
  }, [beneficiaryDetails, reset, contractId, contractList?.items, setValue]);

  const { data: organizationList } = useQuery({
    queryKey: ["organizations"],
    queryFn: () =>
      organizationService.list({
        pageSize: 100,
        page: 1,
        filters: { type: "provider" },
      }),
  });

  const contracts: IOption[] = useMemo(
    () =>
      contractList?.items
        .filter((y) =>
          organizationList?.items.some((z) =>
            String(y.provider.id).includes(String(z.id))
          )
        )
        .map((item) => ({
          label: item.name,
          value: item.id!.toString(),
        })) || [],
    [organizationList, contractList]
  );

  // const selectedContract = watch("contractId");

  // const organizations: IOption[] = useMemo(
  //   () =>
  //     organizationList?.items
  //       .filter((org) => {
  //         // filter the organizations based on selected contract
  //         // provider dropdown should be disabled if no contract is selected

  //         const contract = contractList?.items.find(
  //           (contract) => contract.id === selectedContract
  //         );

  //         return contract?.provider.id === org.id;
  //       })
  //       .map((item) => ({
  //         label: item.name,

  //         value: item.id!.toString(),
  //       })) || [],

  //   [organizationList, contractList, selectedContract]
  // );

  const { addBeneficiary, isPending } = useBeneficiaryMutation({
    beneficiaryId: beneficiaryDetails?.id,

    successCallback: () => close(),

    funderId,

    providerId,

    projectId,

    contractId,
  });

  const onSubmit = async (values: IBeneficiariesFieldValues) => {
    if (beneficiaryDetails && values.status === "Pending evidence review") {
      open({
        ...alertConfig["Pending evidence review"],
        onYes: () => addBeneficiary(values),
        yesLabel: "Send request",
      });
      return;
    }
    await addBeneficiary(values);
  };

  const [min, max] = watch(["cohortStartDate", "cohortEndDate"]);

  // autosave start

  useAutoSaveForm(form, {
    formId: "beneficiaries-form",

    enabled: !beneficiaryDetails,
  });
  // autosave end

  useEffect(() => {
    if (!isDirty) return;
    setShowPromptOnClose(true);
    return () => {
      setShowPromptOnClose(false);
    };
  }, [isDirty, setShowPromptOnClose]);

  const [activeStep, setActiveStep] = useState(1);

  const validateStep1 = () => {
    const { firstName, lastName, email } = watch();
    const hasErrors = Boolean(
      errors.firstName || errors.lastName || errors.email
    );
    return firstName && lastName && email && !hasErrors;
  };

  const validateStep2 = () => {
    const { contractId, providerId, projectId } = watch();
    return contractId && providerId && projectId;
  };

  const validateStep3 = () => {
    const { status } = watch();
    return status;
  };

  return (
    <Form form={form} onSubmit={onSubmit}>
      <Stepper activeStep={activeStep}>
        <StepTrigger stepNumber={1}>1. Personal details</StepTrigger>
        <StepTrigger stepNumber={2}>2. Project details</StepTrigger>
        <StepTrigger stepNumber={3}>3. Other details</StepTrigger>
        <StepContent contentNumber={1}>
          <div className="space-y-8 pt-10">
            <div className="mx-auto max-w-[414px] space-y-3">
              <div className="flex w-full gap-2">
                <Controller
                  name="firstName"
                  label="First name"
                  required
                  control={control}
                  containerClassName="w-full"
                  render={({ field }) => (
                    <Input {...field} placeholder="First name" />
                  )}
                />
                <Controller
                  label="Last name"
                  required
                  control={control}
                  name="lastName"
                  containerClassName="w-full"
                  render={({ field }) => (
                    <Input {...field} placeholder="Last name" />
                  )}
                />
              </div>
              <Controller
                label="Email"
                required
                control={control}
                name="email"
                render={({ field }) => <Input {...field} placeholder="Email" />}
              />
              <Controller
                label="Phone"
                control={control}
                name="phone"
                containerClassName="w-[250px]"
                render={({ field }) => (
                  <InputMobile {...field} placeholder="Phone" />
                )}
              />
            </div>

            <div className="flex justify-end">
              <Button
                className="w-[147px]"
                onClick={() => setActiveStep(2)}
                disabled={!validateStep1()}
              >
                Next
              </Button>
            </div>
          </div>
        </StepContent>

        <StepContent contentNumber={2}>
          <div className="mx-auto max-w-[414px] space-y-3 pt-10">
            <Controller
              label="Contract"
              required
              control={control}
              name="contractId"
              render={({ field }) => (
                <Dropdown
                  enableSearch
                  loading={contractsLoading}
                  value={findLabelFromOptions(
                    contracts,
                    (field.value || "").toString()
                  )}
                  handleSelect={(val) => {
                    field.onChange(Number(val));
                    const contract = contractList?.items.find(
                      (item) => item.id === Number(val)
                    );
                    setValue("providerId", contract?.provider.id as number);
                    setValue("projectId", contract?.projectId as number);
                    setError("contractId", { message: "" });
                    setError("projectId", { message: "" });
                    setError("providerId", { message: "" });
                  }}
                  options={sortOptions(contracts)}
                  placeholder="Select contract"
                  disabled={!!contractId}
                  onChange={(e) => handleSearchContract(e.target.value)}
                />
              )}
            />
            <Controller
              label="Program (Optional)"
              control={control}
              name="cohortName"
              render={({ field }) => <Input {...field} placeholder="Program" />}
            />

            <div className="flex gap-2">
              <Controller
                label="Start date"
                control={control}
                name="cohortStartDate"
                render={({ field }) => (
                  <DatePicker
                    {...(max && { maxDate: sub(max, { days: 1 }) })}
                    value={new Date(field.value || "")}
                    onChange={(date) => {
                      field.onChange(date ? date.toISOString() : "");
                    }}
                  />
                )}
              />
              <Controller
                label="End date"
                control={control}
                name="cohortEndDate"
                render={({ field }) => (
                  <DatePicker
                    {...(min && { minDate: add(min, { days: 1 }) })}
                    value={new Date(field.value || "")}
                    onChange={(date) => {
                      field.onChange(date ? date.toISOString() : "");
                    }}
                  />
                )}
              />
            </div>
            <div className="flex gap-2">
              <Controller
                label="Status"
                required
                control={control}
                name="status"
                render={({ field }) => (
                  <Dropdown
                    value={field.value || ""}
                    handleSelect={(val) => {
                      field.onChange(val);
                    }}
                    options={filterStatus(BENEFICIARY_STATUS, profile.orgType)}
                    placeholder="Status"
                  />
                )}
              />
              <Controller
                label="Risk level"
                control={control}
                name="riskLevel"
                render={({ field }) => (
                  <Dropdown
                    value={field.value as string}
                    handleSelect={(val) => {
                      field.onChange(val);

                      setError("riskLevel", { message: "" });
                    }}
                    options={RISK_LEVEL}
                    placeholder="Select risk level"
                  />
                )}
              />
            </div>

            {/* <Controller
              label="Provider"
              control={control}
              name="providerId"
              render={({ field }) => (
                <Input
                  disabled
                  placeholder="Provider"
                  value={findLabelFromOptions(
                    organizations,
                    field.value.toString()
                  )}
                />
              )}
            />
            <Controller
              label="Project"
              control={control}
              name="projectId"
              render={() => (
                <Input
                  disabled
                  placeholder="Project"
                  value={
                    contractList?.items.find(
                      (item) => item.id === watch("contractId")
                    )?.project
                  }
                />
              )}
            /> */}
          </div>
          <div className="flex justify-between pt-8">
            <Button
              buttonType="secondary"
              className="w-[147px]"
              onClick={() => setActiveStep(1)}
            >
              Back
            </Button>
            <Button
              className="w-[147px]"
              onClick={() => setActiveStep(3)}
              disabled={!validateStep2()}
            >
              Next
            </Button>
          </div>
        </StepContent>

        <StepContent contentNumber={3}>
          <div>
            <div className="hide-scroll max-h-[554px] overflow-auto pt-10">
              <div className="mx-auto max-w-[414px] space-y-10">
                <div className="space-y-4">
                  <p className="font-medium">Demographics</p>
                  <div>
                    <div className="flex gap-2">
                      <Controller
                        label="Date of birth"
                        control={control}
                        name="birthdate"
                        render={({ field }) => (
                          <DatePicker
                            value={new Date(field.value)}
                            onChange={(date) => {
                              field.onChange(date ? date.toISOString() : "");
                            }}
                          />
                        )}
                      />

                      <Controller
                        label="Gender"
                        control={control}
                        name="gender"
                        render={({ field }) => (
                          <Dropdown
                            value={field.value}
                            handleSelect={(val) => field.onChange(val)}
                            options={GENDER}
                            placeholder="Select gender"
                          />
                        )}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Controller
                        label="Ethnicity"
                        control={control}
                        name="ethnicity"
                        containerClassName="w-full"
                        render={({ field }) => (
                          <Input {...field} placeholder="Ethnicity" />
                        )}
                      />

                      <Controller
                        label="Highest education level"
                        control={control}
                        name="educationLevel"
                        containerClassName="w-full"
                        render={({ field }) => (
                          <Dropdown
                            value={field.value}
                            handleSelect={(val) => {
                              field.onChange(val);
                            }}
                            options={HIGHEST_EDUCATION_LEVEL}
                            placeholder="Select highest education level"
                          />
                        )}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Controller
                        label="Socio-economic status"
                        control={control}
                        name="socioeconomicStatus"
                        containerClassName="w-full"
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="Socio-economic status"
                          />
                        )}
                      />

                      <Controller
                        label="Disability status"
                        control={control}
                        name="disabilityStatus"
                        containerClassName="w-full"
                        render={({ field }) => (
                          <Dropdown
                            value={field.value}
                            handleSelect={(val) => {
                              field.onChange(val);
                            }}
                            options={CONFIRM}
                            placeholder="Select disability status"
                          />
                        )}
                      />
                    </div>

                    <Controller
                      label="Address"
                      control={control}
                      name="address"
                      render={({ field }) => (
                        <Input {...field} placeholder="Address" />
                      )}
                    />

                    <Controller
                      label="Language(s) spoken"
                      control={control}
                      name="languages"
                      containerClassName="max-w-[203px]"
                      render={({ field }) => (
                        <Dropdown
                          enableSearch
                          isMultiSelect
                          showAsTags
                          value={field.value}
                          handleSelect={(val) => {
                            field.onChange(val);
                          }}
                          options={LANGUAGES.map((item) => ({
                            label: item,

                            value: item,
                          }))}
                          placeholder="Select languages"
                          filterOptions
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="font-medium">Social Media</p>
                  <div>
                    <Controller
                      label="Linkedin"
                      control={control}
                      name="linkedinUrl"
                      render={({ field }) => (
                        <Input {...field} placeholder="Linkedin link" />
                      )}
                    />
                    <Controller
                      label="Github"
                      control={control}
                      name="githubUrl"
                      render={({ field }) => (
                        <Input {...field} placeholder="Github link" />
                      )}
                    />
                    <Controller
                      label="Other"
                      control={control}
                      name="otherUrl"
                      render={({ field }) => (
                        <Input {...field} placeholder="Other" />
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>

            {IsAuthorized([Beneficiaries.UPDATE]) && (
              <div className="flex justify-between gap-4 pt-6">
                <>
                  <Button
                    buttonType="secondary"
                    className="w-[147px]"
                    onClick={() => {
                      setActiveStep(2);
                    }}
                  >
                    Back
                  </Button>

                  <Button
                    type="submit"
                    loading={isPending}
                    disabled={!validateStep3() || !isDirty}
                    className="w-[147px]"
                  >
                    {beneficiaryDetails?.id ? "Update" : "Add"}
                  </Button>
                </>
              </div>
            )}
          </div>
        </StepContent>
      </Stepper>
    </Form>
  );
}
