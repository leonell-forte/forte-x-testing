import payoutsService from "api/payouts";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAlert } from "lib/hooks";

import Button from "components/ui/button";
import Checkbox from "components/ui/checkbox";
import Dialogue from "components/ui/dialogue/dialogue";
import { ToastAction, toast } from "components/ui/toast/Toast";

type ApprovePayoutProps = {
  id: string;
};

const ApprovePayout = ({ id }: ApprovePayoutProps) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [hasChecked, setHasChecked] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const { setAlert } = useAlert();

  const handlePayout = async () => {
    setLoading(true);
    try {
      await payoutsService.pay(id as string);
      toast({
        title: `ID#${id} successfully paid out`,
        action: (
          <ToastAction
            altText="view"
            onClick={() => navigate(`/payouts/${id}`)}
          >
            <p>View</p>
          </ToastAction>
        ),
      });
      setShowModal(false);
    } catch (err: any) {
      setAlert({
        status: "error",
        message: err.response.data.message,
        title: "Error",
      });
    }
    setLoading(false);
  };

  return (
    <div>
      <Button loading={loading} onClick={() => setShowModal(true)}>
        Payout
      </Button>

      <Dialogue
        isVisible={showModal}
        className="px-[56px]"
        center
        handleClose={() => setShowModal(false)}
      >
        <div className="space-y-8">
          <div className="space-y-6">
            <p className="text-[24px] font-semibold">Approve Payout ID#XX1?</p>
            <div className="space-y-4">
              <p className="text-[20px] font-light">
                Approving this will pay provider for all milestones associated
                to this payout. This action cannot be undone.{" "}
              </p>
              <Checkbox
                onChange={() => setHasChecked(!hasChecked)}
                checked={hasChecked}
                labelClass="text-[20px] font-light"
                white
                label="I have reviewed all milestones associated to this payout."
              />
            </div>
          </div>
          <div className="flex justify-end gap-2.5">
            <Button onClick={() => setShowModal(false)} buttonType="secondary">
              Cancel
            </Button>
            <Button
              loading={loading}
              onClick={handlePayout}
              disabled={!hasChecked}
            >
              Payout
            </Button>
          </div>
        </div>
      </Dialogue>
    </div>
  );
};

export default ApprovePayout;
