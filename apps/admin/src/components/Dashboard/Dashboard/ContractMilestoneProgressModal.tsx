import { ContractMilestoneContent } from "@/components/Dashboard/Dashboard/ContractMilestoneProgress";
import type { ContractProgress } from "@/components/Dashboard/Dashboard/types";
import type { SegmentType } from "@/components/Dashboard/Dashboard/types";
import { useModal } from "@/components/ui/dialogue/v2/Modal";

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
