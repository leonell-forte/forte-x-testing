import React from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/chart";

const OutcomesAchieved = () => {
  const lineChartData = [
    { month: "January", desktop: 186 },
    { month: "February", desktop: 305 },
    { month: "March", desktop: 237 },
    { month: "April", desktop: 73 },
    { month: "May", desktop: 209 },
    { month: "June", desktop: 214 },
  ];

  const lineChartConfig = {
    desktop: {
      label: "Desktop",
      color: "blue",
    },
  } satisfies ChartConfig;
  return (
    <div>
      <ChartContainer config={lineChartConfig} className="h-44 w-44">
        <LineChart
          accessibilityLayer
          data={lineChartData}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={true} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Line
            dataKey="desktop"
            type="natural"
            stroke="blue"
            strokeWidth={2}
            dot={true}
          />
        </LineChart>
      </ChartContainer>
      <div>
        <p>Outcomes Achieved</p>
        <p>$ X,XXX saved</p>
      </div>
    </div>
  );
};

export default OutcomesAchieved;
