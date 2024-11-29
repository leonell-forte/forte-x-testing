import Button from "../../../../components/ui/button";
import Dialogue, {
  IDialogueProps,
} from "../../../../components/ui/dialogue/dialogue";
import { useDeleteContractMutation } from "../../../../lib/mutations/contracts";

interface IDeleteDialogueProp extends IDialogueProps {
  id: string;
}

const DeleteDialogue = ({ id, ...props }: IDeleteDialogueProp) => {
  const { deleteContract, isPending } = useDeleteContractMutation(
    id,
    props.handleClose,
  );

  const handleDelete = async () => {
    await deleteContract(id.toString());
  };

  return (
    <Dialogue
      center
      {...props}
    >
      <div className="text-left">
        <p className="text-[20px] font-semibold">
          Are you sure you want to delete this contract?
        </p>
        <p className="text-[14px] font-medium">
          When you delete a contract, its beneficiaries will no longer be
          related to the contract.
        </p>

        <div className="flex justify-end gap-2 mt-10">
          <Button
            onClick={props.handleClose}
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
