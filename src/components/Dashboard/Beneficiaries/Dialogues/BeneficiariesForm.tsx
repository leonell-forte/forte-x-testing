import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import contractService from "api/contract";
import organizationService from "api/organization";
import { Dispatch, SetStateAction, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import {
  BENEFICIARY_STATUS,
  CONFIRM,
  GENDER,
  HIGHEST_EDUCATION_LEVEL,
  LANGUAGES,
  RISK_LEVEL,
} from "lib/constants";
import { useAppDispatch } from "lib/hooks";
import { useBeneficiaryMutation } from "lib/mutations/beneficiaries";
import { Beneficiaries, IsAuthorized } from "lib/role-permissions";
import { setSelectedData } from "lib/slice/evidence";
import {
  IBeneficiaries,
  IBeneficiariesFieldValues,
} from "lib/types/beneficiaries";
import { findLabelFromOptions } from "lib/utils";
import { beneficiaries } from "lib/validators/beneficiaries";

import { useConfirmPrompt } from "components/ui/alert/confirm-prompt";
import Button from "components/ui/button";
import Controller from "components/ui/custom-controller/CustomController";
import DatePicker from "components/ui/date-picker";
import Dropdown, { IOption } from "components/ui/dropdown";
import { Form } from "components/ui/form/Form";
import InputMobile from "components/ui/form/InputMobile";
import Input from "components/ui/input";

import { useBeneficiariesContext } from "./BeneficiariesContext";

interface IProps {
  id?: number;

  projectId?: number;

  onEdit?: boolean;

  setOnEdit: Dispatch<SetStateAction<boolean>>;

  handleSuccess?: (id?: number) => void;

  beneficiaryData?: IBeneficiaries | null;

  handleClose?: () => void;
}

const BeneficiariesForm = ({
  id,

  projectId,

  handleSuccess,

  onEdit,

  setOnEdit,

  beneficiaryData,

  handleClose,
}: IProps) => {
  const dispatch = useAppDispatch();

  const form = useForm<IBeneficiariesFieldValues>({
    resolver: zodResolver(beneficiaries.schema),

    defaultValues: beneficiaries.defaultValues({ projectId }),
  });

  const {
    control,

    setValue,

    setError,

    watch,

    reset,

    formState: { isDirty },
  } = form;

  const { toShowPrompt } = useBeneficiariesContext();

  useEffect(() => {
    if (beneficiaryData) {
      reset(beneficiaries.defaultValues({ beneficiary: beneficiaryData }));
    }
  }, [beneficiaryData, reset]);

  useEffect(() => {
    toShowPrompt(isDirty);
  }, [isDirty, toShowPrompt]);

  const contract = watch("contractId");

  const project = watch("projectId");

  useEffect(() => {
    // this passes beneficiary, contract and project to add evidence dialogue component as it is needed when editing and adding an evidence
    dispatch(
      setSelectedData({
        contractId: contract,

        projectId: project,

        beneficiaryId: Number(id),
      })
    );
  }, [contract, project, id, dispatch, watch]);

  const { data: organizationList } = useQuery({
    queryKey: ["organizations"],

    queryFn: () =>
      organizationService.list({
        listAll: true,

        page: 1,

        filters: { type: "provider" },
      }),
  });

  const { data: contractList, isLoading: contractsLoading } = useQuery({
    queryKey: ["contracts"],

    queryFn: () =>
      contractService.list({
        listAll: true,
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

  const onSuccess = (id?: number) => {
    reset();

    setOnEdit(false);

    handleSuccess?.(id);
  };

  const { addBeneficiary, isPending } = useBeneficiaryMutation({
    beneficiaryId: id,

    successCallback: (id) => onSuccess(id),
  });

  const onSubmit = async (values: IBeneficiariesFieldValues) => {
    await addBeneficiary(values);
  };

  const { setShowPrompt } = useConfirmPrompt();

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
              <Input {...field} readOnly={!onEdit} placeholder="First name" />
            )}
          />

          <Controller
            label="Last name"
            required
            control={control}
            name="lastName"
            render={({ field }) => (
              <Input {...field} readOnly={!onEdit} placeholder="Last name" />
            )}
          />

          <Controller
            label="Email"
            required
            control={control}
            name="email"
            render={({ field }) => (
              <Input {...field} readOnly={!onEdit} placeholder="Email" />
            )}
          />

          <Controller
            label="Phone"
            control={control}
            name="phone"
            render={({ field }) => (
              <InputMobile {...field} readOnly={!onEdit} placeholder="Phone" />
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
                readOnly={!onEdit}
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
                readOnly={!onEdit}
                options={RISK_LEVEL}
                placeholder="Risk level"
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
                readOnly={!onEdit}
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

                  setValue(
                    "projectId",

                    contract?.projectId as number
                  );

                  setError("contractId", { message: "" });

                  setError("projectId", { message: "" });

                  setError("providerId", { message: "" });
                }}
                options={contracts}
                placeholder="Contract"
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
                  maxDate={new Date(watch("cohortEndDate") || "")}
                  readOnly={!onEdit}
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
                  readOnly={!onEdit}
                  minDate={new Date(watch("cohortStartDate") || "")}
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
            render={({ field }) => (
              <Input {...field} readOnly={!onEdit} placeholder="Program" />
            )}
          />
        </div>

        <div className="flex items-center gap-5">
          <p className="heading w-fit whitespace-nowrap">Social media</p>

          <hr className="w-full" />
        </div>

        <div className="space-y-4">
          <Controller
            label="Linkedin"
            control={control}
            name="linkedinUrl"
            render={({ field }) => (
              <Input
                {...field}
                readOnly={!onEdit}
                placeholder="Linkedin link"
              />
            )}
          />
          <Controller
            label="Github"
            control={control}
            name="githubUrl"
            render={({ field }) => (
              <Input {...field} readOnly={!onEdit} placeholder="Github link" />
            )}
          />
          <Controller
            label="Other"
            control={control}
            name="otherUrl"
            render={({ field }) => (
              <Input {...field} readOnly={!onEdit} placeholder="Other" />
            )}
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
                  readOnly={!onEdit}
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
                <Input {...field} readOnly={!onEdit} placeholder="Ethnicity" />
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
                  readOnly={!onEdit}
                  value={field.value}
                  handleSelect={(val) => field.onChange(val)}
                  options={GENDER}
                  placeholder="Gender"
                />
              )}
            />
            <Controller
              label="Disability status"
              control={control}
              name="disabilityStatus"
              render={({ field }) => (
                <Dropdown
                  readOnly={!onEdit}
                  value={field.value}
                  handleSelect={(val) => {
                    field.onChange(val);
                  }}
                  options={CONFIRM}
                  placeholder="Disability status"
                />
              )}
            />
          </div>
        </div>

        <Controller
          label="Address"
          control={control}
          name="address"
          render={({ field }) => (
            <Input {...field} readOnly={!onEdit} placeholder="Address" />
          )}
        />

        <Controller
          label="Socio-economic status"
          control={control}
          name="socioeconomicStatus"
          render={({ field }) => (
            <Input
              {...field}
              readOnly={!onEdit}
              placeholder="Socio-economic status"
            />
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
              readOnly={!onEdit}
              options={HIGHEST_EDUCATION_LEVEL}
              placeholder="Highest education level"
            />
          )}
        />

        <Controller
          label="Language(s) spoken"
          control={control}
          name="languages"
          render={({ field }) => (
            <Dropdown
              readOnly={!onEdit}
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
              placeholder="Select"
            />
          )}
        />
      </div>

      {IsAuthorized([Beneficiaries.UPDATE]) && (
        <div className="flex justify-end gap-4 pt-6">
          {onEdit ? (
            <>
              <Button
                buttonType="secondary"
                onClick={() => {
                  if (beneficiaryData) {
                    setOnEdit(false);
                    reset(
                      beneficiaries.defaultValues({
                        beneficiary: beneficiaryData,
                      })
                    );

                    return;
                  }
                  if (isDirty) {
                    setShowPrompt(true);
                    return;
                  }
                  if (handleClose) handleClose();
                }}
              >
                Cancel
              </Button>

              <Button type="submit" loading={isPending} disabled={!isDirty}>
                Save
              </Button>
            </>
          ) : (
            <Button onClick={() => setOnEdit(true)}>Edit details</Button>
          )}
        </div>
      )}
    </Form>
  );
};

export default BeneficiariesForm;
