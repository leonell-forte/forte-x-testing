import Dialogue, {
  IDialogueProps,
} from "../../../../components/ui/dialogue/dialogue";
import Button from "../../../../components/ui/button";
import { useDeleteBeneficiaryMutation } from "../../../../lib/mutations/beneficiaries";

interface IDeleteDialogueProp extends IDialogueProps {
  id: number;
}

const DeleteDialogue = ({ id, ...props }: IDeleteDialogueProp) => {
  const { deleteBeneficiary, isPending } = useDeleteBeneficiaryMutation(
    id,
    props.handleClose,
  );

  const handleDelete = async () => {
    await deleteBeneficiary(id);
  };

  return (
    <Dialogue
      center
      isVisible={props.isVisible}
      handleClose={props.handleClose}
    >
      <div className="text-left">
        <p className="text-[20px] font-semibold">
          Are you sure that you want to delete this beneficiary?
        </p>
        <p className="text-[14px] font-medium">
          When you delete a beneficiary, all evidence documents and other
          information are deleted too.
        </p>

        <div className="flex justify-end gap-2 mt-6">
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
