import * as amplitude from "@amplitude/analytics-browser";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import arrow from "assets/images/icons/arrow.svg";

import Beneficiaries from "components/Dashboard/Projects/Tables/Beneficiaries";
import Contracts from "components/Dashboard/Projects/Tables/Contracts";
import Outcomes from "components/Dashboard/Projects/Tables/Outcomes";
import Partners from "components/Dashboard/Projects/Tables/Partners";

const IndividualProjectsPage = () => {
  // page title is set on the outcomes component

  const { id } = useParams();

  useEffect(() => {
    amplitude.track(`Individual Project Page View`, { id });
  }, [id]);

  return (
    <div className="hide-scroll h-full space-y-2.5 overflow-scroll py-3">
      <Link to="/projects" className="flex items-center gap-2.5">
        <img src={arrow} alt="back" />

        <p className="font-semibold">Back</p>
      </Link>

      <Outcomes id={id as string} />

      <Contracts projectId={Number(id)} />

      <Partners />

      <Beneficiaries id={id} />
    </div>
  );
};

export default IndividualProjectsPage;
