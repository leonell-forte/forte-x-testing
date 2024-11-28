import Dialogue, {
  IDialogueProps,
} from "../../../../components/ui/dialogue/dialogue";
import { useEffect } from "react";
import Input from "../../../../components/ui/input";
import Button from "../../../../components/ui/button";
import OutcomeField from "../OutcomeField";
import add from "../../../../assets/images/icons/add.svg";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { projects } from "../../../../lib/validators/projects";
import { zodResolver } from "@hookform/resolvers/zod";
import projectService from "../../../../api/projects";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../../../../components/ui/spinner/spinner";
import { ProjectFieldValues } from "@/pages/Projects/types";
import useProjectMutation from "../../../../lib/mutations/projects";

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

  const {
    formState: { errors },

    handleSubmit,

    reset,

    control,
  } = useForm<ProjectFieldValues>({
    resolver: zodResolver(projects.schema),

    defaultValues: projects.defaultValues(),
  });

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
    if (errors?.outcomes?.type === "too_small") {
      append({ name: "", description: "" });
    }
  }, [errors, append]);

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
        <div className="w-full h-[470px] flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-[22px]"
        >
          <div className="flex items-start">
            <label
              htmlFor=""
              className="w-[180px] pt-3"
            >
              Project name
            </label>

            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Project name"
                  error={!!errors.name?.message}
                  helperText={errors.name?.message}
                />
              )}
            />
          </div>

          <div className="flex w-full items-center gap-4">
            <p className="w-[190px]">Outcomes</p>

            <hr className="w-full" />

            <button
              type="button"
              onClick={handleAddOutcome}
              className="!w-8 !h-8 bg-white rounded-full flex-shrink-0 text-forest-green flex items-center justify-center hover:scale-[1.05] transition-all hover:opacity-80"
            >
              <img
                src={add}
                alt=""
              />
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

          <div className="flex justify-end gap-4 !mt-10">
            <Button
              onClick={close}
              buttonType="secondary"
            >
              Cancel
            </Button>

            <Button
              loading={isPending}
              type="submit"
            >
              Save
            </Button>
          </div>
        </form>
      )}
    </Dialogue>
  );
};

export default ProjectDialogue;
