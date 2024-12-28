import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import useContractMutation from "lib/mutations/contracts";
import { ContractFieldValues, IContract } from "lib/types/contracts";
import { contracts } from "lib/validators/contracts";

import Button from "components/ui/button";

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

    reset,
  } = useForm<ContractFieldValues>({
    resolver: zodResolver(contracts.schema),

    defaultValues: contracts.defaultValues({
      contract: contractDetails,
    }),
  });

  useEffect(() => {
    if (contractDetails) {
      reset(contracts.defaultValues({ contract: contractDetails }));
    }
  }, [contractDetails, reset]);

  const { addContract, isPending } = useContractMutation({
    id: contractDetails.id,
    successCallback: handleClose,
  });

  const onSubmit = async (values: ContractFieldValues) => {
    await addContract({
      ...values,
      status: isCompleted ? "SIGNED" : "COMPLETED",
    });
  };

  const isCompleted = useMemo(
    () => contractDetails.status === "COMPLETED",

    [contractDetails.status]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="text-left">
      <p className="text-[20px] font-semibold">
        Are you sure you want to mark {contractDetails.name} as{" "}
        {isCompleted ? "incomplete" : "completed"}?
      </p>

      <p className="text-[14px] font-medium">
        You can still mark this back as{" "}
        {isCompleted ? "completed" : "incomplete"} after.
      </p>

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
