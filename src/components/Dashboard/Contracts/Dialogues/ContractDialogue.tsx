import { useQuery } from "@tanstack/react-query";
import contractService from "api/contract";
import { useCallback, useEffect, useState } from "react";

import { Contracts, IsAuthorized } from "lib/role-permissions";

import Dialogue, { IDialogueProps } from "components/ui/dialogue/dialogue";
import Spinner from "components/ui/spinner/spinner";

import { useContractsContext } from "./ContractContext";
import ContractForm from "./ContractForm";
import MarkContract from "./MarkContract";

interface IContractDialogueProps extends IDialogueProps {
  id?: number;

  projectId?: number;
}

type Component = "form" | "mark";

const ContractDialogue = ({
  isVisible,

  id,

  projectId,

  handleClose,
}: IContractDialogueProps) => {
  const [contractId, setContractId] = useState(id);
  const { showPrompt } = useContractsContext();
  const {
    data: contractDetails,
    isLoading: contractDetailsLoading,
    refetch,
  } = useQuery({
    queryKey: ["specific-contract", id],

    queryFn: () => contractService.getOne(id!.toString()!),

    enabled: !!id,
  });

  // sets contract form default values

  const [onEdit, setOnEdit] = useState(false);

  const [component, setComponent] = useState<Component>("form");

  const renderComponent = (component: Component) => {
    switch (component) {
      case "form":
        return (
          <ContractForm
            contractDetails={contractId ? contractDetails! : null}
            onEdit={onEdit}
            handleEdit={(val) => setOnEdit(val)}
            handleClose={handleClose!}
            projectId={projectId!}
            markContract={() => setComponent("mark")}
            onSuccess={(contract) => {
              setContractId(contract.id);
              refetch();
            }}
          />
        );

      case "mark":
        return (
          <MarkContract
            contractDetails={contractDetails!}
            handleBack={() => setComponent("form")}
            handleClose={handleClose!}
          />
        );
    }
  };

  const canEdit = IsAuthorized([Contracts.UPDATE]);

  const renderTitle = useCallback(() => {
    switch (component) {
      case "form":
        return `${contractId ? `${onEdit ? "Edit" : "View"} contract Id: ${contractId}` : "Add contract"}`;
      case "mark":
        return "";
    }
  }, [component, contractId, onEdit]);

  useEffect(() => {
    // determines if form is on edit mode or not. if id is present and contract has draft status, it should automatically have edit mode on.
    // if id is not present, edit mode should automatically be on for adding contract.
    setOnEdit(id ? contractDetails?.status === "DRAFT" && canEdit : true);
  }, [contractDetails?.status, id, canEdit]);

  return (
    <Dialogue
      confirmBeforeLeave={showPrompt}
      center={component === "mark"}
      isVisible={isVisible}
      handleClose={handleClose}
      title={renderTitle()}
    >
      {contractDetailsLoading ? (
        <div className="flex h-[470px] w-full items-center justify-center">
          <Spinner />
        </div>
      ) : (
        renderComponent(component)
      )}
    </Dialogue>
  );
};

export default ContractDialogue;
