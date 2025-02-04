import { useQuery } from "@tanstack/react-query";
import projectService from "api/projects";
import { useCallback, useMemo, useState } from "react";

import { useDebounce, usePage, usePageTitle } from "lib/hooks";
import { IProject } from "lib/types/projects";

import ProjectDialogue from "components/Dashboard/Projects/Dialogues/ProjectDialogue";
import ProjectsTable from "components/tables/Projects";
import Button from "components/ui/button";
import Pagination from "components/ui/pagination";
import SearchInput from "components/ui/search-input";

const ProjectsPage = () => {
  usePageTitle("Projects");

  const [search, setSearch] = useState("");

  const [debouncedSearch, setDebouncedSearch] = useState("");

  useDebounce(
    () => {
      setDebouncedSearch(search);
    },

    500,

    [search]
  );

  const { page, setPage } = usePage();

  const { data: projectsList, isLoading: projectLoading } = useQuery({
    queryKey: ["projects", page, debouncedSearch],

    queryFn: () =>
      projectService.list({ page, search: debouncedSearch, listAll: false }),
  });

  const projects: IProject[] = useMemo(
    () => projectsList?.items || [],

    [projectsList]
  );

  const [modal, setModal] = useState<"project" | "delete" | null>(null);

  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);

  const handleCloseModal = () => {
    setModal(null);

    setSelectedProject(null);
  };

  const renderModal = useCallback(() => {
    switch (modal) {
      case "project":
        return (
          <ProjectDialogue
            projectId={(selectedProject?.id || "") as string}
            isVisible={modal === "project"}
            handleClose={handleCloseModal}
          />
        );
    }
  }, [modal, selectedProject]);

  return (
    <>
      {renderModal()}

      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-4">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-[286px]"
            onClear={() => setSearch("")}
          />

          <Button eventName="Add Project" onClick={() => setModal("project")}>
            Add project
          </Button>
        </div>

        <div>
          <ProjectsTable list={projects} isLoading={projectLoading} />

          {!!projects.length && (
            <div className="mt-[18px] flex w-full items-center justify-end">
              <Pagination
                page={page}
                onPageChange={(val) => setPage(val)}
                total={projectsList?.totalSize as number}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProjectsPage;
