import * as amplitude from "@amplitude/analytics-browser";
import { useMutation } from "@tanstack/react-query";
import beneficiariesService from "api/beneficiaries";

import { queryClient } from "components/QueryProvider";

import { useAlert } from "../hooks";
import { IBeneficiaries } from "../types/beneficiaries";

interface IBeneficiaryMutationProps {
  beneficiaryId?: number;

  successCallback?: () => void;
}

export const useBeneficiaryMutation = ({
  beneficiaryId,

  successCallback,
}: IBeneficiaryMutationProps) => {
  const { setAlert } = useAlert();

  const { mutateAsync: addBeneficiary, isPending } = useMutation({
    mutationFn: beneficiaryId
      ? beneficiariesService.update
      : beneficiariesService.add,

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

        message: `Beneficiary ${beneficiaryId ? "updated" : "added"} successfully`,

        status: "success",
      });

      amplitude.track(
        `${beneficiaryId ? "Update" : "Add"} Beneficiary Form Submission`
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

        context?.previousBeneficiaries
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["beneficiaries"] });
    },
  });

  return { addBeneficiary, isPending };
};

export const useImportBeneficiaryMutation = ({
  successCallback,
}: IBeneficiaryMutationProps) => {
  const { setAlert } = useAlert();

  const { mutateAsync: importBeneficiaries, isPending } = useMutation({
    mutationFn: beneficiariesService.importBeneficiaries,

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

        message: `Beneficiary imported successfully`,

        status: "success",
      });

      amplitude.track(`Import Beneficiary Form Submission`);
    },

    onError: (err: any, newBeneficiary, context) => {
      setAlert({
        title: `Failed importing beneficiary`,

        message: err?.response?.data?.message,

        status: "error",
      });

      queryClient.setQueryData(
        ["beneficiaries"],

        context?.previousBeneficiaries
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["beneficiaries"] });
    },
  });

  return { importBeneficiaries, isPending };
};

export const useDeleteBeneficiaryMutation = (
  id: number,

  successCallback?: () => void
) => {
  const { setAlert } = useAlert();

  const { mutateAsync: deleteBeneficiary, isPending } = useMutation({
    mutationFn: beneficiariesService.delete,

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["beneficiaries"] });

      const previousBeneficiaries = queryClient.getQueryData<IBeneficiaries[]>([
        "beneficiaries",
      ]);

      return { previousBeneficiaries };
    },

    onSuccess: () => {
      queryClient.setQueryData(
        ["beneficiaries"],

        (old: { items: IBeneficiaries[] }) => ({
          ...old,

          itemss: old?.items?.filter((item) => item.id !== id),
        })
      );

      successCallback?.();

      setAlert({
        title: "Beneficiary deleted",

        message: "Beneficiary deleted successfully",

        status: "success",
      });

      amplitude.track(`Delete Beneficiary Performed`, {
        id: id,
      });
    },

    onError: (err: any, _, context) => {
      setAlert({
        title: "Failed deleting beneficiary",

        message: err?.response?.data?.message,

        status: "error",
      });

      queryClient.setQueryData(
        ["beneficiaries"],

        context?.previousBeneficiaries
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["beneficiaries"] });
    },
  });

  return { deleteBeneficiary, isPending };
};

export const useBulkStatusUpdateMutation = (
  status: string,

  successCallback?: () => void
) => {
  const { setAlert } = useAlert();

  const { mutateAsync: updateStatus, isPending } = useMutation({
    mutationFn: beneficiariesService.bulkStatusUpdate,

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["beneficiaries"] });

      const previousBeneficiaries = queryClient.getQueryData<IBeneficiaries[]>([
        "beneficiaries",
      ]);

      return { previousBeneficiaries };
    },

    onSuccess: () => {
      queryClient.setQueryData(
        ["beneficiaries"],

        (old: { items: IBeneficiaries[] }) => ({
          ...old,

          items: old?.items?.map((item) => ({ ...item, status })),
        })
      );

      successCallback?.();

      setAlert({
        title: "Success!",

        message: "Beneficiaries status updated.",

        status: "success",
      });

      amplitude.track(`Bulk Beneficiary Status Performed`);
    },

    onError: (err: any, _, context) => {
      setAlert({
        title: "Error",

        message: err?.response?.data?.message,

        status: "error",
      });

      queryClient.setQueryData(
        ["beneficiaries"],

        context?.previousBeneficiaries
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["beneficiaries"] });
    },
  });

  return { updateStatus, isPending };
};
