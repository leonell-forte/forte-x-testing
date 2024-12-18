import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import evidenceService from "api/evidence";
import projectService from "api/projects";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import loader from "assets/images/icons/loader.svg";

import { EVIDENCE_STATUS } from "lib/constants";
import { useAppSelector } from "lib/hooks";
import { useEvidenceMutation } from "lib/mutations/evidences";
import { EvidenceFieldValues } from "lib/types/evidence";
import { findLabelFromOptions } from "lib/utils";
import { evidence } from "lib/validators/evidence";

import Button from "components/ui/button";
import Dialogue, { IDialogueProps } from "components/ui/dialogue/dialogue";
import Dropdown, { IOption } from "components/ui/dropdown";
import FileInput from "components/ui/file-input";
import Input from "components/ui/input";
import Spinner from "components/ui/spinner/spinner";

import CommentSection from "./Sections/CommentSection";

interface IEvidencesDialogueProps extends IDialogueProps {
  id?: number;
}

const EvidencesDialogue = ({ id, ...props }: IEvidencesDialogueProps) => {
  const [onEdit, setOnEdit] = useState(false);

  const [uploading, setUploading] = useState(false);

  const { projectId, beneficiaryId } = useAppSelector(
    (state) => state.evidence
  );

  const { data: evidenceData, isLoading: evidenceLoading } = useQuery({
    queryKey: ["evidence", id],

    queryFn: () => evidenceService.getOne(beneficiaryId!, id!),

    enabled: !!id,
  });

  const { data: project, isLoading: isProjectLoading } = useQuery({
    queryKey: ["specific-project", projectId],

    queryFn: () => projectService.getOne(projectId!.toString()),

    enabled: !!projectId,

    refetchOnMount: true,
  });

  const outcomes: IOption[] = useMemo(
    () =>
      project?.outcomes.map((item) => ({
        label: item.name,

        value: item.id.toString(),
      })) || [],
    [project]
  );

  const {
    handleSubmit,

    control,

    setValue,

    setError,

    formState: { errors },

    reset,

    watch,
  } = useForm({
    resolver: zodResolver(evidence.schema),

    defaultValues: evidence.defaultValues(evidenceData),
  });

  const file = watch("file");

  useEffect(() => {
    // prefills defaultvalue of evidence form
    if (evidenceData) {
      reset(evidence.defaultValues(evidenceData));
    }
  }, [reset, evidenceData]);

  const { addEvidence, isPending } = useEvidenceMutation({
    beneficiaryId: beneficiaryId!,

    evidenceId: id!,

    successCallback: () => props.handleClose?.(),
  });

  const onSubmit = async (values: EvidenceFieldValues) => {
    await addEvidence(values);
  };

  return (
    <Dialogue {...props} title={`Evidence ID ${id}`}>
      <div className="space-y-[30px]">
        {evidenceLoading ? (
          <div className="flex h-[470px] w-full items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-[30px]"
              id="evidences-form"
            >
              <div className="space-y-[1px]">
                <div className="space-y-[1px]">
                  <div className="flex items-start gap-4">
                    <label htmlFor="" className="w-[120px] flex-shrink-0 pt-3">
                      Description
                    </label>

                    <Controller
                      control={control}
                      name="description"
                      render={({ field }) => (
                        <Input
                          {...field}
                          disabled={!onEdit}
                          placeholder="Description"
                          error={!!errors.description?.message}
                          helperText={errors.description?.message}
                        />
                      )}
                    />
                  </div>

                  <div className="flex items-start gap-4">
                    <label htmlFor="" className="w-[120px] flex-shrink-0 pt-3">
                      Outcome
                    </label>

                    <Controller
                      control={control}
                      name="outcomeId"
                      render={({ field }) => (
                        <Dropdown
                          disabled={!onEdit}
                          loading={isProjectLoading}
                          value={findLabelFromOptions(
                            outcomes,
                            field.value?.toString()
                          )}
                          handleSelect={(val) => {
                            setValue("outcomeId", val as string);
                          }}
                          options={outcomes}
                          placeholder="Outcome"
                          error={!!errors.outcomeId?.message}
                          helperText={errors.outcomeId?.message}
                        />
                      )}
                    />
                  </div>

                  <div className="flex items-start gap-4">
                    <label htmlFor="" className="w-[120px] flex-shrink-0 pt-3">
                      Status
                    </label>

                    <Controller
                      control={control}
                      name="status"
                      render={({ field }) => (
                        <Dropdown
                          disabled={!id || !onEdit}
                          value={field.value}
                          handleSelect={(val) => {
                            setValue("status", val as string);

                            setError("status", { message: "" });
                          }}
                          placeholder="Status"
                          options={EVIDENCE_STATUS}
                          error={!!errors.status?.message}
                          helperText={errors.status?.message}
                        />
                      )}
                    />
                  </div>
                </div>

                {!!file.id && (
                  <div className="flex flex-col items-center">
                    <div className="flex max-h-[644px] w-full max-w-[490px] items-center justify-center">
                      <iframe
                        src={
                          file.fileUrl + "#navpanes=0&toolbar=0&view=Fit&page=1"
                        }
                        style={{ border: "none", background: "transparent" }}
                        width="100%"
                        height="600px"
                        title={file.filename}
                      ></iframe>

                      {uploading && (
                        <img
                          src={loader}
                          alt="loader"
                          className="absolute w-10 animate-spin"
                        />
                      )}
                    </div>

                    {!uploading && onEdit && (
                      <div className="relative px-6 py-3 text-center">
                        <p className="font-semibold text-mint">
                          Replace document
                        </p>

                        <div className="absolute top-0 cursor-pointer opacity-0">
                          <Controller
                            control={control}
                            name="file"
                            render={() => (
                              <FileInput
                                disabled={!onEdit}
                                onUploadStart={() => setUploading(true)}
                                onUploadEnd={() => setUploading(false)}
                                onSuccess={(data) => {
                                  setValue("file", data);

                                  setError("file", { message: "" });
                                }}
                                error={!!errors.file?.id?.message}
                                helperText={errors.file?.id?.message}
                              />
                            )}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {!file.id && (
                  <div className="flex items-start gap-x-4">
                    <label htmlFor="" className="w-[120px] flex-shrink-0 pt-3">
                      File
                    </label>

                    <Controller
                      control={control}
                      name="file"
                      render={() => (
                        <FileInput
                          disabled={!onEdit}
                          placeholder="Upload file"
                          onSuccess={(data) => {
                            setValue("file", data);

                            setError("file", { message: "" });
                          }}
                          error={!!errors.file?.message}
                          helperText={errors.file?.message}
                        />
                      )}
                    />
                  </div>
                )}
              </div>
            </form>
          </>
        )}

        {!!id && (
          <div className="space-y-12">
            {/* <ActivityLogSection /> */}

            <CommentSection id={id} />
          </div>
        )}

        <div className="mt-16 flex justify-end">
          {id ? (
            !onEdit ? (
              <Button onClick={() => setOnEdit(true)}>Edit</Button>
            ) : (
              <div className="space-x-4">
                <Button buttonType="secondary" onClick={() => setOnEdit(false)}>
                  Cancel
                </Button>

                <Button type="submit" form="evidences-form" loading={isPending}>
                  Save
                </Button>
              </div>
            )
          ) : (
            <Button loading={isPending} type="submit" form="evidences-form">
              Save and upload document
            </Button>
          )}
        </div>
      </div>
    </Dialogue>
  );
};

export default EvidencesDialogue;
