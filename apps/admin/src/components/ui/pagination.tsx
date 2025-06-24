"use client";

import React, { useEffect, useState } from "react";
import {
  HiChevronLeft,
  HiChevronRight,
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronDoubleRight,
} from "react-icons/hi2";

interface IPaginationProps {
  page: number;
  onPageChange: (value: number) => void;
  total: number;
  pageSize?: number;
  onPageSizeChange?: (value: number) => void;
}

export function calculateTotalPages(
  totalRecords: number,
  pageSize: number
): number {
  if (totalRecords <= 0 || pageSize <= 0) {
    return 0;
  }
  return Math.ceil(totalRecords / pageSize);
}

export function calculatePageRange(
  currentPage: number,
  pageSize: number,
  totalRecords: number
): { start: number; end: number } {
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(start + pageSize - 1, totalRecords);

  return { start, end };
}

const pageSizeOptions = [10, 25, 50, 100];

const Pagination = ({
  page = 1,
  total,
  onPageChange,
  pageSize = 10,
  onPageSizeChange,
}: IPaginationProps) => {
  const [currentPage, setCurrentPage] = useState(page);
  const totalPages = calculateTotalPages(total, pageSize);
  const { start, end } = calculatePageRange(currentPage, pageSize, total);
  const [currentSet, setCurrentSet] = useState(Math.ceil(currentPage / 5));

  useEffect(() => {
    setCurrentSet(Math.ceil(currentPage / 5));
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;

    const newSet = Math.ceil(page / 5);

    if (newSet !== currentSet) {
      setCurrentSet(newSet);
    }

    setCurrentPage(page);
    if (onPageChange) {
      onPageChange(page);
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    if (onPageSizeChange) {
      onPageSizeChange(newPageSize);
    }
    handlePageChange(1);
  };

  const handleKeyDown = (event: React.KeyboardEvent, targetPage: number) => {
    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        handlePageChange(targetPage);
        break;
      case "ArrowLeft":
        event.preventDefault();
        if (currentPage > 1) handlePageChange(currentPage - 1);
        break;
      case "ArrowRight":
        event.preventDefault();
        if (currentPage < totalPages) handlePageChange(currentPage + 1);
        break;
      case "Home":
        event.preventDefault();
        handlePageChange(1);
        break;
      case "End":
        event.preventDefault();
        handlePageChange(totalPages);
        break;
    }
  };

  const getVisiblePages = (): number[] => {
    const startPage = (currentSet - 1) * 5 + 1;
    const endPage = Math.min(startPage + 4, totalPages);

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };

  const visiblePages = getVisiblePages();

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className="flex w-full flex-col items-center justify-center gap-y-3 pt-4"
    >
      {totalPages > 1 && (
        <div
          className="flex items-center justify-center gap-2 rounded-lg"
          role="group"
        >
          <button
            className="flex h-8 w-7 items-center justify-center rounded-md border border-white/10 text-white transition-colors hover:bg-[#1a2b32] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => handlePageChange(1)}
            onKeyDown={(e) => handleKeyDown(e, 1)}
            disabled={currentPage === 1}
            aria-label="First page"
            aria-disabled={currentPage === 1}
          >
            <HiOutlineChevronDoubleLeft
              className="h-5 w-5"
              aria-hidden="true"
            />
          </button>

          <button
            className="flex h-8 w-7 items-center justify-center rounded-md border border-white/10 text-white transition-colors hover:bg-[#1a2b32] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => handlePageChange(currentPage - 1)}
            onKeyDown={(e) => handleKeyDown(e, currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
            aria-disabled={currentPage === 1}
          >
            <HiChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>

          {visiblePages.map((page) => (
            <button
              key={page}
              className={`flex h-8 w-7 items-center justify-center rounded-md font-medium text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                currentPage === page
                  ? "bg-[#1a9b78]"
                  : "border border-white/10 hover:bg-[#1a2b32]"
              }`}
              onClick={() => handlePageChange(page)}
              onKeyDown={(e) => handleKeyDown(e, page)}
              aria-label={`Page ${page}`}
              aria-current={currentPage === page ? "page" : undefined}
            >
              {page}
            </button>
          ))}

          <button
            className="flex h-8 w-7 items-center justify-center rounded-md border border-white/10 text-white transition-colors hover:bg-[#1a2b32] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => handlePageChange(currentPage + 1)}
            onKeyDown={(e) => handleKeyDown(e, currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next page"
            aria-disabled={currentPage === totalPages}
          >
            <HiChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>

          <button
            className="flex h-8 w-7 items-center justify-center rounded-md border border-white/10 text-white transition-colors hover:bg-[#1a2b32] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => handlePageChange(totalPages)}
            onKeyDown={(e) => handleKeyDown(e, totalPages)}
            disabled={currentPage === totalPages}
            aria-label="Last page"
            aria-disabled={currentPage === totalPages}
          >
            <HiOutlineChevronDoubleRight
              className="h-5 w-5"
              aria-hidden="true"
            />
          </button>
        </div>
      )}

      <div className="flex items-center gap-4 text-xs">
        {total > 0 && (
          <div className="opacity-60" aria-live="polite" role="status">
            <p>
              {start} to {end} of {total} items
            </p>
          </div>
        )}

        {onPageSizeChange && total > pageSizeOptions[0] && (
          <div className="flex items-center gap-2">
            <label htmlFor="page-size-select" className="!text-xs opacity-60">
              Show:
            </label>
            <select
              id="page-size-select"
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="rounded-md border border-white/10 bg-transparent px-2 py-1 text-white focus:outline-none focus:ring-2 focus:ring-[#1a9b78]"
              aria-label="Items per page"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size} className="bg-gray-800">
                  {size}
                </option>
              ))}
            </select>
            <span className="text-xs opacity-60">per page</span>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Pagination;
