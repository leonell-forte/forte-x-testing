import { Button } from "@repo/ui/components/button";

import ProvidersTable from "./ProvidersTable";

const Providers = () => {
  return (
    <div className="max-w-[800px] space-y-4">
      <p className="text-lg text-green-300">Step 3 of 5</p>
      <div className="space-y-12">
        <div>
          <h2 className="text-2xl font-bold">Add Providers and Courses</h2>
          <p className="text-sm text-white/60">
            Add Providers and Courses Assign the organizations responsible for
            delivering the training for this project.
          </p>
        </div>

        <div className="space-y-24">
          <ProvidersTable />
          <div className="flex justify-between">
            <Button variant="outline">Back</Button>
            <Button>Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Providers;
