import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import organizationService from "api/organization";
import { add, sub } from "date-fns";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import useContractList from "lib/common/lists/useContractList";
import {
  BENEFICIARY_STATUS,
  CONFIRM,
  GENDER,
  HIGHEST_EDUCATION_LEVEL,
  LANGUAGES,
  RISK_LEVEL,
} from "lib/constants";
import { useBeneficiaryMutation } from "lib/mutations/beneficiaries";
import { Beneficiaries, IsAuthorized } from "lib/role-permissions";
import {
  IBeneficiaries,
  IBeneficiariesFieldValues,
} from "lib/types/beneficiaries";
import { findLabelFromOptions } from "lib/utils";
import { beneficiaries } from "lib/validators/beneficiaries";

import { useConfirmPrompt } from "components/ui/alert/confirm-prompt-v2";
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

const alertConfig = {
  "Pending evidence review": {
    title: "Request review",
    subText:
      "Changing a beneficiary status to Pending evidence review will send an email to Forte or your Funder asking them to review this Beneficiary’s evidence. Click cancel to revert or send request to send the email.",
  },
};

export function showSetupBeneficiaryModal(
  beneficiaryDetails?: IBeneficiaries,
  contractId?: string
) {
  const isEdit = Boolean(beneficiaryDetails);
  useModal.getState().open({
    component: (
      <SetupBeneficiaryModal
        beneficiaryDetails={beneficiaryDetails}
        contractId={contractId}
      />
    ),
    size: "2xl",
    title: `${isEdit ? "Edit" : "Add"} Beneficiary ${isEdit ? "ID: " + beneficiaryDetails?.id : ""}`,
  });
}

export function SetupBeneficiaryModal({
  beneficiaryDetails,
  contractId,
}: {
  beneficiaryDetails?: IBeneficiaries;
  contractId?: string;
}) {
  const { close, setShowPromptOnClose } = useModal();
  const { open: openConfirmPrompt } = useConfirmPrompt();
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

    formState: { isDirty },
  } = form;

  useEffect(() => {
    reset(
      beneficiaries.defaultValues({
        beneficiary: beneficiaryDetails,
        contractId: Number(contractId),
      })
    );
  }, [beneficiaryDetails, reset, contractId]);

  //   const project = watch("projectId");

  const { data: organizationList } = useQuery({
    queryKey: ["organizations"],
    queryFn: () =>
      organizationService.list({
        pageSize: 100,
        page: 1,
        filters: { type: "provider" },
      }),
  });

  const {
    rawList: contractList,
    isLoading: contractsLoading,
    handleSearchContract,
  } = useContractList({
    key: ["dropdown"],
    pageSize: 100,
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

  const selectedContract = watch("contractId");

  const organizations: IOption[] = useMemo(
    () =>
      organizationList?.items
        .filter((org) => {
          // filter the organizations based on selected contract
          // provider dropdown should be disabled if no contract is selected

          const contract = contractList?.items.find(
            (contract) => contract.id === selectedContract
          );

          return contract?.provider.id === org.id;
        })
        .map((item) => ({
          label: item.name,

          value: item.id!.toString(),
        })) || [],

    [organizationList, contractList, selectedContract]
  );

  const { addBeneficiary, isPending } = useBeneficiaryMutation({
    beneficiaryId: beneficiaryDetails?.id,

    successCallback: () => close(),
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

  return (
    <Form form={form} onSubmit={onSubmit}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
          <Controller
            name="firstName"
            label="First name"
            required
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="First name" />
            )}
          />

          <Controller
            label="Last name"
            required
            control={control}
            name="lastName"
            render={({ field }) => <Input {...field} placeholder="Last name" />}
          />

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
            render={({ field }) => (
              <InputMobile {...field} placeholder="Phone" />
            )}
          />

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
                options={BENEFICIARY_STATUS}
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
                options={contracts}
                placeholder="Select contract"
                onChange={(e) => handleSearchContract(e.target.value)}
              />
            )}
          />

          <Controller
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
          />
        </div>

        <div className="flex items-center gap-5">
          <p className="heading w-fit whitespace-nowrap">Cohort</p>

          <hr className="w-full" />
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
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

          <Controller
            label="Program"
            control={control}
            name="cohortName"
            render={({ field }) => <Input {...field} placeholder="Program" />}
          />
        </div>

        <div className="flex items-center gap-5">
          <p className="heading w-fit whitespace-nowrap">Social media</p>

          <hr className="w-full" />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
            render={({ field }) => <Input {...field} placeholder="Other" />}
          />
        </div>

        <div className="flex items-center gap-5">
          <p className="heading w-fit whitespace-nowrap">Demographics</p>

          <hr className="w-full" />
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
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
              label="Ethnicity"
              control={control}
              name="ethnicity"
              render={({ field }) => (
                <Input {...field} placeholder="Ethnicity" />
              )}
            />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
            <Controller
              label="Disability status"
              control={control}
              name="disabilityStatus"
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
        </div>

        <Controller
          label="Address"
          control={control}
          name="address"
          render={({ field }) => <Input {...field} placeholder="Address" />}
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Controller
            label="Socio-economic status"
            control={control}
            name="socioeconomicStatus"
            render={({ field }) => (
              <Input {...field} placeholder="Socio-economic status" />
            )}
          />

          <Controller
            label="Highest education level"
            control={control}
            name="educationLevel"
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

        <Controller
          label="Language(s) spoken"
          control={control}
          name="languages"
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

      {IsAuthorized([Beneficiaries.UPDATE]) && (
        <div className="flex justify-end gap-4 pt-6">
          <>
            <Button
              buttonType="secondary"
              onClick={() => {
                if (isDirty) {
                  openConfirmPrompt();
                  return;
                }
                close();
              }}
            >
              Cancel
            </Button>

            <Button type="submit" loading={isPending} disabled={!isDirty}>
              {beneficiaryDetails?.id ? "Update" : "Add"}
            </Button>
          </>
        </div>
      )}
    </Form>
  );
}
