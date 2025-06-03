import React from "react";

import { IBeneficiaries } from "lib/types/beneficiaries";
import { Evidence } from "lib/types/evidence";
import { IMilestone } from "lib/types/milestones";
import { formatCurrency, formatDate } from "lib/utils";

import InfoVertical from "components/ui/info-vertical/InfoVertical";
import ReferenceLink from "components/ui/reference-link/ReferenceLink";

type DetailsProps = {
  beneficiary?: IBeneficiaries;
  evidenceData?: Evidence;
  milestone: IMilestone;
};

const Details = ({ beneficiary, evidenceData, milestone }: DetailsProps) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-6">
        <InfoVertical label="Milestone ID">
          <ReferenceLink hrefLink={`/milestones/${milestone?.id}`}>
            {milestone?.id}
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
