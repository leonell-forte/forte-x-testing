import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import organizationService from "api/organization";
import projectService from "api/projects";
import { useEffect, useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { HiPlusCircle } from "react-icons/hi";

import { useProjectMutation } from "lib/mutations/projects";
import { IsAuthorized, Organizations } from "lib/role-permissions";
import { ProjectFieldValues } from "lib/types/projects";
import { projects } from "lib/validators/projects";

import { useConfirmPrompt } from "components/ui/alert/confirm-prompt";
import Button from "components/ui/button";
import Controller from "components/ui/custom-controller/CustomController";
import Dialogue, { IDialogueProps } from "components/ui/dialogue/dialogue";
import Dropdown from "components/ui/dropdown";
import { Form } from "components/ui/form/Form";
import Input from "components/ui/input";
import Spinner from "components/ui/spinner/spinner";

import OutcomeField from "../OutcomeField";

interface IProjectDialogueProps extends IDialogueProps {
  projectId?: string;
}

const ProjectDialogue = ({
  isVisible,
  handleClose,
  projectId,
}: IProjectDialogueProps) => {
  // Project query
  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ["specific-project", projectId],
    queryFn: () => projectService.getOne(projectId!),
    enabled: !!projectId,
  });

  // Organization data handling
  const { data: { items: orgItems = [] } = {}, isLoading: orgLoading } =
    useQuery({
      queryKey: ["organizations"],
      queryFn: () =>
        organizationService.list({
          listAll: true,
          page: 1,
          filters: { type: "funder" },
        }),
      enabled: IsAuthorized([Organizations.LIST]),
    });

  const organizations = useMemo(
    () =>
      orgItems.map((item) => ({
        label: item.name,
        value: item.id!.toString(),
      })),
    [orgItems]
  );

  // Form handling
  const form = useForm<ProjectFieldValues>({
    resolver: zodResolver(projects.schema),
    defaultValues: projects.defaultValues(),
  });

  const {
    formState: { errors, isDirty },
    setError,
    reset,
    control,
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "outcomes",
  });

  useEffect(() => {
    // sets default value of project form
    if (project) {
      reset(projects.defaultValues(project));
    }
  }, [project, reset]);

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

  const handleAddOutcome = () => {
    append({ name: "", description: "" });
  };

  const close = () => {
    reset();
    handleClose!();
  };

  // implements optimistic update after adding or editing project
  const { addProject, isPending } = useProjectMutation(projectId!, close);

  const onSubmit = async (values: ProjectFieldValues) => {
    await addProject(values);
  };

  const { setShowPrompt } = useConfirmPrompt();

  return (
    <Dialogue
      confirmBeforeLeave={isDirty}
      isVisible={isVisible}
      handleClose={close}
      title={project ? "Edit project" : "Add project"}
    >
      {projectLoading ? (
        <div className="flex h-[470px] w-full items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <Form form={form} onSubmit={onSubmit} className="space-y-[22px]">
          <Controller
            label=" Project name"
            required
            name="name"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="Project name" />
            )}
          />

          <Controller
            label="Funder"
            required
            name="funderId"
            control={control}
            render={({ field }) => {
              return (
                <Dropdown
                  value={
                    organizations.find(
                      (org) => Number(org.value) === Number(field.value)
                    )?.label
                  }
                  handleSelect={(val) => field.onChange(Number(val))}
                  options={organizations}
                  placeholder="Select funder"
                  loading={orgLoading}
                />
              );
            }}
          />

          <div className="flex items-center gap-5">
            <p className="heading w-fit whitespace-nowrap">Outcomes</p>

            <hr className="w-full" />

            <button
              type="button"
              onClick={handleAddOutcome}
              className="group md:mt-0"
            >
              <HiPlusCircle className="h-auto w-8 text-white transition-all group-hover:fill-mint" />
            </button>
          </div>

          <div className="space-y-[22px]">
            {fields.map((item, index) => {
              return (
                <OutcomeField
                  control={control}
                  index={index}
                  count={index + 1}
                  key={item.id}
                  handleDelete={() => {
                    remove(index);
                  }}
                />
              );
            })}
          </div>

          <div className="!mt-10 flex justify-end gap-4">
            <Button
              onClick={() => {
                if (isDirty) {
                  setShowPrompt(true);
                  return;
                }
                close();
              }}
              buttonType="secondary"
            >
              Cancel
            </Button>

            <Button loading={isPending} type="submit" disabled={!isDirty}>
              Save
            </Button>
          </div>
        </Form>
      )}
    </Dialogue>
  );
};

export default ProjectDialogue;
