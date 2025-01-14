import * as amplitude from "@amplitude/analytics-browser";
import { useMutation } from "@tanstack/react-query";
import organizationService from "api/organization";

import { queryClient } from "components/QueryProvider";

import { useAlert } from "../hooks";
import { OrganizationFieldTypes } from "../types/organizations";

interface IOrganizationMutation {
  orgId?: string;

  successCallback?: (id: number) => void;
}

const useOrganizationMutation = ({
  orgId,
  successCallback,
}: IOrganizationMutation) => {
  const { setAlert } = useAlert();

  const { mutateAsync: addOrganization, isPending } = useMutation({
    mutationFn: orgId
      ? (values: OrganizationFieldTypes) => organizationService.update(values)
      : organizationService.add,

    onMutate: async () => {
      queryClient.cancelQueries({ queryKey: ["organizations", 1] });

      const prevOrganizations = queryClient.getQueryData(["organizations", 1]);

      return { prevOrganizations };
    },

    onSuccess: (addedOrg) => {
      if (!orgId) {
        queryClient.setQueryData(["organizations", 1], (old: any) => {
          return {
            ...old,

            items: [...(old?.items || []), addedOrg.data.data],
          };
        });
      }

      setAlert({
        status: "success",

        message: `Organization ${orgId ? "updated" : "added"} successfully`,

        title: "Success!",
      });

      console.log(addedOrg);

      successCallback?.(addedOrg.data.data.id);

      amplitude.track(
        `${orgId ? "Update" : "Add"} Organization Form Submission`
      );
    },

    onError: (err: any, newOrg, context) => {
      queryClient.setQueryData(
        ["organizations", 1],

        context?.prevOrganizations
      );

      setAlert({
        status: "error",

        title: `Failed ${orgId ? "updating" : "adding"} organization`,

        message: err?.response?.data?.data,
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations", 1] });
    },
  });
  return { addOrganization, isPending };
};

export default useOrganizationMutation;
