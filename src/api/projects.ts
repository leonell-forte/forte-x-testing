import { api } from "../lib/axios/interceptor";
import { DEFAULT_PAGE_SIZE } from "../lib/constants";
import { IProject, ProjectFieldValues } from "../lib/types/projects";
import { IODataObject, generateODataQuery } from "../lib/utils";

interface IProjectListProp {
  page?: number;

  search?: string;

  listAll?: boolean;
}

class ProjectsService {
  async list({
    page = 1,

    search,

    listAll,
  }: IProjectListProp): Promise<{ items: IProject[]; totalSize: number }> {
    const params = new URLSearchParams();

    const filters: IODataObject = {
      "project.name": {
        value: search!,

        exact: false,

        isSearch: true,
      },
      "project.provider.name": {
        value: search!,

        exact: false,

        isSearch: true,
      },
    };

    params.append("$pageNum", page.toString());

    params.append("$pageSize", DEFAULT_PAGE_SIZE);

    params.append("$orderBy", `"project"."createdAt" desc`);

    if (listAll) {
      params.append("$listAll", "true");
    }

    if (generateODataQuery(filters)) {
      params.append("$filter", generateODataQuery(filters));
    }

    const res = await api.get(`/projects?${params}`);

    return res.data;
  }

  async add(project: ProjectFieldValues) {
    const res = await api.post("/projects", project);

    return res;
  }

  async delete(id: string) {
    const res = await api.delete(`/projects/${id}`);

    return res;
  }

  async getOne(id: string): Promise<IProject> {
    const response = await api.get(`/projects/${id}`);

    return response.data.data;
  }

  async update(project: ProjectFieldValues) {
    const data = {
      ...project,

      outcomes: [
        ...project.outcomes.map((item) => ({
          id: item.id,

          name: item.name,

          description: item.description,
        })),
      ],
    };

    const response = await api.put("/projects", data);

    return response;
  }

  async getOrganizations(id: number) {
    const response = await api.get(`/projects/${id}/organizations`);

    return response.data;
  }

  async tagPartners(id: number, organizationIds: number[]) {
    const response = await api.post(`/projects/${id}/organizations`, {
      organizationIds,
    });

    return response.data;
  }
}

const projectService = new ProjectsService();

export default projectService;
