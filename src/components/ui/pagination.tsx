"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

import { cn } from "lib/utils";

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
  const [inputValue, setInputValue] = useState<string>(String(page));

  useEffect(() => {
    setInputValue(page.toString());
  }, [page]);

  const handlePrev = () => {
    onPageChange(page - 1);
    setInputValue(String(page - 1));
  };

  const handleNext = () => {
    onPageChange(page + 1);
    setInputValue(String(page + 1));
  };

  const pageCount = useMemo(() => Math.ceil(total / limit), [total, limit]);

  const [prevTotal, setPrevTotal] = useState(1);

  useEffect(() => {
    if (!isNaN(pageCount)) setPrevTotal(pageCount);
  }, [pageCount]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      // Allow only numeric input
      setInputValue(value);
    }
  };

  const handleBlur = () => {
    const newPage = Number(inputValue);
    if (newPage >= 1 && newPage <= pageCount) {
      onPageChange(newPage);
    } else {
      // Reset to current page if invalid
      setInputValue(String(page));
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={handlePrev}
        className="group"
        disabled={page <= 1}
      >
        <HiChevronLeft
          className={cn(
            "h-auto w-[18px] transition-all group-hover:fill-mint",

            page <= 1 && "opacity-[.2]"
          )}
        />
      </button>
      <div className="flex items-center gap-1.5">
        <div className="flex h-6 w-6 items-center justify-center rounded-[4px] border border-mint">
          <input
            className="h-6 w-6 flex-shrink-0 border-none bg-transparent text-center text-[14px] text-mint outline-none"
            value={inputValue}
            type="text"
            onChange={handleInputChange}
            onBlur={handleBlur}
          />
        </div>

        <span className="text-[14px] text-gray-200">
          of {!isNaN(pageCount) ? pageCount : prevTotal}
        </span>
      </div>
      <button
        type="button"
        onClick={handleNext}
        className="group"
        disabled={page >= pageCount}
      >
        <HiChevronRight
          className={cn(
            "h-auto w-[18px] transition-all group-hover:fill-mint",

            page >= pageCount && "opacity-[.2]"
          )}
        />
      </button>
    </div>
  );
};

export default Pagination;
