import { BallChart } from "@/components/ball-chart/BallChart";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/card";

const Overview = () => {
  return (
    <div>
      <Card>
        <CardContent>
          <div className="grid grid-cols-2">
            <div>
              <CardTitle>Overview</CardTitle>
              <CardDescription>asdkasdlkasj;</CardDescription>
            </div>

            <BallChart
              size="smaller"
              sets={[
                { percentage: 30, label: "Pre-Training" },
                { percentage: 60, label: "In-Training" },
                { percentage: 10, label: "Post-Training" },
              ]}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Overview;
