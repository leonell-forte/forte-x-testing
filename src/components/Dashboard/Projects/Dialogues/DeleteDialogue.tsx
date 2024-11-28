import Dialogue, {
  IDialogueProps,
} from "../../../../components/ui/dialogue/dialogue";
import Button from "../../../../components/ui/button";
import projectService from "../../../../api/projects";
import { useAlert } from "../../../../lib/hooks";
import * as amplitude from "@amplitude/analytics-browser";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../../../components/QueryProvider";
import { IProject } from "../../../../lib/types/projects";

interface IDeleteDialogueProp extends IDialogueProps {
  project: IProject;

  page: number;
}

const DeleteDialogue = ({
  handleClose,

  project,

  isVisible,

  page,
}: IDeleteDialogueProp) => {
  const { id } = project;

  const { setAlert } = useAlert();

  const { mutateAsync: deletProject, isPending } = useMutation({
    mutationFn: projectService.delete,

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["projects", page, ""] });

      const previousProject = queryClient.getQueryData<IProject[]>([
        "projects",
        page,
      ]);

      return { previousProject };
    },

    onSuccess: () => {
      queryClient.setQueryData(
        ["projects", page, ""],

        (old: { items: IProject[] }) => {
          return {
            ...old,

            items: old.items.filter((item) => item.id !== id),
          };
        },
      );

      handleClose!();

      setAlert({
        status: "success",

        message: `Project deleted successfully`,

        title: "Project Deleted!",
      });

      amplitude.track(`Delete Project Performed`, {
        id: project.id,
      });
    },

    onError: (err: any, newProject, context) => {
      setAlert({
        status: "error",

        title: `Faild deleting project`,

        message: err?.response?.data?.message,
      });

      queryClient.setQueryData(["projects", page], context?.previousProject);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", page, ""] });
    },
  });

  const handleDelete = async () => {
    await deletProject(project.id.toString());
  };

  return (
    <Dialogue
      center
      isVisible={isVisible}
      handleClose={handleClose}
    >
      <div className="text-center">
        <p className="text-[24px] font-semibold">
          Are you sure you want to delete this project?
        </p>

        <div className="flex justify-end gap-2 mt-10">
          <Button
            onClick={handleClose}
            buttonType="secondary"
          >
            Cancel
          </Button>

          <Button
            loading={isPending}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </div>
    </Dialogue>
  );
};

export default DeleteDialogue;
