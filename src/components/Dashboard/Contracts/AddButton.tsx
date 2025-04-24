import { ReactComponent as Add } from "assets/images/icons/add.svg";

import { IContract } from "lib/types/contracts";

import MenuButton from "components/ui/menu-button";

import { showSetupBeneficiaryModal } from "../Beneficiaries/Dialogues/SetupBeneficiary";
import { showSetupContractModal } from "./SetupContract";

const AddButton = ({
  contractId,
  contract,
}: {
  contractId: string;
  contract?: IContract;
}) => {
  return (
    <MenuButton.Container>
      <MenuButton.Trigger>
        <Add height={14} />
        Add
      </MenuButton.Trigger>
      <MenuButton.Menu>
        <MenuButton.Item
          onClick={() => showSetupContractModal({ contract, activeStep: 2 })}
        >
          Linked outcome
        </MenuButton.Item>
        <MenuButton.Item
          onClick={() => showSetupBeneficiaryModal(undefined, contractId)}
        >
          Beneficiary
        </MenuButton.Item>
      </MenuButton.Menu>
    </MenuButton.Container>
  );
};

export default AddButton;
