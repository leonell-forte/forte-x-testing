import * as amplitude from "@amplitude/analytics-browser";
import { useMutation } from "@tanstack/react-query";
import projectService from "api/projects";
import { useNavigate } from "react-router-dom";

import { useAlert, usePage } from "lib/hooks";
import { IOrganization } from "lib/types/organizations";
import { formatErrorMessage } from "lib/utils";

import { queryClient } from "components/QueryProvider";
import { ToastAction, toast } from "components/ui/toast/Toast";

import {
  IProject,
  IProjectOrganization,
  ProjectFieldValues,
} from "../types/projects";

export const useProjectMutation = (
  projectId: string,
  succesCallback?: () => void,
  funderId?: string
) => {
  const navigate = useNavigate();

  const { page } = usePage();

  const projectQuery = ["projects", +page || 1, { funder: funderId || "" }];

  const { mutateAsync: addProject, isPending } = useMutation({
    mutationFn: projectId
      ? (values: ProjectFieldValues) => projectService.update(values)
      : projectService.add,

    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: projectQuery,
      });

      await queryClient.cancelQueries({
        queryKey: ["specific-project", projectId],
      });

      const previousProjects = queryClient.getQueryData(projectQuery);

      const previousProject = queryClient.getQueryData([
        "specific-project",

        projectId,
      ]);

      return { previousProjects, previousProject };
    },

    onSuccess: (addedProject) => {
      queryClient.setQueryData(projectQuery, (old: { items: IProject[] }) => {
        return {
          ...old,

          items: [...(old?.items || []), addedProject.data.data],
        };
      });

      queryClient.setQueryData(["specific-project", projectId], () => {
        return addedProject;
      });

      if (funderId) {
        queryClient.setQueryData(
          ["specific org", funderId?.toString()],
          (prev: IOrganization): IOrganization => {
            return {
              ...prev,
              noOfProjects: prev.noOfProjects! + 1,
            };
          }
        );
      }

      succesCallback?.();

      toast({
        title: `Project ${projectId ? "updated" : "added"} successfully`,
        action: (
          <ToastAction
            altText="view"
            onClick={() => navigate(`/projects/${addedProject.data.data?.id}`)}
          >
            <p>View</p>
          </ToastAction>
        ),
      });

      amplitude.track(
        `${projectId ? "Update" : "Add"} Project Form Submission`
      );
    },

    onError: (err: any, newProject, context) => {
      toast({
        title: `Failed ${projectId ? "updating" : "adding"} project`,
        description: formatErrorMessage(err?.response?.data?.data?.[0]),
        variant: "danger",
      });

      queryClient.setQueryData(projectQuery, context?.previousProjects);

      queryClient.setQueryData(
        ["specific-project", projectId],
        context?.previousProject
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: projectQuery });

      queryClient.invalidateQueries({
        queryKey: ["specific-project", projectId],
      });
    },
  });

  return { addProject, isPending };
};

export const useDeleteProjectMutation = (
  id: number,

  successCallback?: () => void,

  funderId?: number
) => {
  const { page, setPage } = usePage();

  const projectQuery = [
    "projects",
    +page || 1,
    { funder: funderId?.toString() || "" },
  ];

  const { mutateAsync: deletProject, isPending } = useMutation({
    mutationFn: projectService.delete,

    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: projectQuery,
      });

      const previousProject =
        queryClient.getQueryData<IProject[]>(projectQuery);

      return { previousProject };
    },

    onSuccess: async () => {
      queryClient.setQueryData(
        projectQuery,

        (old: { items: IProject[] }) => {
          // sets page to previous page if list from current page is empty (except page 1)
          if (old?.items?.length === 1 && page !== 1) {
            setPage(page - 1);
          }
          return {
            ...old,
            items: old?.items?.filter((item) => item.id !== id),
          };
        }
      );

      if (!!funderId) {
        queryClient.setQueryData(
          ["specific org", funderId?.toString()],
          (prev: IOrganization): IOrganization => {
            return {
              ...prev,
              noOfProjects: prev.noOfProjects! - 1,
            };
          }
        );
      }

      successCallback?.();

      toast({
        title: "Project deleted!",
      });

      amplitude.track(`Delete Project Performed`, {
        id: id,
      });
    },

    onError: (err: any, newProject, context) => {
      toast({
        title: `Failed deleting project`,
        description: err?.response?.data?.message,
        variant: "danger",
      });

      queryClient.setQueryData(projectQuery, context?.previousProject);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: projectQuery });
    },
  });

  return { deletProject, isPending };
};

export const useTagPartnerMutation = (
  projectId: number,

  successCallback?: () => void
) => {
  const { setAlert } = useAlert();

  const { mutateAsync: tagPartners, isPending } = useMutation({
    mutationFn: (organizationIds: number[]) =>
      projectService.tagPartners(projectId, organizationIds),

    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["project-organizations", projectId],
      });

      const previousPartners = queryClient.getQueryData([
        "project-organizations",
        projectId,
      ]);

      return { previousPartners };
    },

    onSuccess: () => {
      queryClient.setQueryData(
        ["project-organizations"],
        (old: { items: IProjectOrganization }) => {
          return {
            ...old,
          };
        }
      );

      successCallback?.();

      setAlert({
        status: "success",

        message: `Partner tagged successfully`,

        title: "Success!",
      });

      amplitude.track(`Project Tag Partner Form Submission`, {
        id: projectId,
      });
    },

    onError: (err: any, _, context) => {
      setAlert({
        status: "error",

        title: `Failed tagging partner`,

        message: err?.response?.data?.message,
      });

      queryClient.setQueryData(
        ["project-organizations", projectId],

        context?.previousPartners
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["project-organizations", projectId],
      });
    },
  });

  return { tagPartners, isPending };
};
