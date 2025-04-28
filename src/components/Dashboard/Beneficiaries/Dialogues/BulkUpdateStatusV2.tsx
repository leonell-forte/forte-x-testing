import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { BENEFICIARY_STATUS, filterStatus } from "lib/constants";
import { useBulkStatusUpdateMutation } from "lib/mutations/beneficiaries";
import { BeneficiaryStatusUpdateField } from "lib/types/beneficiaries";
import { beneficiaryStatus } from "lib/validators/beneficiaries";

import { useProfile } from "components/ProfileContext";
import Button from "components/ui/button";
import Controller from "components/ui/custom-controller/CustomController";
import { useModal } from "components/ui/dialogue/v2/Modal";
import Dropdown from "components/ui/dropdown";
import { Form } from "components/ui/form/Form";

type TParams = {
  ids: number[];
  successCb: () => void;
};

export function showBulkUpdateStatusModal(params: TParams) {
  useModal.getState().open({
    component: (
      <BulkUpdateStatus ids={params.ids} successCb={params.successCb} />
    ),
    title: "Bulk Update Status",
  });
}

const BulkUpdateStatus = ({ ids, successCb }: TParams) => {
  const { profile } = useProfile();
  const { close } = useModal();
  const form = useForm<BeneficiaryStatusUpdateField>({
    resolver: zodResolver(beneficiaryStatus.schema),

    defaultValues: beneficiaryStatus.default,
  });

  const { control, setValue, getValues } = form;

  const { updateStatus, isPending } = useBulkStatusUpdateMutation(
    getValues("status"),

    ids,

    () => {
      close();
      successCb();
    }
  );

  const onSubmit = async (values: BeneficiaryStatusUpdateField) => {
    await updateStatus({ status: values.status, ids });
  };

  return (
    <Form onSubmit={onSubmit} form={form}>
      <div className="flex items-start">
        <label htmlFor="" className="min-w-[140px] pt-3">
          Beneficiary status
        </label>

        <Controller
          control={control}
          name="status"
          render={({ field, fieldState }) => {
            const { error } = fieldState;
            return (
              <Dropdown
                value={field.value}
                handleSelect={(val) => {
                  setValue("status", val as string);
                }}
                placeholder="Status"
                options={filterStatus(BENEFICIARY_STATUS, profile.orgType)}
                error={!!error?.message}
                helperText={error?.message}
              />
            );
          }}
        />
      </div>

      <div className="mt-6 flex items-center justify-end gap-4">
        <Button buttonType="secondary" onClick={close}>
          Cancel
        </Button>

        <Button type="submit" loading={isPending}>
          Save
        </Button>
      </div>
    </Form>
  );
};
