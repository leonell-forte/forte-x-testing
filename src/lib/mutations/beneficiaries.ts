import * as amplitude from "@amplitude/analytics-browser";
import { useMutation } from "@tanstack/react-query";
import beneficiariesService from "api/beneficiaries";
import { format } from "date-fns";

import { formatErrorMessage } from "lib/utils";

import { queryClient } from "components/QueryProvider";

import { useAlert, usePage } from "../hooks";
import { IBeneficiaries } from "../types/beneficiaries";

interface IBeneficiaryMutationProps {
  beneficiaryId?: number;

  successCallback?: (id?: number) => void;
}

export const useBeneficiaryMutation = ({
  beneficiaryId,

  successCallback,
}: IBeneficiaryMutationProps) => {
  const { setAlert } = useAlert();

  const { page } = usePage();

  const beneficiaryQuery = [
    "beneficiaries",
    "",
    +page,
    {
      project: "",

      status: "",

      provider: "",

      riskLevel: "",

      // startDate: "",
    },
  ];

  const { mutateAsync: addBeneficiary, isPending } = useMutation({
    mutationFn: beneficiaryId
      ? beneficiariesService.update
      : beneficiariesService.add,

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: beneficiaryQuery });

      const previousBeneficiaries = queryClient.getQueryData(beneficiaryQuery);

      return { previousBeneficiaries };
    },

    onSuccess: (addedBeneficiary) => {
      queryClient.setQueryData(beneficiaryQuery, () => {
        return addedBeneficiary.data.data;
      });

      queryClient.setQueryData(
        ["specific-beneficiary", beneficiaryId],

        () => addedBeneficiary.data.data
      );

      successCallback?.(addedBeneficiary.data.data?.id);

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

        message:
          formatErrorMessage(err?.response?.data?.data?.[0]) ||
          err?.response?.data?.message,

        status: "error",
      });

      queryClient.setQueryData(
        beneficiaryQuery,

        context?.previousBeneficiaries
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: beneficiaryQuery });
    },
  });

  return { addBeneficiary, isPending };
};

export const useImportBeneficiaryMutation = ({
  successCallback,
}: IBeneficiaryMutationProps) => {
  const { setAlert } = useAlert();

  const { page } = usePage();

  const beneficiaryQuery = [
    "beneficiaries",
    "",
    +page,
    {
      project: "",

      status: "",

      provider: "",

      riskLevel: "",

      // startDate: "",
    },
  ];

  const { mutateAsync: importBeneficiaries, isPending } = useMutation({
    mutationFn: beneficiariesService.importBeneficiaries,

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: beneficiaryQuery });

      const previousBeneficiaries = queryClient.getQueryData(beneficiaryQuery);

      return { previousBeneficiaries };
    },

    onSuccess: (addedBeneficiary) => {
      queryClient.setQueryData(beneficiaryQuery, () => {
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
      const errorMessages = err?.response?.data?.errorFields
        ? Object.values(err?.response?.data?.errorFields).map(
            (item) => item as string
          )
        : null;

      console.log(errorMessages);

      setAlert({
        title: `Failed importing beneficiary`,

        message: errorMessages
          ? errorMessages.join("\n")
          : err?.response?.data?.message,

        status: "error",
      });

      queryClient.setQueryData(
        beneficiaryQuery,

        context?.previousBeneficiaries
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: beneficiaryQuery });
    },
  });

  return { importBeneficiaries, isPending };
};

export const useDeleteBeneficiaryMutation = (
  id: number,

  successCallback?: () => void
) => {
  const { setAlert } = useAlert();

  const { page, setPage } = usePage();

  const beneficiaryQuery = [
    "beneficiaries",
    "",
    +page,
    {
      project: "",

      status: "",

      provider: "",

      riskLevel: "",

      // startDate: "",
    },
  ];

  const { mutateAsync: deleteBeneficiary, isPending } = useMutation({
    mutationFn: beneficiariesService.delete,

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: beneficiaryQuery });

      const previousBeneficiaries = queryClient.getQueryData<IBeneficiaries[]>([
        "beneficiaries",
      ]);

      return { previousBeneficiaries };
    },

    onSuccess: () => {
      queryClient.setQueryData(
        beneficiaryQuery,

        (old: { items: IBeneficiaries[] }) => {
          // sets page to previous page if current list is empty
          if (old.items.length === 1 && +page !== 1) {
            setPage(page - 1);
          }

          return {
            ...old,

            itemss: old?.items?.filter((item) => item.id !== id),
          };
        }
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
        beneficiaryQuery,

        context?.previousBeneficiaries
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: beneficiaryQuery });
    },
  });

  return { deleteBeneficiary, isPending };
};

export const useBulkStatusUpdateMutation = (
  status: string,

  successCallback?: () => void
) => {
  const { setAlert } = useAlert();

  const { page } = usePage();

  const beneficiaryQuery = [
    "beneficiaries",
    "",
    +page,
    {
      project: "",

      status: "",

      provider: "",

      riskLevel: "",

      // startDate: "",
    },
  ];

  const { mutateAsync: updateStatus, isPending } = useMutation({
    mutationFn: beneficiariesService.bulkStatusUpdate,

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: beneficiaryQuery });

      const previousBeneficiaries = queryClient.getQueryData<IBeneficiaries[]>([
        "beneficiaries",
      ]);

      return { previousBeneficiaries };
    },

    onSuccess: () => {
      queryClient.setQueryData(
        beneficiaryQuery,

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
        beneficiaryQuery,

        context?.previousBeneficiaries
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: beneficiaryQuery });
    },
  });

  return { updateStatus, isPending };
};

export const useExportEvidenceMutation = () => {
  const { setAlert } = useAlert();

  const { mutateAsync: exportEvidence, isPending } = useMutation({
    mutationFn: beneficiariesService.bulkEvidenceExport,

    onSuccess: (response) => {
      const timestamp = format(new Date(), "MM_dd_yy-HH_mm");
      const fileName = `Evidences_Export-${timestamp}.zip`;
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/zip" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    },

    onError: (err: any) => {
      setAlert({
        title: "Error",

        message: err?.response?.data?.message,

        status: "error",
      });
    },
  });

  return { exportEvidence, isPending };
};

export const useExportBeneficiaries = () => {
  const { setAlert } = useAlert();

  const { mutateAsync: exportBeneficiaries, isPending } = useMutation({
    mutationFn: beneficiariesService.bulkExportBeneficiaries,

    onSuccess: (response) => {
      const timestamp = format(new Date(), "MM_dd_yy-HH_mm");
      const fileName = `Beneficiaries_Export-${timestamp}.csv`;
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    },

    onError: (err: any) => {
      setAlert({
        title: "Error",

        message: err?.response?.data?.message,

        status: "error",
      });
    },
  });

  return { exportBeneficiaries, isPending };
};
