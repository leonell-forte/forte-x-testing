import Dialogue, {
  IDialogueProps,
} from "../../../../components/ui/dialogue/dialogue";
import Button from "../../../../components/ui/button";
// import { useAlert } from "../../../../lib/hooks";

interface IDeleteDialogueProp extends IDialogueProps {}

const DeleteDialogue = ({
  handleClose,

  isVisible,
}: IDeleteDialogueProp) => {
  // const { setAlert } = useAlert();

  const handleDelete = async () => {};

  return (
    <Dialogue
      center
      isVisible={isVisible}
      handleClose={handleClose}
      title=""
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
            onClick={handleClose}
            buttonType="secondary"
          >
            Cancel
          </Button>

          <Button onClick={handleDelete}>Delete</Button>
        </div>
      </div>
    </Dialogue>
  );
};

export default DeleteDialogue;
