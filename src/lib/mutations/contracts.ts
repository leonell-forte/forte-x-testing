import * as amplitude from "@amplitude/analytics-browser";
import { useMutation } from "@tanstack/react-query";
import contractService from "api/contract";

import { ContractFieldValues, IContract } from "lib/types/contracts";

import { queryClient } from "components/QueryProvider";

import { useAlert } from "../hooks";

interface IContractMutation {
  id?: number;

  successCallback?: () => void;
}

const useContractMutation = ({ id, successCallback }: IContractMutation) => {
  const { setAlert } = useAlert();

  const { mutateAsync: addContract, isPending } = useMutation({
    mutationFn: id
      ? (values: ContractFieldValues) => contractService.update({ ...values })
      : contractService.add,

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["contracts"] });

      const previousContracts = queryClient.getQueryData(["projects"]);

      return { previousContracts };
    },

    onSuccess: (addedContract: ContractFieldValues) => {
      queryClient.setQueryData(
        ["contracts", 1, ""],

        (old: { items: IContract[] }) => {
          return {
            ...old,

            items: [...(old?.items || []), addedContract],
          };
        }
      );

      queryClient.setQueryData(
        ["specific-contract", id],

        () => addedContract
      );

      successCallback?.();

      setAlert({
        title: "Success!",

        status: "success",

        message: `Contract has been ${id ? "updated" : "added"} successfully`,
      });

      amplitude.track(`${id ? "Update" : "Add"} Contract Form Submission`);
    },

    onError: (err: any, newContract, context) => {
      setAlert({
        status: "error",

        title: `Failed ${id ? "updating" : "adding"} contract`,

        message: err?.response?.data?.data,
      });

      queryClient.setQueryData(
        ["contracts", 1, ""],

        context?.previousContracts
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts", 1, ""] });
    },
  });

  return { addContract, isPending };
};

export const useDeleteContractMutation = (
  id: string,
  succesCallback?: () => void
) => {
  const { setAlert } = useAlert();

  const { mutateAsync: deleteContract, isPending } = useMutation({
    mutationFn: (id: string) => contractService.delete(id),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["contracts"] });

      const previousContracts = queryClient.getQueryData<IContract[]>([
        "contracts",
      ]);

      return { previousContracts };
    },

    onSuccess: () => {
      queryClient.setQueryData(
        ["contracts"],

        (old: { items: IContract[] }) => {
          return {
            ...old,

            items: [...(old?.items || [])].filter(
              (item) => item.id !== Number(id)
            ),
          };
        }
      );

      succesCallback?.();

      setAlert({
        status: "success",

        message: `Contract deleted successfully`,

        title: "Contract Deleted!",
      });

      amplitude.track(`Delete Contract Performed`, {
        id: id,
      });
    },

    onError: (err: any, _, context) => {
      setAlert({
        status: "error",

        title: `Failed deleting contract`,

        message: err?.response?.data?.message,
      });

      queryClient.setQueryData(["contracts"], context?.previousContracts);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
    },
  });

  return { deleteContract, isPending };
};

export default useContractMutation;
