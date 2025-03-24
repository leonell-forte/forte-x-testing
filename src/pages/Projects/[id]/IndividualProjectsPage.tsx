import { HiArrowLeft } from "react-icons/hi2";
import { Link, useParams } from "react-router-dom";

import { ContractsProvider } from "components/Dashboard/Contracts/Dialogues/ContractContext";
import Beneficiaries from "components/Dashboard/Projects/Tables/Beneficiaries";
import Contracts from "components/Dashboard/Projects/Tables/Contracts";
import Outcomes from "components/Dashboard/Projects/Tables/Outcomes";

// import Partners from "components/Dashboard/Projects/Tables/Partners";

const IndividualProjectsPage = () => {
  const { id } = useParams();

  return (
    <div className="hide-scroll h-full space-y-8 py-3">
      <Link to="/projects" className="group flex w-fit items-center gap-2.5">
        <HiArrowLeft className="transition group-hover:fill-mint" />
        <p className="font-semibold transition group-hover:text-mint">Back</p>
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
