import * as amplitude from "@amplitude/analytics-browser";
import { useMutation } from "@tanstack/react-query";
import organizationService from "@/api/organization";

import { useAlert } from "@/lib/hooks";
import type { Partner } from "@/lib/types/organizations";
import { formatErrorMessage } from "@/lib/utils";

import { queryClient } from "@/components/QueryProvider";

type OrganizationMutation = {
  orgId?: string;

  successCallback?: () => void;
};

export const usePartnerMutation = ({
  orgId,
  successCallback,
}: OrganizationMutation) => {
  const { setAlert } = useAlert();
  const queryKey = ["partners", orgId];
  const { mutateAsync: addPartner, isPending } = useMutation({
    mutationFn: organizationService.addPartner,

    onMutate: async () => {
      queryClient.cancelQueries({ queryKey });

      const prevPartners = queryClient.getQueryData(queryKey);

      return { prevPartners };
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });

      setAlert({
        status: "success",
        message: "Partner added successfully!",
        title: "Success!",
      });

      successCallback?.();

      amplitude.track("Add Partner Form Submission", {
        id: orgId,
      });
    },

    onError: (err: any, _, context) => {
      queryClient.setQueryData(queryKey, context?.prevPartners);
      setAlert({
        status: "error",

        title: `Failed adding partner to organization`,

        message: formatErrorMessage(
          err?.response?.data?.data?.[0] || err?.response.data.message
        ),
      });
    },
  });

  return { addPartner, isPending };
};

// ...existing code...

export const useDeletePartnerMutation = (
  orgId: string,
  successCallback?: () => void
) => {
  const { setAlert } = useAlert();
  const queryKey = ["partners", orgId];

  const { mutateAsync: deletePartner, isPending } = useMutation({
    mutationFn: organizationService.deletePartner,

    onMutate: async (partnerId) => {
      await queryClient.cancelQueries({ queryKey });
      const previousPartners = queryClient.getQueryData<Partner[]>(queryKey);

      queryClient.setQueryData<Partner[]>(
        queryKey,
        (old) => old?.filter((partner) => partner.id !== partnerId) ?? []
      );

      return { previousPartners };
    },

    onSuccess: (_, partnerId) => {
      setAlert({
        status: "success",
        message: "Partner deleted successfully!",
        title: "Success!",
      });

      successCallback?.();

      amplitude.track("Delete Partner Performed", {
        organizationId: orgId,
        partnerId,
      });
    },

    onError: (err: any, _, context) => {
      queryClient.setQueryData(queryKey, context?.previousPartners);

      setAlert({
        status: "error",
        title: "Failed to delete partner",
        message: formatErrorMessage(
          err?.response?.data?.data?.[0] || err?.response?.data?.message
        ),
      });
    },
  });

  return { deletePartner, isPending };
};
