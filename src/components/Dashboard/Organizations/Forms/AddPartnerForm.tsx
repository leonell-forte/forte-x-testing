import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import useOrganizationList from "lib/common/lists/useOrganizationList";
import { usePartnerMutation } from "lib/mutations/partners";
import { IOrganization, PartnerFieldTypes } from "lib/types/organizations";
import { partner } from "lib/validators/organizations";

import { queryClient } from "components/QueryProvider";
import Button from "components/ui/button";
import Controller from "components/ui/custom-controller/CustomController";
import { useModal } from "components/ui/dialogue/v2/Modal";
import Dropdown from "components/ui/dropdown";
import { Form } from "components/ui/form/Form";

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
  const form = useForm<PartnerFieldTypes>({
    resolver: zodResolver(partner.schema),
    defaultValues: partner.defaultValues(Number(orgId)),
  });

  const { setShowPromptOnClose, close } = useModal();

  const {
    control,
    formState: { isDirty },
  } = form;

  const { organizations, isLoading: orgLoading } = useOrganizationList({
    key: ["dropdown"],
    pageSize: 1000,
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
          control={control}
          name="partner"
          render={({ field }) => {
            return (
              <Dropdown
                showAsTags
                isMultiSelect
                enableSearch
                value={field.value}
                handleSelect={(val) => {
                  field.onChange(val);
                }}
                loading={orgLoading}
                options={organizations}
                placeholder="Select partner"
                filterOptions
              />
            );
          }}
        />
      </div>

      <div className="flex w-full justify-between">
        <Button buttonType="secondary" loading={isPending} onClick={close}>
          Cancel
        </Button>
        <Button type="submit" loading={isPending} disabled={!isDirty}>
          Save
        </Button>
      </div>
    </Form>
  );
};

export default AddPartnerForm;
