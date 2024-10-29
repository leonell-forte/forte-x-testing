"use client";

import classNames from "classnames";
import { useMemo } from "react";
import arrow from "../../assets/images/icons/arrow.svg";

interface IPaginationProps {
  page: number;
  onPageChange: (value: number) => void;
  total: number;
  limit?: number;
}

const Pagination = ({
  page = 1,
  total,
  limit = 10,
  onPageChange,
}: IPaginationProps) => {
  const handlePrev = () => {
    onPageChange(page - 1);
  };

  const handleNext = () => {
    onPageChange(page + 1);
  };

  const pageCount = useMemo(() => total / limit, [total, limit]);

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={handlePrev}
        className="w-6 h-6 flex items-center justify-center"
        disabled={page <= 1}
      >
        <img
          alt="prev"
          src={arrow}
          className={classNames("rotate-[90deg]", page <= 1 && " opacity-[.2]")}
        />
      </button>
      <div className="w-6 h-6 rounded-[4px] border border-mint flex items-center justify-center">
        <input
          className="text-mint bg-transparent w-6 h-6 outline-none border-none text-center text-[14px] flex-shrink-0"
          value={page}
          type="number"
          onChange={(e) => onPageChange(Number(e.target.value))}
        />
      </div>
      <button
        type="button"
        onClick={handleNext}
        className="w-6 h-6 flex items-center justify-center"
        disabled={page >= pageCount}
      >
        <img
          alt="prev"
          src={arrow}
          className={classNames(
            "rotate-[-90deg]",
            page >= pageCount && "opacity-[.2]"
          )}
        />
      </button>
    </div>
  );
};

export default Pagination;
