import Input from "../../../../components/ui/input";
import Dialogue, {
  IDialogueProps,
} from "../../../../components/ui/dialogue/dialogue";
import Button from "../../../../components/ui/button";
import Dropdown, { IOption } from "../../../../components/ui/dropdown";
import { BENEFICIARY_STATUS } from "../../../../lib/constants";
import { useEffect, useMemo, useState } from "react";
import CommentSection from "./Sections/CommentSection";
import ActivityLogSection from "./Sections/ActivityLogSection";
import DocumentSection from "./Sections/DocumentSection";
import { useAlert, useAppSelector } from "../../../../lib/hooks";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { evidence } from "../../../../lib/validators/evidence";
import { EvidenceFieldValues } from "../../../../lib/types/evidence";
import evidenceService from "../../../../api/evidence";
import FileInput from "../../../../components/ui/file-input";
import { useQuery } from "@tanstack/react-query";
import projectService from "../../../../api/projects";
import { findLabelFromOptions } from "../../../../lib/utils";

interface IEvidencesDialogueProps extends IDialogueProps {
  id?: number;
}

const EvidencesDialogue = ({ id, ...props }: IEvidencesDialogueProps) => {
  const [onEdit, setOnEdit] = useState(false);

  const [loading, setLoading] = useState(false);

  const { contractId, projectId, beneficiaryId } = useAppSelector(
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
  } = useForm({
    resolver: zodResolver(evidence.schema),

    defaultValues: evidence.defaultValues(),
  });

  useEffect(() => {
    if (evidenceData) {
      reset(evidence.defaultValues(evidenceData));
    }
  }, [reset, evidenceData]);

  const { setAlert } = useAlert();

  const onSubmit = async (values: EvidenceFieldValues) => {
    setLoading(true);
    try {
      evidenceService.add({
        projectId: projectId!,

        beneficiaryId: beneficiaryId!,

        contractId: contractId!,

        values,
      });

      setAlert({
        title: "Success!",

        message: "New evidence added successfully",

        status: "success",
      });

      props.handleClose?.();
    } catch (err: any) {
      setAlert({
        title: "An error has occurred",

        message: err?.response?.data?.message,

        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialogue
      {...props}
      title={`${id ? "Edit" : "Add"} evidence`}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-[30px]"
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

          <div className="flex items-start gap-4">
            <label
              htmlFor=""
              className="pt-3 flex-shrink-0 w-[120px]"
            >
              File
            </label>

            <Controller
              control={control}
              name="fileId"
              render={() => (
                <FileInput
                  placeholder="Upload file"
                  onSuccess={(data) => {
                    setValue("fileId", data.id);

                    setError("fileId", { message: "" });
                  }}
                  error={!!errors.fileId?.message}
                  helperText={errors.fileId?.message}
                />
              )}
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
            <Button
              loading={loading}
              type="submit"
            >
              Save and upload document
            </Button>
          )}
        </div>
      </form>
    </Dialogue>
  );
};

export default EvidencesDialogue;
