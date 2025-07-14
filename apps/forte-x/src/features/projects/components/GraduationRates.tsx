import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type CustomTooltipProps,
} from "@repo/ui/components/chart";
import { useMemo } from "react";
import { Cell, Label, Pie, PieChart } from "recharts";

const chartData = [
  {
    browser: "chrome",
    visitors: 275,
    fill: "var(--chart-1)",
    stroke: "var(--chart-1)",
  },
  {
    browser: "safari",
    visitors: 200,
    fill: "var(--chart-2)",
    stroke: "var(--chart-2)",
  },
  {
    browser: "firefox",
    visitors: 287,
    fill: "var(--chart-3)",
    stroke: "var(--chart-3)",
  },
  {
    browser: "edge",
    visitors: 173,
    fill: "var(--chart-4)",
    stroke: "var(--chart-4)",
  },
  {
    browser: "other",
    visitors: 190,
    fill: "var(--chart-5)",
    stroke: "var(--chart-5)",
  },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
    color: "var(--chart-1)",
  },
  chrome: {
    label: "Chrome",
    color: "var(--chart-2)",
  },
  safari: {
    label: "Safari",
    color: "var(--chart-3)",
  },
  firefox: {
    label: "Firefox",
    color: "var(--chart-4)",
  },
  edge: {
    label: "Edge",
    color: "var(--chart-5)",
  },
  other: {
    label: "Other",
    color: "var(--chart-6)",
  },
} satisfies ChartConfig;

const GraduationRates = () => {
  const totalVisitors = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
  }, []);

  return (
    <div className="flex items-center">
      <ChartContainer config={chartConfig} className="h-40 w-40">
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={(props: CustomTooltipProps) => (
              <ChartTooltipContent {...props} hideLabel />
            )}
          />
          <Pie
            data={chartData}
            dataKey="visitors"
            nameKey="browser"
            innerRadius={60}
            strokeWidth={5}
          >
            {chartData.map((entry) => (
              <Cell key={entry.browser} fill={entry.fill} />
            ))}
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
                return null;
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
