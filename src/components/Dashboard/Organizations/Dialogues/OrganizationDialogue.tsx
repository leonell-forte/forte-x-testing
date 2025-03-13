import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import organizationService from "api/organization";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import useOrganizationList from "lib/common/lists/useOrganizationList";
import usePartnerList from "lib/common/lists/usePartnerList";
import { REGIONS, STATUS, TYPES } from "lib/constants";
import useOrganizationMutation from "lib/mutations/organizations";
import { usePartnerMutation } from "lib/mutations/partners";
import {
  OrgTypes,
  OrganizationFieldTypes,
  Partner,
  PartnerFieldTypes,
} from "lib/types/organizations";
import { findLabelFromOptions } from "lib/utils";
import { organizations, partner } from "lib/validators/organizations";

import { queryClient } from "components/QueryProvider";
import { useConfirmPrompt } from "components/ui/alert/confirm-prompt";
import Button from "components/ui/button";
import Controller from "components/ui/custom-controller/CustomController";
import Dialogue, { IDialogueProps } from "components/ui/dialogue/dialogue";
import Dropdown from "components/ui/dropdown";
import { Form } from "components/ui/form/Form";
import Input from "components/ui/input";
import Spinner from "components/ui/spinner/spinner";

import Partners from "../Partners";

interface IOrganizationDialogueProps extends IDialogueProps {
  orgId?: string;

  addSuccessCallback?: (id: number) => void;
}

type ModalType = "organization" | "partner";

const labelClass = "min-w-[160px]";

const OrganizationDialogue = ({
  handleClose,

  addSuccessCallback,

  isVisible,

  orgId,
}: IOrganizationDialogueProps) => {
  const [modal, setModal] = useState<ModalType>("organization");
  const renderModal = (modal: ModalType) => {
    switch (modal) {
      case "organization":
        return (
          <OrganizationForm
            handleClose={handleClose}
            orgId={orgId}
            addSuccessCallback={addSuccessCallback}
            isVisible={isVisible}
            handleAddPartner={() => setModal("partner")}
          />
        );

      case "partner":
        return (
          <AddPartnerForm
            handleClose={() => setModal("organization")}
            orgId={orgId}
          />
        );
    }
  };
  return renderModal(modal);
};

export default OrganizationDialogue;

type OrganizationFormProps = IOrganizationDialogueProps & {
  handleAddPartner: () => void;
};

const OrganizationForm = ({
  handleClose,
  orgId,
  addSuccessCallback,
  isVisible,
  handleAddPartner,
}: OrganizationFormProps) => {
  const [editMode, setEditMode] = useState(orgId ? false : true);

  const { data: orgData, isLoading } = useQuery({
    queryKey: ["specific org", orgId],

    queryFn: () => organizationService.getOne(orgId!),

    enabled: !!orgId,
  });

  const { partners, isLoading: partnersLoading } = usePartnerList(orgId);

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

    formState: { isDirty },
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

  const getTitle = () => {
    if (orgId) {
      return editMode ? "Edit organization" : "View organization";
    }
    return "Add organization";
  };

  const handleCancel = () => {
    if (!orgId && isDirty) {
      setShowPrompt(true);
      return;
    }

    reset();
    setEditMode(false);
    !orgId && onClose();
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

  const { setShowPrompt } = useConfirmPrompt();

  return (
    <Dialogue
      confirmBeforeLeave={isDirty}
      isVisible={isVisible}
      handleClose={onClose}
      title={getTitle()}
    >
      {isLoading ? (
        <div className="flex h-[470px] w-full items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <Form form={form} onSubmit={onSubmit} className="space-y-10">
          <div className="space-y-4">
            <Controller
              required
              labelClassName={labelClass}
              label="Organization"
              name="name"
              control={control}
              render={({ field }) => {
                return (
                  <Input
                    {...field}
                    placeholder="Organization name"
                    disabled={!editMode}
                  />
                );
              }}
            />
            <Controller
              labelClassName={labelClass}
              label="Registered name"
              required
              name="registeredName"
              control={control}
              render={({ field }) => {
                return (
                  <Input
                    {...field}
                    placeholder="Registered name"
                    disabled={!editMode}
                  />
                );
              }}
            />
            <Controller
              labelClassName={labelClass}
              label="Registration #"
              required
              name="registrationNumber"
              control={control}
              render={({ field }) => {
                return (
                  <Input
                    {...field}
                    placeholder="Registration number"
                    disabled={!editMode}
                  />
                );
              }}
            />
            <div className="flex w-full flex-col gap-5 gap-y-1.5 md:flex-row md:items-center">
              <label htmlFor="" className="min-w-[140px]">
                Registered address*
              </label>

              <div className="w-full space-y-4">
                <Controller
                  labelClassName={labelClass}
                  name="registeredAddress"
                  control={control}
                  render={({ field }) => {
                    return (
                      <Input
                        {...field}
                        placeholder="Registered address"
                        disabled={!editMode}
                      />
                    );
                  }}
                />

                <div className="flex w-full items-center gap-4 md:gap-2">
                  <Controller
                    name="state"
                    control={control}
                    render={({ field }) => {
                      return (
                        <Input
                          {...field}
                          placeholder="State"
                          disabled={!editMode}
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
                          placeholder="Postal code"
                          disabled={!editMode}
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
                          placeholder="Country"
                          disabled={!editMode}
                        />
                      );
                    }}
                  />
                </div>
              </div>
            </div>
            <Controller
              labelClassName={labelClass}
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
                    disabled={!editMode}
                  />
                );
              }}
            />
            <Controller
              labelClassName={labelClass}
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
                    disabled={!editMode}
                  />
                );
              }}
            />
            <Controller
              labelClassName={labelClass}
              label="Status"
              required
              name="status"
              control={control}
              render={() => {
                return (
                  <Dropdown
                    value={
                      STATUS.find((item) => item.value === watch("status"))
                        ?.label
                    }
                    handleSelect={(val) => {
                      setError("status", { message: "" });
                      setValue("status", val as string);
                    }}
                    options={STATUS}
                    placeholder="Select status"
                    disabled={!editMode}
                  />
                );
              }}
            />
          </div>

          {partnersLoading ? (
            <div className="flex h-[200px] w-full items-center justify-center">
              <Spinner />
            </div>
          ) : (
            <Partners
              handleAddPartner={handleAddPartner}
              partners={partners || []}
              orgId={orgId as string}
            />
          )}

          <div className="!mt-10 flex justify-end gap-4">
            {editMode ? (
              <>
                <Button onClick={handleCancel} buttonType="secondary">
                  Cancel
                </Button>
                <Button loading={isPending} type="submit" disabled={!isDirty}>
                  Save
                </Button>
              </>
            ) : (
              <Button type="button" onClick={() => setEditMode(true)}>
                Edit
              </Button>
            )}
          </div>
        </Form>
      )}
    </Dialogue>
  );
};

