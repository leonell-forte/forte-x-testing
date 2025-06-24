import { useQuery } from "@tanstack/react-query";
import { DownloadIcon } from "lucide-react";
import { useParams } from "react-router-dom";

import organizationService from "@/api/organization";
import payoutsService from "@/api/payouts";
import ApprovePayout from "@/components/Dashboard/Payouts/ApprovePayout";
import BankDetails from "@/components/Dashboard/Payouts/BankDetails";
import PayoutMilestones from "@/components/Dashboard/Payouts/PayoutMilestones";
import { useProfile } from "@/components/ProfileContext";
import { BreadCrumb } from "@/components/ui/breadcrumb/Breadcrumb";
import Button from "@/components/ui/button";
import Status from "@/components/ui/status";
import { Payout, PayoutStatus } from "@/lib/types/payouts";
import { getStatusVariant } from "@/lib/utils";
// Import the print styles
import "@/styles/print.css";
import { downloadPayoutPdf } from "@/utils/payout-pdf";

const IndividualPayoutsPage = () => {
  const params = useParams();

  const { profile } = useProfile();

  const isForteUser = profile?.organization === "Forte";

  const { data: payout, isLoading } = useQuery<Payout>({
    queryKey: ["payout", params.id],
    queryFn: () => payoutsService.getById(params.id as string),
  });

  const { data: bankDetails } = useQuery({
    queryKey: ["bank-details", payout?.provider?.id],
    queryFn: () =>
      organizationService.getBankDetails(
        payout?.provider?.id?.toString() as string
      ),
    enabled: !!payout?.provider?.id,
  });

  const handleDownloadPdf = () => {
    if (payout) {
      downloadPayoutPdf(payout, bankDetails);
    }
  };

  return (
    <>
      <BreadCrumb href="/payouts">Payouts</BreadCrumb>
      <BreadCrumb>Payout ID#{payout?.id}</BreadCrumb>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <p className="text-[24px] font-semibold">Payout ID#{payout?.id}</p>
            <Status variant={getStatusVariant(payout?.status as PayoutStatus)}>
              {payout?.status}
            </Status>
          </div>
          <div className="flex gap-4">
            <Button buttonType="secondary" onClick={handleDownloadPdf}>
              <DownloadIcon />
              Download
            </Button>
            {isForteUser && payout?.status === "draft" && (
              <ApprovePayout id={params.id as string} />
            )}
          </div>
        </div>

        <BankDetails
          providerId={payout?.provider.id?.toString() as string}
          total={Number(payout?.amount)}
        />

        <PayoutMilestones
          milestones={payout?.milestones || []}
          loading={isLoading}
        />
      </div>
    </>
  );
};

export default IndividualPayoutsPage;
