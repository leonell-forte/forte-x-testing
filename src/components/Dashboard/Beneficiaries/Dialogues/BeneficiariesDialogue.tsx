import Input from "../../../../components/ui/input";
import Dialogue, {
  IDialogueProps,
} from "../../../../components/ui/dialogue/dialogue";
import Dropdown, { IOption } from "../../../../components/ui/dropdown";
import Button from "../../../../components/ui/button";
import DatePicker from "../../../../components/ui/date-picker";
import { Controller, useForm } from "react-hook-form";
import { IBeneficiariesFieldValues } from "../../../../lib/types/beneficiaries";
import { zodResolver } from "@hookform/resolvers/zod";
import { beneficiaries } from "../../../../lib/validators/beneficiaries";
import organizationService from "../../../../api/organization";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { reset } from "@amplitude/analytics-browser";
import { STATUS } from "../../../../lib/constants";
import contractService from "../../../../api/contract";

interface IBeneficiariesDialogueProps extends IDialogueProps {}

const BeneficiariesDialogue = ({ ...props }: IBeneficiariesDialogueProps) => {
  const {
    control,

    handleSubmit,

    formState: { errors },

    setValue,

    setError,
  } = useForm<IBeneficiariesFieldValues>({
    resolver: zodResolver(beneficiaries.schema),

    defaultValues: beneficiaries.defaultValues(),
  });

  const { data: organizationList, isLoading: orgLoading } = useQuery({
    queryKey: ["organizations"],

    queryFn: () =>
      organizationService.list({
        listAll: true,

        page: 1,

        filters: { type: "provider" },
      }),
  });

  const { data: contractList, isLoading } = useQuery({
    queryKey: ["contracts"],

    queryFn: () =>
      contractService.list({
        listAll: true,
      }),
  });

  const organizations: IOption[] = useMemo(
    () =>
      organizationList?.items.map((item) => ({
        label: item.name,

        value: item.id!.toString(),
      })) || [],

    [organizationList],
  );

  const contracts: IOption[] = useMemo(
    () =>
      contractList?.items.map((item) => ({
        label: `Contract ${item.id}`,

        value: item.id!.toString(),
      })) || [],

    [organizationList],
  );

  const onSubmit = (values: IBeneficiariesFieldValues) => {
    console.log(values);
  };

  const close = () => {
    reset();

    props.handleClose!();
  };

  return (
    <Dialogue
      {...props}
      handleClose={close}
      title="Add beneficiaries"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
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
              Provider
            </label>

            <Controller
              control={control}
              name="providerId"
              render={({ field }) => (
                <Dropdown
                  value={
                    organizations.find(
                      (item) => Number(item.value) === field.value,
                    )?.label
                  }
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
                  options={STATUS}
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
                <Input
                  {...field}
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
                  value={
                    contracts.find((item) => Number(item.value) === field.value)
                      ?.label
                  }
                  handleSelect={(val) => {
                    setValue("contractId", Number(val));

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
        </div>

        <div className="flex items-center !mt-0">
          <p className="text-[20px] font-semibold w-[190px]">Cohort</p>

          <hr className="w-full" />
        </div>

        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
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
                    }}
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

              <DatePicker />
            </div>
          </div>

          <div className="flex items-start">
            <label
              htmlFor=""
              className="min-w-[140px] pt-3"
            >
              Program
            </label>

            <Input placeholder="Program" />
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

              <Input placeholder="Linkdin link" />
            </div>

            <div className="flex items-start">
              <label
                htmlFor=""
                className="min-w-[140px] pt-3"
              >
                Github
              </label>

              <Input placeholder="Github link" />
            </div>
          </div>

          <div className="flex items-start">
            <label
              htmlFor=""
              className="min-w-[140px] pt-3"
            >
              Other
            </label>

            <Input placeholder="Other" />
          </div>
        </div>

        <div className="flex items-center !mt-0">
          <p className="text-[20px] font-semibold w-[190px]">Demographics</p>

          <hr className="w-full" />
        </div>

        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <div className="flex items-start">
              <label
                htmlFor=""
                className="min-w-[140px] pt-3"
              >
                Date of birth
              </label>

              <DatePicker />
            </div>

            <div className="flex items-start">
              <label
                htmlFor=""
                className="min-w-[140px] pt-3"
              >
                Etnicity
              </label>

              <Dropdown
                options={[]}
                placeholder="Select"
              />
            </div>

            <div className="flex items-start">
              <label
                htmlFor=""
                className="min-w-[140px] pt-3"
              >
                Gender
              </label>

              <Dropdown
                options={[]}
                placeholder="Select"
              />
            </div>

            <div className="flex items-start">
              <label
                htmlFor=""
                className="min-w-[140px] pt-3"
              >
                Disability status
              </label>

              <Dropdown
                options={[]}
                placeholder="Select"
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

            <Input placeholder="Address" />
          </div>

          <div className="flex items-start">
            <label
              htmlFor=""
              className="min-w-[140px] pt-3"
            >
              Socio-economic status
            </label>

            <Input placeholder="Socio-economic status" />
          </div>

          <div className="flex items-start">
            <label
              htmlFor=""
              className="min-w-[140px] pt-3"
            >
              Highest education level
            </label>

            <Input placeholder="Highest education level" />
          </div>

          <div className="flex items-start">
            <label
              htmlFor=""
              className="min-w-[140px] pt-3"
            >
              Language(s) spoken
            </label>

            <Dropdown
              options={[]}
              placeholder="Select"
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

          <Button type="submit">Save</Button>
        </div>
      </form>
    </Dialogue>
  );
};

export default BeneficiariesDialogue;
