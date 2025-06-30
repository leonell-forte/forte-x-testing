import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/card";

import GraduationRates from "./GraduationRates";
import OutcomesAchieved from "./OutcomesAchieved";
import ProviderAvatars from "./ProviderAvatars";
import StudentStatuses from "./StudentStatuses";

const ProjectCard = () => {
  return (
    <Card className="flex flex-row">
      <CardContent className="flex w-full items-center gap-12">
        <div>
          <CardTitle>Project Title</CardTitle>
          <CardDescription>Q1 2024 - Q3 2025</CardDescription>
        </div>
        <div>
          <CardTitle>3000</CardTitle>
          <CardDescription>students</CardDescription>
        </div>
        <ProviderAvatars />

        <StudentStatuses />

        <GraduationRates />

        <OutcomesAchieved />
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
