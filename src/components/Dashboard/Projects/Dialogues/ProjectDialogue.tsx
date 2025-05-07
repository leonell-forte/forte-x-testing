import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import projectService from "api/projects";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { HiOutlinePlusCircle } from "react-icons/hi";

import useOrganizationList from "lib/common/lists/useOrganizationList";
import { useProjectMutation } from "lib/mutations/projects";
import { Funders, IsAuthorized, Providers } from "lib/role-permissions";
import { ProjectFieldValues } from "lib/types/projects";
import { projects } from "lib/validators/projects";

import { useCustomPrompt } from "components/ui/alert/custom-prompt";
import Button from "components/ui/button";
import Controller from "components/ui/custom-controller/CustomController";
import { useModal } from "components/ui/dialogue/v2/Modal";
import Dropdown from "components/ui/dropdown";
import { Form } from "components/ui/form/Form";
import { useAutoSaveForm } from "components/ui/form/useAutoSave";
import Input from "components/ui/input";
import Spinner from "components/ui/spinner/spinner";
import {
  StepContent,
  StepTrigger,
  Stepper,
} from "components/ui/stepper/Stepper";

import OutcomeField from "../OutcomeField";

interface IProjectDialogueProps {
  projectId?: string;
  funderId?: string;
  addOutcome?: boolean;
}

export const showProjectDialogue = ({
  projectId,
  funderId,
  addOutcome,
}: IProjectDialogueProps) => {
  useModal.getState().open({
    component: (
      <ProjectDialogue
        projectId={projectId}
        funderId={funderId}
        addOutcome={addOutcome}
      />
    ),
    size: "2xl",
    title: projectId
      ? addOutcome
        ? "Add outcomes"
        : "Edit project"
      : "Add project",
    panelClassName: "max-w-[584px] lg:px-[50px]",
    titleClassName: "text-center",
  });
};

