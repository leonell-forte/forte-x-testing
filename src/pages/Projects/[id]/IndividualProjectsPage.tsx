import { Link, useParams } from "react-router-dom";
import Outcomes from "../../../components/Dashboard/Projects/Tables/Outcomes";
import arrow from "../../../assets/images/icons/arrow.svg";
import Contracts from "../../../components/Dashboard/Projects/Tables/Contracts";
import Partners from "../../../components/Dashboard/Projects/Tables/Partners";
import Beneficiaries from "../../../components/Dashboard/Projects/Tables/Beneficiaries";
import { useQuery } from "@tanstack/react-query";
import projectService from "../../../api/projects";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projects } from "../../../lib/validators/projects";
import { useEffect } from "react";
import { useProjectMutation } from "../../../lib/mutations/projects";
import { ProjectFieldValues } from "../../../lib/types/projects";

const IndividualProjectsPage = () => {
  const { id } = useParams();

  const { data: project, isLoading } = useQuery({
    queryKey: ["specific-project", id],

    queryFn: () => projectService.getOne(id!),

    enabled: !!id,
  });

  const {
    formState,

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

  const { addProject } = useProjectMutation(id!);

  const onSubmit = async (values: ProjectFieldValues) => {
    await addProject(values);
  };

  return (
    <div className="space-y-2.5 py-3">
      <Link
        to="/projects"
        className="flex items-center gap-2.5"
      >
        <img
          src={arrow}
          alt="back"
        />

        <p className="font-semibold">Back</p>
      </Link>

      <Outcomes
        control={control}
        formState={formState}
        outcomes={project?.outcomes}
        isLoading={isLoading}
        onSubmit={handleSubmit(onSubmit)}
      />

      <Contracts />

      <Partners />

      <Beneficiaries />
    </div>
  );
};

export default IndividualProjectsPage;
