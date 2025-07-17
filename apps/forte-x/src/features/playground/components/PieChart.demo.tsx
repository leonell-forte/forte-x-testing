import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
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

export default function PieChartDemo() {
  const totalVisitors = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
  }, []);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pie Chart</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <ChartContainer config={chartConfig} className="h-40 w-40">
          <PieChart width={160} height={160}>
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
              strokeWidth={10}
            >
              {chartData.map((entry) => (
                <Cell key={entry.browser} fill={entry.fill} />
              ))}
              <Label
                position="center"
                content={() => {
                  return (
                    <text
                      x={"50%"}
                      y={"50%"}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={24}
                      fontWeight="bold"
                      fill="var(--foreground)"
                    >
                      {totalVisitors.toLocaleString()}
                    </text>
                  );
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
        <p>Graduation Rate</p>
      </CardContent>
    </Card>
  );
}
