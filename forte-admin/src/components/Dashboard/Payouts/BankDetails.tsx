import { useQuery } from "@tanstack/react-query";
import organizationService from "api/organization";
import classNames from "classnames";
import { useState } from "react";

import { ReactComponent as Link2 } from "assets/images/icons/link2.svg";

import { useAlert } from "lib/hooks";
import { formatCurrency } from "lib/utils";

import { useProfile } from "components/ProfileContext";
import Button from "components/ui/button";
import Details from "components/ui/details";
import { toast } from "components/ui/toast/Toast";

type BankDetailsProps = {
  providerId: string;
  total?: number;
};

const BankDetails = ({ providerId, total }: BankDetailsProps) => {
  const { profile } = useProfile();
  const { data: bankDetails, isLoading } = useQuery({
    queryKey: ["bank-details", providerId],
    queryFn: () => organizationService.getBankDetails(providerId as string),
    enabled: !!providerId,
  });

  const isForte = profile.orgType === "forte";

  const [loading, setLoading] = useState(false);

  const { setAlert } = useAlert();

  const handleOnboard = async () => {
    setLoading(true);
    try {
      const res = await organizationService.getStripeOnboardingLink(
        providerId as string
      );
      console.log(res.data);

      if (isForte) {
        navigator.clipboard.writeText(res.data);
        toast({
          title: "Link copied to clipboard",
        });
      } else {
        window.location.href = res.data;
      }
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
    return isForte ? (
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="space-y-1">
          <p className="text-[20px] font-semibold">
            No linked bank details yet.
          </p>
          <p className="font-light">
            Send provider the link below to complete payment set up.
          </p>
        </div>
        <Button
          buttonType="secondary"
          className="!border-mint !text-mint"
          loading={loading}
          onClick={handleOnboard}
        >
          <Link2 fill="#42ECA8" width={16} />
          Copy set up link
        </Button>
      </div>
    ) : (
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="space-y-1">
          <p className="text-[20px] font-semibold">
            No linked bank details yet.
          </p>
          <p className="font-light">
            Click the link below to complete payment set up.
          </p>
        </div>
        <Button
          buttonType="secondary"
          className="!border-mint !text-mint"
          loading={loading}
          onClick={handleOnboard}
        >
          <Link2 fill="#42ECA8" width={16} />
          Set up payment
        </Button>
      </div>
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
