import { SortValues } from "lib/types/common";
import { IFilters } from "lib/types/organizations";

import PageComponent from "components/Dashboard/Organizations/PageComponent";

const initialFilters: IFilters = {
  region: [],

  status: "",

  type: "funder",

  sortLabel: "createdAt",

  sortValue: SortValues.DESC,
};

const FundersPage = () => {
  return <PageComponent type="funder" initialFilters={initialFilters} />;
};

export default FundersPage;
