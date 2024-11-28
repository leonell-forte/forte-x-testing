import contractService from "../../api/contract";
import { queryClient } from "../../components/QueryProvider";
import {
  ContractFieldValues,
  IContractDetails,
} from "../../lib/types/contracts";
import { useMutation } from "@tanstack/react-query";
import { useAlert } from "../hooks";
import * as amplitude from "@amplitude/analytics-browser";

interface IContractMutation {
  successCallback?: () => void;
}

const useContractMutation = ({ successCallback }: IContractMutation) => {
  const { setAlert } = useAlert();

  const { mutateAsync: addContract, isPending } = useMutation({
    mutationFn: contractService.add,

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["contracts"] });

      const previousContracts = queryClient.getQueryData(["projects"]);

      return { previousContracts };
    },

    onSuccess: (addedContract: ContractFieldValues) => {
      queryClient.setQueryData(
        ["contracts", 1, "", ""],

        (old: { items: IContractDetails[] }) => {
          return {
            ...old,

            items: [...(old?.items || []), addedContract],
          };
        },
      );

      successCallback?.();

      setAlert({
        title: "Success!",

        status: "success",

        message: "Contract has been added successfully",
      });

      amplitude.track(`Add Contract Form Submission`);
    },

    onError: (err: any, newContract, context) => {
      setAlert({
        status: "error",

        title: "Failed adding new contract",

        message: err?.response?.data?.message,
      });

      queryClient.setQueryData(
        ["contracts", 1, "", ""],

        context?.previousContracts,
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts", 1, "", ""] });
    },
  });

  return { addContract, isPending };
};

export default useContractMutation;
