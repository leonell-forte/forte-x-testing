import React, { useMemo } from "react";
import { Label, Pie, PieChart } from "recharts";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/chart";

const GraduationRates = () => {
  const chartData = [
    { browser: "chrome", visitors: 275, fill: "red", stroke: "red" },
    { browser: "safari", visitors: 200, fill: "blue", stroke: "blue" },
    { browser: "firefox", visitors: 287, fill: "green", stroke: "green" },
    { browser: "edge", visitors: 173, fill: "yellow", stroke: "yellow" },
    { browser: "other", visitors: 190, fill: "purple", stroke: "purple" },
  ];

  const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    chrome: {
      label: "Chrome",
      color: "red",
    },
    safari: {
      label: "Safari",
      color: "blue",
    },
    firefox: {
      label: "Firefox",
      color: "green",
    },
    edge: {
      label: "Edge",
      color: "yellow",
    },
    other: {
      label: "Other",
      color: "purple",
    },
  } satisfies ChartConfig;

  const totalVisitors = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
  }, [chartData]);
  return (
    <div className="flex items-center">
      <ChartContainer config={chartConfig} className="h-40 w-40">
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={chartData}
            dataKey="visitors"
            nameKey="browser"
            innerRadius={60}
            strokeWidth={5}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-3xl font-bold"
                      >
                        {totalVisitors.toLocaleString()}
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
      <p>Graduation Rate</p>
    </div>
  );
};

export default GraduationRates;
