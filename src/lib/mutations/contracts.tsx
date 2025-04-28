import * as amplitude from "@amplitude/analytics-browser";
import { useMutation } from "@tanstack/react-query";
import contractService from "api/contract";
import { useNavigate } from "react-router-dom";

import {
  ContractFieldValues,
  IContract,
  StatusType,
} from "lib/types/contracts";
import { IOrganization } from "lib/types/organizations";
import { IProject } from "lib/types/projects";
import { formatErrorMessage } from "lib/utils";

import { queryClient } from "components/QueryProvider";
import { ToastAction, toast } from "components/ui/toast/Toast";

import { usePage } from "../hooks";

interface IContractMutation {
  id?: number;

  successCallback?: (contract: IContract) => void;

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

    onSuccess: (addedContract: IContract, values: ContractFieldValues) => {
      queryClient.setQueryData(
        contractQuery,

        (old: { items: IContract[] }) => {
          return {
            ...old,

            items: [...(old?.items || []), addedContract],
          };
        }
      );

      if (id) {
        queryClient.setQueryData(
          ["specific-contract", id.toString()],
          (old: IContract): IContract => {
            const newData = {
              ...old,
              ...addedContract,
              name: values.name,
              outcomes: addedContract.outcomes.map((item, index) => ({
                ...item,
                id: item.id,
                projectOutcomeId: item.projectOutcomeId,
                outcome: addedContract.outcomeNames?.[index],
              })),
            };

            return newData;
          }
        );
      }

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

type UpdateContractMutation = {
  id: string;
  callBack?: () => void;
};

export const useUpdateContractStatusMutation = ({
  id,
  callBack,
}: UpdateContractMutation) => {
  const { mutateAsync: updateContract, isPending } = useMutation({
    mutationFn: (status: StatusType) =>
      contractService.changeStatus(id, status),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["specific-contract", id] });

      const previousContracts = queryClient.getQueryData<IContract[]>([
        "specific-contract",
        id,
      ]);

      return { previousContracts };
    },

    onSuccess: (result, values, { previousContracts }) => {
      queryClient.setQueryData(["specific-contract", id], () => {
        return { ...previousContracts, status: values };
      });
      toast({
        title: "Contract status updated successfully!",
      });
      callBack?.();
    },

    onError: (err: any, _, context) => {
      toast({
        title: "Error updating contract status!",
        description: formatErrorMessage(err?.response?.data?.data?.[0]),
        variant: "danger",
      });

      callBack?.();
    },

    onSettled: () => {},
  });

  return { updateContract, isPending };
};

export default useContractMutation;
