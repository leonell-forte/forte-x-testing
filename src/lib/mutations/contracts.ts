import * as amplitude from "@amplitude/analytics-browser";
import { useMutation } from "@tanstack/react-query";
import contractService from "api/contract";

import { ContractFieldValues, IContract } from "lib/types/contracts";
import { formatErrorMessage } from "lib/utils";

import { queryClient } from "components/QueryProvider";

import { useAlert, usePage } from "../hooks";

interface IContractMutation {
  id?: number;

  successCallback?: (contract: ContractFieldValues) => void;
}

const useContractMutation = ({ id, successCallback }: IContractMutation) => {
  const { setAlert } = useAlert();

  const { page } = usePage();

  const contractQuery = [
    "contracts",
    +page || 1,
    "",
    {
      status: "",

      project: "",

      date: "",
    },
  ];

  const { mutateAsync: addContract, isPending } = useMutation({
    mutationFn: id
      ? (values: ContractFieldValues) => contractService.update({ ...values })
      : contractService.add,

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: contractQuery });

      const previousContracts = queryClient.getQueryData(["projects"]);

      return { previousContracts };
    },

    onSuccess: (addedContract: ContractFieldValues) => {
      queryClient.setQueryData(
        contractQuery,

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

      successCallback?.(addedContract);

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

        message: formatErrorMessage(err?.response?.data?.data?.[0]),
      });

      queryClient.setQueryData(
        contractQuery,

        context?.previousContracts
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
    },
  });

  return { addContract, isPending };
};

export const useDeleteContractMutation = (
  id: string,
  succesCallback?: () => void
) => {
  const { setAlert } = useAlert();

  const { page, setPage } = usePage();

  const contractQuery = [
    "contracts",
    +page || 1,
    "",
    {
      status: "",

      project: "",

      date: "",
    },
  ];

  const { mutateAsync: deleteContract, isPending } = useMutation({
    mutationFn: (id: string) => contractService.delete(id),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: contractQuery });

      const previousContracts = queryClient.getQueryData<IContract[]>([
        "contracts",
      ]);

      return { previousContracts };
    },

    onSuccess: () => {
      queryClient.setQueryData(
        contractQuery,

        (old: { items: IContract[] }) => {
          // sets page to previous page if current list is empty
          if (old?.items.length === 1 && +page !== 1) {
            setPage(page - 1);
          }

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

        message:
          formatErrorMessage(err?.response?.data?.data?.[0]) ||
          err?.response?.data?.message,
      });

      queryClient.setQueryData(contractQuery, context?.previousContracts);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
    },
  });

  return { deleteContract, isPending };
};

export default useContractMutation;
