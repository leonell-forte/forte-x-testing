import { useQuery } from "@tanstack/react-query";
import organizationService from "api/organization";
import { useParams } from "react-router-dom";

import { ReactComponent as Add } from "assets/images/icons/add.svg";
import { ReactComponent as Edit } from "assets/images/icons/pencil.svg";

import usePartnerList from "lib/common/lists/usePartnerList";
import { OrgStatus } from "lib/types/organizations";
import { getStatusVariant } from "lib/utils";

import { showSetupBeneficiaryModal } from "components/Dashboard/Beneficiaries/Dialogues/SetupBeneficiary";
import { showSetupContractModal } from "components/Dashboard/Contracts/SetupContract";
import { showOrganizationDialogue } from "components/Dashboard/Organizations/Dialogues/OrganizationDialogue";
import { showAddPartnerForm } from "components/Dashboard/Organizations/Forms/AddPartnerForm";
import Partners from "components/Dashboard/Organizations/Partners";
import { showProjectDialogue } from "components/Dashboard/Projects/Dialogues/ProjectDialogue";
import { BreadCrumb } from "components/ui/breadcrumb/Breadcrumb";
import Button from "components/ui/button";
import Details from "components/ui/details";
import MenuButton from "components/ui/menu-button";
import Spinner from "components/ui/spinner/spinner";
import Status from "components/ui/status";
import Tabs, { TabData } from "components/ui/tabs/Tabs";

import BeneficiariesPage from "pages/Beneficiaries/BeneficiariesPage";
import ContractsPage from "pages/Contracts/ContractsPage";
import MilestonePage from "pages/Milestones/MilestonesPage";
import ProjectsPage from "pages/Projects/ProjectsPage";

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
              <MenuButton.Container>
                <MenuButton.Trigger>
                  <Add />
                  Add
                </MenuButton.Trigger>
                <MenuButton.Menu>
                  <MenuButton.Item
                    onClick={() =>
                      showAddPartnerForm({
                        orgId: funderId,
                      })
                    }
                  >
                    Partner
                  </MenuButton.Item>
                  <MenuButton.Item
                    onClick={() => showProjectDialogue({ funderId })}
                  >
                    Project
                  </MenuButton.Item>
                  <MenuButton.Item
                    onClick={() =>
                      showSetupContractModal({ funderId: funderId })
                    }
                  >
                    Contract
                  </MenuButton.Item>
                  <MenuButton.Item
                    onClick={() =>
                      showSetupBeneficiaryModal(undefined, undefined, funderId)
                    }
                  >
                    Beneficiary
                  </MenuButton.Item>
                </MenuButton.Menu>
              </MenuButton.Container>
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
            </Details.Container>
          </div>
        </div>

        <Tabs tabs={tabs} />
      </div>
    </>
  );
};

export default IndividualFundersPage;
