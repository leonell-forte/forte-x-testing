import { ReactComponent as Link2 } from "assets/images/icons/link2.svg";

import Button from "components/ui/button";

const BankDetails = () => {
  return (
    <div className="space-y-4 text-center">
      <div className="space-y-1">
        <p className="text-[20px] font-semibold">No linked bank details yet.</p>
        <p className="font-light">
          Send provider the link below to complete payment set up.
        </p>
      </div>
      <Button buttonType="secondary" className="!border-mint !text-mint">
        <Link2 fill="#42ECA8" width={16} />
        Copy set up link
      </Button>
    </div>
  );
};

export default BankDetails;
