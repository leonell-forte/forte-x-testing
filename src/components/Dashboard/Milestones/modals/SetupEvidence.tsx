import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import evidenceService from "api/evidence";
import classNames from "classnames";
import { get } from "lodash";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import useBeneficiariesList from "lib/common/lists/useBeneficiariesList";
import useMilestoneList from "lib/common/lists/useMilestoneList";
import { EVIDENCE_STATUS, NO_PROMPT_STATUS, filterStatus } from "lib/constants";
import { useEvidenceMutation } from "lib/mutations/evidences";
import { EvidenceFieldValues } from "lib/types/evidence";
import { IMilestone, TMilestoneEvidence } from "lib/types/milestones";
import { completeSchema, evidence } from "lib/validators/evidence";

import { useProfile } from "components/ProfileContext";
import { useCustomPrompt } from "components/ui/alert/custom-prompt";
import Button from "components/ui/button";
import Controller from "components/ui/custom-controller/CustomController";
import { useModal } from "components/ui/dialogue/v2/Modal";
import Dropdown from "components/ui/dropdown";
import FileInput, { ScanAnimation } from "components/ui/file-input";
import { Form } from "components/ui/form/Form";
import { useAutoSaveForm } from "components/ui/form/useAutoSave";
import Input from "components/ui/input";
import Spinner from "components/ui/spinner/spinner";

import { showViewEvidenceModal } from "./ViewEvidence";

type TParams = {
  milestone?: IMilestone;
  evidenceDetails?: TMilestoneEvidence;
  beneficiaryIdParam?: string;
};

const config = {
  "pending review": {
    title: "Request review",
    subText:
      "Changing a beneficiary status to Pending evidence review will send an email to Forte or your Funder asking them to review this Beneficiary’s evidence. Click cancel to revert or send request to send the email.",
  },
  "more information requested": {
    title: "Request more information",
    subText:
      "Changing evidence status to More information requested will send an email to Forte or your Funder asking them to review this evidence. Click cancel to revert or send request to send the email.",
  },
};

export function showSetupEvidenceModal(params: TParams) {
  const isEdit = Boolean(params.evidenceDetails);
  useModal.getState().open({
    component: (
      <SetupEvidenceModal
        milestone={params.milestone}
        evidenceDetails={params.evidenceDetails}
        beneficiaryIdParam={params.beneficiaryIdParam}
      />
    ),
    size: "2xl",
    title: `${isEdit ? "Edit" : "Add"} Evidence ${isEdit ? "ID: " + params.evidenceDetails?.id : ""}`,
    panelClassName: "max-w-[584px] lg:px-[85px]",
  });
}

