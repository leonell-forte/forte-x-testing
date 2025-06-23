import { useModal } from "components/ui/dialogue/v2/Modal";

import { ContractMilestoneContent } from "./ContractMilestoneProgress";
import { ContractProgress, SegmentType } from "./types";

export const showContractMilestoneProgressModal = (
  projects: (ContractProgress & { segment: SegmentType[] })[]
) => {
  useModal.getState().open({
    component: <ContractMilestoneProgressModal projects={projects} />,
    title: "Contract Milestone Progress",
    size: "2xl",
  });
};

const ContractMilestoneProgressModal = ({
  projects,
}: {
  projects: (ContractProgress & { segment: SegmentType[] })[];
}) => {
  return <ContractMilestoneContent projects={projects} />;
};

export default ContractMilestoneProgressModal;
