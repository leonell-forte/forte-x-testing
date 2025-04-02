import { useMutation } from "@tanstack/react-query";
import milestoneService from "api/milestones";

import { queryClient } from "components/QueryProvider";
import { ToastAction, toast } from "components/ui/toast/Toast";

export const useGetAchievedMilestones = () => {
  const { mutateAsync: getAchievedMilestones, isPending } = useMutation({
    mutationFn: milestoneService.getAchievedMilestones,
  });

  return { getAchievedMilestones, isPending };
};

export const useGenerateInvoice = (succesCallback: (x: any) => void) => {
  const { mutateAsync: generateInvoice, isPending } = useMutation({
    mutationFn: milestoneService.generateInvoice,

    onSuccess: (res) => {
      succesCallback(res);
      toast({
        title: "Invoice ID: 203432 successfully generated",
        action: <ToastAction altText="view">View</ToastAction>,
      });
    },

    onError: () => {
      toast({
        variant: "danger",
        title: "Failed generating invoice",
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });

  return { generateInvoice, isPending };
};

export default useGetAchievedMilestones;
