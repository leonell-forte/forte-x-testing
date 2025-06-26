import Details from "@/components/ui/details";
import type { IOrganization } from "@/lib/types/organizations";

type ProviderDetailsProps = {
  data?: IOrganization;
};

const ProviderDetails = ({ data }: ProviderDetailsProps) => {
  return (
    <Details.Container>
      <Details.Content
        label="Registration #"
        value={data?.registrationNumber || ""}
      />
      <Details.Content label="Region" value={data?.regions?.join(", ") || ""} />
    </Details.Container>
  );
};

export default ProviderDetails;
