import { useQuery } from "@tanstack/react-query";
import contractService from "api/contract";
import organizationService from "api/organization";
import projectService from "api/projects";

import { IBeneficiaries } from "lib/types/beneficiaries";
import { formatDate } from "lib/utils";

import InfoVertical from "components/ui/info-vertical/InfoVertical";
import ReferenceLink from "components/ui/reference-link/ReferenceLink";
import Spinner from "components/ui/spinner/spinner";

type Params = {
  beneficiary: IBeneficiaries;
};

const ProjectDetailsSection = ({ beneficiary }: Params) => {
  const { projectId, providerId, contractId } = beneficiary;
  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ["project-details", projectId],
    queryFn: () => projectService.getOne(projectId),
    enabled: Boolean(projectId),
  });
  const { data: provider, isLoading: providerLoading } = useQuery({
    queryKey: ["provider-details", providerId],
    queryFn: () => organizationService.getOne(providerId),
    enabled: Boolean(providerId),
  });
  const { data: contract, isLoading: contractLoading } = useQuery({
    queryKey: ["contract-details", contractId],
    queryFn: () => contractService.getOne(contractId),
    enabled: Boolean(contractId),
  });

  if (projectLoading || providerLoading || contractLoading)
    return (
      <div className="flex h-24 w-full items-center justify-center">
        <Spinner />
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 items-center gap-6 rounded-lg border p-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        <InfoVertical label="Provider">
          <ReferenceLink hrefLink="/providers">{provider?.name}</ReferenceLink>
        </InfoVertical>
        <InfoVertical label="Project">
          <ReferenceLink hrefLink={`/projects/${project?.id}`}>
            {project?.name}
          </ReferenceLink>
        </InfoVertical>
        <InfoVertical label="Contract">
          <ReferenceLink hrefLink={`/contracts/${contract?.id}`}>
            {contract?.name}
          </ReferenceLink>
        </InfoVertical>
        <InfoVertical label="Program Name">
          {beneficiary.cohortName || "-"}
        </InfoVertical>
        <InfoVertical label="Start Date">
          {formatDate(beneficiary.cohortStartDate)}
        </InfoVertical>
        <InfoVertical label="End Date">
          {formatDate(beneficiary.cohortEndDate)}
        </InfoVertical>
      </div>
    </div>
  );
};

export default ProjectDetailsSection;
