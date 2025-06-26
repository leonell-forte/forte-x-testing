import { useDeleteProjectMutation } from "@/lib/mutations/projects";
import type { IProject } from "@/lib/types/projects";

import Button from "@/components/ui/button";
import type { IDialogueProps } from "@/components/ui/dialogue/dialogue";
import Dialogue from "@/components/ui/dialogue/dialogue";

interface IDeleteDialogueProp extends IDialogueProps {
  project: IProject;

  funderId?: number;
}

const DeleteDialogue = ({
  handleClose,

  project,

  funderId,

  isVisible,
}: IDeleteDialogueProp) => {
  const { id } = project;

  const { deletProject, isPending } = useDeleteProjectMutation(
    id,
    handleClose,
    funderId
  );

  const handleDelete = async () => {
    await deletProject(project.id.toString());
  };

  return (
    <Dialogue
      center
      isVisible={isVisible}
      handleClose={handleClose}
      canFullScreen={false}
    >
      <div>
        <p className="heading">Are you sure you want to delete this project?</p>

        <div className="mt-10 flex justify-end gap-2">
          <Button onClick={handleClose} buttonType="secondary">
            Cancel
          </Button>

          <Button loading={isPending} onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>
    </Dialogue>
  );
};

export default DeleteDialogue;
