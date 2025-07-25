import { useLocation, useMatches } from "react-router-dom";

interface RouteMatch {
  id: string;
  pathname: string;
  pathnameBase: string;
  params: Record<string, string | undefined>;
  data: unknown;
  handle?: {
    breadcrumb?: string | ((data: { params: any; data: any }) => string);
  };
}

export function useBreadcrumbs(): { showBreadcrumbs: boolean } {
  const matches = useMatches() as RouteMatch[];
  const location = useLocation();

  const hideBreadcrumbsOnRoutes: string[] = ["/projects", "/add"];

  const showBreadcrumbs: boolean =
    !hideBreadcrumbsOnRoutes.includes(location.pathname) &&
    matches.filter((match) => match.handle?.breadcrumb).length > 0;

  return { showBreadcrumbs };
}
