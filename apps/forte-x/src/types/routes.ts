import type { ReactElement } from "react";
import type { LoaderFunctionArgs, Params } from "react-router-dom";

export interface BreadcrumbData {
  params: Params;
  data?: any;
}

export interface RouteHandle {
  breadcrumb: string | ((data: BreadcrumbData) => string);
}

export interface RouteConfig {
  path?: string;
  element: ReactElement;
  index?: boolean;
  children?: RouteConfig[];
  handle?: RouteHandle;
  loader?: (args: LoaderFunctionArgs) => Promise<any> | any;
}
