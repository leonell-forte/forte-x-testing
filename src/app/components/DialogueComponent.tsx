"use client";
import Button from "@/components/ui/button";
import Dialogue from "@/components/ui/dialogue/dialogue";
import React, { useState } from "react";

const DialogueComponent = () => {
  const [showDialogue, setShowDialogue] = useState(false);
  return (
    <div>
      <p className="text-2xl text-white font-semibold uppercase mb-2">
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
