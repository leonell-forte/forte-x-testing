import projectService from "../../api/projects";
import { queryClient } from "../../components/QueryProvider";
import { useAlert } from "../../lib/hooks";
import { useMutation } from "@tanstack/react-query";
import * as amplitude from "@amplitude/analytics-browser";
import { ProjectFieldValues } from "@/pages/Projects/types";

const useProjectMutation = (projectId: string, succesCallback?: () => void) => {
  const { setAlert } = useAlert();

  const { mutateAsync: addProject, isPending } = useMutation({
    mutationFn: projectId
      ? (values: ProjectFieldValues) => projectService.update(values)
      : projectService.add,

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["projects", 1] });

      await queryClient.cancelQueries({
        queryKey: ["specific-project", projectId],
      });

      const previousProjects = queryClient.getQueryData(["projects", 1]);

      const previousProject = queryClient.getQueryData([
        "specific-project",

        projectId,
      ]);

      return { previousProjects, previousProject };
    },

    onSuccess: (addedProject) => {
      if (!projectId) {
        queryClient.setQueryData(["projects", 1], (old: any) => {
          return {
            ...old,

            items: [...(old?.items || []), addedProject.data.data],
          };
        });

        queryClient.setQueryData(["specific-project", projectId], () => {
          return addedProject;
        });
      }

      succesCallback?.();

      setAlert({
        status: "success",

        message: `Project ${projectId ? "updated" : "added"} successfully`,

        title: "Success!",
      });

      amplitude.track(
        `${projectId ? "Update" : "Add"} Project Form Submission`,
      );
    },

    onError: (err: any, newProject, context) => {
      setAlert({
        status: "error",

        title: `Failed ${projectId ? "updating" : "adding"} project`,

        message: err?.response?.data?.message,
      });

      queryClient.setQueryData(["projects", 1], context?.previousProjects);

      queryClient.setQueryData(
        ["specific-project", projectId],
        context?.previousProject,
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", 1] });

      queryClient.invalidateQueries({
        queryKey: ["specific-project", projectId],
      });
    },
  });

  return { addProject, isPending };
};

export default useProjectMutation;
