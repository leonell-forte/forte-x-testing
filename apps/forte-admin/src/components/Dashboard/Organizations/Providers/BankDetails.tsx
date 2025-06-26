import PayoutBankDetails from "@/components/Dashboard/Payouts/BankDetails";

type BankDetailsProps = {
  providerId: string;
};

const BankDetails = ({ providerId }: BankDetailsProps) => {
  return (
    <div className="space-y-4">
      <PayoutBankDetails providerId={providerId} />
    </div>
  );
};

export default BankDetails;
