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
            editMode={editMode}
            projectId={projectId}
            handleClose={props.handleClose}
            beneficiaryData={beneficiaryData}
          />

          {id && (
            <Evidences handleAddOrViewEvidence={handleAddOrViewEvidence} />
          )}

          {IsAuthorized([Beneficiaries.UPDATE]) && !isStatusFinalized && (
            <div className="flex justify-end gap-4">
              <Button
                loading={loadingStatus === "Rejected"}
                onClick={() => updateStatus("Rejected")}
                buttonType="secondary"
              >
                Reject beneficiary
              </Button>

              <Button
                loading={loadingStatus === "Accepted"}
                onClick={() => updateStatus("Accepted")}
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
