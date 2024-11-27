import Input from "../../../../components/ui/input";
import Dialogue, {
  IDialogueProps,
} from "../../../../components/ui/dialogue/dialogue";
import Button from "../../../../components/ui/button";
import Dropdown, { IOption } from "../../../../components/ui/dropdown";
import { useEffect, useMemo } from "react";
import ContractOutcomeField from "../ContractOutcomeField";
import organizationService from "../../../../api/organization";
import { useMutation, useQuery } from "@tanstack/react-query";
import { IOrganization } from "@/pages/Organizations/types";
import { STATUS } from "../../../../lib/constants";
import projectService from "../../../../api/projects";
import { IProject } from "../../../../pages/Projects/types";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { contracts } from "../../../../lib/validators/contracts";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ContractFieldValues,
  IContractDetails,
  StatusType,
} from "../../../../pages/Contracts/types";
import contractService from "../../../../api/contract";
import { queryClient } from "../../../../components/QueryProvider";
import { useAlert } from "../../../../lib/hooks";
import * as amplitude from "@amplitude/analytics-browser";
import Spinner from "../../../../components/ui/spinner/spinner";

interface IContractDialogueProps extends IDialogueProps {
  id?: number;
}

const ContractDialogue = ({
  isVisible,

  id,

  handleClose,
}: IContractDialogueProps) => {
  const { setAlert } = useAlert();

  const { data: contractDetails, isLoading: contractDetailsLoading } = useQuery(
    {
      queryKey: ["specific-contract", id],

      queryFn: () => contractService.getOne(id!.toString()!),

      enabled: !!id,
    },
  );

  const {
    watch,

    control,

    setValue,

    setError,

    handleSubmit,

    reset,

    formState: { errors },
  } = useForm<ContractFieldValues>({
    resolver: zodResolver(contracts.schema),

    defaultValues: contracts.defaultValues(),
  });

  useEffect(() => {
    if (contractDetails) {
      reset(contracts.defaultValues(contractDetails));
    }
  }, [contractDetails, reset]);

  const { fields, append, remove } = useFieldArray({
    control,

    name: "contractOutcomeRates",
  });

  const { data: organizationList, isLoading: orgLoading } = useQuery({
    queryKey: ["organizations"],

    queryFn: () => organizationService.list(1, true),
  });

  const { data: projectsList, isLoading: projectLoading } = useQuery({
    queryKey: ["projects"],

    queryFn: () => projectService.list(),
  });

  const organizations: IOption[] = useMemo(
    () =>
      organizationList?.items?.map((item: IOrganization) => ({
        label: item.name,

        value: item.id?.toString(),
      })) || [],

    [organizationList],
  );

  const projects = useMemo(
    () =>
      projectsList?.items.map((item: IProject) => ({
        label: item.name,

        value: item.id,
      })) || [],

    [projectsList],
  );

  const close = () => {
    handleClose!();

    reset();
  };

  const { mutateAsync: addContract, isPending } = useMutation({
    mutationFn: contractService.add,

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["contracts"] });

      const previousContracts = queryClient.getQueryData(["projects"]);

      return { previousContracts };
    },

    onSuccess: (addedContract: ContractFieldValues) => {
      queryClient.setQueryData(
        ["contracts", 1, "", ""],

        (old: { items: IContractDetails[] }) => {
          return {
            ...old,

            items: [...(old?.items || []), addedContract],
          };
        },
      );

      close();

      setAlert({
        title: "Success!",

        status: "success",

        message: "Contract has been added successfully",
      });

      amplitude.track(`$Add Contract Form Submission`);
    },

    onError: (err: any, newContract, context) => {
      setAlert({
        status: "error",

        title: "Failed adding new contract",

        message: err?.response?.data?.message,
      });

      queryClient.setQueryData(
        ["contracts", 1, "", ""],

        context?.previousContracts,
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts", 1, "", ""] });
    },
  });

  const onSubmit = async (values: ContractFieldValues) => {
    await addContract(values);
  };

  return (
    <Dialogue
      isVisible={isVisible}
      handleClose={close}
      title="Add contract"
    >
      {contractDetailsLoading ? (
        <div className="w-full h-[470px] flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-1"
        >
          <div className="flex items-start gap-4">
            <label
              htmlFor=""
              className="pt-4 min-w-[120px]"
            >
              Parties
            </label>

            <Controller
              name="contractParties"
              control={control}
              render={({ field }) => {
                return (
                  <Dropdown
                    enableSearch
                    loading={orgLoading}
                    showAsTags
                    value={field.value.map((item) =>
                      item.organizationId?.toString(),
                    )}
                    options={organizations}
                    handleSelect={(val) => {
                      setValue(
                        "contractParties",
                        (val as string[]).map((item) => ({
                          organizationId: Number(item),
                        })),
                      );

                      setError("contractParties", { message: "" });
                    }}
                    error={!!errors.contractParties?.message}
                    helperText={errors.contractParties?.message}
                    isMultiSelect
                    placeholder="Parties"
                  />
                );
              }}
            />
          </div>

          <div className="flex items-start gap-4">
            <label
              htmlFor=""
              className="pt-4 min-w-[120px]"
            >
              Status
            </label>

            <Controller
              name="status"
              control={control}
              render={({ field }) => {
                return (
                  <Dropdown
                    value={field.value.toLowerCase()}
                    handleSelect={(val) => {
                      setValue("status", val as StatusType);

                      setError("status", { message: "" });
                    }}
                    options={STATUS}
                    placeholder="Status"
                    error={!!errors.status?.message}
                    helperText={errors.status?.message}
                  />
                );
              }}
            />
          </div>

          <div className="flex items-start gap-4">
            <label
              htmlFor=""
              className="pt-4 min-w-[120px]"
            >
              Project
            </label>

            <Controller
              name="projectId"
              control={control}
              render={({ field }) => {
                return (
                  <Dropdown
                    loading={projectLoading}
                    enableSearch
                    value={
                      projects.find(
                        (item: IOption) => item.value == field.value.toString(), //eslint-disable-line eqeqeq,
                      )?.label
                    }
                    options={projects}
                    handleSelect={(val) => {
                      setValue("projectId", Number(val));

                      setError("projectId", { message: "" });
                    }}
                    placeholder="Project"
                    error={!!errors.projectId?.message}
                    helperText={errors.projectId?.message}
                  />
                );
              }}
            />
          </div>

          <div className="flex items-start gap-4">
            <label
              htmlFor=""
              className="pt-1 flex-shrink-0 w-[120px]"
            >
              Target number of beneficiaries
            </label>

            <Controller
              name="targetNoOfBenefeciaries"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Number of beneficiaries"
                  type="number"
                  error={!!errors.targetNoOfBenefeciaries?.message}
                  helperText={errors.targetNoOfBenefeciaries?.message}
                />
              )}
            />
          </div>

          <div className="flex items-start gap-4">
            <label
              htmlFor=""
              className="pt-4 min-w-[120px]"
            >
              Document
            </label>

            <Controller
              name="document"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Upload here"
                  error={!!errors.document?.message}
                  helperText={errors.document?.message}
                />
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-6">
            <div className="flex items-start gap-4">
              <label
                htmlFor=""
                className="pt-4 min-w-[120px]"
              >
                Start date
              </label>

              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Start date"
                    error={!!errors.startDate?.message}
                    helperText={errors.startDate?.message}
                  />
                )}
              />
            </div>

            <div className="flex items-start gap-4">
              <label
                htmlFor=""
                className="pt-4 min-w-[120px]"
              >
                End date
              </label>

              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="End date"
                    error={!!errors.endDate?.message}
                    helperText={errors.endDate?.message}
                  />
                )}
              />
            </div>
          </div>

          <div className="space-y-10">
            {fields.map((item, index) => {
              return (
                <ContractOutcomeField
                  isLast={index === fields.length - 1}
                  key={index}
                  projectId={watch("projectId")}
                  control={control}
                  perOutcome={watch(`contractOutcomeRates.${index}.perOutcome`)}
                  index={index}
                  handleDelete={() => remove(index)}
                  handleSelectOutcome={(val) => {
                    setValue(
                      `contractOutcomeRates.${index}.projectOutcomeId`,
                      Number(val),
                    );
                  }}
                  handleRadioSelect={(value) => {
                    setValue(`contractOutcomeRates.${index}.threshold`, 0);
                    setError(`contractOutcomeRates.${index}.threshold`, {
                      message: "",
                    });
                    if (value === "Per outcome") {
                      setValue(
                        `contractOutcomeRates.${index}.perOutcome`,
                        true,
                      );
                    } else {
                      setValue(
                        `contractOutcomeRates.${index}.perOutcome`,
                        false,
                      );
                    }
                  }}
                  handleAdd={() =>
                    append({
                      projectOutcomeId: 0,

                      rate: "",

                      perOutcome: false,

                      threshold: 0,
                    })
                  }
                />
              );
            })}
          </div>

          <div className="flex justify-end gap-4 !mt-10">
            <Button
              onClick={close}
              buttonType="secondary"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              loading={isPending}
            >
              Save
            </Button>
          </div>
        </form>
      )}
    </Dialogue>
  );
};

export default ContractDialogue;
