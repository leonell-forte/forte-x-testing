import { useQuery } from "@tanstack/react-query";
import beneficiariesService from "api/beneficiaries";
import { useState } from "react";

import { useAlert } from "lib/hooks";
import { useBeneficiaryMutation } from "lib/mutations/beneficiaries";
import { Beneficiaries, IsAuthorized } from "lib/role-permissions";
import { formatErrorMessage } from "lib/utils";
import { beneficiaries } from "lib/validators/beneficiaries";

import Button from "components/ui/button";
import Dialogue, { IDialogueProps } from "components/ui/dialogue/dialogue";
import Spinner from "components/ui/spinner/spinner";

import BeneficiariesForm from "./BeneficiariesForm";
import Evidences from "./Evidences";

interface IBeneficiariesDialogueProps extends IDialogueProps {
  id?: number;

  projectId?: number;

  editMode?: boolean;

  handleAddOrViewEvidence?: (id?: number) => void;
}

const AddDialogue = ({
  id,

  projectId,

  editMode,

  handleAddOrViewEvidence,

  ...props
}: IBeneficiariesDialogueProps) => {
  const { setAlert } = useAlert();

  const [onEdit, setOnEdit] = useState<boolean>(!!editMode);

  const [loadingStatus, setLoadingStatus] = useState<
    "Accepted" | "Rejected" | null
  >(null);

  const { data: beneficiaryData, isLoading } = useQuery({
    queryKey: ["specific-beneficiary", id],

    queryFn: () => beneficiariesService.getOne(id),

    enabled: !!id,
  });

  const { addBeneficiary } = useBeneficiaryMutation({
    beneficiaryId: id,

    successCallback: props.handleClose,
  });

  const updateStatus = async (status: "Accepted" | "Rejected") => {
    setLoadingStatus(status);

    try {
      if (beneficiaryData) {
        await addBeneficiary(
          beneficiaries.defaultValues({
            beneficiary: { ...beneficiaryData, status },
            projectId,
          })
        );
      }
    } catch (err: any) {
      setAlert({
        title: `Failed  updating  beneficiary`,

        message:
          formatErrorMessage(err?.response?.data?.data?.[0]) ||
          err?.response?.data?.message,

        status: "error",
      });
    } finally {
      setLoadingStatus(null);
    }
  };

  const currentStatus = beneficiaryData?.status;

  const isStatusFinalized =
    currentStatus === "Accepted" || currentStatus === "Rejected";

  return (
    <Dialogue
      {...props}
      confirmBeforeLeave={onEdit}
      handleClose={props.handleClose}
      title={`${id ? `Beneficiary ID #${id}` : "Add beneficiary"}`}
    >
      {isLoading ? (
        <div className="flex h-[470px] w-full items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <div className="space-y-[22px]">
          <BeneficiariesForm
            id={id}
            onEdit={onEdit}
            setOnEdit={setOnEdit}
            projectId={projectId}
            handleClose={props.handleClose}
            beneficiaryData={beneficiaryData}
          />

          {id && (
            <Evidences handleAddOrViewEvidence={handleAddOrViewEvidence} />
          )}

          {id && IsAuthorized([Beneficiaries.UPDATE]) && !isStatusFinalized && (
            <div className="flex w-full flex-col items-center justify-center gap-4 sm:flex-row sm:justify-end">
              <Button
                loading={loadingStatus === "Rejected"}
                onClick={() => updateStatus("Rejected")}
                buttonType="secondary"
                className="w-full"
              >
                Reject beneficiary
              </Button>

              <Button
                loading={loadingStatus === "Accepted"}
                onClick={() => updateStatus("Accepted")}
                className="w-full"
              >
                Accept beneficiary
              </Button>
            </div>
          )}
        </div>
      )}
    </Dialogue>
  );
};

export default AddDialogue;
