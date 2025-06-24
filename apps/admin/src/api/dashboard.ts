import { api } from "@/lib/axios/interceptor";

import type {
  ActionItemsType,
  BeneficiaryStats,
  Budget,
  ContractProgress,
  ContractType,
  MilestoneType,
  ProjectMileStoneProgress,
  ProjectMilestoneType,
  ProjectTypes,
} from "@/components/Dashboard/Dashboard/types";

class DashboardService {
  async getBudget(projectId?: string): Promise<Budget> {
    const res = await api.get(`/dashboard/budget/${projectId || ""}`);

    return res.data.data;
  }

  async getActionItems(projectId?: string): Promise<ActionItemsType> {
    const res = await api.get(`/dashboard/action-items/${projectId || ""}`);

    return res.data.data;
  }

  async getBeneficiaries(projectId?: string): Promise<BeneficiaryStats> {
    const res = await api.get(`/dashboard/beneficiaries/${projectId || ""}`);

    return res.data.data;
  }

  async getMilestones(): Promise<{
    outcome: MilestoneType;
    threshold: MilestoneType;
  }> {
    const outcome = await api.get(`/dashboard/milestones/outcome`);
    const threshold = await api.get(`/dashboard/milestones/threshold`);

    return { outcome: outcome.data.data, threshold: threshold.data.data };
  }

  async getContracts(): Promise<ContractType> {
    const res = await api.get("/dashboard/contracts");

    return res.data.data;
  }

  async getProjects(): Promise<ProjectTypes> {
    const res = await api.get("/dashboard/projects");

    return res.data.data;
  }

  async getProjectMilestone(projectId?: string): Promise<ProjectMilestoneType> {
    const res = await api.get(`/dashboard/milestones/project/${projectId}`);

    return res.data.data;
  }

  async getContractProgress(projectId: string): Promise<ContractProgress[]> {
    const res = await api.get(`/dashboard/contract-progress/${projectId}`);

    return res.data.data;
  }

  async getProgressMilestoneProgress(
    projectId: string
  ): Promise<ProjectMileStoneProgress[]> {
    const res = await api.get(
      `/dashboard/milestones-progress-contract/${projectId}`
    );

    return res.data.data;
  }
}

const dashboardService = new DashboardService();

export default dashboardService;
