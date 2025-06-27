import { BallChart } from "@/components/ball-chart/BallChart";
import { ModeToggle } from "@/components/mode-toggle";
import StudentsTable from "@/components/playground/StudentsTable";

export default function Playground() {
  return (
    <div>
      <div className="container mx-auto space-y-16 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Playground</h1>
          <ModeToggle />
        </div>
        <BallChart
          size="big"
          sets={[
            { percentage: 30, label: "Pre-Training" },
            { percentage: 60, label: "In-Training" },
            { percentage: 10, label: "Post-Training" },
          ]}
        />
        <StudentsTable />
      </div>
    </div>
  );
}
