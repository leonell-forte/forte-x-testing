import { BallChart } from "@/components/ball-chart/BallChart";

const StudentStatuses = () => {
  return (
    <BallChart
      size="smaller"
      sets={[
        { percentage: 30, label: "Pre-Training" },
        { percentage: 60, label: "In-Training" },
        { percentage: 10, label: "Post-Training" },
      ]}
    />
  );
};

export default StudentStatuses;
