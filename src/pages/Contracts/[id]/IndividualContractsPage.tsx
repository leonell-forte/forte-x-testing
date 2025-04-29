import { useQuery } from "@tanstack/react-query";
import contractService from "api/contract";
import evidenceService from "api/evidence";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { ReactComponent as Check } from "assets/images/icons/check.svg";
import { ReactComponent as Edit } from "assets/images/icons/pencil.svg";

import { Contracts, IsAuthorized } from "lib/role-permissions";
import { IContract } from "lib/types/contracts";
import { getStatusVariant } from "lib/utils";

import AddButton from "components/Dashboard/Contracts/AddButton";
import ContractDetails from "components/Dashboard/Contracts/ContractDetails";
import MarkContract from "components/Dashboard/Contracts/Dialogues/MarkContract";
import LinkedOutcomes from "components/Dashboard/Contracts/LinkedOutcomes";
import { showSetupContractModal } from "components/Dashboard/Contracts/SetupContract";
import { useProfile } from "components/ProfileContext";
import { BreadCrumb } from "components/ui/breadcrumb/Breadcrumb";
import Button from "components/ui/button";
import Dialogue from "components/ui/dialogue/dialogue";
import Spinner from "components/ui/spinner/spinner";
import Status from "components/ui/status";
import Tabs from "components/ui/tabs/Tabs";

import BeneficiariesPage from "pages/Beneficiaries/BeneficiariesPage";
import MilestonePage from "pages/Milestones/MilestonesPage";

const IndividualContractsPage = () => {
  const { profile } = useProfile();
  const params = useParams();

  const [modal, setModal] = useState<"contract" | "mark" | null>(null);

  const {
    data: contractDetails,
    isFetching: contractDetailsLoading,
    refetch,
  } = useQuery({
    queryKey: ["specific-contract", params.id],

    queryFn: () => contractService.getOne(params.id!),

    enabled: !!params.id,

    refetchOnWindowFocus: false,
  });

  const { isSigned, isCompleted, isDraft } = useMemo(() => {
    const status = contractDetails?.status;

    return {
      isSigned: status === "signed",

      isCompleted: status === "completed",

      isDraft: status === "draft",

      isCancelled: status === "cancelled",
    };
  }, [contractDetails?.status]);

  const statusActions = useMemo(() => {
    if (isDraft) return { label: "Mark as signed" };

    if (isSigned) return { label: "Mark as completed" };

    if (isCompleted) return { label: "Mark as incomplete" };

    return null;
  }, [isDraft, isSigned, isCompleted]);

  const name = contractDetails?.name || "";
  const status = contractDetails?.status || "";

  const handleClose = () => {
    setModal(null);
  };

  const renderModal = () => {
    switch (modal) {
      case "mark":
        return (
          <Dialogue isVisible center handleClose={handleClose}>
            <MarkContract
              contractDetails={contractDetails!}
              handleBack={() => setModal(null)}
              handleClose={() => {
                refetch();
                setModal(null);
              }}
            />
          </Dialogue>
        );
    }
  };

  const tabs = useMemo(() => {
    if (!contractDetails) return [];
    return [
      {
        value: "outcomes",
        label: `Linked outcomes (${contractDetails?.outcomes?.length})`,
        content: (
          <LinkedOutcomes
            outcomes={contractDetails?.outcomes || []}
            isLoading={contractDetailsLoading}
          />
        ),
      },
      {
        value: "beneficiaries",
        label: `Beneficiaries (${contractDetails?.noOfBeneficiaries})`,
        content: <BeneficiariesPage hideHeader contractId={params.id} />,
      },
      {
        value: "milestones",
        label: `Milestones (${contractDetails?.noOfMilestones})`,
        content: <MilestonePage hideHeader contractId={params.id} />,
      },
    ];
  }, [contractDetails, contractDetailsLoading, params.id]);

  if (contractDetailsLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      {renderModal()}

      <BreadCrumb href="/contracts">Contracts</BreadCrumb>
      <BreadCrumb>{name}</BreadCrumb>

      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-4">
              <p className="text-[24px] font-medium">{name}</p>
              <Status variant={getStatusVariant(status)}>
                {status.toLowerCase()}
              </Status>
            </div>
            <button
              className="link"
              onClick={() =>
                evidenceService.getFile(
                  `/${contractDetails!.document!.slug!}`,
                  contractDetails?.document?.filename
                )
              }
            >
              {contractDetails?.document?.filename}
            </button>
          </div>

          <div className="flex gap-4">
            {IsAuthorized([Contracts.UPDATE]) &&
              contractDetails?.status !== "cancelled" && (
                <div>
                  {contractDetails && (
                    <Button
                      buttonType="secondary"
                      onClick={() => setModal("mark")}
                    >
                      <Check fill="white" width={17.59} />
                      {statusActions?.label}
                    </Button>
                  )}
                </div>
              )}

            <>
              {IsAuthorized([Contracts.UPDATE]) &&
                (profile.orgType === "forte" ||
                  contractDetails?.status === "draft") && (
                  <Button
                    buttonType="secondary"
                    onClick={() =>
                      showSetupContractModal({
                        contract: contractDetails,
                      })
                    }
                  >
                    <Edit width={18} />
                    Edit
                  </Button>
                )}
              <AddButton
                contractId={params.id as string}
                contract={contractDetails}
              />
            </>
          </div>
        </div>

        <ContractDetails contract={contractDetails as IContract} />

        <Tabs tabs={tabs} />
      </div>
    </>
  );
};

export default IndividualContractsPage;
