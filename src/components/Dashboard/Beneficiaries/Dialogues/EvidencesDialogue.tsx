import Input from "../../../../components/ui/input";
import Dialogue, {
  IDialogueProps,
} from "../../../../components/ui/dialogue/dialogue";
import Button from "../../../../components/ui/button";
import Dropdown from "../../../../components/ui/dropdown";
import { BENEFICIARY_STATUS } from "../../../../lib/constants";
import { useState } from "react";
import CommentSection from "./Sections/CommentSection";
import ActivityLogSection from "./Sections/ActivityLogSection";
import DocumentSection from "./Sections/DocumentSection";

interface IEvidencesDialogueProps extends IDialogueProps {
  id?: number;
}

const EvidencesDialogue = ({ id, ...props }: IEvidencesDialogueProps) => {
  const [onEdit, setOnEdit] = useState(false);
  return (
    <Dialogue
      {...props}
      title={`${id ? "Edit" : "Add"} evidence`}
    >
      <form className="space-y-[30px]">
        <div>
          <div className="flex items-start gap-4">
            <label
              htmlFor=""
              className="pt-1 flex-shrink-0 w-[120px]"
            >
              Description
            </label>

            <Input placeholder="Description" />
          </div>

          <div className="flex items-start gap-4">
            <label
              htmlFor=""
              className="pt-1 flex-shrink-0 w-[120px]"
            >
              Outcome
            </label>

            <Input placeholder="Outcome" />
          </div>

          <div className="flex items-start gap-4">
            <label
              htmlFor=""
              className="pt-1 flex-shrink-0 w-[120px]"
            >
              Status
            </label>

            <Dropdown
              placeholder="Status"
              options={BENEFICIARY_STATUS}
            />
          </div>
        </div>

        {!!id && (
          <div className="space-y-12">
            <DocumentSection />

            <ActivityLogSection />

            <CommentSection />
          </div>
        )}

        <div className="flex justify-end mt-16">
          {onEdit ? (
            <div className="space-x-4">
              <Button
                buttonType="secondary"
                onClick={() => setOnEdit(false)}
              >
                Cancel
              </Button>

              <Button>Save</Button>
            </div>
          ) : id ? (
            <Button onClick={() => setOnEdit(true)}>Edit</Button>
          ) : (
            <Button>Save and upload document</Button>
          )}
        </div>
      </form>
    </Dialogue>
  );
};

export default EvidencesDialogue;
