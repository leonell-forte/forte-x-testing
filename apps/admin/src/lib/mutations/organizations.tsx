import * as amplitude from "@amplitude/analytics-browser";
import { capitalize } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import organizationService from "@/api/organization";
import { queryClient } from "@/components/QueryProvider";
import { ToastAction, toast } from "@/components/ui/toast/Toast";
import type { OrganizationFieldTypes } from "@/lib/types/organizations";
import { formatErrorMessage } from "@/lib/utils";

interface IOrganizationMutation {
  orgId?: string;

  successCallback?: (id: number) => void;

  type?: string;
}

const useOrganizationMutation = ({
  orgId,
  successCallback,
  type,
}: IOrganizationMutation) => {
  const navigate = useNavigate();

  const { mutateAsync: addOrganization, isPending } = useMutation({
    mutationFn: orgId
      ? (values: OrganizationFieldTypes) => organizationService.update(values)
      : organizationService.add,

    onMutate: async () => {
      queryClient.cancelQueries({ queryKey: ["organizations"] });

      const prevOrganizations = queryClient.getQueryData(["organizations"]);

      return { prevOrganizations };
    },

    onSuccess: (addedOrg) => {
      if (!orgId) {
        queryClient.setQueryData(["organizations"], (old: any) => {
          return {
            ...old,

            items: [...(old?.items || []), addedOrg.data.data],
          };
        });
      }

      successCallback?.(addedOrg.data.data.id);

      toast({
        title: `${capitalize(type || "organization")} ${orgId ? "updated" : "added"} successfully`,
        action: (
          <ToastAction
            altText="view"
            onClick={() => navigate(`/${type}s/${addedOrg.data.data?.id}`)}
          >
            <p>View</p>
          </ToastAction>
        ),
      });

      amplitude.track(
        `${orgId ? "Update" : "Add"} Organization Form Submission`
      );
    },

    onError: (err: any, _, context) => {
      queryClient.setQueryData(
        ["organizations"],

        context?.prevOrganizations
      );

      toast({
        title: `Failed ${orgId ? "updating" : "adding"} ${type}`,
        description: formatErrorMessage(err?.response?.data?.data?.[0]),
        variant: "danger",
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      queryClient.invalidateQueries({ queryKey: ["specific org"] });
    },
  });
  return { addOrganization, isPending };
};

// const usePartnerMutation = () => {};

export default useOrganizationMutation;
