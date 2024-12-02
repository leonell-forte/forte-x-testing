import { Link, useParams } from "react-router-dom";
import Outcomes from "../../../components/Dashboard/Projects/Tables/Outcomes";
import arrow from "../../../assets/images/icons/arrow.svg";
import Contracts from "../../../components/Dashboard/Projects/Tables/Contracts";
import HorizontalScroller from "../../../components/ui/horizontal-scroller";

const IndividualProjectsPage = () => {
  // page title is set on the outcomes component

  const { id } = useParams();

  return (
    <div className="space-y-2.5 py-3 overflow-scroll h-full hide-scroll">
      <Link
        to="/projects"
        className="flex items-center gap-2.5"
      >
        <img
          src={arrow}
          alt="back"
        />

        <p className="font-semibold">Back</p>
      </Link>

      <Outcomes id={id as string} />

      <Contracts projectId={Number(id)} />

      {/* <Partners />

      <Beneficiaries /> */}
    </div>
  );
};

export default IndividualProjectsPage;
