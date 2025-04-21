import * as amplitude from "@amplitude/analytics-browser";
import { useMutation } from "@tanstack/react-query";
import contractService from "api/contract";
import { useNavigate } from "react-router-dom";

import { ContractFieldValues } from "lib/types/contracts";
import { formatErrorMessage } from "lib/utils";

import { queryClient } from "components/QueryProvider";
import { ToastAction, toast } from "components/ui/toast/Toast";

interface IContractMutation {
  id?: number;

  successCallback?: (contract: ContractFieldValues) => void;
}

const useContractMutation = ({ id, successCallback }: IContractMutation) => {
  const navigate = useNavigate();

  const { mutateAsync: addContract, isPending } = useMutation({
    mutationFn: id
      ? (values: ContractFieldValues) => contractService.update({ ...values })
      : contractService.add,

    onSuccess: (addedContract: ContractFieldValues) => {
      successCallback?.(addedContract);

      toast({
        title: `Contract ${id ? "updated" : "added"} successfully`,
        ...(!id && {
          action: (
            <ToastAction
              altText="view"
              onClick={() => navigate(`/contracts/${addedContract.id}`)}
            >
              <p>View</p>
            </ToastAction>
          ),
        }),
      });

      amplitude.track(`${id ? "Update" : "Add"} Contract Form Submission`);
    },

    onError: (err: any) => {
      toast({
        variant: "danger",
        title:
          formatErrorMessage(err?.response?.data?.data?.[0]) ||
          `Failed ${id ? "updating" : "adding"} contract`,
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      queryClient.invalidateQueries({ queryKey: ["specific-contract"] });
    },
  });

  return { addContract, isPending };
};

export const useDeleteContractMutation = (succesCallback?: () => void) => {
  const { mutateAsync: deleteContract, isPending } = useMutation({
    mutationFn: (id: string) => contractService.delete(id),
    onSuccess: () => {
      succesCallback?.();
      toast({ title: "Contract deleted successfully" });
      amplitude.track("Delete Contract Performed");
    },
    onError: (err: any) => {
      toast({
        title:
          formatErrorMessage(err?.response?.data?.data?.[0]) ||
          err?.response?.data?.message ||
          "Failed deleting contract",
        variant: "danger",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
    },
  });

  return { deleteContract, isPending };
};

export default useContractMutation;
