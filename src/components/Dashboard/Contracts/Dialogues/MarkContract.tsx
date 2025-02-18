import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";

import useContractMutation from "lib/mutations/contracts";
import {
  ContractFieldValues,
  IContract,
  StatusRecords,
} from "lib/types/contracts";
import { contracts } from "lib/validators/contracts";

import Button from "components/ui/button";
import FileInput from "components/ui/file-input";

interface IMarkContract {
  contractDetails: IContract;

  handleBack: () => void;

  handleClose: () => void;
}

const MarkAsCompleted = ({
  contractDetails,
  handleBack,
  handleClose,
}: IMarkContract) => {
  const {
    handleSubmit,

    setValue,

    setError,

    formState: { errors },

    control,

    reset,
  } = useForm<ContractFieldValues>({
    resolver: zodResolver(contracts.schema),

    defaultValues: contracts.defaultValues({
      contract: contractDetails,
    }),
  });

  const { isCompleted, isDraft } = useMemo(() => {
    const status = contractDetails?.status;

    return {
      isSigned: status === "SIGNED",

      isCompleted: status === "COMPLETED",

      isDraft: status === "DRAFT",
    };
  }, [contractDetails?.status]);

  useEffect(() => {
    if (contractDetails) {
      let contract = { ...contractDetails };

      if (isDraft) contract.documentId = 0;

      reset(
        contracts.defaultValues({
          contract,
        })
      );
    }
  }, [contractDetails, reset, isDraft]);

  const { addContract, isPending } = useContractMutation({
    id: contractDetails.id,
    successCallback: handleClose,
  });

  const { next, revert } = useMemo(() => {
    const states: Record<StatusRecords, { next: string; revert: string }> = {
      COMPLETED: { next: "incomplete", revert: "complete" },

      SIGNED: { next: "complete", revert: "incomplete" },

      DRAFT: { next: "signed", revert: "" },
    };
    return states[contractDetails.status as StatusRecords];
  }, [contractDetails.status]);

  const onSubmit = async (values: ContractFieldValues) => {
    await addContract({
      ...values,

      status: isCompleted || isDraft ? "SIGNED" : "COMPLETED",
    });
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
        <Button onClick={handleBack} buttonType="secondary">
          Cancel
        </Button>

        <Button type="submit" loading={isPending}>
          Submit
        </Button>
      </div>
    </form>
  );
};

export default MarkAsCompleted;
