import { useState } from "react";

import { ReactComponent as Add } from "assets/images/icons/add.svg";

import MenuButton from "components/ui/menu-button";

import { showSetupBeneficiaryModal } from "../Beneficiaries/Dialogues/SetupBeneficiary";
import { showSetupContractModal } from "../Contracts/SetupContract";
import ProjectDialogue from "./Dialogues/ProjectDialogue";

type ModalType = "outcome" | "contract" | "beneficiary";

const AddOptions = ({ id }: { id: string }) => {
  const [show, setShow] = useState(false);

  const [modal, setModal] = useState<ModalType | null>(null);

  const handleClose = () => {
    setModal(null);
  };

  const handleSelect = (modal: ModalType) => {
    setModal(modal);
    setShow(false);
  };

  const renderModal = (modal: ModalType | null) => {
    switch (modal) {
      case "outcome":
        return (
          <ProjectDialogue
            projectId={(id || "") as string}
            isVisible={true}
            handleClose={handleClose}
          />
        );
    }
  };

  return (
    <>
      {renderModal(modal)}
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
            <MenuButton.Item onClick={() => handleSelect("outcome")}>
              Outcome
            </MenuButton.Item>
            <MenuButton.Item
              onClick={() => showSetupContractModal({ projectId: Number(id) })}
            >
              Contract
            </MenuButton.Item>
            <MenuButton.Item onClick={() => showSetupBeneficiaryModal()}>
              Beneficiary
            </MenuButton.Item>
          </MenuButton.Menu>
        </MenuButton.Container>
      </div>
    </>
  );
};

export default AddOptions;
