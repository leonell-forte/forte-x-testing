import Table from "../../../../components/ui/table";
import pencil from "../../../../assets/images/icons/pencil.svg";
import { useEffect, useState } from "react";
import Input from "../../../../components/ui/input";
import Button from "../../../../components/ui/button";
import { ProjectFieldValues } from "../../../../lib/types/projects";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projects } from "../../../../lib/validators/projects";
import { useProjectMutation } from "../../../../lib/mutations/projects";
import { useQuery } from "@tanstack/react-query";
import projectService from "../../../../api/projects";
import { usePageTitle } from "../../../../lib/hooks";

interface IProps {
  id: string;
}

const Outcomes = ({ id }: IProps) => {
  const { data: project, isLoading } = useQuery({
    queryKey: ["specific-project", id],

    queryFn: () => projectService.getOne(id!),

    enabled: !!id,
  });

  usePageTitle(project?.name);

  const [editIndex, setEditIndex] = useState<number | null>(null);

  const closeEdit = () => {
    setEditIndex(null);
  };

  const {
    formState: { errors },

    handleSubmit,

    reset,

    control,
  } = useForm<ProjectFieldValues>({
    resolver: zodResolver(projects.schema),

    defaultValues: projects.defaultValues(),
  });

  useEffect(() => {
    // sets default value of project form
    if (project) {
      reset(projects.defaultValues(project));
    }
  }, [project, reset]);

  const close = () => {
    setEditIndex(null);
  };

  const { addProject, isPending } = useProjectMutation(id!, close);

  const onSubmit = async (values: ProjectFieldValues) => {
    await addProject(values);
  };

  return (
    <div className="space-y-2.5">
      <p className="font-semibold text-[24px]">Outcomes</p>

      <Table.Container isLoading={isLoading}>
        <Table.Head>
          <Table.Row>
            {HEADERS.map((item, index) => {
              return (
                <Table.Header
                  small
                  key={index}
                >
                  {item}
                </Table.Header>
              );
            })}

            <Table.Header></Table.Header>
          </Table.Row>
        </Table.Head>

        <Table.Body>
          {project?.outcomes.map((item, index) => {
            const { name, description } = item;

            const onEdit = index === editIndex;

            return (
              <Table.Row key={index}>
                <Table.Data className=" py-1">{`Outcome ${
                  index + 1
                }`}</Table.Data>

                <Table.Data className=" py-1">
                  {onEdit ? (
                    <Controller
                      name={`outcomes.${index}.name`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          small
                          {...field}
                          noHelperText
                          error={!!errors.outcomes?.[index]?.name?.message}
                          helperText={errors.outcomes?.[index]?.name?.message}
                        />
                      )}
                    />
                  ) : (
                    <p>{name}</p>
                  )}
                </Table.Data>

                <Table.Data className=" py-1">
                  {onEdit ? (
                    <Controller
                      name={`outcomes.${index}.description`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          small
                          {...field}
                          noHelperText
                          error={
                            !!errors.outcomes?.[index]?.description?.message
                          }
                          helperText={
                            errors.outcomes?.[index]?.description?.message
                          }
                        />
                      )}
                    />
                  ) : (
                    <p>{description}</p>
                  )}
                </Table.Data>

                <Table.Data className=" py-1">
                  <div className="flex justify-end gap-1.5">
                    {onEdit ? (
                      <>
                        <Button
                          onClick={closeEdit}
                          buttonType="tertiary"
                        >
                          Cancel
                        </Button>

                        <Button
                          loading={isPending}
                          onClick={handleSubmit(onSubmit)}
                        >
                          Save
                        </Button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setEditIndex(index)}
                      >
                        <img
                          src={pencil}
                          alt=""
                        />
                      </button>
                    )}
                  </div>
                </Table.Data>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Container>
    </div>
  );
};

export default Outcomes;

const HEADERS = ["Outcome", "Name", "Outcome(s)"];
