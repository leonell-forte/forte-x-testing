import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import SearchInput from "@/components/ui/search-input";

export const SearchConsoleMarker = () => {
  return <div id="search-console" />;
};

export const SearchConsole = () => {
  const params = useParams();

  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const location = useLocation();
  const [searchConsoleOut, setSearchConsoleOut] = useState<HTMLElement | null>(
    null
  );

  useEffect(() => {
    setSearchConsoleOut(document.getElementById("search-console"));
  }, [location, setSearchConsoleOut]);

  useEffect(() => {
    if (!params?.query) {
      setQ("");
      return;
    }
    setQ(params.query);
  }, [params]);

  return (
    <>
      {searchConsoleOut &&
        createPortal(
          <form
            autoComplete="off"
            onSubmit={(e) => {
              e.preventDefault();
              navigate(`/search/${q}`);
            }}
            className="search-console"
          >
            <SearchInput
              containerClass="hidden sm:flex md:w-[286px]"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onClear={() => setQ("")}
            />
          </form>,
          searchConsoleOut
        )}
    </>
  );
};
