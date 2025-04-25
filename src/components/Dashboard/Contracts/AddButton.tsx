import { ReactComponent as Add } from "assets/images/icons/add.svg";

import { Beneficiaries, Contracts, IsAuthorized } from "lib/role-permissions";
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
  if (
    !IsAuthorized([Contracts.UPDATE]) ||
    !IsAuthorized([Beneficiaries.CREATE])
  )
    return null;
  return (
    <MenuButton.Container>
      <MenuButton.Trigger>
        <Add height={14} />
        Add
      </MenuButton.Trigger>
      <MenuButton.Menu>
        {IsAuthorized([Contracts.UPDATE]) && (
          <MenuButton.Item
            onClick={() => showSetupContractModal({ contract, activeStep: 2 })}
          >
            Linked outcome
          </MenuButton.Item>
        )}
        {IsAuthorized([Beneficiaries.CREATE]) && (
          <MenuButton.Item
            onClick={() => showSetupBeneficiaryModal({ contractId })}
          >
            Beneficiary
          </MenuButton.Item>
        )}
      </MenuButton.Menu>
    </MenuButton.Container>
  );
};

export default AddButton;
