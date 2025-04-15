import { useQuery } from "@tanstack/react-query";
import organizationService from "api/organization";
import classNames from "classnames";
import { useState } from "react";

import { useAlert } from "lib/hooks";
import { formatCurrency } from "lib/utils";

import Button from "components/ui/button";
import Details from "components/ui/details";

type BankDetailsProps = {
  providerId: string;
  total?: number;
};

const BankDetails = ({ providerId, total }: BankDetailsProps) => {
  const { data: bankDetails, isLoading } = useQuery({
    queryKey: ["bank-details", providerId],
    queryFn: () => organizationService.getBankDetails(providerId as string),
    enabled: !!providerId,
  });

  const [loading, setLoading] = useState(false);

  const { setAlert } = useAlert();

  const handleOnboard = async () => {
    setLoading(true);
    try {
      const res = await organizationService.getStripeOnboardingLink(
        providerId as string
      );
      window.location.href = res.data;
    } catch (err) {
      console.log(err);

      setAlert({
        status: "error",
        message: "Failed to get onboarding link",
        title: "Error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-[100px] w-full animate-pulse rounded-[.5em] bg-white/10" />
    );
  }

  if (bankDetails && !bankDetails?.data?.length) {
    return (
      <Button loading={loading} onClick={handleOnboard}>
        Enter Bank Details
      </Button>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[20px] font-semibold">Payout details</p>
        {!total && (
          <button
            onClick={handleOnboard}
            className="font-semibold text-white underline underline-offset-4"
          >
            Edit
          </button>
        )}
      </div>

      {bankDetails?.data.map((item, index) => {
        return (
          <Details.Container key={index}>
            <Details.Content label="Bank" value={item.bankName || ""} />
            <div
              className={classNames("flex w-full", total && "flex-col gap-6")}
            >
              <Details.Content
                label="Account name"
                value={item.accountHolderName || "-"}
              />
              {total && (
                <Details.Content
                  label="Account number"
                  value={item.last4Digits || ""}
                />
              )}
            </div>
            <Details.Content
              label={total ? "Total" : "Account number"}
              value={
                total ? formatCurrency(total as number) : item.last4Digits || ""
              }
            />
          </Details.Container>
        );
      })}
    </div>
  );
};

export default BankDetails;
