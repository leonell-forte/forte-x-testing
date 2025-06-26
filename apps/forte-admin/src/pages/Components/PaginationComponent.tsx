import { useState } from "react";

import Pagination from "@/components/ui/pagination";

const PaginationComponent = () => {
  const [page, setPage] = useState(1);
  return (
    <div>
      <p className="mb-2 text-2xl font-semibold uppercase text-white">
        Pagination
      </p>
      <Pagination page={page} onPageChange={(val) => setPage(val)} total={50} />
    </div>
  );
};

export default PaginationComponent;
