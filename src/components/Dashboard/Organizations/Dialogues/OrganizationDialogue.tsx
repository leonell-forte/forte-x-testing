import Input from "../../../../components/ui/input";
import Dialogue, {
  IDialogueProps,
} from "../../../../components/ui/dialogue/dialogue";
import Dropdown from "../../../../components/ui/dropdown";
import Button from "../../../../components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { organizations } from "../../../../lib/validators/organizations";
import { zodResolver } from "@hookform/resolvers/zod";
import { REGIONS, STATUS, TYPES } from "../../../../lib/constants";
import { useQuery } from "@tanstack/react-query";
import organizationService from "../../../../api/organization";
import { useEffect } from "react";
import Spinner from "../../../../components/ui/spinner/spinner";
import useOrganizationMutation from "../../../../lib/mutations/organizations";
import {
  OrganizationFieldTypes,
  OrgTypes,
} from "../../../../lib/types/organizations";

interface IOrganizationDialogueProps extends IDialogueProps {
  orgId?: string;
}

const OrganizationDialogue = ({
  handleClose,

  isVisible,

  orgId,
}: IOrganizationDialogueProps) => {
  const { data: orgData, isLoading } = useQuery({
    queryKey: ["specific org", orgId],

    queryFn: () => organizationService.getOne(orgId!),

    enabled: !!orgId,
  });

  const {
    handleSubmit,

    watch,

    setValue,

    setError,

    reset,

    control,

    formState: { errors },
  } = useForm<OrganizationFieldTypes>({
    resolver: zodResolver(organizations.schema),

    defaultValues: organizations.defaultValues(),
  });

  // prefill initial value from selected org

  useEffect(() => {
    if (orgData) {
      reset(organizations.defaultValues(orgData));
    }
  }, [orgData, reset]);

  const onClose = () => {
    reset();

    handleClose!();
  };

  // implements optimistic update after adding or updating organization

  const { addOrganization, isPending } = useOrganizationMutation({
    orgId,
    successCallback: onClose,
  });

  const onSubmit = async (values: OrganizationFieldTypes) => {
    await addOrganization(values);
  };

  return (
    <Dialogue
      isVisible={isVisible}
      handleClose={onClose}
      title={orgId ? "Edit organization" : "Add organization"}
    >
      {isLoading ? (
        <div className="w-full h-[470px] flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-1"
        >
          <div className="flex items-start gap-4">
            <label
              htmlFor=""
              className="pt-3 w-[200px]"
            >
              Organization
            </label>

            <Controller
              name="name"
              control={control}
              render={({ field }) => {
                return (
                  <Input
                    {...field}
                    error={!!errors.name?.message}
                    helperText={errors.name?.message}
                    placeholder="Organization name"
                  />
                );
              }}
            />
          </div>

          <div className="flex items-start gap-4">
            <label
              htmlFor=""
              className="pt-3 w-[200px]"
            >
              Registered name
            </label>

            <Controller
              name="registeredName"
              control={control}
              render={({ field }) => {
                return (
                  <Input
                    {...field}
                    error={!!errors.registeredName?.message}
                    helperText={errors.registeredName?.message}
                    placeholder="Registered name"
                  />
                );
              }}
            />
          </div>

          <div className="flex items-start gap-4">
            <label
              htmlFor=""
              className="pt-3 w-[200px]"
            >
              Registration #
            </label>

            <Controller
              name="registrationNumber"
              control={control}
              render={({ field }) => {
                return (
                  <Input
                    {...field}
                    error={!!errors.registrationNumber?.message}
                    helperText={errors.registrationNumber?.message}
                    placeholder="Registration number"
                  />
                );
              }}
            />
          </div>

          <div className="flex items-start gap-4">
            <label
              htmlFor=""
              className="w-[200px] pt-3.5"
            >
              Registered address
            </label>

            <div className="w-full space-y-1">
              <Controller
                name="registeredAddress"
                control={control}
                render={({ field }) => {
                  return (
                    <Input
                      {...field}
                      error={!!errors.registeredAddress?.message}
                      helperText={errors.registeredAddress?.message}
                      placeholder="Registered address"
                    />
                  );
                }}
              />

              <div className="flex flex-col md:flex-row w-full gap-[22px] md:gap-2">
                <Controller
                  name="state"
                  control={control}
                  render={({ field }) => {
                    return (
                      <Input
                        {...field}
                        error={!!errors.state?.message}
                        helperText={errors.state?.message}
                        placeholder="State"
                      />
                    );
                  }}
                />

                <Controller
                  name="postalCode"
                  control={control}
                  render={({ field }) => {
                    return (
                      <Input
                        {...field}
                        error={!!errors.postalCode?.message}
                        helperText={errors.postalCode?.message}
                        placeholder="Postal code"
                      />
                    );
                  }}
                />

                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => {
                    return (
                      <Input
                        {...field}
                        error={!!errors.country?.message}
                        helperText={errors.country?.message}
                        placeholder="Country"
                      />
                    );
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <label
              htmlFor=""
              className="pt-3 w-[200px]"
            >
              Region
            </label>

            <Controller
              name="regions"
              control={control}
              render={({ field }) => {
                return (
                  <Dropdown
                    enableSearch
                    isMultiSelect
                    value={field.value}
                    handleSelect={(val) => {
                      setValue("regions", val as string[]);

                      setError("regions", { message: "" });
                    }}
                    options={REGIONS}
                    placeholder="Select region"
                    error={!!errors.regions?.message}
                    helperText={errors.regions?.message}
                  />
                );
              }}
            />
          </div>

          <div className="flex items-start gap-4">
            <label
              htmlFor=""
              className="pt-3 w-[200px]"
            >
              Type
            </label>

            <Dropdown
              value={TYPES.find((item) => item.value === watch("type"))?.label}
              handleSelect={(val) => {
                setError("type", { message: "" });
                setValue("type", val as OrgTypes);
              }}
              options={TYPES}
              placeholder="Select type"
              error={!!errors.type?.message}
              helperText={errors.type?.message}
            />
          </div>

          <div className="flex items-start gap-4">
            <label
              htmlFor=""
              className="pt-3 w-[200px]"
            >
              Status
            </label>

            <Dropdown
              value={
                STATUS.find((item) => item.value === watch("status"))?.label
              }
              handleSelect={(val) => {
                setError("status", { message: "" });
                setValue("status", val as string);
              }}
              options={STATUS}
              placeholder="Select status"
              error={!!errors.status?.message}
              helperText={errors.status?.message}
            />
          </div>

          <div className="flex justify-end gap-4 !mt-10">
            <Button
              onClick={onClose}
              buttonType="secondary"
            >
              Cancel
            </Button>

            <Button
              loading={isPending}
              type="submit"
            >
              Save
            </Button>
          </div>
        </form>
      )}
    </Dialogue>
  );
};

export default OrganizationDialogue;
