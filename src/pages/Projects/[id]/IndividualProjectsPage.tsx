import * as amplitude from "@amplitude/analytics-browser";
import { useQuery } from "@tanstack/react-query";
import projectService from "api/projects";
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { ReactComponent as Pencil } from "assets/images/icons/pencil.svg";

import { IProject } from "lib/types/projects";

import { ContractsProvider } from "components/Dashboard/Contracts/Dialogues/ContractContext";
import AddOptions from "components/Dashboard/Projects/AddButton";
import ProjectDialogue from "components/Dashboard/Projects/Dialogues/ProjectDialogue";
import Contracts from "components/Dashboard/Projects/Tables/Contracts";
import Outcomes from "components/Dashboard/Projects/Tables/Outcomes";
import { BreadCrumb } from "components/ui/breadcrumb/Breadcrumb";
import Button from "components/ui/button";
import Spinner from "components/ui/spinner/spinner";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "components/ui/tabs/Tabs";

import BeneficiariesPage from "pages/Beneficiaries/BeneficiariesPage";

const IndividualProjectsPage = () => {
  const [modal, setModal] = useState<"project" | null>(null);

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

  const renderModal = useCallback(() => {
    switch (modal) {
      case "project":
        return (
          <ProjectDialogue
            projectId={(id || "") as string}
            isVisible={modal === "project"}
            handleClose={() => setModal(null)}
          />
        );
    }
    // eslint-disable-next-line
  }, [modal]);

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      {renderModal()}

      <BreadCrumb href="/projects">Projects</BreadCrumb>
      <BreadCrumb>Project: {project?.name}</BreadCrumb>
      <div className="hide-scroll h-full space-y-8 py-3">
        <div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[24px] font-[450]">{project?.name}</p>
              <Link
                to={`/funders?id=${project?.funder?.id}`}
                className="link text-[14px] underline underline-offset-4"
              >
                {project?.funder?.name}
              </Link>
            </div>
            <div className="flex gap-4">
              <Button
                onClick={() => setModal("project")}
                buttonType="secondary"
              >
                <Pencil height={14} />
                Edit
              </Button>
              <AddOptions id={id as string} />
            </div>
          </div>
        </div>

        <Tabs defaultValue="outcomes">
          <TabsList>
            <TabsTrigger value="outcomes">
              Outcomes ({project?.outcomes?.length})
            </TabsTrigger>
            <TabsTrigger value="contracts">
              Contracts ({project?.contractsCount})
            </TabsTrigger>
            <TabsTrigger value="beneficiaries">
              Beneficiaries ({project?.beneficiariesCount})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="outcomes">
            <Outcomes project={project as IProject} isLoading={isLoading} />
          </TabsContent>
          <TabsContent value="contracts">
            <ContractsProvider>
              <Contracts projectId={Number(id)} />
            </ContractsProvider>
          </TabsContent>
          <TabsContent value="beneficiaries">
            <BeneficiariesPage projectId={id} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default IndividualProjectsPage;
