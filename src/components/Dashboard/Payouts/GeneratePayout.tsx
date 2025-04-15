import payoutsService from "api/payouts";
import React, { useState } from "react";

import useOrganizationList from "lib/common/lists/useOrganizationList";
import { useAlert } from "lib/hooks";
import { IsAuthorized, Organizations } from "lib/role-permissions";
import { findLabelFromOptions } from "lib/utils";

import Button from "components/ui/button";
import Dialogue, { IDialogueProps } from "components/ui/dialogue/dialogue";
import Dropdown from "components/ui/dropdown";

type GeneratePayoutProps = IDialogueProps;

const GeneratePayout = (props: GeneratePayoutProps) => {
  const { setAlert } = useAlert();

  const [providerId, setProviderId] = useState("");
  const {
    organizations,
    isLoading: orgLoading,
    handleSearchOrg,
  } = useOrganizationList({
    key: ["filter"],
    filters: { type: "provider" },
    enabled: IsAuthorized([Organizations.LIST]),
    pageSize: 100,
  });

  const [loading, setLoading] = React.useState(false);
  const handleGeneratePayouts = async () => {
    setLoading(true);
    try {
      await payoutsService.generate(providerId as string);
      setAlert({
        message: "Payouts generated successfully",
        status: "success",
        title: "Success",
      });
      props.handleClose?.();
    } catch (err) {
      console.log(err);
      setAlert({
        message: "Failed to generate payouts",
        status: "error",
        title: "Error",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialogue isVisible title="Generate Payout" handleClose={props.handleClose}>
      <div className="space-y-10">
        {IsAuthorized([Organizations.LIST]) && (
          <Dropdown
            loading={orgLoading}
            options={organizations}
            placeholder="Provider"
            value={findLabelFromOptions(organizations, providerId)}
            handleSelect={(val) => setProviderId(val as string)}
            enableSearch
            onChange={(e) => handleSearchOrg(e.target.value)}
          />
        )}
        <div className="flex justify-end gap-2">
          <Button buttonType="secondary" onClick={props.handleClose}>
            Cancel
          </Button>
          <Button
            loading={loading}
            className="group"
            onClick={handleGeneratePayouts}
          >
            Generate Payout
          </Button>
        </div>
      </div>
    </Dialogue>
  );
};

export default GeneratePayout;
