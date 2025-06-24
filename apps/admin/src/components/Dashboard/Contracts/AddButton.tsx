import Add from "@/assets/images/icons/add.svg?react";
import { showSetupBeneficiaryModal } from "@/components/Dashboard/Beneficiaries/Dialogues/SetupBeneficiary";
import { showSetupContractModal } from "@/components/Dashboard/Contracts/SetupContract";
import MenuButton from "@/components/ui/menu-button";
import { Beneficiaries, Contracts, IsAuthorized } from "@/lib/role-permissions";
import type { IContract } from "@/lib/types/contracts";

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
            disabled={contract?.status === "completed"}
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
