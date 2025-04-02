import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import organizationService from "api/organization";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import usePartnerList from "lib/common/lists/usePartnerList";
import { REGIONS, STATUS, TYPES } from "lib/constants";
import { useAppDispatch, useAppSelector } from "lib/hooks";
import useOrganizationMutation from "lib/mutations/organizations";
import { clearPartners } from "lib/slice/partners";
import { OrgTypes, OrganizationFieldTypes } from "lib/types/organizations";
import { organizations } from "lib/validators/organizations";

import { useProfile } from "components/ProfileContext";
import { useConfirmPrompt } from "components/ui/alert/confirm-prompt";
import Button from "components/ui/button";
import Controller from "components/ui/custom-controller/CustomController";
import Dialogue from "components/ui/dialogue/dialogue";
import Dropdown from "components/ui/dropdown";
import { Form } from "components/ui/form/Form";
import { useAutoSaveForm } from "components/ui/form/useAutoSave";
import Input from "components/ui/input";
import Spinner from "components/ui/spinner/spinner";

import { IOrganizationDialogueProps } from "../Dialogues/OrganizationDialogue";
import Partners from "../Partners";

const labelClass = "min-w-[160px]";

type OrganizationFormProps = IOrganizationDialogueProps & {
  handleAddPartner: () => void;
  savedFormData?: OrganizationFieldTypes | null;
  onFormDataChange?: (data: OrganizationFieldTypes) => void;
};

const OrganizationForm = ({
  handleClose,
  orgId,
  addSuccessCallback,
  isVisible,
  handleAddPartner,
  savedFormData,
  onFormDataChange,
  type,
}: OrganizationFormProps) => {
  const dispatch = useAppDispatch();
  // this is a custom state to store partners to be added to the organization after creation
  const { profile } = useProfile();

  const { partnersToAdd } = useAppSelector((state) => state.partners);

  const [editMode, setEditMode] = useState(orgId ? false : true);

  const { data: orgData, isLoading } = useQuery({
    queryKey: ["specific org", orgId],

    queryFn: () => organizationService.getOne(orgId!),

    enabled: !!orgId,
  });

  const { partners, isLoading: partnersLoading } = usePartnerList(orgId);

  const form = useForm<OrganizationFieldTypes>({
    resolver: zodResolver(organizations.schema),

    defaultValues: savedFormData || organizations.defaultValues(type),
  });

  const {
    watch,

    setValue,

    setError,

    reset,

    control,

    formState: { isDirty },
  } = form;

  // Add this computed value for form dirtiness
  const isFormDirty = useMemo(() => {
    return isDirty || partnersToAdd.length > 0;
  }, [isDirty, partnersToAdd.length]);

  // prefill initial value from selected org

  useEffect(() => {
    if (orgData) {
      reset(organizations.defaultValues(type, orgData));
    }
  }, [orgData, reset, type]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      onFormDataChange?.(value as OrganizationFieldTypes);
    });
    return () => subscription.unsubscribe();
  }, [form.watch, onFormDataChange, form]);

  const onClose = () => {
    reset();

    handleClose!();
  };

  // autosave start

  const formId = "organization-form";

  useAutoSaveForm(form, {
    formId,
    enabled: !orgData,
  });

  // autosave end

  const getTitle = () => {
    if (orgId) {
      return editMode ? `Edit ${type}` : `View ${type}`;
    }
    return `Add ${type}`;
  };

  const handleCancel = () => {
    if (!orgId && isFormDirty) {
      setShowPrompt(true);
      return;
    }

    reset();
    setEditMode(false);
    if (!orgId) onClose();
  };

  // implements optimistic update after adding or updating organization

  const { addOrganization, isPending } = useOrganizationMutation({
    orgId,
    successCallback: async (id) => {
      onClose();

      addSuccessCallback?.(id);

      // if there are partners to add, add them after the organization is created
      if (partnersToAdd.length) {
        await Promise.all(
          partnersToAdd.map(async (partner) => {
            return await organizationService.addPartner({
              ...partner,
              organizationId: id,
            });
          })
        );
        dispatch(clearPartners());
      }
    },
  });

  const onSubmit = async (values: OrganizationFieldTypes) => {
    await addOrganization(values);
  };

  const { setShowPrompt } = useConfirmPrompt();

  return (
    <Dialogue
      confirmBeforeLeave={isFormDirty}
      isVisible={isVisible}
      handleClose={onClose}
      title={getTitle()}
      formId={formId}
    >
      {isLoading ? (
        <div className="flex h-[470px] w-full items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <Form form={form} onSubmit={onSubmit} className="space-y-10">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
            </div>

            <div className="flex w-full flex-col gap-5 gap-y-1.5">
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

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
                        setValue("regions", val as string[], {
                          shouldDirty: true,
                        });

                        setError("regions", { message: "" });
                      }}
                      options={REGIONS}
                      placeholder="Select region"
                      disabled={!editMode}
                      filterOptions
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
                        TYPES.find((item) => item.value === watch("type"))
                          ?.label
                      }
                      handleSelect={(val) => {
                        setError("type", { message: "" });

                        setValue("type", val as OrgTypes, {
                          shouldDirty: true,
                        });
                      }}
                      options={TYPES}
                      placeholder="Select type"
                      disabled
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
                        setValue("status", val as string, {
                          shouldDirty: true,
                        });
                      }}
                      options={STATUS}
                      placeholder="Select status"
                      disabled={!editMode}
                    />
                  );
                }}
              />
            </div>
          </div>

          {profile.organization === "Forte" &&
            (partnersLoading ? (
              <div className="flex h-[200px] w-full items-center justify-center">
                <Spinner />
              </div>
            ) : (
              <Partners
                handleAddPartner={handleAddPartner}
                partners={partners || []}
                orgId={orgId as string}
              />
            ))}

          <div className="!mt-10 flex justify-end gap-4">
            {editMode ? (
              <>
                <Button onClick={handleCancel} buttonType="secondary">
                  Cancel
                </Button>
                <Button
                  loading={isPending}
                  type="submit"
                  disabled={!isFormDirty}
                >
                  {orgId ? "Update" : "Add"}
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

export default OrganizationForm;
