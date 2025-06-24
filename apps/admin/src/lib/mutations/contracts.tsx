import * as amplitude from "@amplitude/analytics-browser";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import contractService from "@/api/contract";
import { queryClient } from "@/components/QueryProvider";
import { ToastAction, toast } from "@/components/ui/toast/Toast";
import { usePage } from "@/lib/hooks";
import type {
  ContractFieldValues,
  IContract,
  StatusType,
} from "@/lib/types/contracts";
import type { IOrganization } from "@/lib/types/organizations";
import type { IProject } from "@/lib/types/projects";
import { formatErrorMessage } from "@/lib/utils";

interface IContractMutation {
  id?: string;

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

    onError: (err: any, _, context) => {
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
  id?: string,
  onSuccess?: () => void,
  funderId?: string,
  projectId?: number
) => {
  const { page, setPage } = usePage();

  // Create a more flexible query key matcher that will match all contract queries
  // This ensures we update all relevant contract lists in the cache
  const contractsQueryKeyPrefix = ["contracts"];

  const { mutateAsync: deleteContract, isPending } = useMutation({
    mutationFn: (contractId: string) => contractService.delete(contractId),

    onMutate: async () => {
      // Cancel all queries that start with the contracts prefix
      await queryClient.cancelQueries({
        queryKey: contractsQueryKeyPrefix,
        exact: false,
      });

      // Store all matching queries to restore in case of error
      const previousQueries = new Map();

      // Find all contract queries in the cache
      const queryCache = queryClient.getQueryCache();
      const contractQueries = queryCache.findAll({
        queryKey: contractsQueryKeyPrefix,
        exact: false,
      });

      // Store the current state of each query
      contractQueries.forEach((query) => {
        previousQueries.set(
          query.queryKey,
          queryClient.getQueryData(query.queryKey)
        );
      });

      // Optimistically update all contract queries
      contractQueries.forEach((query) => {
        const data = queryClient.getQueryData(query.queryKey);
        if (data && typeof data === "object" && "items" in data) {
          queryClient.setQueryData(query.queryKey, {
            ...data,
            items: (data.items as IContract[]).filter((item) => item.id !== id),
          });
        }
      });

      return { previousQueries };
    },

    onSuccess: () => {
      // If we're on a page that's now empty (except page 1), go to previous page
      const currentPageQuery = [
        "contracts",
        +page || 1,
        "",
        {
          status: "",
          project: "",
          date: "",
        },
      ];

      const currentPageData = queryClient.getQueryData<{ items: IContract[] }>(
        currentPageQuery
      );
      if (currentPageData?.items?.length === 0 && +page !== 1) {
        setPage(page - 1);
      }

      if (funderId) {
        queryClient.setQueryData(
          ["specific org", funderId.toString()],
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

      if (onSuccess) {
        onSuccess();
      }

      toast({
        title: "Contract deleted successfully!",
      });

      amplitude.track("Delete Contract Performed", {
        contractId: id,
      });
    },

    onError: (err: any, _: any, context: any) => {
      toast({
        title: "Failed deleting contract",
        description: formatErrorMessage(err?.response?.data?.data?.[0]),
        variant: "danger",
      });

      // Restore all previous queries from the context
      if (context?.previousQueries) {
        context.previousQueries.forEach((data: any, queryKey: any) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },

    onSettled: () => {
      // Invalidate all contract queries to ensure data consistency
      queryClient.invalidateQueries({
        queryKey: contractsQueryKeyPrefix,
        exact: false,
      });
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

    onSuccess: (_, values, { previousContracts }) => {
      queryClient.setQueryData(["specific-contract", id], () => {
        return { ...previousContracts, status: values };
      });
      toast({
        title: "Contract status updated successfully!",
      });
      callBack?.();
    },

    onError: (err: any) => {
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
