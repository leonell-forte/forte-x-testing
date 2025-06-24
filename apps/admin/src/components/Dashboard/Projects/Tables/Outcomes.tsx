import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { RiPencilFill as Pencil } from "react-icons/ri";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area/ScrollArea";
import SearchInput from "@/components/ui/search-input";
import Table from "@/components/ui/table";
import Cards from "@/components/ui/table-card";
import { usePageTitle } from "@/lib/hooks";
import { useProjectMutation } from "@/lib/mutations/projects";
import { IsAuthorized, Projects } from "@/lib/role-permissions";
import { IProject, ProjectFieldValues } from "@/lib/types/projects";
import { projects } from "@/lib/validators/projects";

interface IProps {
  project: IProject;
  isLoading: boolean;
}

const Outcomes = ({ project, isLoading }: IProps) => {
  usePageTitle(project?.name);

  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [search, setSearch] = useState("");

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

  const { addProject, isPending } = useProjectMutation(
    project?.id?.toString() || "",
    close
  );

  const onSubmit = async (values: ProjectFieldValues) => {
    await addProject(values);
  };

  const outcomes = project?.outcomes?.filter((item) => {
    return item.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <>
      <div className="space-y-2.5">
        <SearchInput
          placeholder="Search"
          className="md:max-w-[313px]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="lg:hidden">
          <Cards.Container
            isLoading={isLoading}
            className="!grid-cols-1 md:!grid-cols-2"
          >
            {outcomes?.map((item, index) => {
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
                              <Pencil className="group-hover:fill-mint h-auto w-5 transition-all" />
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

        <ScrollArea className="hidden w-[calc(100vw-330px)] overflow-hidden lg:block">
          <Table.Container
            emptyConfig={{
              status: !outcomes?.length,
              title: "No outcomes yet",
              description: "Add an outcome by clicking the ‘Add’ button above.",
            }}
            isLoading={isLoading}
          >
            <Table.Head>
              <Table.Row>
                {HEADERS.map((item, index) => {
                  return <Table.Header key={index}>{item}</Table.Header>;
                })}

                <Table.Header></Table.Header>
              </Table.Row>
            </Table.Head>

            <Table.Body>
              {outcomes?.map((item, index) => {
                const { name, description } = item;

                const onEdit = index === editIndex;

                return (
                  <Table.Row key={index}>
                    <Table.Data>{`Outcome ${index + 1}`}</Table.Data>

                    <Table.Data>
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
                              <Pencil className="group-hover:fill-mint h-auto w-5 transition-all" />
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
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </>
  );
};

export default Outcomes;

const HEADERS = ["Outcome", "Name", "Description"];
