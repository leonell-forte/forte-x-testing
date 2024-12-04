import { useAlert } from "../hooks";
import { useMutation } from "@tanstack/react-query";
import beneficiariesServce from "../../api/beneficiaries";
import { queryClient } from "../../components/QueryProvider";
import * as amplitude from "@amplitude/analytics-browser";

interface IBeneficiaryMutationProps {
  beneficiaryId?: number;

  successCallback?: () => void;
}

const useBeneficiaryMutation = ({
  beneficiaryId,

  successCallback,
}: IBeneficiaryMutationProps) => {
  const { setAlert } = useAlert();

  const { mutateAsync: addBeneficiary, isPending } = useMutation({
    mutationFn: beneficiariesServce.add,

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["beneficiaries"] });

      const previousBeneficiaries = queryClient.getQueryData(["beneficiaries"]);

      return { previousBeneficiaries };
    },

    onSuccess: (addedBeneficiary) => {
      queryClient.setQueryData(["beneficiaries"], () => {
        return addedBeneficiary.data.data;
      });

      successCallback?.();

      setAlert({
        title: "Success!",

        message: `Beneficiary added successfully`,

        status: "success",
      });

      amplitude.track(
        `${beneficiaryId ? "Update" : "Add"} Beneficiary Form Submission`,
      );
    },

    onError: (err: any, newBeneficiary, context) => {
      setAlert({
        title: `Failed ${beneficiaryId ? "updating" : "adding"} beneficiary`,

        message: err?.response?.data?.message,

        status: "error",
      });

      queryClient.setQueryData(
        ["beneficiaries"],

        context?.previousBeneficiaries,
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["beneficiaries"] });
    },
  });

  return { addBeneficiary, isPending };
};

export default useBeneficiaryMutation;
