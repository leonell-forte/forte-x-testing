import { IContract } from "lib/types/contracts";

import { useModal } from "components/ui/dialogue/v2/Modal";

import { ContractsProvider } from "./Dialogues/ContractContext";
import ContractDialogue from "./Dialogues/ContractDialogue";

type SetupContract = {
  contract?: IContract;

  projectId?: number;

  providerId?: string;

  funderId?: string;
};

export const showSetupContractModal = ({
  contract,
  projectId,
  providerId,
  funderId,
}: SetupContract) => {
  useModal.getState().open({
    component: (
      <ContractsProvider>
        <ContractDialogue
          id={contract?.id}
          projectId={projectId}
          providerId={providerId}
          funderId={funderId}
        />
      </ContractsProvider>
    ),
    size: "2xl",
    title: `${contract ? "Edit" : "Add"} Contract`,
    panelClassName: "max-w-[584px] lg:px-[85px]",
  });
};

export default SetupContract;
