import { omit } from "lodash";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";

import Button from "@/components/ui/button";
import FileInput from "@/components/ui/file-input";
import useContractMutation, {
  useUpdateContractStatusMutation,
} from "@/lib/mutations/contracts";
import type {
  ContractFieldValues,
  IContract,
  StatusRecords,
  StatusType,
} from "@/lib/types/contracts";
import { contracts } from "@/lib/validators/contracts";

interface IMarkContract {
  contractDetails: IContract;

  handleBack?: () => void;

  handleClose: () => void;
}

const MarkAsCompleted = ({
  contractDetails,
  handleBack,
  handleClose,
}: IMarkContract) => {
  const { addContract: updateFile, isPending: updateFilePending } =
    useContractMutation({
      id: contractDetails?.id,
    });

  const {
    handleSubmit,

    setValue,

    setError,

    formState: { errors },

    control,

    reset,

    watch,
  } = useForm<ContractFieldValues>({
    defaultValues: contracts.defaultValues({
      contract: contractDetails,
    }),
  });

  const { isCompleted, isDraft } = useMemo(() => {
    const status = contractDetails?.status;

    return {
      isSigned: status.toUpperCase() === "SIGNED",

      isCompleted: status.toUpperCase() === "COMPLETED",

      isDraft: status.toUpperCase() === "DRAFT",
    };
  }, [contractDetails?.status]);

  useEffect(() => {
    if (contractDetails) {
      let contract = { ...contractDetails };

      if (isDraft) contract.documentId = 0;

      reset(
        contracts.defaultValues({
          contract: {
            ...contract,
            status: contract.status.toLowerCase() as StatusType,
          },
        })
      );
    }
  }, [contractDetails, reset, isDraft]);

  const { updateContract, isPending } = useUpdateContractStatusMutation({
    id: (contractDetails.id || "").toString(),
    callBack: handleClose,
  });

  const { next, revert } = useMemo(() => {
    const states: Record<StatusRecords, { next: string; revert: string }> = {
      completed: { next: "incomplete", revert: "complete" },

      signed: { next: "complete", revert: "incomplete" },

      draft: { next: "signed", revert: "" },
    };
    return states[contractDetails.status.toLowerCase() as StatusRecords];
  }, [contractDetails.status]);

  const onSubmit = async () => {
    if (isDraft) {
      await updateFile({
        documentId: watch("documentId"),
        outcomeRates: contractDetails.outcomes.map((item) =>
          omit(item, ["outcome", "currency", "id"])
        ) as ContractFieldValues["outcomeRates"],
        id: contractDetails.id,
        name: contractDetails.name,
        providerId: contractDetails.provider.id,
        projectId: contractDetails.projectId,
        startDate: contractDetails.startDate,
        endDate: contractDetails.endDate,
        targetNoOfBenefeciaries: String(
          contractDetails.targetNoOfBenefeciaries
        ),
        status: contractDetails.status.toLowerCase() as StatusType,
      });
    }
    await updateContract(isDraft || isCompleted ? "signed" : "completed");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="text-left">
      <p className="heading">
        {isDraft
          ? `Are you sure you want to mark ${contractDetails.name} as signed?`
          : `Are you sure you want to mark ${contractDetails.name} as ${next}?`}
      </p>

      <p className="text-[14px] font-medium">
        {isDraft
          ? `If yes, please upload the signed document.`
          : ` You can still mark this back as ${revert} after.`}
      </p>

      {isDraft && (
        <div className="mt-6 flex flex-col gap-1">
          <Controller
            name="documentId"
            control={control}
            render={() => (
              <FileInput
                accept=".pdf"
                onSuccess={(data) => {
                  setValue("documentId", data.id);

                  setError("documentId", { message: "" });
                }}
                placeholder="Document"
                error={!!errors.documentId?.message}
                helperText={errors.documentId?.message}
              />
            )}
          />
        </div>
      )}

      <div className="mt-10 flex justify-end gap-2">
        <Button onClick={() => handleBack?.()} buttonType="secondary">
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={!watch("documentId")}
          loading={isPending || updateFilePending}
        >
          Submit
        </Button>
      </div>
    </form>
  );
};

export default MarkAsCompleted;
