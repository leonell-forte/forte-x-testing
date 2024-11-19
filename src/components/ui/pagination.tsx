"use client";

import classNames from "classnames";
import { useMemo, useState } from "react";
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
  const [inputValue, setInputValue] = useState<string>(String(page));

  const handlePrev = () => {
    onPageChange(page - 1);
    setInputValue(String(page - 1));
  };

  const handleNext = () => {
    onPageChange(page + 1);
    setInputValue(String(page + 1));
  };

  const pageCount = useMemo(() => Math.ceil(total / limit), [total, limit]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        className="w-6 h-6 flex items-center justify-center"
        disabled={page <= 1}
      >
        <img
          alt="prev"
          src={arrow}
          className={classNames("rotate-[90deg]", page <= 1 && "opacity-[.2]")}
        />
      </button>
      <div className="w-6 h-6 rounded-[4px] border border-mint flex items-center justify-center">
        <input
          className="text-mint bg-transparent w-6 h-6 outline-none border-none text-center text-[14px] flex-shrink-0"
          value={inputValue}
          type="text"
          onChange={handleInputChange}
          onBlur={handleBlur}
        />
      </div>
      <button
        type="button"
        onClick={handleNext}
        className="w-6 h-6 flex items-center justify-center"
        disabled={page >= pageCount}
      >
        <img
          alt="next"
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
