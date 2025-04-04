import { useMutation } from "@tanstack/react-query";
import milestoneService from "api/milestones";
import { useNavigate } from "react-router-dom";

import { queryClient } from "components/QueryProvider";
import { ToastAction, toast } from "components/ui/toast/Toast";

export const useGetAchievedMilestones = () => {
  const { mutateAsync: getAchievedMilestones, isPending } = useMutation({
    mutationFn: milestoneService.getAchievedMilestones,
  });

  return { getAchievedMilestones, isPending };
};

export const useGenerateInvoice = (succesCallback: (x: any) => void) => {
  const navigate = useNavigate();
  const { mutateAsync: generateInvoice, isPending } = useMutation({
    mutationFn: milestoneService.generateInvoice,

    onSuccess: (res) => {
      const id = res?.id;
      succesCallback(res);
      toast({
        title: `Invoice ID: ${id} successfully generated`,
        action: (
          <ToastAction
            altText="view"
            onClick={() => navigate(`/invoices/${id}`)}
          >
            View
          </ToastAction>
        ),
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
