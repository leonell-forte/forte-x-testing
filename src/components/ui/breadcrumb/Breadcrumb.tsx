import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";

import { cn } from "lib/utils";

export const BreadCrumbs = () => {
  return (
    <div className="bread-container">
      <div
        id="bread-crumbs"
        className="flex w-full flex-wrap items-center space-x-3"
      />
    </div>
  );
};

type Props = {
  href?: string;
  className?: string;
  children: ReactNode;
};

export const BreadCrumb = ({ children, href, className }: Props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [breadCrumbOut, setBreadCrumbOut] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setBreadCrumbOut(document.getElementById("bread-crumbs"));
  }, [location, setBreadCrumbOut]);
  return (
    <>
      {breadCrumbOut &&
        createPortal(
          <div
            className={cn(
              "bread-crumb overflow-hidden text-ellipsis whitespace-nowrap transition duration-500 [&:last-child]:font-semibold",
              href ? "text-white hover:text-mint" : "text-white",
              className
            )}
            {...(href !== undefined
              ? { role: "button", onClick: () => navigate(href) }
              : {})}
          >
            {children}
          </div>,
          breadCrumbOut
        )}
    </>
  );
};
