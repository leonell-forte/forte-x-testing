import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import organizationService from "api/organization";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { REGIONS, STATUS, TYPES } from "lib/constants";
import useOrganizationMutation from "lib/mutations/organizations";
import { OrgTypes, OrganizationFieldTypes } from "lib/types/organizations";
import { organizations } from "lib/validators/organizations";

import Button from "components/ui/button";
import Controller from "components/ui/custom-controller/CustomController";
import Dialogue, { IDialogueProps } from "components/ui/dialogue/dialogue";
import Dropdown from "components/ui/dropdown";
import { Form } from "components/ui/form/Form";
import Input from "components/ui/input";
import Spinner from "components/ui/spinner/spinner";

interface IOrganizationDialogueProps extends IDialogueProps {
  orgId?: string;

  addSuccessCallback?: (id: number) => void;
}

const OrganizationDialogue = ({
  handleClose,

  addSuccessCallback,

  isVisible,

  orgId,
}: IOrganizationDialogueProps) => {
  const { data: orgData, isLoading } = useQuery({
    queryKey: ["specific org", orgId],

    queryFn: () => organizationService.getOne(orgId!),

    enabled: !!orgId,
  });

  const form = useForm<OrganizationFieldTypes>({
    resolver: zodResolver(organizations.schema),

    defaultValues: organizations.defaultValues(),
  });

  const {
    watch,

    setValue,

    setError,

    reset,

    control,
  } = form;

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
    successCallback: (id) => {
      onClose();

      addSuccessCallback?.(id);
    },
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
        <div className="flex h-[470px] w-full items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <Form form={form} onSubmit={onSubmit} className="space-y-4">
          <Controller
            required
            label="Organization"
            name="name"
            control={control}
            render={({ field }) => {
              return <Input {...field} placeholder="Organization name" />;
            }}
          />

          <Controller
            label="Registered name"
            required
            name="registeredName"
            control={control}
            render={({ field }) => {
              return <Input {...field} placeholder="Registered name" />;
            }}
          />

          <Controller
            label="Registration #"
            required
            name="registrationNumber"
            control={control}
            render={({ field }) => {
              return <Input {...field} placeholder="Registration number" />;
            }}
          />

          <div className="flex items-start gap-4">
            <label htmlFor="" className="w-[150px] pt-3.5">
              Registered address*
            </label>

            <div className="w-full space-y-4">
              <Controller
                name="registeredAddress"
                control={control}
                render={({ field }) => {
                  return <Input {...field} placeholder="Registered address" />;
                }}
              />

              <div className="flex w-full flex-col gap-1 md:flex-row md:gap-2">
                <Controller
                  name="state"
                  control={control}
                  render={({ field }) => {
                    return <Input {...field} placeholder="State" />;
                  }}
                />

                <Controller
                  name="postalCode"
                  control={control}
                  render={({ field }) => {
                    return <Input {...field} placeholder="Postal code" />;
                  }}
                />

                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => {
                    return <Input {...field} placeholder="Country" />;
                  }}
                />
              </div>
            </div>
          </div>

          <Controller
            label="Region"
            required
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
                />
              );
            }}
          />

          <Controller
            label="Type"
            required
            name="type"
            control={control}
            render={() => {
              return (
                <Dropdown
                  value={
                    TYPES.find((item) => item.value === watch("type"))?.label
                  }
                  handleSelect={(val) => {
                    setError("type", { message: "" });

                    setValue("type", val as OrgTypes);
                  }}
                  options={TYPES}
                  placeholder="Select type"
                />
              );
            }}
          />

          <Controller
            label="Status"
            required
            name="status"
            control={control}
            render={() => {
              return (
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
                />
              );
            }}
          />

          <div className="!mt-10 flex justify-end gap-4">
            <Button onClick={onClose} buttonType="secondary">
              Cancel
            </Button>

            <Button loading={isPending} type="submit">
              Save
            </Button>
          </div>
        </Form>
      )}
    </Dialogue>
  );
};

export default OrganizationDialogue;
