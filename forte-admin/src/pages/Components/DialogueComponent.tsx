import { useState } from "react";

import Button from "components/ui/button";
import Dialogue from "components/ui/dialogue/dialogue";

const DialogueComponent = () => {
  const [showDialogue, setShowDialogue] = useState(false);
  return (
    <div>
      <p className="mb-2 text-2xl font-semibold uppercase text-white">
        Dialogues
      </p>
      <div className="flex flex-wrap gap-4">
        <Button onClick={() => setShowDialogue(true)} buttonType="primary">
          Open Dialogue
        </Button>
        <Dialogue
          isVisible={showDialogue}
          handleClose={() => setShowDialogue(false)}
          title="Dialogue Title"
        ></Dialogue>
      </div>
    </div>
  );
};

export default DialogueComponent;
