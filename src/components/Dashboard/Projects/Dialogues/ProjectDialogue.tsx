import Dialogue, {
  IDialogueProps,
} from "../../../../components/ui/dialogue/dialogue";
import { useEffect } from "react";
import Input from "../../../../components/ui/input";
import Button from "../../../../components/ui/button";
import OutcomeField from "../OutcomeField";
import add from "../../../../assets/images/icons/add.svg";
import { IOrganization } from "../../../../pages/Organizations/types";
import Dropdown from "../../../../components/ui/dropdown";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { projects } from "../../../../lib/validators/projects";
import { zodResolver } from "@hookform/resolvers/zod";
import projectService from "../../../../api/projects";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../../../../components/QueryProvider";
import { useAlert } from "../../../../lib/hooks";
import * as amplitude from "@amplitude/analytics-browser";
import Spinner from "../../../../components/ui/spinner/spinner";

interface IProjectDialogueProps extends IDialogueProps {
  projectId?: string;

  organizations: IOrganization[];

  page: number;
}

const ProjectDialogue = ({
  isVisible,

  handleClose,

  projectId,

  organizations,

  page,
}: IProjectDialogueProps) => {
  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ["specific-project", projectId],

    queryFn: () => projectService.getOne(projectId!),

    enabled: !!projectId,
  });

  const form = useForm<z.infer<typeof projects.schema>>({
    resolver: zodResolver(projects.schema),

    defaultValues: projects.defaultValues(),
  });

  const {
    watch,

    setValue,

    setError,

    getValues,

    formState: { errors },

    handleSubmit,

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
    if (errors?.outcomes?.type === "too_small") {
      append({ name: "", description: "" });
    }
  }, [errors, append]);

  const { setAlert } = useAlert();

  const handleAddOutcome = () => {
    append({ name: "", description: "" });
  };

  const close = () => {
    reset();

    handleClose!();
  };

  // implements optimistic update after adding or editing project
  const { mutateAsync: addProject, isPending } = useMutation({
    mutationFn: projectId
      ? () => projectService.update(getValues())
      : projectService.add,

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["projects", page] });

      const previousProject = queryClient.getQueryData(["projects", page]);

      return { previousProject };
    },

    onSuccess: (addedProject) => {
      if (!projectId) {
        queryClient.setQueryData(["projects", page], (old: any) => {
          return {
            ...old,

            items: [...(old?.items || []), addedProject.data.data],
          };
        });
      }

      close();

      setAlert({
        status: "success",

        message: `Project ${projectId ? "updated" : "added"} successfully`,

        title: "Success!",
      });

      amplitude.track(
        `${projectId ? "Update" : "Add"} Project Form Submission`
      );
    },

    onError: (err: any, newProject, context) => {
      setAlert({
        status: "error",

        title: `Faild ${projectId ? "updating" : "adding"} project`,

        message: err?.response?.data?.message,
      });

      queryClient.setQueryData(["projects", page], context?.previousProject);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", page] });
    },
  });

  const onSubmit = async (values: z.infer<typeof projects.schema>) => {
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-[22px]">
          <div className="flex items-center">
            <label htmlFor="" className="w-[180px]">
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

          <div className="flex items-center">
            <label htmlFor="" className="w-[180px]">
              Provider
            </label>

            <Dropdown
              name="providerId"
              value={
                organizations.find(
                  (item) => Number(item.id) === watch("providerId")
                )?.registeredName
              }
              options={organizations
                .filter((org) => org.type === "provider")
                .map((item: IOrganization) => ({
                  label: item.registeredName,
                  value: item.id!.toString(),
                }))}
              handleSelect={(val) => {
                setValue("providerId", Number(val));
                setError("providerId", { message: "" });
              }}
              placeholder="Select provider"
              error={!!errors.providerId?.message}
              helperText={errors.providerId?.message}
            />
          </div>

          <div className="flex items-center">
            <label htmlFor="" className="w-[180px]">
              Funder
            </label>

            <Dropdown
              name="funderId"
              value={
                organizations.find(
                  (item) => Number(item.id) === watch("funderId")
                )?.registeredName
              }
              options={organizations
                .filter((org) => org.type === "funder")
                .map((item: IOrganization) => ({
                  label: item.registeredName,
                  value: item.id!.toString(),
                }))}
              handleSelect={(val) => {
                setValue("funderId", Number(val));
                setError("funderId", { message: "" });
              }}
              placeholder="Select funder"
              error={!!errors.funderId?.message}
              helperText={errors.funderId?.message}
            />
          </div>

          <div className="flex w-full items-center gap-4">
            <p className="w-[190px]">Outcome</p>

            <hr className="w-full" />

            <button
              type="button"
              onClick={handleAddOutcome}
              className="!w-8 !h-8 bg-white rounded-full flex-shrink-0 text-forest-green flex items-center justify-center hover:scale-[1.05] transition-all hover:opacity-80"
            >
              <img src={add} alt="" />
            </button>
          </div>

          <div className="space-y-[22px]">
            {fields
              .map((item, index) => {
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
              })
              .reverse()}
          </div>

          <div className="flex justify-end gap-4 !mt-10">
            <Button onClick={close} buttonType="secondary">
              Cancel
            </Button>

            <Button loading={isPending} type="submit">
              Save
            </Button>
          </div>
        </form>
      )}
    </Dialogue>
  );
};

export default ProjectDialogue;
