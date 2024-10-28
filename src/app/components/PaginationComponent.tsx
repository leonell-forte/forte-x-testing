"use client";

import Pagination from "@/components/ui/pagination";
import React, { useState } from "react";

const PaginationComponent = () => {
  const [page, setPage] = useState(1);
  return (
    <div>
      <p className="text-2xl text-white font-semibold uppercase mb-2">
        Pagination
      </p>
      <Pagination page={page} onPageChange={(val) => setPage(val)} total={50} />
    </div>
  );
};

export default PaginationComponent;
