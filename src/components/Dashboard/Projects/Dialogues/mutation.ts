import projectService from "../../../../api/projects";
import { queryClient } from "../../../../components/QueryProvider";
import { useAlert } from "../../../../lib/hooks";
import { projects } from "../../../../lib/validators/projects";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import * as amplitude from "@amplitude/analytics-browser";

const useProjectMutation = (projectId: string, close: () => void) => {
  const { setAlert } = useAlert();

  const { mutateAsync: addProject, isPending } = useMutation({
    mutationFn: projectId
      ? (values: z.infer<typeof projects.schema>) =>
          projectService.update(values)
      : projectService.add,

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["projects", 1] });

      const previousProject = queryClient.getQueryData(["projects", 1]);

      return { previousProject };
    },

    onSuccess: (addedProject) => {
      if (!projectId) {
        queryClient.setQueryData(["projects", 1], (old: any) => {
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
        `${projectId ? "Update" : "Add"} Project Form Submission`,
      );
    },

    onError: (err: any, newProject, context) => {
      setAlert({
        status: "error",

        title: `Failed ${projectId ? "updating" : "adding"} project`,

        message: err?.response?.data?.message,
      });

      queryClient.setQueryData(["projects", 1], context?.previousProject);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", 1] });
    },
  });

  return { addProject, isPending };
};

export default useProjectMutation;
