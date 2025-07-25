// components/Breadcrumbs.tsx
import { Link, useMatches } from "react-router-dom";

import type { RouteHandle } from "@/types/routes";

interface MatchWithHandle {
  id: string;
  pathname: string;
  pathnameBase: string;
  params: Record<string, string | undefined>;
  data: any;
  handle?: RouteHandle;
}

interface Breadcrumb {
  label: string;
  href: string;
}

export function Breadcrumbs(): JSX.Element {
  const matches = useMatches() as MatchWithHandle[];

  // Filter matches that have breadcrumb handles and build breadcrumbs
  const crumbs: Breadcrumb[] = matches
    .filter((match): match is MatchWithHandle & { handle: RouteHandle } =>
      Boolean(match.handle?.breadcrumb)
    )
    .map((match, idx) => {
      const { breadcrumb } = match.handle;

      const label =
        typeof breadcrumb === "function"
          ? breadcrumb({ params: match.params, data: match.data })
          : breadcrumb;

      // Build the href by joining pathname bases up to this point
      const href = matches
        .slice(1, idx + 1)
        .map((m) => m.pathnameBase)
        .join("");

      return { label, href };
    });

  if (crumbs.length === 0) return <></>;

  return (
    <nav className="text-muted-foreground flex items-center space-x-2 text-sm">
      {crumbs.map((crumb, idx) => (
        <span key={crumb.href} className="flex items-center">
          {idx > 0 && <span className="mx-1">/</span>}
          {idx < crumbs.length - 1 ? (
            <Link to={crumb.href} className="hover:underline">
              {crumb.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
