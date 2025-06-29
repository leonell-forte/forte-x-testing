import React from "react";

type SizePreset = "small" | "big";

type BallChartSet = {
  percentage: number;
  color?: string;
  label?: string;
};

type BallChartProps = {
  sets: [BallChartSet, BallChartSet, BallChartSet];
  size?: SizePreset;
};

const COLOR_PALETTE = [
  "fill-chart-1",
  "fill-chart-2",
  "fill-chart-3",
  "fill-chart-4",
  "fill-chart-5",
];

function getRandomColors(palette: string[], count: number): string[] {
  const shuffled = [...palette].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

const sizePresets = {
  small: { width: 120, height: 80, ballRadius: 2.5 },
  big: { width: 300, height: 200, ballRadius: 4 },
};

function getRandomPositions(
  count: number,
  width: number,
  height: number,
  radius: number
): { x: number; y: number }[] {
  const positions: { x: number; y: number }[] = [];
  for (let i = 0; i < count; i++) {
    const x = Math.random() * (width - 2 * radius) + radius;
    const randomY = Math.random();
    const skewedY = Math.pow(randomY, 0.3);
    const y = skewedY * (height - 2 * radius) + radius;
    positions.push({ x, y });
  }
  return positions;
}

export const BallChart: React.FC<BallChartProps> = ({ sets, size = "big" }) => {
  const { width, height, ballRadius } = sizePresets[size];

  const maxPossibleBalls = size === "big" ? 400 : 100;

  const randomColors = React.useMemo(
    () => getRandomColors(COLOR_PALETTE, 3),
    []
  );

  return (
    <div className="flex">
      {sets.map((set, setIdx) => {
        const color = set.color || randomColors[setIdx];
        const numBalls = Math.round((set.percentage / 100) * maxPossibleBalls);
        const positions = getRandomPositions(
          numBalls,
          width,
          height,
          ballRadius
        );
        const label = set.label || `Set ${setIdx + 1}`;

        return (
          <div className="flex flex-col items-center gap-y-2" key={setIdx}>
            <div className="bg-background flex flex-col items-center border-x border-b border-gray-300 p-2">
              <svg width={width} height={height} className="bg-transparent">
                {positions.map((p, i) => (
                  <circle
                    key={i}
                    cx={p.x}
                    cy={p.y}
                    r={ballRadius}
                    className={color}
                    opacity={0.85}
                    stroke="#333"
                    strokeWidth={0.5}
                  />
                ))}
              </svg>
            </div>
            <div className="flex flex-col items-center text-xs">
              <p>{label}</p>
              <p className="font-medium">{set.percentage}%</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
