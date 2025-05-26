import {
  Cell,
  PieChart as Chart,
  Pie,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { SegmentType } from "components/Dashboard/Dashboard/types";

type ChartProps = {
  segments: SegmentType[];
  total?: number;
};

const PieChart = ({ segments, total }: ChartProps) => {
  return (
    <ResponsiveContainer width={100} height={100} className="mx-auto">
      <Chart>
        <Pie
          data={[
            ...segments,
            total && { value: total, color: "", label: "Total" },
          ]}
          cx="50%"
          cy="50%"
          outerRadius={48}
          innerRadius={40}
          cornerRadius={10}
          stroke="none"
          spacing={24}
          dataKey="value"
          paddingAngle={5}
        >
          {segments.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} stroke={"none"} />
          ))}
          {!!total && (
            <Cell
              key={`cell-${segments.length + (total ? 1 : 0)}`}
              fill={"transparent"}
              stroke={"white"}
            />
          )}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload) return null;
            const { payload: segment } = payload[0];
            return (
              <div className="flex items-center gap-2 rounded-[8px] bg-black/50 px-4 py-2">
                <div>
                  <p className="text-[8px] font-light">{segment.label}</p>
                  <p className="font-light">{segment.value}</p>
                </div>
              </div>
            );
          }}
        />
      </Chart>
    </ResponsiveContainer>
  );
};

export default PieChart;
