import { IContract } from "lib/types/contracts";

import { useModal } from "components/ui/dialogue/v2/Modal";

import { ContractsProvider } from "./Dialogues/ContractContext";
import ContractDialogue from "./Dialogues/ContractDialogue";

type SetupContract = {
  contract?: IContract;

  projectId?: number;
};

export const showSetupContractModal = ({
  contract,
  projectId,
}: SetupContract) => {
  useModal.getState().open({
    component: (
      <ContractsProvider>
        <ContractDialogue id={contract?.id} projectId={projectId} />
      </ContractsProvider>
    ),
    size: "2xl",
    title: `${contract ? "Edit" : "Add"} Contract`,
  });
};

export default SetupContract;
