import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import organizationService from "@/api/organization";
import Add from "@/assets/images/icons/add.svg?react";
import Edit from "@/assets/images/icons/pencil.svg?react";
import { showSetupBeneficiaryModal } from "@/components/Dashboard/Beneficiaries/Dialogues/SetupBeneficiary";
import { showSetupContractModal } from "@/components/Dashboard/Contracts/SetupContract";
import { showOrganizationDialogue } from "@/components/Dashboard/Organizations/Dialogues/OrganizationDialogue";
import { showAddPartnerForm } from "@/components/Dashboard/Organizations/Forms/AddPartnerForm";
import Partners from "@/components/Dashboard/Organizations/Partners";
import { showProjectDialogue } from "@/components/Dashboard/Projects/Dialogues/ProjectDialogue";
import { BreadCrumb } from "@/components/ui/breadcrumb/Breadcrumb";
import Button from "@/components/ui/button";
import Details from "@/components/ui/details";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu/DropdownMenu";
import Spinner from "@/components/ui/spinner/spinner";
import Status from "@/components/ui/status";
import Tabs, { TabData } from "@/components/ui/tabs/Tabs";
import usePartnerList from "@/lib/common/lists/usePartnerList";
import { IsAuthorized, Providers } from "@/lib/role-permissions";
import { OrgStatus } from "@/lib/types/organizations";
import { getStatusVariant } from "@/lib/utils";
import BeneficiariesPage from "@/pages/Beneficiaries/BeneficiariesPage";
import ContractsPage from "@/pages/Contracts/ContractsPage";
import MilestonePage from "@/pages/Milestones/MilestonesPage";
import ProjectsPage from "@/pages/Projects/ProjectsPage";

const IndividualFundersPage = () => {
  const params = useParams();
  const funderId = params.id;
  const { data: orgData, isLoading } = useQuery({
    queryKey: ["specific org", funderId],

    queryFn: () => organizationService.getOne(funderId!),

    enabled: !!funderId,
  });

  const { partners: existingPartners } = usePartnerList(funderId);
  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const tabs: TabData[] = [
    {
      value: "partners",
      label: `Partners (${orgData?.noOfPartners || 0})`,
      content: (
        <Partners partners={existingPartners || []} orgId={funderId || ""} />
      ),
    },
    {
      value: "projects",
      label: `Projects (${orgData?.noOfProjects || 0})`,
      content: <ProjectsPage hideHeader funderId={funderId} />,
    },
    {
      value: "contracts",
      label: `Contracts (${orgData?.noOfContracts || 0})`,
      content: <ContractsPage hideHeader funderId={funderId} />,
    },
    {
      value: "beneficiaries",
      label: `Beneficiaries (${orgData?.noOfBeneficiaries || 0})`,
      content: <BeneficiariesPage hideHeader funderId={funderId} />,
    },
    {
      value: "milestones",
      label: `Milestones (${orgData?.noOfMilestones || 0})`,
      content: <MilestonePage funderId={funderId} hideHeader />,
    },
  ];

  return (
    <>
      <BreadCrumb href="/funders">Funders</BreadCrumb>
      <BreadCrumb>{orgData?.name}</BreadCrumb>

      <div className="space-y-10">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <p className="text-[24px] font-[450]">{orgData?.name}</p>
              <Status variant={getStatusVariant(orgData?.status as OrgStatus)}>
                {orgData?.status}
              </Status>
            </div>

            <div className="flex gap-4">
              <Button
                buttonType="secondary"
                onClick={() =>
                  showOrganizationDialogue({ orgId: funderId, type: "funder" })
                }
              >
                <Edit />
                Edit
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button>
                    <Add />
                    Add
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="center"
                  side="bottom"
                  sideOffset={1}
                >
                  {IsAuthorized([Providers.CREATE]) && (
                    <DropdownMenuItem
                      onClick={() =>
                        showAddPartnerForm({
                          orgId: funderId as string,
                          type: "provider",
                        })
                      }
                    >
                      Partner
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => showProjectDialogue({ funderId })}
                  >
                    Project
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      showSetupContractModal({ funderId: funderId })
                    }
                  >
                    Contract
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => showSetupBeneficiaryModal({ funderId })}
                  >
                    Beneficiary
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-[20px] font-semibold">Funder Details</p>
            <Details.Container>
              <Details.Content
                label="Registration #"
                value={orgData?.registrationNumber || ""}
              />
              <Details.Content
                label="Region"
                value={orgData?.regions?.join(", ") || ""}
              />
              <Details.Content
                label="Currency"
                value={orgData?.currency || "-"}
              />
            </Details.Container>
          </div>
        </div>

        <Tabs tabs={tabs} />
      </div>
    </>
  );
};

export default IndividualFundersPage;
