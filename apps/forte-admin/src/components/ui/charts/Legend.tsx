import { Tooltip } from "../tooltip/Tooltip";

interface LegendProps {
  segments: { label: string; color: string }[];
  max?: number; // Optional maximum number of legends to display
}

const Legend = ({ segments, max }: LegendProps) => {
  // If max is not provided or is greater than segments length, show all segments
  const shouldLimit = max !== undefined && segments.length > max;
  const visibleSegments = shouldLimit ? segments.slice(0, max) : segments;
  const hiddenSegments = shouldLimit ? segments.slice(max) : [];

  return (
    <div className="data-legend">
      <div className="relative flex flex-wrap items-center justify-center gap-2">
        {visibleSegments.map((seg, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span
              className="inline-block h-3 w-3 rounded-full"
              style={{ background: seg.color }}
            />
            <div className="text-[14px]">{seg.label}</div>
          </div>
        ))}

        {shouldLimit && (
          <Tooltip
            arrow={false}
            placement="top"
            title={
              <p className="font-light">
                {hiddenSegments.map((seg) => seg.label).join(", ")}
              </p>
            }
          >
            <p className="font-light text-white/50">
              +{hiddenSegments.length} more
            </p>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default Legend;
