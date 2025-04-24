import * as amplitude from "@amplitude/analytics-browser";
import { useMutation } from "@tanstack/react-query";
import contractService from "api/contract";
import { useNavigate } from "react-router-dom";

import { ContractFieldValues, IContract } from "lib/types/contracts";
import { IOrganization } from "lib/types/organizations";
import { IProject } from "lib/types/projects";
import { formatErrorMessage } from "lib/utils";

import { queryClient } from "components/QueryProvider";
import { ToastAction, toast } from "components/ui/toast/Toast";

import { usePage } from "../hooks";

interface IContractMutation {
  id?: number;

  successCallback?: (contract: ContractFieldValues) => void;

  providerId?: number;

  projectId?: number;
}

const useContractMutation = ({
  id,
  successCallback,
  providerId,
  projectId,
}: IContractMutation) => {
  const navigate = useNavigate();

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

      if (providerId) {
        queryClient.setQueryData(
          ["specific org", providerId?.toString()],
          (prev: IOrganization): IOrganization => {
            return {
              ...prev,
              noOfContracts: prev.noOfContracts! + 1,
            };
          }
        );
      }

      if (projectId) {
        queryClient.setQueryData(
          ["specific-project", projectId.toString()],

          (prev: IProject): IProject => ({
            ...prev,
            contractsCount: +prev.contractsCount! + 1,
          })
        );
      }

      successCallback?.(addedContract);

      toast({
        title: `Contract has been ${id ? "updated" : "added"} successfully`,
        action: (
          <ToastAction
            altText="view"
            onClick={() => navigate(`/contracts/${addedContract.id}`)}
          >
            <p>View</p>
          </ToastAction>
        ),
      });

      amplitude.track(`${id ? "Update" : "Add"} Contract Form Submission`);
    },

    onError: (err: any, newContract, context) => {
      toast({
        title: `Failed ${id ? "updating" : "adding"} contract`,
        description: formatErrorMessage(
          err?.response?.data?.data?.[0] || err?.response?.data?.message
        ),
        variant: "danger",
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
  succesCallback?: () => void,
  funderId?: string,
  projectId?: number
) => {
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

      if (funderId) {
        queryClient.setQueryData(
          ["specific org", funderId?.toString()],
          (prev: IOrganization): IOrganization => {
            return {
              ...prev,
              noOfContracts: prev.noOfContracts! - 1,
            };
          }
        );
      }

      if (projectId) {
        queryClient.setQueryData(
          ["specific-project", projectId.toString()],
          (prev: IProject): IProject => ({
            ...prev,
            contractsCount: +prev.contractsCount! - 1,
          })
        );
      }

      succesCallback?.();

      toast({
        title: "Contract deleted successfully!",
      });

      amplitude.track(`Delete Contract Performed`, {
        id: id,
      });
    },

    onError: (err: any, _, context) => {
      toast({
        title: `Failed deleting contract`,
        description: formatErrorMessage(err?.response?.data?.data?.[0]),
        variant: "danger",
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
