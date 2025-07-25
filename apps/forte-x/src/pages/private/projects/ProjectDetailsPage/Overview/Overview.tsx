import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@repo/ui/components/card";
import { Progress } from "@repo/ui/components/progress";

import { BallChart } from "@/components/ball-chart/BallChart";

import content from "../../content.json";

const Overview = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-x-4 gap-y-12">
            <div>
              <CardTitle>Project Status</CardTitle>
              <CardDescription>Student Progress</CardDescription>
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
              <CardTitle>Timeline</CardTitle>
            </div>

            <Progress value={60} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-6">
          <CardTitle>Key Information</CardTitle>
          <div className="flex gap-6">
            {content.keyInformation.map((item, index) => {
              return (
                <Card key={index} className="bg-white/50">
                  <CardContent>
                    <CardTitle>{item}</CardTitle>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2">
        <div className="space-y-6">
          {Object.entries(content.providers).map(([key, value]) => {
            return (
              <div key={key} className="space-y-4">
                <p className="text-lg font-semibold">{key}</p>
                {value.map((item, index) => {
                  return (
                    <Card key={index} className="overflow-hidden p-0">
                      <div className="flex items-center">
                        <img
                          src={content.sampleImage}
                          alt="sample"
                          className="h-16 w-24"
                        />
                        <CardContent className="flex w-full justify-between">
                          <div>
                            <CardTitle>{item.course}</CardTitle>
                            <CardDescription>{item.cohort}</CardDescription>
                          </div>
                          <p className="text-lg font-semibold">
                            {item.students} Students
                          </p>
                        </CardContent>
                      </div>
                    </Card>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Overview;
