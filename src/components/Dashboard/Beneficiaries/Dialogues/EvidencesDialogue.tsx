import Input from "../../../../components/ui/input";
import Dialogue, {
  IDialogueProps,
} from "../../../../components/ui/dialogue/dialogue";
import Button from "../../../../components/ui/button";
import Dropdown, { IOption } from "../../../../components/ui/dropdown";
import { BENEFICIARY_STATUS } from "../../../../lib/constants";
import { useEffect, useMemo, useState } from "react";
import CommentSection from "./Sections/CommentSection";

import { useAppSelector } from "../../../../lib/hooks";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { evidence } from "../../../../lib/validators/evidence";
import { EvidenceFieldValues } from "../../../../lib/types/evidence";
import evidenceService from "../../../../api/evidence";
import FileInput from "../../../../components/ui/file-input";
import { useQuery } from "@tanstack/react-query";
import projectService from "../../../../api/projects";
import { findLabelFromOptions } from "../../../../lib/utils";
import loader from "../../../../assets/images/icons/loader.svg";
import classNames from "classnames";
import { useEvidenceMutation } from "../../../../lib/mutations/evidences";
import Spinner from "../../../../components/ui/spinner/spinner";

interface IEvidencesDialogueProps extends IDialogueProps {
  id?: number;
}

const EvidencesDialogue = ({ id, ...props }: IEvidencesDialogueProps) => {
  const [uploading, setUploading] = useState(false);

  const { projectId, beneficiaryId } = useAppSelector(
    (state) => state.evidence,
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
    [project],
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
    <Dialogue
      {...props}
      title={`${id ? "Edit" : "Add"} evidence`}
    >
      {evidenceLoading ? (
        <div className="w-full h-[470px] flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-[30px]"
            id="evidences-form"
          >
            <div>
              <div className="flex items-start gap-4">
                <label
                  htmlFor=""
                  className="pt-3 flex-shrink-0 w-[120px]"
                >
                  Description
                </label>

                <Controller
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Description"
                      error={!!errors.description?.message}
                      helperText={errors.description?.message}
                    />
                  )}
                />
              </div>

              <div className="flex items-start gap-4">
                <label
                  htmlFor=""
                  className="pt-3 flex-shrink-0 w-[120px]"
                >
                  Outcome
                </label>

                <Controller
                  control={control}
                  name="outcomeId"
                  render={({ field }) => (
                    <Dropdown
                      loading={isProjectLoading}
                      value={findLabelFromOptions(
                        outcomes,
                        field.value?.toString(),
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
                <label
                  htmlFor=""
                  className="pt-3 flex-shrink-0 w-[120px]"
                >
                  Status
                </label>

                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Dropdown
                      value={field.value}
                      handleSelect={(val) => {
                        setValue("status", val as string);

                        setError("status", { message: "" });
                      }}
                      placeholder="Status"
                      options={BENEFICIARY_STATUS}
                      error={!!errors.status?.message}
                      helperText={errors.status?.message}
                    />
                  )}
                />
              </div>
            </div>

            {file && (
              <div className="flex flex-col items-center">
                <div className="w-full max-w-[490px] max-h-[644px] flex items-center justify-center">
                  <img
                    src={file?.fileUrl}
                    alt={file.filename}
                    className={classNames(uploading && "opacity-20")}
                  />
                  {uploading && (
                    <img
                      src={loader}
                      alt="loader"
                      className="animate-spin absolute w-10"
                    />
                  )}
                </div>

                {!uploading && (
                  <div className="py-3 px-6 relative text-center">
                    <p className="font-semibold text-mint">Replace document</p>
                    <div className="absolute top-0 opacity-0 cursor-pointer">
                      <Controller
                        control={control}
                        name="file"
                        render={() => (
                          <FileInput
                            onUploadStart={() => setUploading(true)}
                            onUploadEnd={() => setUploading(false)}
                            onSuccess={(data) => {
                              setValue("file", data);

                              setError("file", { message: "" });
                            }}
                          />
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {!file && (
              <div className="flex items-start gap-4">
                <label
                  htmlFor=""
                  className="pt-3 flex-shrink-0 w-[120px]"
                >
                  File
                </label>

                <Controller
                  control={control}
                  name="file"
                  render={() => (
                    <FileInput
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
          </form>
        </>
      )}

      {!!id && (
        <div className="space-y-12">
          {/* <ActivityLogSection /> */}

          <CommentSection id={id} />
        </div>
      )}

      <div className="flex justify-end mt-16">
        {id ? (
          <div className="space-x-4">
            <Button
              buttonType="secondary"
              onClick={props.handleClose}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              form="evidences-form"
              loading={isPending}
            >
              Save
            </Button>
          </div>
        ) : (
          <Button
            loading={isPending}
            type="submit"
            form="evidences-form"
          >
            Save and upload document
          </Button>
        )}
      </div>
    </Dialogue>
  );
};

export default EvidencesDialogue;