type AddPartnerFormProps = IOrganizationDialogueProps;

const AddPartnerForm = ({ orgId, ...props }: AddPartnerFormProps) => {
  const existingPartners = queryClient.getQueryData([
    "partners",
    orgId,
  ]) as Partner[];

  const form = useForm<PartnerFieldTypes>({
    resolver: zodResolver(partner.schema),
    defaultValues: partner.defaultValues(Number(orgId)),
  });

  const {
    control,
    setValue,
    setError,
    formState: { isDirty },
  } = form;

  const {
    organizations,
    isLoading: orgLoading,
    rawList,
  } = useOrganizationList({
    page: 1,
    listAll: true,
    filters: {},
  });

  const filteredOrganizations = organizations.filter((org) => {
    const isOwnOrg = Number(org.value) === Number(orgId);
    const orgExists = existingPartners.some(
      (partner) => Number(partner.partner.id) === Number(org.value)
    );

    return !isOwnOrg && !orgExists;
  });

  const { addPartner, isPending } = usePartnerMutation({
    orgId,
    successCallback: props.handleClose,
  });

  const onSubmit = async (values: PartnerFieldTypes) => {
    await addPartner(values);
  };

  return (
    <Dialogue
      isVisible
      title="Add partner"
      handleClose={props.handleClose}
      confirmBeforeLeave={isDirty}
    >
      <Form form={form} onSubmit={onSubmit} className="space-y-10">
        <div className="space-y-4">
          <Controller
            labelClassName={labelClass}
            label="Organization name"
            required
            name="partnerId"
            control={control}
            render={({ field }) => {
              return (
                <Dropdown
                  enableSearch
                  value={findLabelFromOptions(organizations, field.value)}
                  handleSelect={(val) => {
                    setValue("partnerId", Number(val), { shouldDirty: true });

                    const selecterPartner = rawList?.items.find(
                      (item) => Number(item.id) === Number(val)
                    );

                    setValue(
                      "registeredName",
                      selecterPartner?.registeredName || ""
                    );

                    setValue(
                      "registrationId",
                      selecterPartner?.registrationNumber || ""
                    );

                    setError("partnerId", { message: "" });
                  }}
                  loading={orgLoading}
                  options={filteredOrganizations}
                  placeholder="Select partner"
                />
              );
            }}
          />

          <Controller
            required
            labelClassName={labelClass}
            label="Registered name"
            name="registeredName"
            control={control}
            render={({ field }) => {
              return (
                <Input
                  value={field.value}
                  placeholder="Registration name"
                  disabled
                />
              );
            }}
          />

          <Controller
            required
            labelClassName={labelClass}
            label="Registration ID"
            name="registrationId"
            control={control}
            render={({ field }) => {
              return (
                <Input
                  value={field.value}
                  placeholder="Registration ID"
                  disabled
                />
              );
            }}
          />
        </div>

        <div className="flex w-full justify-end">
          <Button type="submit" loading={isPending}>
            Add partner
          </Button>
        </div>
      </Form>
    </Dialogue>
  );
};
