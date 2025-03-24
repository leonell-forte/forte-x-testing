import { IMilestone } from "lib/types/milestones";

import { useModal } from "components/ui/dialogue/v2/Modal";

export function showMilestoneModal(data: IMilestone) {
  useModal.getState().open({
    component: <ViewMilestoneModal data={data} />,
    size: "sm",
    title: "View Milestone Details",
  });
}

function ViewMilestoneModal({ data }: { data: IMilestone }) {
  console.log(data);
  return <div>Hello!!!!</div>;
}
