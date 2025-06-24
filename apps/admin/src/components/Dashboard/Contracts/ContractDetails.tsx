import type { IContract } from "@/lib/types/contracts";
import { formatDate } from "@/lib/utils";

import Details from "@/components/ui/details";

const ContractDetails = ({ contract }: { contract: IContract }) => {
  const {
    project,
    projectId,
    targetNoOfBenefeciaries,
    provider,
    startDate,
    endDate,
    funder,
  } = contract;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[20px] font-semibold">Contract Details</p>
        {/* <Link to="#" className="font-semibold underline underline-offset-4">
          View more
        </Link> */}
      </div>

      <Details.Container>
        <Details.Content
          label="Project"
          value={project as string}
          link={`/projects/${projectId}`}
        />
        <Details.Content
          label="Total # of beneficiaries"
          value={targetNoOfBenefeciaries.toString()}
        />
        <Details.Content
          label="Start date"
          value={formatDate(startDate, "dd LLL yyyy")}
        />
        <Details.Content
          label="Funder"
          value={funder.name}
          link={`/funders/?id=${funder.id}`}
        />
        <Details.Content
          label="Provider"
          value={provider.name}
          link={`/providers/${provider.id}`}
        />
        <Details.Content
          label="End date"
          value={formatDate(endDate, "dd LLL yyyy")}
        />
      </Details.Container>
    </div>
  );
};

export default ContractDetails;
