import classNames from "classnames";
import React, { type ReactNode, useEffect, useRef, useState } from "react";

import { type SegmentType } from "@/components/Dashboard/Dashboard/types";
import { Tooltip } from "@/components/ui/tooltip/Tooltip";
import { formatNumber } from "@/lib/utils";

interface SegmentedProgressBarProps {
  segments: SegmentType[];
  ticks?: {
    label: string;
    value?: string | number;
  }[];
  height?: number;
  gap?: number;
  pillRadius?: number;
  midRadius?: number;
  borderColor?: string;
  backgroundColor?: string;
  borderPadding?: number;
  label?: string | ReactNode;
  maxValue?: number;
  progress?: string | ReactNode;
  total?: number;
  segmentGap?: number;
  nonSegmented?: boolean;
  noTooltip?: boolean;
  minSegmentWidth?: number;
  threshold?: number;
  thresholdWidth?: number;
}

function getSegmentPath(
  x: number,
  y: number,
  w: number,
  h: number,
  rxLeft: number,
  rxRight: number
) {
  rxLeft = Math.min(rxLeft, w / 2, h / 2);
  rxRight = Math.min(rxRight, w / 2, h / 2);

  return `
    M${x + rxLeft},${y}
    H${x + w - rxRight}
    A${rxRight},${rxRight} 0 0 1 ${x + w},${y + rxRight}
    V${y + h - rxRight}
    A${rxRight},${rxRight} 0 0 1 ${x + w - rxRight},${y + h}
    H${x + rxLeft}
    A${rxLeft},${rxLeft} 0 0 1 ${x},${y + h - rxLeft}
    V${y + rxLeft}
    A${rxLeft},${rxLeft} 0 0 1 ${x + rxLeft},${y}
    Z
  `;
}

