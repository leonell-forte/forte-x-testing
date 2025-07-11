import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";

import { BallChart } from "@/components/ball-chart/BallChart";

export default function BallChartDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ball Chart</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-12">
        <div className="flex flex-col items-center gap-2">
          <h5 className="text-sm">Small variant (for tables)</h5>
          <BallChart
            size="small"
            sets={[
              { percentage: 30, label: "Pre-Training" },
              { percentage: 60, label: "In-Training" },
              { percentage: 10, label: "Post-Training" },
            ]}
          />
        </div>
        <div className="flex flex-col items-center gap-2">
          <h5 className="text-sm">Big variant</h5>
          <BallChart
            size="big"
            sets={[
              { percentage: 30, label: "Pre-Training" },
              { percentage: 60, label: "In-Training" },
              { percentage: 10, label: "Post-Training" },
            ]}
          />
        </div>
      </CardContent>
    </Card>
  );
}
