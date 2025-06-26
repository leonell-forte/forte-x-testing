import { useQuery } from "@tanstack/react-query";
import organizationService from "@/api/organization";

const usePartnerList = (orgId?: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ["partners", orgId],
    queryFn: () => organizationService.getPartners(orgId || ""),
    enabled: !!orgId,
  });
  return { partners: data, isLoading };
};

export default usePartnerList;
