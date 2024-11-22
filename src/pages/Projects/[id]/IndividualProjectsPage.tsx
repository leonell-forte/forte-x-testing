import { Link } from "react-router-dom";
import Outcomes from "../../../components/Dashboard/Projects/Tables/Outcomes";
import arrow from "../../../assets/images/icons/arrow.svg";
import Contracts from "../../../components/Dashboard/Projects/Tables/Contracts";
import Partners from "../../../components/Dashboard/Projects/Tables/Partners";
import Beneficiaries from "../../../components/Dashboard/Projects/Tables/Beneficiaries";

const IndividualProjectsPage = () => {
  return (
    <div className="space-y-2.5 py-3">
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

      <Outcomes />

      <Contracts />

      <Partners />

      <Beneficiaries />
    </div>
  );
};

export default IndividualProjectsPage;
