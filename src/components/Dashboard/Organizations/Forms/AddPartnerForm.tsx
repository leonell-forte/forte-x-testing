import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import useOrganizationList from "lib/common/lists/useOrganizationList";
import usePartnerList from "lib/common/lists/usePartnerList";
import { useAppSelector } from "lib/hooks";
import { usePartnerMutation } from "lib/mutations/partners";
import { IOrganization, PartnerFieldTypes } from "lib/types/organizations";
import { findLabelFromOptions } from "lib/utils";
import { partner } from "lib/validators/organizations";

import { queryClient } from "components/QueryProvider";
import Button from "components/ui/button";
import Controller from "components/ui/custom-controller/CustomController";
import { useModal } from "components/ui/dialogue/v2/Modal";
import Dropdown from "components/ui/dropdown";
import { Form } from "components/ui/form/Form";
import Input from "components/ui/input";

import { IOrganizationDialogueProps } from "../Dialogues/OrganizationDialogue";

type AddPartnerFormProps = IOrganizationDialogueProps;

const labelClass = "min-w-[160px]";

export const showAddPartnerForm = ({ orgId }: AddPartnerFormProps) => {
  useModal.getState().open({
    component: <AddPartnerForm orgId={orgId} />,
    title: "Add Partner",
    size: "2xl",
  });
};

const AddPartnerForm = ({ orgId, ...props }: AddPartnerFormProps) => {
  const { partnersToAdd } = useAppSelector((state) => state.partners);

  const { partners: existingPartners } = usePartnerList(orgId);

  const form = useForm<PartnerFieldTypes>({
    resolver: zodResolver(partner.schema),
    defaultValues: partner.defaultValues(Number(orgId)),
  });

  const { setShowPromptOnClose, close } = useModal();

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
    handleSearchOrg,
  } = useOrganizationList({
    key: ["dropdown"],
    pageSize: 100,
  });

  const filteredOrganizations = organizations.filter((org) => {
    const isOwnOrg = Number(org.value) === Number(orgId);
    const orgExists =
      existingPartners?.some(
        (partner) => Number(partner.partner.id) === Number(org.value)
      ) ||
      partnersToAdd.some(
        (partner) => Number(partner.partner.id) === Number(org.value)
      );

    return !isOwnOrg && !orgExists;
  });

  const { addPartner, isPending } = usePartnerMutation({
    orgId,
    successCallback: props.handleClose,
  });

  const onSubmit = async (values: PartnerFieldTypes) => {
    if (orgId) {
      await addPartner(values);
      queryClient.setQueryData(
        ["specific org", orgId],
        (prev: IOrganization): IOrganization => {
          return { ...prev, noOfPartners: prev.noOfPartners! + 1 };
        }
      );
      close();
      return;
    }

    props.handleClose?.();
  };

  useEffect(() => {
    if (!isDirty) return;
    setShowPromptOnClose(true);
    return () => {
      setShowPromptOnClose(false);
    };
  }, [isDirty, setShowPromptOnClose]);

  return (
    <Form form={form} onSubmit={onSubmit} className="space-y-10">
      <div className="space-y-4">
        <Controller
          labelClassName={labelClass}
          label="Organization name"
          required
          name="partner.id"
          control={control}
          render={({ field }) => {
            return (
              <Dropdown
                enableSearch
                value={findLabelFromOptions(organizations, field.value)}
                handleSelect={(val) => {
                  const selecterPartner = rawList?.items.find(
                    (item) => Number(item.id) === Number(val)
                  );

                  setValue(
                    "partner",
                    {
                      id: Number(selecterPartner?.id),
                      name: selecterPartner?.name || "",
                      registeredName: selecterPartner?.registeredName || "",
                      registeredNumber:
                        selecterPartner?.registrationNumber || "",
                    },
                    {
                      shouldDirty: true,
                    }
                  );

                  setError("partner.id", { message: "" });
                }}
                loading={orgLoading}
                options={filteredOrganizations}
                placeholder="Select partner"
                onChange={(e) => handleSearchOrg(e.target.value)}
              />
            );
          }}
        />

        <Controller
          required
          labelClassName={labelClass}
          label="Registered name"
          name="partner.registeredName"
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
          name="partner.registeredNumber"
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
  );
};

export default AddPartnerForm;
