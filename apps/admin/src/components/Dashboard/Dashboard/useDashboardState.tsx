import { create } from "zustand";

import type { IOption } from "@/components/ui/dropdown";

type UseDashboardState = {
  project: IOption | null;
  setProject: (project: IOption | null) => void;
};

export const useDashboardState = create<UseDashboardState>((set) => ({
  project: null,
  setProject: (project) => set({ project }),
}));
