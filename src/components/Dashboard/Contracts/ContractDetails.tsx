import { Link } from "react-router-dom";

import { ReactComponent as LinkIcon } from "assets/images/icons/link.svg";

import { IContract } from "lib/types/contracts";
import { formatDate } from "lib/utils";

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

      <div className="grid grid-cols-3 gap-6 rounded-3 border border-white/30 p-6">
        <Detail
          label="Project"
          value={project as string}
          link={`/projects/${projectId}`}
        />
        <Detail
          label="Total # of beneficiaries"
          value={targetNoOfBenefeciaries.toString()}
        />
        <Detail
          label="Start date"
          value={formatDate(startDate, "dd MMM yyyy").toUpperCase()}
        />
        <Detail
          label="Funder"
          value={funder.name}
          link={`/funders/?id=${funder.id}`}
        />
        <Detail
          label="Provider"
          value={provider.name}
          link={`/providers?id=${provider.id}`}
        />
        <Detail
          label="End date"
          value={formatDate(endDate, "dd MMM yyyy").toUpperCase()}
        />
      </div>
    </div>
  );
};

export default ContractDetails;

type DetailProps = {
  label: string;
  value: string;
  link?: string;
};

const Detail = ({ label, value, link }: DetailProps) => {
  return (
    <div className="space-y-2">
      <p className="text-[12px] font-light text-neutral-100">{label}</p>
      <div className="flex items-center gap-2.5">
        <p className="font-light text-neutral-100">{value}</p>
        {link && (
          <Link to={link} className="link">
            <LinkIcon />
          </Link>
        )}
      </div>
    </div>
  );
};
