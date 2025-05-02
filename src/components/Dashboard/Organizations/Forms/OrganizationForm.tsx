import { zodResolver } from "@hookform/resolvers/zod";
import { capitalize } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import organizationService from "api/organization";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { REGIONS, STATUS } from "lib/constants";
import { useAppDispatch, useAppSelector } from "lib/hooks";
import useOrganizationMutation from "lib/mutations/organizations";
import { Funders, IsAuthorized, Providers } from "lib/role-permissions";
import { clearPartners } from "lib/slice/partners";
import { OrgStatus, OrganizationFieldTypes } from "lib/types/organizations";
import { organizations } from "lib/validators/organizations";

import Button from "components/ui/button";
import Controller from "components/ui/custom-controller/CustomController";
import { useModal } from "components/ui/dialogue/v2/Modal";
import Dropdown from "components/ui/dropdown";
import { Form } from "components/ui/form/Form";
import { useAutoSaveForm } from "components/ui/form/useAutoSave";
import Input from "components/ui/input";
import Spinner from "components/ui/spinner/spinner";

import { showDeactivateOrgPrompt } from "../Dialogues/DeactivateOrgPrompt";
import { IOrganizationDialogueProps } from "../Dialogues/OrganizationDialogue";

const labelClass = "min-w-[160px]";

type OrganizationFormProps = IOrganizationDialogueProps & {
  savedFormData?: OrganizationFieldTypes | null;
  onFormDataChange?: (data: OrganizationFieldTypes) => void;
};

const OrganizationForm = ({
  handleClose,
  orgId,
  addSuccessCallback,
  savedFormData,
  onFormDataChange,
  type,
}: OrganizationFormProps) => {
  const dispatch = useAppDispatch();
  // this is a custom state to store partners to be added to the organization after creation

  const { partnersToAdd } = useAppSelector((state) => state.partners);

  const [editMode, setEditMode] = useState(orgId ? false : true);

  const { data: orgData, isLoading } = useQuery({
    queryKey: ["specific org", orgId],

    queryFn: () => organizationService.getOne(orgId!),

    enabled: !!orgId,
  });

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

  const { close, setShowPromptOnClose } = useModal();

  const { addOrganization, isPending } = useOrganizationMutation({
    orgId,

    successCallback: async (id) => {
      close();

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

    type,
  });

  const onSubmit = async (values: OrganizationFieldTypes) => {
    if (orgData && values.status === "inactive") {
      showDeactivateOrgPrompt({
        onYes: () => addOrganization(values),
        orgName: orgData?.name,
      });
      return;
    }
    await addOrganization(values);
  };

  useEffect(() => {
    if (!isDirty) return;
    setShowPromptOnClose(true);
    return () => {
      setShowPromptOnClose(false);
    };
  }, [isDirty, setShowPromptOnClose]);

  return (
    <>
      {isLoading ? (
        <div className="flex h-[470px] w-full items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <Form form={form} onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-3">
            <Controller
              containerClassName="w-full md:w-[365px]"
              required
              labelClassName={labelClass}
              label={`${capitalize(type as string)} name`}
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

            <div className="flex w-full flex-col gap-2 md:flex-row">
              <Controller
                containerClassName="w-full md:w-[365px] md:flex-shrink-0"
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
                containerClassName="w-full"
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

            <Controller
              labelClassName={labelClass}
              name="registeredAddress"
              label="Registered address"
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

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-2">
              <Controller
                name="state"
                label="State"
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
                label="Postal code"
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
                label="Country"
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

          <div className="border-t border-white/30 pt-6">
            <div className="max-w-[272px] space-y-3">
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
              {/* <Controller
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
            /> */}
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
                        setValue("status", val as OrgStatus, {
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

          {/* {profile.organization === "Forte" &&
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
            ))} */}

          {IsAuthorized([Providers.UPDATE, Funders.UPDATE]) ? (
            <div className="!mt-10 flex justify-end gap-4">
              {editMode ? (
                <>
                  {/* <Button onClick={handleCancel} buttonType="secondary">
                    Cancel
                  </Button> */}
                  <Button
                    loading={isPending}
                    type="submit"
                    disabled={!isFormDirty}
                    className="w-[147px]"
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
          ) : (
            <div className="h-1" />
          )}
        </Form>
      )}
    </>
  );
};

export default OrganizationForm;
