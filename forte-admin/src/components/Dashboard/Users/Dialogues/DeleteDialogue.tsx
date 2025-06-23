import { useCallback } from "react";

import { useDeleteUserMutation } from "lib/mutations/users";

import Button from "components/ui/button";
import Dialogue, { IDialogueProps } from "components/ui/dialogue/dialogue";

interface IDeleteDialogueProp extends IDialogueProps {
  id: string;
}

const DeleteDialogue = ({ id, ...props }: IDeleteDialogueProp) => {
  const { deleteUser, isPending } = useDeleteUserMutation(
    id,
    props.handleClose
  );

  const handleDelete = useCallback(async () => {
    await deleteUser(id);
  }, [id, deleteUser]);

  return (
    <Dialogue center {...props}>
      <div className="text-left">
        <p className="heading">Are you sure you want to delete this user?</p>

        <div className="mt-10 flex justify-end gap-2">
          <Button onClick={props.handleClose} buttonType="secondary">
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
