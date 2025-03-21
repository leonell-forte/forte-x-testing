"use client";

import { useEffect, useState } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

interface IPaginationProps {
  page: number;
  onPageChange: (value: number) => void;
  total: number;
  pageSize?: number;
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

const Pagination = ({
  page = 1,
  total,
  onPageChange,
  pageSize = 10,
}: IPaginationProps) => {
  const [currentPage, setCurrentPage] = useState(page);
  const totalPages = calculateTotalPages(total, pageSize);
  const { start, end } = calculatePageRange(currentPage, pageSize, total);
  const [currentSet, setCurrentSet] = useState(Math.ceil(currentPage / 5));

  // Update the set when currentPage changes externally
  useEffect(() => {
    setCurrentSet(Math.ceil(currentPage / 5));
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;

    // Calculate which set this page belongs to
    const newSet = Math.ceil(page / 5);

    // Update the current set if needed
    if (newSet !== currentSet) {
      setCurrentSet(newSet);
    }

    setCurrentPage(page);
    if (onPageChange) {
      onPageChange(page);
    }
  };

  // Get the visible pages for the current set
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
    <div className="flex w-full items-center justify-between pt-4">
      <div className="text-xs opacity-60">
        <p>
          Showing {start} to {end} of {total}
        </p>
        <p>
          Page {currentPage} of {totalPages}
        </p>
      </div>
      {totalPages > 1 ? (
        <div className="flex items-center justify-center gap-2 rounded-lg">
          <button
            className="flex h-8 w-7 items-center justify-center rounded-md border border-white/10 text-white transition-colors hover:bg-[#1a2b32] disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <HiChevronLeft className="h-5 w-5" />
          </button>

          {visiblePages.map((page) => (
            <button
              key={page}
              className={`flex h-8 w-7 items-center justify-center rounded-md font-medium text-white transition-colors ${
                currentPage === page
                  ? "bg-[#1a9b78]"
                  : "border border-white/10 hover:bg-[#1a2b32]"
              }`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}

          <button
            className="flex h-8 w-7 items-center justify-center rounded-md border border-white/10 text-white transition-colors hover:bg-[#1a2b32] disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <HiChevronRight className="h-5 w-5" />
          </button>
        </div>
      ) : (
        <div />
      )}
    </div>
  );
};

export default Pagination;
