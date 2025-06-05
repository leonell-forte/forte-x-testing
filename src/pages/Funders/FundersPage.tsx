import { IFilters } from "lib/types/organizations";

import PageComponent from "components/Dashboard/Organizations/PageComponent";

const initialFilters: IFilters = {
  region: [],

  status: "",

  type: "funder",

  sortLabel: "createdAt",

  sortValue: "desc",
};

const FundersPage = () => {
  return <PageComponent type="funder" initialFilters={initialFilters} />;
};

export default FundersPage;
