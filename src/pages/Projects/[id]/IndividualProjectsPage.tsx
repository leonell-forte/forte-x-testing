import { Link, useNavigate, useParams } from "react-router-dom";

import arrow from "assets/images/icons/arrow.svg";

import { ContractsProvider } from "components/Dashboard/Contracts/Dialogues/ContractContext";
import Beneficiaries from "components/Dashboard/Projects/Tables/Beneficiaries";
import Contracts from "components/Dashboard/Projects/Tables/Contracts";
import Outcomes from "components/Dashboard/Projects/Tables/Outcomes";

// import Partners from "components/Dashboard/Projects/Tables/Partners";

const IndividualProjectsPage = () => {
  // page title is set on the outcomes component

  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="hide-scroll h-full space-y-8 py-3">
      <Link
        to={".."}
        onClick={(e) => {
          e.preventDefault();
          navigate(-1);
        }}
        className="flex items-center gap-2.5"
      >
        <img src={arrow} alt="back" />

        <p className="font-semibold">Back</p>
      </Link>

      <Outcomes id={id as string} />

      <ContractsProvider>
        <Contracts projectId={Number(id)} />
      </ContractsProvider>

      {/* temporarily hide partners */}
      {/* <Partners projectId={Number(id)} /> */}

      <Beneficiaries id={id} />
    </div>
  );
};

export default IndividualProjectsPage;
