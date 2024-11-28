// import organizationService from "@/api/organization";
// import { queryClient } from "@/components/QueryProvider";
// import { OrganizationFieldTypes } from "@/pages/Organizations/types";
// import { useMutation } from "@tanstack/react-query";
// import React from "react";
// import { useAlert } from "../hooks";

// const useOrganizationMutation = (orgId?: string) => {
//     const { setAlert } = useAlert();

//     const { mutateAsync: addOrganization, isPending } = useMutation({
//         mutationFn: orgId
//           ? (values: OrganizationFieldTypes) => organizationService.update(values)
//           : organizationService.add,

//         onMutate: async () => {
//           queryClient.cancelQueries({ queryKey: ["organizations", 1] });

//           const prevOrganizations = queryClient.getQueryData([
//             "organizations",

//             1,
//           ]);

//           return { prevOrganizations };
//         },

//         onSuccess: (addedOrg) => {
//           if (!orgId) {
//             queryClient.setQueryData(["organizations", 1], (old: any) => {
//               return {
//                 ...old,

//                 items: [...(old?.items || []), addedOrg.data.data],
//               };
//             });
//           }

//           setAlert({
//             status: "success",

//             message: `Organization ${orgId ? "updated" : "added"} successfully`,

//             title: "Success!",
//           });

//           onClose();

//           reset();

//           amplitude.track(
//             `${orgId ? "Update" : "Add"} Organization Form Submission`,
//           );
//         },

//         onError: (err: any, newOrg, context) => {
//           queryClient.setQueryData(
//             ["organizations", page],

//             context?.prevOrganizations,
//           );

//           setAlert({
//             status: "error",

//             title: `Failed ${orgId ? "updating" : "adding"} organization`,

//             message: err?.response?.data?.message,
//           });
//         },

//         onSettled: () => {
//           queryClient.invalidateQueries({ queryKey: ["organizations", page] });
//         },
//       });
//   return {};
// };

// export default useOrganizationMutation;

export const wer = "";
