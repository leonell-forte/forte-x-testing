import { IContract } from "lib/types/contracts";

import { useModal } from "components/ui/dialogue/v2/Modal";

import { ContractsProvider } from "./Dialogues/ContractContext";
import ContractDialogue from "./Dialogues/ContractDialogue";

type SetupContract = {
  contract?: IContract;

  projectId?: number;

  providerId?: string;

  funderId?: string;

  activeStep?: number;
};

export const showSetupContractModal = ({
  contract,
  projectId,
  providerId,
  funderId,
  activeStep,
}: SetupContract) => {
  useModal.getState().open({
    component: (
      <ContractsProvider>
        <ContractDialogue
          id={contract?.id}
          projectId={projectId}
          providerId={providerId}
          funderId={funderId}
          activeStep={activeStep}
        />
      </ContractsProvider>
    ),
    size: "2xl",
    title: `${contract ? (activeStep === 2 ? "Add linked outcomes" : "Edit contract") : "Add contract"}`,
    panelClassName: "max-w-[584px] lg:px-[85px]",
    titleClassName: "text-center",
  });
};

export default SetupContract;
