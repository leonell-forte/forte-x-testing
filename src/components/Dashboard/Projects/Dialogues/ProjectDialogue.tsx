import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import projectService from "api/projects";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import add from "assets/images/icons/add.svg";

import { useProjectMutation } from "lib/mutations/projects";
import { ProjectFieldValues } from "lib/types/projects";
import { projects } from "lib/validators/projects";

import Button from "components/ui/button";
import Controller from "components/ui/custom-controller/CustomController";
import Dialogue, { IDialogueProps } from "components/ui/dialogue/dialogue";
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
  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ["specific-project", projectId],

    queryFn: () => projectService.getOne(projectId!),

    enabled: !!projectId,
  });

  const form = useForm<ProjectFieldValues>({
    resolver: zodResolver(projects.schema),

    defaultValues: projects.defaultValues(),
  });

  const {
    formState: { errors },

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

  return (
    <Dialogue
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
          <div className="flex items-start">
            <label htmlFor="" className="w-[180px] pt-3">
              Project name
            </label>

            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Project name" />
              )}
            />
          </div>

          <div className="flex w-full items-center gap-4">
            <p className="w-[190px]">Outcomes</p>

            <hr className="w-full" />

            <button
              type="button"
              onClick={handleAddOutcome}
              className="flex !h-8 !w-8 flex-shrink-0 items-center justify-center rounded-full bg-white text-forest-green transition-all hover:scale-[1.05] hover:opacity-80"
            >
              <img src={add} alt="" />
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
                  nameError={errors.outcomes?.[index]?.name?.message}
                  descriptionError={
                    errors.outcomes?.[index]?.description?.message
                  }
                  handleDelete={() => {
                    remove(index);
                  }}
                />
              );
            })}
          </div>

          <div className="!mt-10 flex justify-end gap-4">
            <Button onClick={close} buttonType="secondary">
              Cancel
            </Button>

            <Button loading={isPending} type="submit">
              Save
            </Button>
          </div>
        </Form>
      )}
    </Dialogue>
  );
};

export default ProjectDialogue;
