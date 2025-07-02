import { BallChart } from "@/components/ball-chart/BallChart";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/card";
import { Progress } from "@/components/progress";

const Overview = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-x-4 gap-y-12">
            <div>
              <CardTitle>Overview</CardTitle>
              <CardDescription>asdkasdlkasj;</CardDescription>
            </div>

            <BallChart
              size="small"
              sets={[
                { percentage: 30, label: "Pre-Training" },
                { percentage: 60, label: "In-Training" },
                { percentage: 10, label: "Post-Training" },
              ]}
            />

            <div>
              <CardTitle>Overview</CardTitle>
              <CardDescription>asdkasdlkasj;</CardDescription>
            </div>

            <Progress value={60} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <CardTitle>Key Information</CardTitle>
        </CardContent>
      </Card>
    </div>
  );
};

export default Overview;
