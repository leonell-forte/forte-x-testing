import Dialogue, {
  IDialogueProps,
} from "../../../../components/ui/dialogue/dialogue";
import Button from "../../../../components/ui/button";
import { IProject } from "../../../../lib/types/projects";
import { useDeleteProjectMutation } from "../../../../lib/mutations/projects";

interface IDeleteDialogueProp extends IDialogueProps {
  project: IProject;
}

const DeleteDialogue = ({
  handleClose,

  project,

  isVisible,
}: IDeleteDialogueProp) => {
  const { id } = project;

  const { deletProject, isPending } = useDeleteProjectMutation(id, handleClose);

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
