import { useQuery } from "@tanstack/react-query";
import { type Dispatch, type SetStateAction, useState } from "react";

import beneficiariesService from "@/api/beneficiaries";
import { useBeneficiariesContext } from "@/components/Dashboard/Beneficiaries/Dialogues/BeneficiariesContext";
import BeneficiariesForm from "@/components/Dashboard/Beneficiaries/Dialogues/BeneficiariesForm";
import Dialogue from "@/components/ui/dialogue/dialogue";
import type { IDialogueProps } from "@/components/ui/dialogue/dialogue";
import Spinner from "@/components/ui/spinner/spinner";

interface IBeneficiariesDialogueProps extends IDialogueProps {
  beneficiaryId?: number;

  setBeneficiaryId: Dispatch<SetStateAction<number>>;

  projectId?: number;

  editMode?: boolean;

  handleAddOrViewEvidence?: (id?: number) => void;
}

const AddDialogue = ({
  beneficiaryId,

  setBeneficiaryId,

  projectId,

  editMode,

  // handleAddOrViewEvidence,

  ...props
}: IBeneficiariesDialogueProps) => {
  const { showPrompt } = useBeneficiariesContext();

  const [onEdit, setOnEdit] = useState<boolean>(!!editMode);

  const { data: beneficiaryData, isLoading } = useQuery({
    queryKey: ["specific-beneficiary", beneficiaryId],

    queryFn: () => beneficiariesService.getOne(beneficiaryId),

    enabled: !!beneficiaryId,
  });

  return (
    <Dialogue
      {...props}
      confirmBeforeLeave={showPrompt}
      handleClose={props.handleClose}
      title={`${beneficiaryId ? `Beneficiary ID #${beneficiaryId}` : "Add beneficiary"}`}
      formId="beneficiaries-form"
    >
      {isLoading ? (
        <div className="flex h-[470px] w-full items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <div className="space-y-[22px]">
          <BeneficiariesForm
            id={beneficiaryId}
            onEdit={onEdit}
            setOnEdit={setOnEdit}
            projectId={projectId}
            handleSuccess={(id) => {
              if (id) setBeneficiaryId(id);
            }}
            beneficiaryData={beneficiaryId ? beneficiaryData : null}
            handleClose={props.handleClose}
          />

          {/* {beneficiaryId && (
            <Evidences handleAddOrViewEvidence={handleAddOrViewEvidence} />
          )} */}
        </div>
      )}
    </Dialogue>
  );
};

export default AddDialogue;
