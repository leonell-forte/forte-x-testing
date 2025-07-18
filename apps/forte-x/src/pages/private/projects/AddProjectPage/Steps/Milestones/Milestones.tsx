import { Button } from "@repo/ui/components/button";

import { useStepper } from "@/components/ui/stepper";

import MilestoneTable from "./MilestoneTable";

const Milestones = () => {
  const { setActiveStep } = useStepper();
  return (
    <div className="max-w-[800px] space-y-4">
      <p className="text-lg text-green-300">Step 2 of 5</p>
      <div className="space-y-12">
        <div>
          <h2 className="text-2xl font-bold">Add project details</h2>
          <p className="text-sm text-white/60">
            Enter the core information about your project to establish a shared
            understanding among all stakeholders, including key details and the
            main point of the product
          </p>
        </div>

        <div className="space-y-24">
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Add Milestones</h3>

            <MilestoneTable />
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setActiveStep("project-details")}
            >
              Back
            </Button>
            <Button onClick={() => setActiveStep("providers")}>Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Milestones;
