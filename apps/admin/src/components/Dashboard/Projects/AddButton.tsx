import { useState } from "react";

import Add from "@/assets/images/icons/add.svg?react";
import { showSetupBeneficiaryModal } from "@/components/Dashboard/Beneficiaries/Dialogues/SetupBeneficiary";
import { showSetupContractModal } from "@/components/Dashboard/Contracts/SetupContract";
import { showProjectDialogue } from "@/components/Dashboard/Projects/Dialogues/ProjectDialogue";
import MenuButton from "@/components/ui/menu-button";
import {
  Beneficiaries,
  Contracts,
  IsAuthorized,
  Projects,
} from "@/lib/role-permissions";

const AddOptions = ({ id }: { id: string }) => {
  const [show, setShow] = useState(false);

  if (
    !IsAuthorized([Projects.UPDATE]) &&
    !IsAuthorized([Contracts.CREATE]) &&
    !IsAuthorized([Beneficiaries.CREATE])
  ) {
    return null;
  }

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
            {IsAuthorized([Projects.UPDATE]) && (
              <MenuButton.Item
                onClick={() =>
                  showProjectDialogue({ projectId: id, addOutcome: true })
                }
              >
                Outcome
              </MenuButton.Item>
            )}
            {IsAuthorized([Contracts.CREATE]) && (
              <MenuButton.Item
                onClick={() =>
                  showSetupContractModal({ projectId: Number(id) })
                }
              >
                Contract
              </MenuButton.Item>
            )}
            {IsAuthorized([Beneficiaries.CREATE]) && (
              <MenuButton.Item
                onClick={() =>
                  showSetupBeneficiaryModal({
                    projectId: id,
                  })
                }
              >
                Beneficiary
              </MenuButton.Item>
            )}
          </MenuButton.Menu>
        </MenuButton.Container>
      </div>
    </>
  );
};

export default AddOptions;
