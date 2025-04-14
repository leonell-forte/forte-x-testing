import * as amplitude from "@amplitude/analytics-browser";
import { useMutation } from "@tanstack/react-query";
import beneficiariesService from "api/beneficiaries";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

import { formatErrorMessage } from "lib/utils";

import { queryClient } from "components/QueryProvider";
import { ToastAction, toast } from "components/ui/toast/Toast";

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
  const navigate = useNavigate();

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
      successCallback?.(addedBeneficiary.data.data?.id);
      console.log(addedBeneficiary);

      toast({
        title: `Beneficiary ${beneficiaryId ? "updated" : "added"} successfully`,
        ...(!beneficiaryId && {
          action: (
            <ToastAction
              altText="view"
              onClick={() =>
                navigate(`/beneficiaries/${addedBeneficiary.data.data?.id}`)
              }
            >
              <p>View</p>
            </ToastAction>
          ),
        }),
      });

      amplitude.track(
        `${beneficiaryId ? "Update" : "Add"} Beneficiary Form Submission`
      );
    },

    onError: (err: any) => {
      toast({
        title: `Failed ${beneficiaryId ? "updating" : "adding"} beneficiary`,
        description:
          formatErrorMessage(err?.response?.data?.data?.[0]) ||
          err?.response?.data?.message,
        variant: "danger",
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: beneficiaryQuery });
      queryClient.invalidateQueries({
        queryKey: ["beneficiary-details"],
      });
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

export const useDeleteBeneficiaryMutation = (successCallback?: () => void) => {
  const { mutateAsync: deleteBeneficiary, isPending } = useMutation({
    mutationFn: beneficiariesService.delete,

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["beneficiaries"] });
    },

    onSuccess: (res) => {
      console.log(res);
      successCallback?.();

      toast({ title: "Beneficiary deleted successfully" });

      // amplitude.track(`Delete Beneficiary Performed`, {
      //   id: id,
      // });
    },

    onError: (err: any) => {
      toast({
        title: "Failed deleting beneficiary",
        description: err?.response?.data?.message,
        variant: "danger",
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["beneficiaries"] });
    },
  });

  return { deleteBeneficiary, isPending };
};

export const useBulkStatusUpdateMutation = (
  status: string,

  ids: number[],

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

          items: old?.items?.map((item) => {
            if (ids.includes(item.id)) {
              return { ...item, status };
            }
            return { ...item };
          }),
        })
      );

      successCallback?.();

      toast({ title: "Updated selected beneficiaries status" });

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
