import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import beneficiariesService from "api/beneficiaries";
import contractService from "api/contract";
import organizationService from "api/organization";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";

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
import { setSelectedData } from "lib/slice/evidence";
import {
  DisabilityStatusEnum,
  IBeneficiariesFieldValues,
  RiskLevelEnum,
} from "lib/types/beneficiaries";
import { findLabelFromOptions } from "lib/utils";
import { beneficiaries } from "lib/validators/beneficiaries";

import Button from "components/ui/button";
import DatePicker from "components/ui/date-picker";
import Dropdown, { IOption } from "components/ui/dropdown";
import Input from "components/ui/input";

interface IProps {
  id?: number;

  projectId?: number;

  editMode?: boolean;

  handleClose?: () => void;
}

const BeneficiariesForm = ({
  id,

  projectId,

  handleClose,

  editMode,
}: IProps) => {
  const dispatch = useAppDispatch();

  const [onEdit, setOnEdit] = useState(editMode);

  const {
    control,

    handleSubmit,

    formState: { errors },

    setValue,

    setError,

    watch,

    reset,
  } = useForm<IBeneficiariesFieldValues>({
    resolver: zodResolver(beneficiaries.schema),

    defaultValues: beneficiaries.defaultValues({ projectId }),
  });

  const { data: beneficiaryData } = useQuery({
    queryKey: ["specific-beneficiary", id],

    queryFn: () => beneficiariesService.getOne(id),

    enabled: !!id,
  });

  useEffect(() => {
    if (beneficiaryData) {
      reset(beneficiaries.defaultValues({ beneficiary: beneficiaryData }));
    }
  }, [beneficiaryData, reset]);

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
            String(y.partyIds).includes(String(z.id))
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

          return contract?.partyIds.some(
            (item) => Number(item) === Number(org.id)
          );
        })
        .map((item) => ({
          label: item.name,

          value: item.id!.toString(),
        })) || [],

    [organizationList, contractList, selectedContract]
  );

  const close = () => {
    reset();

    handleClose?.();
  };

  const { addBeneficiary, isPending } = useBeneficiaryMutation({
    beneficiaryId: id,

    successCallback: close,
  });

  const onSubmit = async (values: IBeneficiariesFieldValues) => {
    await addBeneficiary(values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="">
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-x-6 gap-y-1 md:grid-cols-2">
          <div className="flex items-start">
            <label htmlFor="" className="min-w-[140px] pt-3">
              First name
            </label>

            <Controller
              control={control}
              name="firstName"
              render={({ field }) => (
                <Input
                  {...field}
                  disabled={!onEdit}
                  placeholder="First name"
                  error={!!errors.firstName?.message}
                  helperText={errors.firstName?.message}
                />
              )}
            />
          </div>

          <div className="flex items-start">
            <label htmlFor="" className="min-w-[140px] pt-3">
              Last name
            </label>

            <Controller
              control={control}
              name="lastName"
              render={({ field }) => (
                <Input
                  {...field}
                  disabled={!onEdit}
                  placeholder="Last name"
                  error={!!errors.lastName?.message}
                  helperText={errors.lastName?.message}
                />
              )}
            />
          </div>

          <div className="flex items-start">
            <label htmlFor="" className="min-w-[140px] pt-3">
              Email
            </label>

            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <Input
                  {...field}
                  disabled={!onEdit}
                  placeholder="Email"
                  error={!!errors.email?.message}
                  helperText={errors.email?.message}
                />
              )}
            />
          </div>

          <div className="flex items-start">
            <label htmlFor="" className="min-w-[140px] pt-3">
              Phone
            </label>

            <Controller
              control={control}
              name="phone"
              render={({ field }) => (
                <Input
                  {...field}
                  phoneNUmber
                  disabled={!onEdit}
                  placeholder="Phone"
                  error={!!errors.phone?.message}
                  helperText={errors.phone?.message}
                />
              )}
            />
          </div>

          <div className="flex items-start">
            <label htmlFor="" className="min-w-[140px] pt-3">
              Status
            </label>

            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Dropdown
                  value={field.value}
                  disabled={!onEdit}
                  handleSelect={(val) => {
                    setValue("status", val as string);

                    setError("status", { message: "" });
                  }}
                  options={BENEFICIARY_STATUS}
                  placeholder="Status"
                  error={!!errors.status?.message}
                  helperText={errors.status?.message}
                />
              )}
            />
          </div>

          <div className="flex items-start">
            <label htmlFor="" className="min-w-[140px] pt-3">
              Risk level
            </label>

            <Controller
              control={control}
              name="riskLevel"
              render={({ field }) => (
                <Dropdown
                  value={field.value as string}
                  handleSelect={(val) => {
                    setValue("riskLevel", val as RiskLevelEnum);

                    setError("riskLevel", { message: "" });
                  }}
                  disabled={!onEdit}
                  options={RISK_LEVEL}
                  placeholder="Risk level"
                  error={!!errors.riskLevel?.message}
                  helperText={errors.riskLevel?.message}
                />
              )}
            />
          </div>

          <div className="flex items-start">
            <label htmlFor="" className="min-w-[140px] pt-3">
              Contract
            </label>

            <Controller
              control={control}
              name="contractId"
              render={({ field }) => (
                <Dropdown
                  enableSearch
                  disabled={!onEdit}
                  loading={contractsLoading}
                  value={findLabelFromOptions(
                    contracts,

                    field.value.toString()
                  )}
                  handleSelect={(val) => {
                    setValue("contractId", Number(val));
                    setValue(
                      "providerId",
                      Number(
                        organizationList?.items.filter((org) => {
                          const contract = contractList?.items.find(
                            (contract) => contract.id === Number(val)
                          );

                          return contract?.partyIds.some(
                            (item) => Number(item) === Number(org.id)
                          );
                        })[0].id
                      )
                    );

                    setValue(
                      "projectId",

                      contractList?.items.find(
                        (item) => item.id === Number(val)
                      )?.projectId as number
                    );

                    setError("contractId", { message: "" });

                    setError("projectId", { message: "" });

                    setError("providerId", { message: "" });
                  }}
                  options={contracts}
                  placeholder="Contract"
                  error={!!errors.contractId?.message}
                  helperText={errors.contractId?.message}
                />
              )}
            />
          </div>

          <div className="flex items-start">
            <label htmlFor="" className="min-w-[140px] pt-3">
              Provider
            </label>

            <Controller
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
                  error={!!errors.providerId?.message}
                  helperText={errors.providerId?.message}
                />
              )}
            />
          </div>

          <div className="flex items-start">
            <label htmlFor="" className="min-w-[140px] pt-3">
              Project
            </label>

            <Input
              disabled
              placeholder="Project"
              value={
                contractList?.items.find(
                  (item) => item.id === watch("contractId")
                )?.project
              }
              error={!!errors.projectId?.message}
              helperText={errors.projectId?.message}
            />
          </div>
        </div>

        <div className="!mt-0 flex items-center">
          <p className="w-[190px] text-[20px] font-semibold">Cohort</p>

          <hr className="w-full" />
        </div>

        <div className="space-y-1">
          <div className="grid grid-cols-1 gap-x-6 gap-y-1 md:grid-cols-2">
            <div className="flex items-start">
              <label htmlFor="" className="min-w-[140px] pt-3">
                Start date
              </label>

              <Controller
                control={control}
                name="cohortStartDate"
                render={({ field }) => (
                  <DatePicker
                    maxDate={new Date(watch("cohortEndDate") || "")}
                    disabled={!onEdit}
                    value={new Date(field.value || "")}
                    onChange={(date) => {
                      setValue("cohortStartDate", date!.toISOString());

                      setError("cohortStartDate", { message: "" });
                    }}
                    error={!!errors?.cohortStartDate?.message}
                    helperText={errors?.cohortStartDate?.message}
                  />
                )}
              />
            </div>

            <div className="flex items-start">
              <label htmlFor="" className="min-w-[140px] pt-3">
                End date
              </label>

              <Controller
                control={control}
                name="cohortEndDate"
                render={({ field }) => (
                  <DatePicker
                    disabled={!onEdit}
                    minDate={new Date(watch("cohortStartDate") || "")}
                    value={new Date(field.value || "")}
                    onChange={(date) => {
                      setValue("cohortEndDate", date!.toISOString());

                      setError("cohortEndDate", { message: "" });
                    }}
                    error={!!errors?.cohortEndDate?.message}
                    helperText={errors?.cohortEndDate?.message}
                  />
                )}
              />
            </div>
          </div>

          <div className="flex items-start">
            <label htmlFor="" className="min-w-[140px] pt-3">
              Program
            </label>

            <Controller
              control={control}
              name="cohortName"
              render={({ field }) => (
                <Input
                  {...field}
                  disabled={!onEdit}
                  placeholder="Program"
                  error={!!errors.cohortName?.message}
                  helperText={errors.cohortName?.message}
                />
              )}
            />
          </div>
        </div>

        <div className="!mt-0 flex items-center">
          <p className="w-[190px] text-[20px] font-semibold">Social media</p>

          <hr className="w-full" />
        </div>

        <div>
          <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2">
            <div className="flex items-start">
              <label htmlFor="" className="min-w-[140px] pt-3">
                Linkedin
              </label>

              <Controller
                control={control}
                name="linkedinUrl"
                render={({ field }) => (
                  <Input
                    {...field}
                    disabled={!onEdit}
                    placeholder="Linkedin link"
                    error={!!errors.linkedinUrl?.message}
                    helperText={errors.linkedinUrl?.message}
                  />
                )}
              />
            </div>

            <div className="flex items-start">
              <label htmlFor="" className="min-w-[140px] pt-3">
                Github
              </label>

              <Controller
                control={control}
                name="githubUrl"
                render={({ field }) => (
                  <Input
                    {...field}
                    disabled={!onEdit}
                    placeholder="Github link"
                    error={!!errors.githubUrl?.message}
                    helperText={errors.githubUrl?.message}
                  />
                )}
              />
            </div>
          </div>

          <div className="flex items-start">
            <label htmlFor="" className="min-w-[140px] pt-3">
              Other
            </label>

            <Controller
              control={control}
              name="otherUrl"
              render={({ field }) => (
                <Input
                  {...field}
                  disabled={!onEdit}
                  placeholder="Other"
                  error={!!errors.otherUrl?.message}
                  helperText={errors.otherUrl?.message}
                />
              )}
            />
          </div>
        </div>

        <div className="!mt-0 flex items-center">
          <p className="w-[190px] text-[20px] font-semibold">Demographics</p>

          <hr className="w-full" />
        </div>

        <div className="space-y-1">
          <div className="grid grid-cols-1 gap-x-6 gap-y-1 md:grid-cols-2">
            <div className="flex items-start">
              <label htmlFor="" className="min-w-[140px] pt-3">
                Date of birth
              </label>

              <Controller
                control={control}
                name="birthdate"
                render={({ field }) => (
                  <DatePicker
                    disabled={!onEdit}
                    value={new Date(field.value)}
                    onChange={(date) => {
                      setValue("birthdate", date!.toISOString());

                      setError("birthdate", { message: "" });
                    }}
                    error={!!errors?.birthdate?.message}
                    helperText={errors?.birthdate?.message}
                  />
                )}
              />
            </div>

            <div className="flex items-start">
              <label htmlFor="" className="min-w-[140px] pt-3">
                Ethnicity
              </label>

              <Controller
                control={control}
                name="ethnicity"
                render={({ field }) => (
                  <Input
                    {...field}
                    disabled={!onEdit}
                    placeholder="Ethnicity"
                    error={!!errors.ethnicity?.message}
                    helperText={errors.ethnicity?.message}
                  />
                )}
              />
            </div>

            <div className="flex items-start">
              <label htmlFor="" className="min-w-[140px] pt-3">
                Gender
              </label>

              <Controller
                control={control}
                name="gender"
                render={({ field }) => (
                  <Dropdown
                    disabled={!onEdit}
                    value={field.value}
                    handleSelect={(val) => {
                      setValue("gender", val as string);

                      setError("gender", { message: "" });
                    }}
                    options={GENDER}
                    placeholder="Gender"
                    error={!!errors.gender?.message}
                    helperText={errors.gender?.message}
                  />
                )}
              />
            </div>

            <div className="flex items-start">
              <label htmlFor="" className="min-w-[140px] pt-3">
                Disability status
              </label>

              <Controller
                control={control}
                name="disabilityStatus"
                render={({ field }) => (
                  <Dropdown
                    disabled={!onEdit}
                    value={field.value}
                    handleSelect={(val) => {
                      setValue("disabilityStatus", val as DisabilityStatusEnum);

                      setError("disabilityStatus", { message: "" });
                    }}
                    options={CONFIRM}
                    placeholder="Disability status"
                    error={!!errors.disabilityStatus?.message}
                    helperText={errors.disabilityStatus?.message}
                  />
                )}
              />
            </div>
          </div>

          <div className="flex items-start">
            <label htmlFor="" className="min-w-[140px] pt-3">
              Address
            </label>

            <Controller
              control={control}
              name="address"
              render={({ field }) => (
                <Input
                  {...field}
                  disabled={!onEdit}
                  placeholder="Address"
                  error={!!errors.address?.message}
                  helperText={errors.address?.message}
                />
              )}
            />
          </div>

          <div className="flex items-start">
            <label htmlFor="" className="min-w-[140px] pt-3">
              Socio-economic status
            </label>

            <Controller
              control={control}
              name="socioeconomicStatus"
              render={({ field }) => (
                <Input
                  {...field}
                  disabled={!onEdit}
                  placeholder="Socio-economic status"
                  error={!!errors.socioeconomicStatus?.message}
                  helperText={errors.socioeconomicStatus?.message}
                />
              )}
            />
          </div>

          <div className="flex items-start">
            <label htmlFor="" className="min-w-[140px] pt-3">
              Highest education level
            </label>

            <Controller
              control={control}
              name="educationLevel"
              render={({ field }) => (
                <Dropdown
                  value={field.value}
                  handleSelect={(val) => {
                    setValue("educationLevel", val as string);

                    setError("educationLevel", { message: "" });
                  }}
                  disabled={!onEdit}
                  options={HIGHEST_EDUCATION_LEVEL}
                  placeholder="Highest education level"
                  error={!!errors.educationLevel?.message}
                  helperText={errors.educationLevel?.message}
                />
              )}
            />
          </div>

          <div className="flex items-start">
            <label htmlFor="" className="min-w-[140px] pt-3">
              Language(s) spoken
            </label>

            <Controller
              control={control}
              name="languages"
              render={({ field }) => (
                <Dropdown
                  disabled={!onEdit}
                  enableSearch
                  isMultiSelect
                  showAsTags
                  value={field.value}
                  handleSelect={(val) => {
                    setValue("languages", val as string[]);

                    setError("languages", { message: "" });
                  }}
                  options={LANGUAGES.map((item) => ({
                    label: item,

                    value: item,
                  }))}
                  placeholder="Select"
                  error={!!errors.languages?.message}
                  helperText={errors.languages?.message}
                />
              )}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-6">
        {onEdit ? (
          <>
            <Button buttonType="secondary" onClick={() => setOnEdit(false)}>
              Cancel
            </Button>

            <Button type="submit" loading={isPending}>
              Save
            </Button>
          </>
        ) : (
          <Button onClick={() => setOnEdit(true)}>Edit details</Button>
        )}
      </div>
    </form>
  );
};

export default BeneficiariesForm;
