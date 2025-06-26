import { SearchItem } from "@/pages/Search/SearchResultsPage";

import { api } from "../lib/axios/interceptor";

type Params = {
  searchText: string;
};

type Resp = {
  items: SearchItem[];
};

export const searchConsole = async (params: Params) => {
  const res = await api.get<Resp>("/search", { params });
  return res?.data.items;
};
