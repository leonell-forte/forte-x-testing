import { Card, CardContent } from "@repo/ui/components/card";
import { Link } from "react-router-dom";

const Finances = () => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p>Overall Project Budget</p>
        <Link to="#">See payment details</Link>
      </div>
      <Card>
        <CardContent>
          <h2 className="text-4xl">$ X,XXX,XXX.XX</h2>
          <p className="text-sm text-white/60">Total Balance</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Finances;
