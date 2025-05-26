import Card from "components/Dashboard/Dashboard/Card";
import Legend from "components/ui/charts/Legend";
import SegmentedProgressBar from "components/ui/charts/SegmentedProgressBar";

import DataText, { DataTextProps } from "./DataText";
import TileHeader from "./TileHeader";
import { SegmentType, TickType } from "./types";

type Props = {
  title: string;
  tooltip?: string;
  outcomeRates: DataTextProps;
  paymentsPending: DataTextProps;
  segments: SegmentType[];
  ticks: TickType[];
  total?: number;
};

const MilestoneTile = ({
  title,
  tooltip,
  outcomeRates,
  paymentsPending,
  segments,
  ticks,
  total,
}: Props) => {
  return (
    <Card variant="outline" className="space-y-6">
      <TileHeader title={title} tooltip={tooltip} />

      <div className="data-text-component wrapper grid grid-cols-2 divide-x divide-panel/10">
        <div className="pb-1 pr-2 pt-3">
          <DataText {...outcomeRates} />
        </div>
        <div className="pb-1 pl-6 pr-2 pt-3">
          <DataText {...paymentsPending} />
        </div>
      </div>

      <div className="data-text-component px-4">
        <SegmentedProgressBar segments={segments} ticks={ticks} total={total} />
      </div>

      <Legend segments={segments} />
    </Card>
  );
};

export default MilestoneTile;
