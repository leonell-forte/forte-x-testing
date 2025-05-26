import * as amplitude from "@amplitude/analytics-browser";
import { useQuery } from "@tanstack/react-query";
import projectService from "api/projects";
import { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";

import { ReactComponent as Pencil } from "assets/images/icons/pencil.svg";

import { IsAuthorized, Projects } from "lib/role-permissions";
import { IProject } from "lib/types/projects";
import { getStatusVariant } from "lib/utils";

import { ContractsProvider } from "components/Dashboard/Contracts/Dialogues/ContractContext";
import AddOptions from "components/Dashboard/Projects/AddButton";
import { showProjectDialogue } from "components/Dashboard/Projects/Dialogues/ProjectDialogue";
import Contracts from "components/Dashboard/Projects/Tables/Contracts";
import Outcomes from "components/Dashboard/Projects/Tables/Outcomes";
import { BreadCrumb } from "components/ui/breadcrumb/Breadcrumb";
import Button from "components/ui/button";
import Spinner from "components/ui/spinner/spinner";
import Status from "components/ui/status";
import Tabs from "components/ui/tabs/Tabs";

import BeneficiariesPage from "pages/Beneficiaries/BeneficiariesPage";

const IndividualProjectsPage = () => {
  const { id } = useParams();

  const { data: project, isLoading } = useQuery({
    queryKey: ["specific-project", id],

    queryFn: () => projectService.getOne(id!),

    enabled: !!id,
  });

  useEffect(() => {
    const debounce = setTimeout(() => {
      amplitude.track(`${project?.name} Page View`, { id });
    }, 300);
    return () => clearTimeout(debounce);
  }, [project?.name, id]);

  const tabs = useMemo(() => {
    return [
      {
        value: "outcomes",
        label: `Outcomes (${project?.outcomes?.length})`,
        content: (
          <Outcomes project={project as IProject} isLoading={isLoading} />
        ),
      },
      {
        value: "contracts",
        label: `Contracts (${project?.contractsCount})`,
        content: (
          <ContractsProvider>
            <Contracts projectId={Number(id)} />
          </ContractsProvider>
        ),
      },
      {
        value: "beneficiaries",
        label: `Beneficiaries (${project?.beneficiariesCount})`,
        content: <BeneficiariesPage projectId={id} hideHeader />,
      },
    ];
  }, [project, isLoading, id]);

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <BreadCrumb href="/projects">Projects</BreadCrumb>
      <BreadCrumb>Project: {project?.name}</BreadCrumb>

      <div className="hide-scroll h-full space-y-8 py-3">
        <div>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-4">
                <p className="text-[24px] font-[450]">{project?.name}</p>

                <Status variant={getStatusVariant(project?.status || "")}>
                  {project?.status}
                </Status>
              </div>
              <Link
                to={`/funders?id=${project?.funder?.id}`}
                className="link text-[14px] underline underline-offset-4"
              >
                {project?.funder?.name}
              </Link>
            </div>
            <div className="flex gap-4">
              {IsAuthorized([Projects.UPDATE]) && (
                <Button
                  onClick={() => showProjectDialogue({ projectId: id })}
                  buttonType="secondary"
                >
                  <Pencil height={14} />
                  Edit
                </Button>
              )}
              <AddOptions id={id as string} />
            </div>
          </div>
        </div>

        <Tabs tabs={tabs} />
      </div>
    </>
  );
};

export default IndividualProjectsPage;
