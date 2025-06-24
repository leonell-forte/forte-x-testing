import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { BENEFICIARY_STATUS } from "@/lib/constants";
import { useBulkStatusUpdateMutation } from "@/lib/mutations/beneficiaries";
import type { BeneficiaryStatusUpdateField } from "@/lib/types/beneficiaries";
import { beneficiaryStatus } from "@/lib/validators/beneficiaries";

import Button from "@/components/ui/button";
import Dialogue, { type IDialogueProps } from "@/components/ui/dialogue/dialogue";
import Dropdown from "@/components/ui/dropdown";

interface IBulkUpdateProps extends IDialogueProps {
  ids: number[];
}

const BulkUpdateStatus = ({ ids, ...props }: IBulkUpdateProps) => {
  const { handleSubmit, control, setValue, getValues } =
    useForm<BeneficiaryStatusUpdateField>({
      resolver: zodResolver(beneficiaryStatus.schema),

      defaultValues: beneficiaryStatus.default,
    });

  const { updateStatus, isPending } = useBulkStatusUpdateMutation(
    getValues("status"),

    ids,

    props.handleClose
  );

  const onSubmit = async (values: BeneficiaryStatusUpdateField) => {
    await updateStatus({ status: values.status, ids });
  };

  return (
    <Dialogue {...props} center title="Bulk update status">
      <form onSubmit={handleSubmit(onSubmit)}>
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
                  options={BENEFICIARY_STATUS}
                  error={!!error?.message}
                  helperText={error?.message}
                />
              );
            }}
          />
        </div>

        <div className="mt-6 flex items-center justify-end gap-4">
          <Button buttonType="secondary" onClick={props.handleClose}>
            Cancel
          </Button>

          <Button type="submit" loading={isPending}>
            Save
          </Button>
        </div>
      </form>
    </Dialogue>
  );
};

export default BulkUpdateStatus;
