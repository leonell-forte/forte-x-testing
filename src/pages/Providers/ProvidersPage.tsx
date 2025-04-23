import { IFilters } from "lib/types/organizations";

import PageComponent from "components/Dashboard/Organizations/PageComponent";

const initialFilters: IFilters = {
  region: [],

  status: "",

  type: "provider",
};

const ProvidersPage = ({ hideHeader = false }: { hideHeader?: boolean }) => {
  return (
    <PageComponent
      hideHeader={hideHeader}
      type="provider"
      initialFilters={initialFilters}
    />
  );
};

export default ProvidersPage;
