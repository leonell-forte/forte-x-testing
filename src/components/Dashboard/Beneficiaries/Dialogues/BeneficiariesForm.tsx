import beneficiariesServce from "../../../../api/beneficiaries";
import contractService from "../../../../api/contract";
import organizationService from "../../../../api/organization";
import projectService from "../../../../api/projects";
import Button from "../../../../components/ui/button";
import DatePicker from "../../../../components/ui/date-picker";
import Dropdown, { IOption } from "../../../../components/ui/dropdown";
import Input from "../../../../components/ui/input";
import {
  BENEFICIARY_STATUS,
  CONFIRM,
  GENDER,
  HIGHEST_EDUCATION_LEVEL,
  LANGUAGES,
  RISK_LEVEL,
} from "../../../../lib/constants";
import useBeneficiaryMutation from "../../../../lib/mutations/beneficiaries";
import {
  DisabilityStatusEnum,
  IBeneficiariesFieldValues,
  RiskLevelEnum,
} from "../../../../lib/types/beneficiaries";
import { findLabelFromOptions } from "../../../../lib/utils";
import { beneficiaries } from "../../../../lib/validators/beneficiaries";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";

interface IProps {
  id?: number;

  projectId?: number;

  handleClose?: () => void;
}

const BeneficiariesForm = ({ id, projectId, handleClose }: IProps) => {
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

    queryFn: () => beneficiariesServce.getOne(id),

    enabled: !!id,
  });

  useEffect(() => {
    if (beneficiaryData) {
      reset(beneficiaries.defaultValues({ beneficiary: beneficiaryData }));
    }
  }, [beneficiaryData, reset]);

  const { data: organizationList, isLoading: orgLoading } = useQuery({
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

  const { data: projectsList, isLoading: projectLoading } = useQuery({
    queryKey: ["projects"],

    queryFn: () => projectService.list({ listAll: true }),
  });

  const contracts: IOption[] = useMemo(
    () =>
      contractList?.items.map((item) => ({
        label: `Contract ${item.id}`,

        value: item.id!.toString(),
      })) || [],

    [contractList],
  );

  const selectedContract = watch("contractId");
  const organizations: IOption[] = useMemo(
    () =>
      organizationList?.items
        .filter((org) => {
          // filter the organizations based on selected contract
          // provider dropdown should be disabled if no contract is selected

          const contract = contractList?.items.find(
            (contract) => contract.id === selectedContract,
          );

          return contract?.contractParties.some(
            (item) => item.organizationId === Number(org.id),
          );
        })
        .map((item) => ({
          label: item.name,

          value: item.id!.toString(),
        })) || [],

    [organizationList, contractList, selectedContract],
  );

  const projects: IOption[] = useMemo(
    () =>
      projectsList?.items.map((item) => ({
        label: item.name,

        value: item.id.toString(),
      })) || [],
    [projectsList],
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
        <div className="flex items-start">
          <label
            htmlFor=""
            className="min-w-[140px] pt-3"
          >
            First name
          </label>

          <Controller
            control={control}
            name="firstName"
            render={({ field }) => (
              <Input
                {...field}
                placeholder="First name"
                error={!!errors.firstName?.message}
                helperText={errors.firstName?.message}
              />
            )}
          />
        </div>

        <div className="flex items-start">
          <label
            htmlFor=""
            className="min-w-[140px] pt-3"
          >
            Last name
          </label>

          <Controller
            control={control}
            name="lastName"
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Last name"
                error={!!errors.lastName?.message}
                helperText={errors.lastName?.message}
              />
            )}
          />
        </div>

        <div className="flex items-start">
          <label
            htmlFor=""
            className="min-w-[140px] pt-3"
          >
            Email
          </label>

          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Email"
                error={!!errors.email?.message}
                helperText={errors.email?.message}
              />
            )}
          />
        </div>

        <div className="flex items-start">
          <label
            htmlFor=""
            className="min-w-[140px] pt-3"
          >
            Phone
          </label>

          <Controller
            control={control}
            name="phone"
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Phone"
                error={!!errors.phone?.message}
                helperText={errors.phone?.message}
              />
            )}
          />
        </div>

        <div className="flex items-start">
          <label
            htmlFor=""
            className="min-w-[140px] pt-3"
          >
            Status
          </label>

          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Dropdown
                value={field.value}
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
          <label
            htmlFor=""
            className="min-w-[140px] pt-3"
          >
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
                options={RISK_LEVEL}
                placeholder="Risk level"
                error={!!errors.riskLevel?.message}
                helperText={errors.riskLevel?.message}
              />
            )}
          />
        </div>

        <div className="flex items-start">
          <label
            htmlFor=""
            className="min-w-[140px] pt-3"
          >
            Contract
          </label>

          <Controller
            control={control}
            name="contractId"
            render={({ field }) => (
              <Dropdown
                enableSearch
                loading={contractsLoading}
                value={findLabelFromOptions(
                  contracts,

                  field.value.toString(),
                )}
                handleSelect={(val) => {
                  setValue("contractId", Number(val));

                  setValue("providerId", 0);

                  setError("contractId", { message: "" });
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
          <label
            htmlFor=""
            className="min-w-[140px] pt-3"
          >
            Provider
          </label>

          <Controller
            control={control}
            name="providerId"
            render={({ field }) => (
              <Dropdown
                enableSearch
                disabled={!watch("contractId")}
                value={findLabelFromOptions(
                  organizations,

                  field.value.toString(),
                )}
                handleSelect={(val) => {
                  setValue("providerId", Number(val));

                  setError("providerId", { message: "" });
                }}
                loading={orgLoading}
                options={organizations}
                placeholder="Provider"
                error={!!errors.providerId?.message}
                helperText={errors.providerId?.message}
              />
            )}
          />
        </div>

        <div className="flex items-start">
          <label
            htmlFor=""
            className="min-w-[140px] pt-3"
          >
            Project
          </label>

          <Controller
            control={control}
            name="projectId"
            render={({ field }) => (
              <Dropdown
                enableSearch
                disabled={!!projectId}
                loading={projectLoading}
                value={findLabelFromOptions(projects, field.value.toString())}
                handleSelect={(val) => {
                  setValue("projectId", Number(val));

                  setError("projectId", { message: "" });
                }}
                options={projects}
                placeholder="Project"
                error={!!errors.projectId?.message}
                helperText={errors.projectId?.message}
              />
            )}
          />
        </div>
      </div>

      <div className="flex items-center !mt-0">
        <p className="text-[20px] font-semibold w-[190px]">Cohort</p>

        <hr className="w-full" />
      </div>

      <div className="space-y-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
          <div className="flex items-start">
            <label
              htmlFor=""
              className="min-w-[140px] pt-3"
            >
              Start date
            </label>

            <Controller
              control={control}
              name="cohortStartDate"
              render={({ field }) => (
                <DatePicker
                  value={new Date(field.value)}
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
            <label
              htmlFor=""
              className="min-w-[140px] pt-3"
            >
              End date
            </label>

            <Controller
              control={control}
              name="cohortEndDate"
              render={({ field }) => (
                <DatePicker
                  value={new Date(field.value)}
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
          <label
            htmlFor=""
            className="min-w-[140px] pt-3"
          >
            Program
          </label>

          <Controller
            control={control}
            name="cohortName"
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Program"
                error={!!errors.cohortName?.message}
                helperText={errors.cohortName?.message}
              />
            )}
          />
        </div>
      </div>

      <div className="flex items-center !mt-0">
        <p className="text-[20px] font-semibold w-[190px]">Social media</p>

        <hr className="w-full" />
      </div>

      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <div className="flex items-start">
            <label
              htmlFor=""
              className="min-w-[140px] pt-3"
            >
              Linkedin
            </label>

            <Controller
              control={control}
              name="linkedinUrl"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Linkedin link"
                  error={!!errors.linkedinUrl?.message}
                  helperText={errors.linkedinUrl?.message}
                />
              )}
            />
          </div>

          <div className="flex items-start">
            <label
              htmlFor=""
              className="min-w-[140px] pt-3"
            >
              Github
            </label>

            <Controller
              control={control}
              name="githubUrl"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Github link"
                  error={!!errors.githubUrl?.message}
                  helperText={errors.githubUrl?.message}
                />
              )}
            />
          </div>
        </div>

        <div className="flex items-start">
          <label
            htmlFor=""
            className="min-w-[140px] pt-3"
          >
            Other
          </label>

          <Controller
            control={control}
            name="otherUrl"
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Other"
                error={!!errors.otherUrl?.message}
                helperText={errors.otherUrl?.message}
              />
            )}
          />
        </div>
      </div>

      <div className="flex items-center !mt-0">
        <p className="text-[20px] font-semibold w-[190px]">Demographics</p>

        <hr className="w-full" />
      </div>

      <div className="space-y-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
          <div className="flex items-start">
            <label
              htmlFor=""
              className="min-w-[140px] pt-3"
            >
              Date of birth
            </label>

            <Controller
              control={control}
              name="birthdate"
              render={({ field }) => (
                <DatePicker
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
            <label
              htmlFor=""
              className="min-w-[140px] pt-3"
            >
              Ethnicity
            </label>

            <Controller
              control={control}
              name="ethnicity"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Ethnicity"
                  error={!!errors.ethnicity?.message}
                  helperText={errors.ethnicity?.message}
                />
              )}
            />
          </div>

          <div className="flex items-start">
            <label
              htmlFor=""
              className="min-w-[140px] pt-3"
            >
              Gender
            </label>

            <Controller
              control={control}
              name="gender"
              render={({ field }) => (
                <Dropdown
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
            <label
              htmlFor=""
              className="min-w-[140px] pt-3"
            >
              Disability status
            </label>

            <Controller
              control={control}
              name="disabilityStatus"
              render={({ field }) => (
                <Dropdown
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
          <label
            htmlFor=""
            className="min-w-[140px] pt-3"
          >
            Address
          </label>

          <Controller
            control={control}
            name="address"
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Address"
                error={!!errors.address?.message}
                helperText={errors.address?.message}
              />
            )}
          />
        </div>

        <div className="flex items-start">
          <label
            htmlFor=""
            className="min-w-[140px] pt-3"
          >
            Socio-economic status
          </label>

          <Controller
            control={control}
            name="socioeconomicStatus"
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Socio-economic status"
                error={!!errors.socioeconomicStatus?.message}
                helperText={errors.socioeconomicStatus?.message}
              />
            )}
          />
        </div>

        <div className="flex items-start">
          <label
            htmlFor=""
            className="min-w-[140px] pt-3"
          >
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
                options={HIGHEST_EDUCATION_LEVEL}
                placeholder="Highest education level"
                error={!!errors.educationLevel?.message}
                helperText={errors.educationLevel?.message}
              />
            )}
          />
        </div>

        <div className="flex items-start">
          <label
            htmlFor=""
            className="min-w-[140px] pt-3"
          >
            Language(s) spoken
          </label>

          <Controller
            control={control}
            name="languages"
            render={({ field }) => (
              <Dropdown
                enableSearch
                isMultiSelect
                showAsTags
                value={field.value}
                handleSelect={(val) => {
                  setValue("languages", val as string[]);

                  setError("languages", { message: "" });
                }}
                options={LANGUAGES}
                placeholder="Select"
                error={!!errors.languages?.message}
                helperText={errors.languages?.message}
              />
            )}
          />
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-6">
        <Button
          buttonType="secondary"
          onClick={close}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          loading={isPending}
        >
          Save
        </Button>
      </div>
    </form>
  );
};

export default BeneficiariesForm;
