import MilestoneTable from "./MilestoneTable";

const Milestones = () => {
  return (
    <div className="max-w-screen-2xl space-y-4">
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

        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Add Milestones</h3>
          <MilestoneTable />
        </div>
      </div>
    </div>
  );
};

export default Milestones;
