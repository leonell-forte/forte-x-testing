import { api } from "../lib/axios/interceptor";
import { DEFAULT_PAGE_SIZE } from "../lib/constants";
import { generateODataQuery, IODataObject } from "../lib/utils";
import { IProject, ProjectFieldValues } from "../lib/types/projects";

class ProjectsService {
  async list(page: number = 1, search?: string, listAll?: boolean) {
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

    params.append("$listAll", listAll ? "true" : "false");

    params.append("$pageSize", DEFAULT_PAGE_SIZE);

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
}

const projectService = new ProjectsService();

export default projectService;
