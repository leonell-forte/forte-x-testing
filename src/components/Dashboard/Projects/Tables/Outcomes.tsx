import * as amplitude from "@amplitude/analytics-browser";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import projectService from "api/projects";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { RiPencilFill as Pencil } from "react-icons/ri";

import { usePageTitle } from "lib/hooks";
import { useProjectMutation } from "lib/mutations/projects";
import { IsAuthorized, Projects } from "lib/role-permissions";
import { ProjectFieldValues } from "lib/types/projects";
import { projects } from "lib/validators/projects";

import Button from "components/ui/button";
import Input from "components/ui/input";
import Table from "components/ui/table";
import Cards from "components/ui/table-card";

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

  useEffect(() => {
    const debounce = setTimeout(() => {
      amplitude.track(`${project?.name} Page View`, { id });
    }, 300);
    return () => clearTimeout(debounce);
  }, [project?.name, id]);

  const [editIndex, setEditIndex] = useState<number | null>(null);

  const closeEdit = () => {
    setEditIndex(null);
  };

  const {
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
      <p className="text-[24px] font-semibold">Outcomes</p>

      <div className="lg:hidden">
        <Cards.Container
          isLoading={isLoading}
          className="!grid-cols-1 md:!grid-cols-2"
        >
          {project?.outcomes.map((item, index) => {
            const { name, description } = item;
            const onEdit = index === editIndex;

            return (
              <Cards.Card key={index}>
                <div
                  className={classNames(
                    "flex items-end",
                    onEdit ? "flex-col gap-4" : "flex-row"
                  )}
                >
                  <div className="w-full space-y-2">
                    <p className="truncate text-[18px] font-bold capitalize">
                      {onEdit ? (
                        <Controller
                          name={`outcomes.${index}.name`}
                          control={control}
                          render={({ field }) => (
                            <div className="py-2">
                              <Input label="Name" {...field} />
                            </div>
                          )}
                        />
                      ) : (
                        name
                      )}
                    </p>
                    <p>
                      {onEdit ? (
                        <Controller
                          name={`outcomes.${index}.description`}
                          control={control}
                          render={({ field }) => (
                            <div className="py-2">
                              <Input label="Description" {...field} />
                            </div>
                          )}
                        />
                      ) : (
                        description
                      )}
                    </p>
                  </div>
                  <div>
                    {IsAuthorized([Projects.UPDATE]) && (
                      <div className="flex justify-end gap-1.5">
                        {onEdit ? (
                          <>
                            <Button onClick={closeEdit} buttonType="tertiary">
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
                          <Button
                            buttonType="default"
                            type="button"
                            onClick={() => setEditIndex(index)}
                            className="group"
                          >
                            <Pencil className="h-auto w-5 transition-all group-hover:fill-mint" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Cards.Card>
            );
          })}
        </Cards.Container>
      </div>

      <div className="hidden lg:block">
        <Table.Container isLoading={isLoading}>
          <Table.Head>
            <Table.Row>
              {HEADERS.map((item, index) => {
                return <Table.Header key={index}>{item}</Table.Header>;
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
                  <Table.Data className="w-[120px]">{`Outcome ${
                    index + 1
                  }`}</Table.Data>

                  <Table.Data className="w-[300px]">
                    {onEdit ? (
                      <Controller
                        name={`outcomes.${index}.name`}
                        control={control}
                        render={({ field }) => (
                          <div className="py-1">
                            <Input {...field} />
                          </div>
                        )}
                      />
                    ) : (
                      name
                    )}
                  </Table.Data>

                  <Table.Data>
                    {onEdit ? (
                      <Controller
                        name={`outcomes.${index}.description`}
                        control={control}
                        render={({ field }) => (
                          <div className="py-1">
                            <Input {...field} />
                          </div>
                        )}
                      />
                    ) : (
                      description
                    )}
                  </Table.Data>

                  <Table.Data>
                    {IsAuthorized([Projects.UPDATE]) && (
                      <div className="flex justify-end gap-1.5">
                        {onEdit ? (
                          <>
                            <Button onClick={closeEdit} buttonType="tertiary">
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
                          <Button
                            buttonType="default"
                            type="button"
                            onClick={() => setEditIndex(index)}
                            className="group"
                          >
                            <Pencil className="h-auto w-5 transition-all group-hover:fill-mint" />
                          </Button>
                        )}
                      </div>
                    )}
                  </Table.Data>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Container>
      </div>
    </div>
  );
};

export default Outcomes;

const HEADERS = ["Outcome", "Name", "Outcome(s)"];
