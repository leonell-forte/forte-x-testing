import { useQuery } from "@tanstack/react-query";
import organizationService from "api/organization";
import { useParams } from "react-router-dom";

import { ReactComponent as Add } from "assets/images/icons/add.svg";
import { ReactComponent as Edit } from "assets/images/icons/pencil.svg";

import { OrgStatus } from "lib/types/organizations";
import { getStatusVariant } from "lib/utils";

import { showSetupBeneficiaryModal } from "components/Dashboard/Beneficiaries/Dialogues/SetupBeneficiary";
import { showSetupContractModal } from "components/Dashboard/Contracts/SetupContract";
import { showOrganizationDialogue } from "components/Dashboard/Organizations/Dialogues/OrganizationDialogue";
import BankDetails from "components/Dashboard/Organizations/Providers/BankDetails";
import ProviderDetails from "components/Dashboard/Organizations/Providers/ProviderDetails";
import { BreadCrumb } from "components/ui/breadcrumb/Breadcrumb";
import Button from "components/ui/button";
import MenuButton from "components/ui/menu-button";
import Spinner from "components/ui/spinner/spinner";
import Status from "components/ui/status";
import Tabs, { TabData } from "components/ui/tabs/Tabs";

import BeneficiariesPage from "pages/Beneficiaries/BeneficiariesPage";
import ContractsPage from "pages/Contracts/ContractsPage";
import MilestonePage from "pages/Milestones/MilestonesPage";

const IndividualProvidersPage = () => {
  const params = useParams();

  const orgId = params.id;
  const { data: orgData, isLoading } = useQuery({
    queryKey: ["specific org", orgId],

    queryFn: () => organizationService.getOne(orgId!),

    enabled: !!orgId,
  });

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const detailsTabs: TabData[] = [
    {
      value: "provider",
      label: "Provider details",
      content: <ProviderDetails data={orgData} />,
    },
    {
      value: "bank",
      label: "Bank details",
      content: <BankDetails />,
    },
  ];

  const tabs: TabData[] = [
    {
      value: "contracts",
      label: `Contracts (${orgData?.noOfContracts || 0})`,
      content: <ContractsPage hideHeader providerId={orgId} />,
    },
    {
      value: "beneficiaries",
      label: `Beneficiaries (${orgData?.noOfBeneficiaries || 0})`,
      content: <BeneficiariesPage hideHeader providerId={orgId} />,
    },
    {
      value: "milestones",
      label: `Milestones (${orgData?.noOfMilestones || 0})`,
      content: <MilestonePage providerId={orgId} hideHeader />,
    },
  ];

  return (
    <>
      <BreadCrumb href="/providers">Providers</BreadCrumb>
      <BreadCrumb>{orgData?.name}</BreadCrumb>

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
                showOrganizationDialogue({ orgId, type: "provider" })
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
                  onClick={() => showSetupContractModal({ providerId: orgId })}
                >
                  Contract
                </MenuButton.Item>
                <MenuButton.Item
                  onClick={() =>
                    showSetupBeneficiaryModal({
                      providerId: orgId,
                    })
                  }
                >
                  Beneficiary
                </MenuButton.Item>
              </MenuButton.Menu>
            </MenuButton.Container>
          </div>
        </div>

        <Tabs tabs={detailsTabs} />

        <Tabs tabs={tabs} />
      </div>
    </>
  );
};

export default IndividualProvidersPage;
