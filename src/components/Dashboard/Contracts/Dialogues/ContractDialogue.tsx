import { useQuery } from "@tanstack/react-query";
import contractService from "api/contract";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Contracts, IsAuthorized } from "lib/role-permissions";

import { useModal } from "components/ui/dialogue/v2/Modal";
import Spinner from "components/ui/spinner/spinner";

import ContractForm from "./ContractForm";

interface IContractDialogueProps {
  id?: number;

  projectId?: number;

  providerId?: string;

  funderId?: string;
}

const ContractDialogue = ({
  id,

  projectId,

  providerId,

  funderId,
}: IContractDialogueProps) => {
  const navigate = useNavigate();
  const [contractId, setContractId] = useState(id);
  const { close: handleClose } = useModal();
  const {
    data: contractDetails,
    isFetching: contractDetailsLoading,
    refetch,
  } = useQuery({
    queryKey: ["specific-contract", contractId],

    queryFn: () => contractService.getOne(contractId!.toString()!),

    enabled: !!contractId,

    refetchOnWindowFocus: false,
  });

  // sets contract form default values

  const [onEdit, setOnEdit] = useState(false);

  const canEdit = IsAuthorized([Contracts.UPDATE]);

  useEffect(() => {
    // determines if form is on edit mode or not. if id is present and contract has draft status, it should automatically have edit mode on.
    // if id is not present, edit mode should automatically be on for adding contract.
    setOnEdit(id ? contractDetails?.status === "DRAFT" && canEdit : true);
  }, [contractDetails?.status, id, canEdit]);

  return contractDetailsLoading ? (
    <div className="flex h-[470px] w-full items-center justify-center">
      <Spinner />
    </div>
  ) : (
    <ContractForm
      contractDetails={contractId ? contractDetails! : null}
      onEdit={onEdit}
      handleEdit={(val) => setOnEdit(val)}
      handleClose={handleClose!}
      projectId={projectId!}
      providerId={providerId}
      funderId={funderId}
      onSuccess={(contract) => {
        setContractId(contract.id);
        refetch();
        navigate(`/contracts/${contract.id}`);
      }}
    />
  );
};

export default ContractDialogue;
