import { useState } from "react";

import { ReactComponent as Add } from "assets/images/icons/add.svg";

import MenuButton from "components/ui/menu-button";

import { showSetupBeneficiaryModal } from "../Beneficiaries/Dialogues/SetupBeneficiary";
import { showSetupContractModal } from "../Contracts/SetupContract";
import { showProjectDialogue } from "./Dialogues/ProjectDialogue";

const AddOptions = ({ id }: { id: string }) => {
  const [show, setShow] = useState(false);

  return (
    <>
      <div className="relative">
        <MenuButton.Container
          open={show}
          onOpenChange={(open) => setShow(open)}
        >
          <MenuButton.Trigger>
            <Add height={14} />
            Add
          </MenuButton.Trigger>
          <MenuButton.Menu>
            <MenuButton.Item
              onClick={() =>
                showProjectDialogue({ projectId: id, addOutcome: true })
              }
            >
              Outcome
            </MenuButton.Item>
            <MenuButton.Item
              onClick={() => showSetupContractModal({ projectId: Number(id) })}
            >
              Contract
            </MenuButton.Item>
            <MenuButton.Item
              onClick={() =>
                showSetupBeneficiaryModal(
                  undefined,
                  undefined,
                  undefined,
                  undefined,
                  id
                )
              }
            >
              Beneficiary
            </MenuButton.Item>
          </MenuButton.Menu>
        </MenuButton.Container>
      </div>
    </>
  );
};

export default AddOptions;
