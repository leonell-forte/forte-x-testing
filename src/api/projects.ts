import { z } from "zod";
import { api } from "../lib/axios/interceptor";
import { DEFAULT_PAGE_SIZE } from "../lib/constants";
import { projects } from "../lib/validators/projects";

class ProjectsService {
  async list(page: number = 1) {
    const params = new URLSearchParams();

    params.append("$pageNum", page.toString());

    params.append("$pageSize", DEFAULT_PAGE_SIZE);

    const res = await api.get(`/projects?${params}`);
    return res.data;
  }

  async add(project: z.infer<typeof projects.schema>) {
    const res = await api.post("/projects", project);
    return res;
  }

  async delete(id: string) {
    const res = await api.delete(`/projects/${id}`);
    return res;
  }
}

const projectService = new ProjectsService();

export default projectService;
