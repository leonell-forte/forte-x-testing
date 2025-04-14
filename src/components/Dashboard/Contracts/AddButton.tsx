import { ReactComponent as Add } from "assets/images/icons/add.svg";

import MenuButton from "components/ui/menu-button";

import { showSetupBeneficiaryModal } from "../Beneficiaries/Dialogues/SetupBeneficiary";

const AddButton = ({ contractId }: { contractId: string }) => {
  return (
    <MenuButton.Container>
      <MenuButton.Trigger>
        <Add height={14} />
        Add
      </MenuButton.Trigger>
      <MenuButton.Menu>
        <MenuButton.Item>Linked outcome</MenuButton.Item>
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
