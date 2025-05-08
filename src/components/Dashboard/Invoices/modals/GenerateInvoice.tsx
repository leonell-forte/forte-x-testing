import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import useOrganizationList from "lib/common/lists/useOrganizationList";
import {
  useGenerateInvoice,
  useGetAchievedMilestones,
} from "lib/mutations/invoices";
import { TGenerateInvoice, generateInvoiceForm } from "lib/validators/invoice";

import Button from "components/ui/button";
import Controller from "components/ui/custom-controller/CustomController";
import DatePicker from "components/ui/date-picker";
import { useModal } from "components/ui/dialogue/v2/Modal";
import Dropdown from "components/ui/dropdown";
import { Form } from "components/ui/form/Form";
import { toast } from "components/ui/toast/Toast";

export function showGenerateInvoiceModal() {
  useModal.getState().open({
    component: <GenerateInvoiceModal />,
    size: "sm",
    title: "Generate Invoice",
  });
}

function GenerateInvoiceModal() {
  const { close } = useModal();
  const [loading, setLoading] = useState(false);
  const form = useForm<TGenerateInvoice>({
    resolver: zodResolver(generateInvoiceForm.schema),
    defaultValues: generateInvoiceForm.defaultValues,
  });
  const {
    control,
    formState: { isValid },
    watch,
  } = form;

  const { startDate, endDate } = watch();

  const { getAchievedMilestones } = useGetAchievedMilestones();
  const { generateInvoice } = useGenerateInvoice(close);

  const onSubmit = async (payload: TGenerateInvoice) => {
    setLoading(true);
    const milestones = await getAchievedMilestones(payload);
    const milestoneIds = milestones.map((item: any) => item.id);
    if (milestoneIds.length === 0) {
      close();
      toast({
        title: "No achieved milestones found between the selected dates",
      });
      setLoading(false);
      return;
    }
    await generateInvoice({ funderId: payload.funderId, milestoneIds });
    setLoading(false);
  };

  const {
    organizations,
    rawList,
    isLoading: orgLoading,
    handleSearchOrg,
  } = useOrganizationList({
    listAll: true,
    filters: { type: "funder" },
  });

  return (
    <div>
      <Form form={form} onSubmit={onSubmit} className="space-y-10">
        <div className="space-y-4">
          <Controller
            name="funderId"
            label="Funder"
            control={control}
            render={({ field }) => {
              return (
                <Dropdown
                  loading={orgLoading}
                  enableSearch
                  value={
                    rawList?.items.find(
                      (item) => item.id?.toString() === field.value
                    )?.name
                  }
                  options={organizations}
                  onChange={(e) => handleSearchOrg(e.target.value)}
                  handleSelect={(val) => field.onChange(val)}
                  placeholder="Select funder"
                />
              );
            }}
          />
          <div className="grid grid-cols-1 gap-x-2 gap-y-4 md:grid-cols-2">
            <Controller
              label="Start date"
              control={control}
              name="startDate"
              render={({ field }) => (
                <DatePicker
                  value={new Date(field.value || "")}
                  onChange={(date) => {
                    field.onChange(date ? date.toISOString() : "");
                  }}
                  maxDate={endDate ? new Date(endDate) : undefined}
                />
              )}
            />

            <Controller
              label="End date"
              control={control}
              name="endDate"
              render={({ field }) => (
                <DatePicker
                  value={new Date(field.value || "")}
                  onChange={(date) => {
                    field.onChange(date ? date.toISOString() : "");
                  }}
                  minDate={startDate ? new Date(startDate) : undefined}
                />
              )}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={!isValid}
            loading={loading}
            className="w-[147px]"
          >
            Generate
          </Button>
        </div>
      </Form>
    </div>
  );
}
