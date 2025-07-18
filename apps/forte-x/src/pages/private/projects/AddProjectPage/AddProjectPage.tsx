import {
  Stepper,
  StepperContent,
  StepperList,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper";

import Milestones from "./Steps/Milestones/Milestones";
import ProjectDetails from "./Steps/ProjectDetails";
import Providers from "./Steps/Providers/Providers";

const AddProjectPage = () => {
  return (
    <div className="h-full">
      <Stepper defaultValue="project-details">
        <StepperTitle>
          Complete these steps to fully set up your project
        </StepperTitle>

        <StepperList>
          <StepperTrigger
            title="Project details"
            description="Fill in the basic details of your project"
            value="project-details"
          />
          <StepperTrigger
            title="Milestones"
            description="Map out key targets to track"
            value="milestones"
          />
          <StepperTrigger
            title="Providers"
            description="Add in your delivery partners"
            value="providers"
          />
          <StepperTrigger
            title="Payment triggers"
            description="Set conditional logic for disbursement"
            value="payment-triggers"
          />
          <StepperTrigger title="" description="" value="" />
          <StepperTrigger
            title="Student set-up"
            description="Identify demographics you want to collect"
            value="student-set-up"
          />
        </StepperList>
        <StepperContent value="project-details">
          <ProjectDetails />
        </StepperContent>
        <StepperContent value="milestones">
          <Milestones />
        </StepperContent>
        <StepperContent value="providers">
          <Providers />
        </StepperContent>
      </Stepper>
    </div>
  );
};

export default AddProjectPage;
