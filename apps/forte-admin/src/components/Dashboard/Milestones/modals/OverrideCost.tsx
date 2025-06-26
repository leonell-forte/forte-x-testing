import { useState } from "react";

import { useOverrideCost } from "@/lib/mutations/evidences";
import type { IMilestone } from "@/lib/types/milestones";

import Button from "@/components/ui/button";
import { useModal } from "@/components/ui/dialogue/v2/Modal";
import Input from "@/components/ui/input";

type TParams = {
  milestone: IMilestone;
};

export function showOverrideCostModal(params: TParams) {
  useModal.getState().open({
    component: <OverrideCostModal milestone={params.milestone} />,
    title: "Override milestone cost",
  });
}

function OverrideCostModal({ milestone }: TParams) {
  const [newCost, setNewCost] = useState("");

  const { overrideCost, isPending } = useOverrideCost();

  const onSubmit = () => {
    overrideCost({ id: milestone.id, cost: Number(newCost) });
  };

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input value={milestone.cost} disabled isCurrency />
        <Input
          isCurrency
          value={newCost}
          onChange={(e) => setNewCost(e.target.value)}
          type="number"
        />
      </div>
      <div className="flex w-full justify-end">
        <Button
          loading={isPending}
          onClick={onSubmit}
          disabled={newCost.length === 0}
          className="!px-8"
        >
          Override
        </Button>
      </div>
    </div>
  );
}
