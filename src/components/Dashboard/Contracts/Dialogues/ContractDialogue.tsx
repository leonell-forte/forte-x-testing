import { useQuery } from "@tanstack/react-query";
import contractService from "api/contract";
import { useCallback, useEffect, useState } from "react";

import { useProfile } from "lib/hooks";
import { Contracts, isAuthorized } from "lib/role-permissions";

import Dialogue, { IDialogueProps } from "components/ui/dialogue/dialogue";
import Spinner from "components/ui/spinner/spinner";

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
  const currentUser = useProfile();

  const { data: contractDetails, isLoading: contractDetailsLoading } = useQuery(
    {
      queryKey: ["specific-contract", id],

      queryFn: () => contractService.getOne(id!.toString()!),

      enabled: !!id,
    }
  );

  // sets contract form default values

  const [onEdit, setOnEdit] = useState(false);

  const [component, setComponent] = useState<Component>("form");

  useEffect(() => {
    // determines if form is on edit mode or not. if id is present and contract has draft status, it should automatically have edit mode on.
    // if id is not present, edit mode should automatically be on for adding contract.
    setOnEdit(
      id
        ? contractDetails?.status === "DRAFT" &&
            isAuthorized(currentUser?.role, [Contracts.UPDATE])
        : true
    );
  }, [contractDetails?.status, id]);

  const renderComponent = (component: Component) => {
    switch (component) {
      case "form":
        return (
          <ContractForm
            contractDetails={id ? contractDetails! : null}
            onEdit={onEdit}
            handleEdit={(val) => setOnEdit(val)}
            handleClose={handleClose!}
            projectId={projectId!}
            markContract={() => setComponent("mark")}
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

  const renderTitle = useCallback(() => {
    switch (component) {
      case "form":
        return `${id ? `${onEdit ? "Edit" : "View"} contract Id: ${id}` : "Add contract"}`;
      case "mark":
        return "";
    }
  }, [component, id, onEdit]);

  return (
    <Dialogue
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
