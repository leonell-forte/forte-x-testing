import { isPhoneValid } from "lib/isPhoneValid";
import { IBeneficiaries } from "lib/types/beneficiaries";
import { formatDate } from "lib/utils";

import InfoVertical from "components/ui/info-vertical/InfoVertical";

type Params = {
  beneficiary: IBeneficiaries;
};

const PersonalDetailsSection = ({ beneficiary }: Params) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 items-center gap-6 rounded-lg border p-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3">
        <InfoVertical label="First Name">{beneficiary.firstName}</InfoVertical>
        <InfoVertical label="Email">{beneficiary.email}</InfoVertical>
        <InfoVertical label="Date of birth">
          {formatDate(beneficiary.birthdate || "")}
        </InfoVertical>
        <InfoVertical label="Last Name">
          {beneficiary.lastName || "-"}
        </InfoVertical>
        <InfoVertical label="Phone">
          {isPhoneValid(beneficiary.phone) ? beneficiary.phone : "-"}
        </InfoVertical>
        <InfoVertical label="Gender">
          <p className="capitalize">{beneficiary.gender || "-"}</p>
        </InfoVertical>
      </div>
    </div>
  );
};

export default PersonalDetailsSection;