const SegmentedProgressBar: React.FC<SegmentedProgressBarProps> = ({
  segments,
  height = 24,
  pillRadius = 12,
  midRadius = 3,
  borderColor = "#fff",
  backgroundColor = "transparent",
  borderPadding = 3,
  label,
  ticks,
  progress,
  total: propTotal,
  segmentGap = 3,
  nonSegmented = false,
  noTooltip = false,
  minSegmentWidth = 20,
  threshold,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.offsetWidth);
      }
    };
    handleResize();
    const observer = new (window as any).ResizeObserver(handleResize);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const filteredSegments = segments.filter((seg) => seg.value !== 0);

  const segmentsSum = filteredSegments.reduce(
    (sum, seg) => sum + (seg.value as number),
    0
  );

  const total = propTotal !== undefined ? propTotal : segmentsSum;

  const [anchorPos, setAnchorPos] = useState<{ left: number; top: number }>({
    left: 0,
    top: 0,
  });

  const thresholdPillExtra = threshold !== undefined ? 6 : 0;
  const extraSpace = threshold !== undefined ? thresholdPillExtra * 2 : 0;
  const verticalOffset = extraSpace / 2;

  const barY = 1 + verticalOffset;
  const barHeight = height - 2;

  const innerX = borderPadding + 1;
  const innerY = barY + borderPadding;
  const innerWidth = width - 2 * borderPadding - 2;
  const innerHeight = barHeight - 2 * borderPadding;

  const calculateSegmentWidths = () => {
    if (filteredSegments.length === 0 || innerWidth <= 0) return [];

    const initialWidths = filteredSegments.map((seg) => {
      let segWidth = ((seg.value as number) / total) * innerWidth;

      if (filteredSegments.length > 1) {
        segWidth -=
          (segmentGap * (filteredSegments.length - 1)) /
          filteredSegments.length;
      }

      return Math.max(segWidth, minSegmentWidth);
    });

    const totalSegmentWidth =
      initialWidths.reduce((sum, width) => sum + width, 0) +
      (filteredSegments.length - 1) * segmentGap;

    if (totalSegmentWidth > innerWidth) {
      const availableWidth =
        innerWidth - (filteredSegments.length - 1) * segmentGap;
      const scaleFactor =
        availableWidth /
        (totalSegmentWidth - (filteredSegments.length - 1) * segmentGap);
      return initialWidths.map((width) => width * scaleFactor);
    }

    return initialWidths;
  };

  const segmentWidths = calculateSegmentWidths();

  const getThresholdPosition = () => {
    if (threshold === undefined || total === 0) return null;

    const thresholdRatio = threshold / total;
    const thresholdX = innerX + thresholdRatio * innerWidth;

    return Math.min(Math.max(thresholdX, innerX), innerX + innerWidth);
  };

  const thresholdX = getThresholdPosition();

  const getThresholdSegment = () => {
    if (threshold === undefined || thresholdX === null) return null;

    let currentX = innerX;
    for (let i = 0; i < filteredSegments.length; i++) {
      const segmentEndX = currentX + segmentWidths[i];
      if (thresholdX >= currentX && thresholdX <= segmentEndX) {
        return filteredSegments[i];
      }
      currentX = segmentEndX + segmentGap;
    }

    return filteredSegments.length > 0
      ? filteredSegments[filteredSegments.length - 1]
      : null;
  };

  const thresholdSegment = getThresholdSegment();

  const thresholdWidth = 4;
  const thresholdY = barY - thresholdPillExtra;
  const thresholdHeight = barHeight + thresholdPillExtra * 2;

  return (
    <div className="segmented-progress-bar flex w-full flex-col gap-2">
      <div className="flex flex-col gap-2">
        <div
          className="relative"
          ref={containerRef}
          style={{ height: height + "px" }}
        >
          {label && (
            <div className="label-container absolute left-0 top-[-24px] flex w-full justify-between">
              <div className="text-[14px] font-light">{label}</div>
              {progress !== undefined && (
                <div className="text-[14px] font-light">{progress}</div>
              )}
            </div>
          )}
          <div
            ref={anchorRef}
            className="pointer-events-none absolute"
            style={{
              left: anchorPos.left,
              top: anchorPos.top,
              width: 2,
              height: 2,
              zIndex: 50,
            }}
          />
          {width > 0 && (
            <svg
              width={width}
              height={height}
              viewBox={`0 0 ${width} ${height}`}
              xmlns="http://www.w3.org/2000/svg"
              style={{ overflow: "visible" }}
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Background and border */}
              <rect
                x={1}
                y={barY}
                width={width - 2}
                height={barHeight}
                rx={pillRadius}
                ry={pillRadius}
                fill={backgroundColor}
                stroke={borderColor}
                strokeWidth={1}
              />
              {/* Segments as paths */}
              {filteredSegments.map((seg, idx) => {
                let x = innerX;

                // Calculate x position based on previous segments
                for (let i = 0; i < idx; i++) {
                  x += segmentWidths[i] + segmentGap;
                }

                let rxLeft = midRadius;
                let rxRight = midRadius;
                if (nonSegmented) {
                  rxLeft = pillRadius;
                  rxRight = pillRadius;
                } else if (idx === 0) {
                  rxLeft = pillRadius;
                  rxRight = midRadius;
                } else if (idx === filteredSegments.length - 1) {
                  rxLeft = midRadius;
                  rxRight = pillRadius;
                }

                const path = getSegmentPath(
                  x,
                  innerY,
                  segmentWidths[idx],
                  innerHeight,
                  rxLeft,
                  rxRight
                );

                return (
                  <Tooltip
                    key={idx}
                    title={
                      !noTooltip ? (
                        <div className="flex min-w-[80px] flex-col">
                          <div className="mb-1 flex items-center">
                            <span
                              className="mr-2 inline-block h-3 w-3 rounded-full"
                              style={{ background: seg.color }}
                            />
                            <div className="text-white">
                              {seg.label || `Segment ${idx + 1}`}
                            </div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-400">
                              Value:{" "}
                            </span>
                            <span className="text-white">
                              {formatNumber(seg.value, 0)}
                            </span>
                          </div>
                        </div>
                      ) : null
                    }
                    placement="top"
                    arrow={false}
                  >
                    <path
                      key={idx}
                      d={path}
                      fill={seg.color}
                      stroke="none"
                      className={seg.className}
                      onMouseMove={(e) => {
                        if (containerRef.current) {
                          const rect =
                            containerRef.current.getBoundingClientRect();
                          setAnchorPos({
                            left: e.clientX - rect.left,
                            top: e.clientY - rect.top,
                          });
                        }
                      }}
                      style={{ cursor: noTooltip ? "default" : "pointer" }}
                    />
                  </Tooltip>
                );
              })}

              {/* Threshold indicator */}
              {threshold !== undefined &&
                thresholdX !== null &&
                thresholdSegment && (
                  <Tooltip
                    title={
                      !noTooltip ? (
                        <>
                          <div className="flex min-w-[80px] gap-1">
                            <div className="mb-1 flex items-center">
                              <div className="text-white">Threshold:</div>
                            </div>
                            <div>
                              <span className="text-white">
                                {formatNumber(threshold, 0)}
                              </span>
                            </div>
                          </div>
                          <div className="flex min-w-[80px] gap-1">
                            <div className="mb-1 flex items-center">
                              <div className="text-white">
                                Total # of beneficiaries:
                              </div>
                            </div>
                            <div>
                              <span className="text-white">
                                {formatNumber(total, 0)}
                              </span>
                            </div>
                          </div>
                        </>
                      ) : null
                    }
                    placement="top"
                    arrow={false}
                  >
                    <rect
                      x={thresholdX - thresholdWidth / 2}
                      y={thresholdY}
                      width={thresholdWidth}
                      height={thresholdHeight}
                      fill={thresholdSegment.color}
                      rx={thresholdWidth / 2}
                      ry={thresholdWidth / 2}
                      style={{
                        cursor: noTooltip ? "default" : "pointer",
                        stroke: thresholdSegment.color,
                        strokeWidth: 2,
                      }}
                      className="drop-shadow"
                    />
                  </Tooltip>
                )}
            </svg>
          )}
        </div>
        {ticks && (
          <div className="segmented-tick-container flex justify-between">
            {ticks?.map((tick, index) => {
              const last = index === ticks.length - 1;
              const first = index === 0;
              const hasTickValue = tick.value !== undefined;
              return (
                <div
                  key={index}
                  className={classNames(
                    "overflow-hidden",
                    first && "text-left",
                    last && "text-right",
                    !first && !last && "text-center"
                  )}
                >
                  {hasTickValue && (
                    <p
                      className={classNames(
                        "segmented-tick-value text-[20px] font-light",
                        tick.value === undefined && "!text-[10px] font-light"
                      )}
                    >
                      {tick.value}
                    </p>
                  )}
                  <p
                    className={classNames(
                      "segmented-tick-label truncate font-light",
                      !hasTickValue && "text-[10px]"
                    )}
                  >
                    {tick.label}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SegmentedProgressBar;
