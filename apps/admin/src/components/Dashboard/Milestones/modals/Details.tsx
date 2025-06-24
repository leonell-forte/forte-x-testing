import { useQuery } from "@tanstack/react-query";
import milestoneService from "@/api/milestones";

import type { IBeneficiaries } from "@/lib/types/beneficiaries";
import type { Evidence } from "@/lib/types/evidence";
import { formatCurrency, formatDate } from "@/lib/utils";

import InfoVertical from "@/components/ui/info-vertical/InfoVertical";
import ReferenceLink from "@/components/ui/reference-link/ReferenceLink";
import Spinner from "@/components/ui/spinner/spinner";

type DetailsProps = {
  beneficiary?: IBeneficiaries;
  evidenceData?: Evidence;
  milestoneId: string;
};

const Details = ({ beneficiary, evidenceData, milestoneId }: DetailsProps) => {
  const { data: milestone, isLoading } = useQuery({
    queryKey: ["milestone-details", milestoneId],

    queryFn: () => milestoneService.getOne(milestoneId!),

    enabled: Boolean(milestoneId),
  });

  if (isLoading)
    return (
      <div className="flex h-56 w-full items-center justify-center">
        <Spinner />
      </div>
    );

  return (
    <div className="mb-10 space-y-8">
      <div className="grid grid-cols-2 gap-6">
        <InfoVertical label="Milestone ID">
          <ReferenceLink hrefLink={`/milestones/${milestoneId}`}>
            {milestoneId}
          </ReferenceLink>
        </InfoVertical>
        <InfoVertical label="Contract Name">
          <ReferenceLink hrefLink={`/contracts/${milestone?.contract.id}`}>
            {milestone?.contract.name}
          </ReferenceLink>
        </InfoVertical>
        <InfoVertical label="Reference">
          <ReferenceLink hrefLink={`/beneficiaries/${beneficiary?.id}`}>
            {beneficiary?.firstName} {beneficiary?.lastName}
          </ReferenceLink>
        </InfoVertical>
      </div>

      <hr />

      <div className="grid grid-cols-3 gap-6">
        <InfoVertical label="Evidence">
          {evidenceData?.file.filename}
        </InfoVertical>
        <InfoVertical label="Outcome name">
          {milestone?.outcome.name}
        </InfoVertical>
        <InfoVertical label="Outcome type">
          <p>Per {milestone?.type}</p>
        </InfoVertical>
        <InfoVertical label="Cost">
          {formatCurrency(Number(milestone?.cost) || 0)}
        </InfoVertical>
        <InfoVertical label="Date created">
          {formatDate(new Date(evidenceData?.createdAt || ""), "dd LLLL yyyy")}
        </InfoVertical>
      </div>
    </div>
  );
};

export default Details;
