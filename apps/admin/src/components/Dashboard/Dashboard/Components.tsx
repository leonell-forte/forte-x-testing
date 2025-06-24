import Card from "@/components/Dashboard/Dashboard/Card";
import DataText from "@/components/Dashboard/Dashboard/DataText";

const Components = () => {
  return (
    <Card>
      <DataText label="Budget Remaining" value="$ XX,XXX.XX" />
      <DataText label="# OF CONTRACTS" value="XX" percentage={-10} size="sm" />
    </Card>
  );
};

export default Components;