function SetupEvidenceModal({
  milestone: selectedMilestone,
  evidenceDetails,
  beneficiaryIdParam,
}: TParams) {
  const [milestone, setMilestone] = useState<IMilestone | null>(
    selectedMilestone || null
  );
  const [uploading, setUploading] = useState(false);

  const { profile } = useProfile();
  const { close } = useModal();
  const { open } = useCustomPrompt();

  const fromBeneficiaries = Boolean(beneficiaryIdParam);
  const isThreshold = milestone?.type === "threshold";
  const formId = "evidence-form";
  const contractId = milestone?.contract.id || "";

  const {
    milestones,
    handleSearchMilestone,
    rawList,
    isLoading: milestoneLoading,
  } = useMilestoneList({
    key: ["dropdown"],
  });

  const {
    beneficiaries,
    isLoading: beneLoading,
    handleSearchBene,
  } = useBeneficiariesList({
    key: ["dropdown"],
    pageSize: 100,
    filters: {
      contractId,
    },
  });

  const form = useForm<EvidenceFieldValues>({
    resolver: zodResolver(isThreshold ? completeSchema : evidence.schema),
    defaultValues: evidence.defaultValues(),
    mode: "onChange",
  });

  const {
    control,
    watch,
    setValue,
    setError,
    reset,
    formState: { isDirty },
  } = form;

  const [file] = watch(["file", "beneficiaryId"]);

  const { addEvidence, isPending } = useEvidenceMutation({
    milestoneId: String(milestone?.id || 0),

    evidenceId: evidenceDetails?.id || 0,

    successCallback: (res) => {
      showViewEvidenceModal({
        milestoneId: milestone?.id as string,
        evidenceId: res.id,
        beneficiaryId: res.beneficiary.id,
      });
    },
  });

  const onSubmit = async (values: EvidenceFieldValues) => {
    const payload = {
      ...values,
      beneficiaryId: isThreshold
        ? values.beneficiaryId
        : milestone!.reference.id!,
    };
    if (
      evidenceData &&
      !NO_PROMPT_STATUS.includes(values.status) &&
      evidenceData.status !== values.status
    ) {
      open({
        ...get(config, values.status),
        onYes: () => addEvidence(payload),
        yesLabel: "Send request",
      });
      return;
    }
    await addEvidence(payload);
  };

  const { data: evidenceData, isLoading: evidenceLoading } = useQuery({
    queryKey: ["evidence", evidenceDetails?.id],

    queryFn: () =>
      evidenceService.getOne(
        evidenceDetails ? evidenceDetails.beneficiary.id : NaN,
        evidenceDetails ? evidenceDetails.id : NaN
      ),

    enabled: Boolean(evidenceDetails?.id),
  });

  const { data: fileData, isLoading: isFileLoading } = useQuery({
    queryKey: ["file", file?.fileUrl],

    queryFn: () => evidenceService.getFile(file?.fileUrl || ""),

    enabled: Boolean(file?.fileUrl),

    refetchOnWindowFocus: false,
  });

  useAutoSaveForm(form, {
    formId,
    enabled: !evidenceDetails,
  });

  useEffect(() => {
    // prefills defaultvalue of evidence form
    if (evidenceData) {
      reset(evidence.defaultValues(evidenceData));
      return;
    }
    if (fromBeneficiaries && beneficiaryIdParam) {
      setValue("beneficiaryId", beneficiaryIdParam);
      return;
    }
  }, [reset, evidenceData, fromBeneficiaries, beneficiaryIdParam, setValue]);

  return (
    <div>
      {evidenceLoading ? (
        <div className="flex h-[470px] w-full items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <Form form={form} onSubmit={onSubmit} id="evidences-form">
          <div className="space-y-4">
            <div
              className={classNames(
                "grid grid-cols-1 gap-4 sm:grid-cols-2",
                !evidenceData && "!grid-cols-1"
              )}
            >
              {isThreshold ? (
                <Controller
                  label="Beneficiary"
                  required
                  name="beneficiaryId"
                  control={control}
                  render={({ field }) => {
                    return (
                      <Dropdown
                        enableSearch
                        disabled={
                          Boolean(evidenceDetails) ||
                          fromBeneficiaries ||
                          !milestone
                        }
                        loading={beneLoading}
                        value={
                          beneficiaries.find(
                            (item) => Number(item.value) === Number(field.value)
                          )?.label
                        }
                        options={beneficiaries}
                        handleSelect={(val) => {
                          field.onChange(String(val));
                        }}
                        placeholder="Select beneficiary"
                        onChange={(e) => handleSearchBene(e.target.value)}
                      />
                    );
                  }}
                />
              ) : null}
              {!selectedMilestone && (
                <Controller
                  label="Milestone"
                  name="milestoneId"
                  control={control}
                  render={() => {
                    return (
                      <Dropdown
                        enableSearch
                        value={milestone ? `Milestone ID: ${milestone.id}` : ""}
                        options={milestones}
                        handleSelect={(val) => {
                          const milestone = rawList?.items.find(
                            (i) => i.id === val
                          );
                          setMilestone(milestone || null);
                        }}
                        placeholder="Select milestone"
                        onChange={(e) => handleSearchMilestone(e.target.value)}
                        loading={milestoneLoading}
                      />
                    );
                  }}
                />
              )}
              <Controller
                label="Evidence Description"
                required
                control={control}
                name="description"
                render={({ field }) => (
                  <Input {...field} placeholder="Description" />
                )}
              />
              {!!evidenceData && (
                <Controller
                  label="Status"
                  required
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Dropdown
                      value={field.value}
                      handleSelect={(val) => field.onChange(val)}
                      placeholder="Status"
                      options={filterStatus(EVIDENCE_STATUS, profile.orgType)}
                      disabled={
                        !evidenceDetails || profile.orgType === "provider"
                      }
                    />
                  )}
                />
              )}
            </div>
            {!isFileLoading && fileData ? (
              <div className="flex flex-col items-center">
                <div className="flex h-[calc(100vh-550px)] w-full items-center justify-center overflow-x-auto md:h-[calc(100vh-550px)]">
                  {fileData && (
                    <iframe
                      src={fileData + "#navpanes=0&toolbar=0&view=Fit&page=1"}
                      style={{ border: "none", background: "transparent" }}
                      width="100%"
                      height="100%"
                      title={file.filename}
                      className={
                        uploading || isFileLoading
                          ? "h-full opacity-[.1]"
                          : "w-[700px] max-w-full overflow-x-auto md:w-[42rem]"
                      }
                    />
                  )}

                  {uploading && (
                    <div className="absolute">
                      <ScanAnimation isVertical />
                    </div>
                  )}
                </div>

                {fileData && (
                  <div className="relative flex justify-center px-6 py-3 text-center">
                    <p className="pointer-events-none absolute truncate text-center font-semibold text-mint">
                      Replace document
                    </p>
                    <div className="opacity-0">
                      <FileInput
                        accept=".pdf"
                        onUploadStart={() => setUploading(true)}
                        onUploadEnd={() => setUploading(false)}
                        onSuccess={(data) => {
                          setValue("file", data);

                          setError("file", { message: "" });
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : null}
            {isFileLoading ? (
              <div className="flex h-[250px] w-full items-center justify-center">
                <Spinner />
              </div>
            ) : null}

            {!file.id && (
              <Controller
                label="File"
                required
                control={control}
                name="file"
                render={() => (
                  <FileInput
                    accept=".pdf"
                    placeholder="Upload file"
                    onSuccess={(data) => {
                      setValue("file", data);

                      setError("file", { message: "" });
                    }}
                  />
                )}
              />
            )}
          </div>

          <div className="mt-8 flex w-full justify-end">
            {evidenceDetails ? (
              <div className="flex w-full flex-col justify-end gap-4 sm:flex-row">
                <Button
                  buttonType="secondary"
                  onClick={close}
                  className="w-full sm:w-fit"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  className="w-full sm:w-fit"
                  form="evidences-form"
                  disabled={!isDirty}
                  loading={isPending}
                >
                  Update
                </Button>
              </div>
            ) : (
              <Button
                loading={isPending}
                type="submit"
                form="evidences-form"
                disabled={!milestone}
              >
                Add and upload document
              </Button>
            )}
          </div>
        </Form>
      )}
    </div>
  );
}