const ProjectDialogue = ({
  projectId,
  funderId,
  addOutcome,
}: IProjectDialogueProps) => {
  const { open } = useCustomPrompt();

  const { setShowPromptOnClose } = useModal();

  // Project query
  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ["specific-project", projectId],
    queryFn: () => projectService.getOne(projectId!),
    enabled: !!projectId,
  });

  // Organization data handling

  const {
    organizations,
    isLoading: orgLoading,
    handleSearchOrg,
  } = useOrganizationList({
    key: ["dropdown"],
    pageSize: 100,
    filters: { type: "funder" },
    enabled: IsAuthorized([Funders.LIST, Providers.LIST]),
  });

  // Form handling
  const form = useForm<ProjectFieldValues>({
    resolver: zodResolver(projects.schema),
    defaultValues: projects.defaultValues(
      project,
      funderId ? +funderId : undefined
    ),
  });

  const { close: handleClose } = useModal();

  const {
    formState: { errors, isDirty },
    setError,
    reset,
    control,
    watch,
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "outcomes",
  });

  const handleAddOutcome = () => {
    append({ name: "", description: "" });
  };

  const close = () => {
    reset();
    handleClose();
  };

  // implements optimistic update after adding or editing project
  const { addProject, isPending } = useProjectMutation(
    projectId!,
    close,
    funderId
  );

  const onSubmit = async (values: ProjectFieldValues) => {
    if (project && projectId) {
      open({
        title: "Confirm email with changes",
        subText:
          "Saving edits will send an email to all Project Partner users. Click cancel to revert or send to confirm changes and send the email.",
        onYes: () => addProject(values),
        yesLabel: "Send email with changes",
      });
      return;
    }
    await addProject(values);
  };

  useEffect(() => {
    // sets default value of project form

    if (project) {
      reset(projects.defaultValues(project, funderId ? +funderId : undefined));
    }
  }, [project, reset, funderId]);

  useEffect(() => {
    if (
      errors?.outcomes?.type === "too_small" ||
      errors?.outcomes?.root?.type === "too_small"
    ) {
      append({ name: "", description: "" });

      setError("outcomes.0.name", {
        message: "Outcome name is a required field",
      });

      setError("outcomes.0.description", {
        message: "Description is a required field",
      });
    }
  }, [errors, append, setError]);

  // autosave start

  const formId = "project-form";

  useAutoSaveForm(form, {
    formId,
    enabled: !project,
  });

  // autosave end

  useEffect(() => {
    if (isDirty) {
      setShowPromptOnClose(true);
    } else {
      setShowPromptOnClose(false);
    }
  }, [isDirty, setShowPromptOnClose]);

  const [activeStep, setActiveStep] = useState(addOutcome ? 2 : 1);

  // Watch required fields for step validation
  const projectName = watch("name");
  const selectedFunderId = watch("funderId");
  const budget = watch("budget");

  return (
    <>
      {projectLoading ? (
        <div className="flex h-[470px] w-full items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <Form form={form} onSubmit={onSubmit} className="space-y-[22px]">
          <Stepper activeStep={activeStep}>
            {!addOutcome && (
              <>
                <StepTrigger stepNumber={1}>1. Project details</StepTrigger>
                <StepTrigger stepNumber={2}>
                  {!addOutcome ? "2." : ""} Project outcomes
                </StepTrigger>
              </>
            )}
            <StepContent contentNumber={1}>
              <div className="space-y-8 pt-10">
                <div className="mx-auto max-w-[385px] space-y-3">
                  <Controller
                    label=" Project name"
                    required
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="Project name" />
                    )}
                  />

                  {!funderId && (
                    <Controller
                      label="Funder"
                      required
                      name="funderId"
                      control={control}
                      render={({ field }) => {
                        return (
                          <Dropdown
                            enableSearch
                            value={
                              organizations.find(
                                (org) =>
                                  Number(org.value) === Number(field.value)
                              )?.label
                            }
                            handleSelect={(val) => field.onChange(Number(val))}
                            options={organizations}
                            placeholder="Select funder"
                            loading={orgLoading}
                            onChange={(e) => handleSearchOrg(e.target.value)}
                            disabled={!!funderId}
                          />
                        );
                      }}
                    />
                  )}

                  <Controller
                    label="Budget"
                    containerClassName="max-w-[182.5px]"
                    required
                    name="budget"
                    control={control}
                    render={({ field }) => {
                      return <Input {...field} isCurrency />;
                    }}
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    className="w-[147px]"
                    onClick={() => setActiveStep(2)}
                    disabled={!projectName || !selectedFunderId || !budget}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </StepContent>
            <StepContent contentNumber={2}>
              <div className="mx-auto max-w-[365px] pt-10">
                {/* {project ? (
                  <div className="text-xs opacity-70">
                    To view and edit Partners, Contracts and Beneficiaries
                    related to this project,{" "}
                    <Link
                      to={`/projects/${project.id}`}
                      className="link hover:underline"
                    >
                      click here
                    </Link>
                    .
                  </div>
                ) : null} */}

                <div className="space-y-4">
                  <div className="space-y-[22px]">
                    {fields.map((item, index) => {
                      return (
                        <OutcomeField
                          control={control}
                          index={index}
                          count={index + 1}
                          key={item.id}
                          handleDelete={
                            !(fields.length - 1)
                              ? undefined
                              : () => remove(index)
                          }
                        />
                      );
                    })}
                  </div>

                  <div className="space-y-3">
                    <hr className="w-full" />

                    <button
                      type="button"
                      onClick={handleAddOutcome}
                      className="group flex items-center gap-2 md:mt-0"
                    >
                      <HiOutlinePlusCircle className="h-auto w-8 text-white transition-all group-hover:stroke-mint" />
                      <p className="font-light group-hover:text-mint">
                        Add line item
                      </p>
                    </button>
                  </div>
                </div>
              </div>

              <div className="!mt-10 flex justify-between gap-4">
                <div>
                  {!addOutcome && (
                    <Button
                      buttonType="secondary"
                      className="w-[147px]"
                      onClick={() => setActiveStep(1)}
                    >
                      Back
                    </Button>
                  )}
                </div>
                <Button
                  loading={isPending}
                  type="submit"
                  disabled={!isDirty}
                  className="w-[147px]"
                >
                  {projectId ? "Save" : "Add"}
                </Button>
              </div>
            </StepContent>
          </Stepper>
        </Form>
      )}
    </>
  );
};

export default ProjectDialogue;
