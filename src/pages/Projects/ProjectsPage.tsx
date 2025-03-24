import { useCallback, useState } from "react";

import useProjectList from "lib/common/lists/useProjectList";
import { usePage } from "lib/hooks";
import { IsAuthorized, Projects } from "lib/role-permissions";
import { IProject } from "lib/types/projects";

import ProjectDialogue from "components/Dashboard/Projects/Dialogues/ProjectDialogue";
import ProjectsTable from "components/tables/Projects";
import Button from "components/ui/button";
import Pagination from "components/ui/pagination";
import SearchInput from "components/ui/search-input";

const ProjectsPage = () => {
  const { page, setPage } = usePage();

  const {
    projects,
    isLoading: projectLoading,
    rawList: projectsList,
    handleSearchProject,
    searchProjectValue,
  } = useProjectList({
    key: [page],
    page,
  });

  const [modal, setModal] = useState<"project" | "delete" | null>(null);

  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);

  const handleCloseModal = () => {
    setModal(null);

    setSelectedProject(null);

    setPage(1);
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
    // eslint-disable-next-line
  }, [modal, selectedProject]);

  return (
    <>
      {renderModal()}

      <div className="flex h-full flex-col space-y-2.5">
        <div className="space-y-5">
          <div className="flex flex-col items-start justify-between gap-2.5 sm:flex-row">
            <p className="text-[24px] font-semibold">Projects</p>
            {IsAuthorized([Projects.CREATE]) && (
              <Button
                eventName="Add Project"
                onClick={() => setModal("project")}
              >
                Add project
              </Button>
            )}
          </div>

          <SearchInput
            value={searchProjectValue}
            onChange={(e) => {
              handleSearchProject(e.target.value);
              setPage(1);
            }}
            containerClass="md:max-w-[286px]"
            onClear={() => handleSearchProject("")}
          />
        </div>

        <div className="flex h-full flex-col justify-between gap-4">
          <ProjectsTable
            list={projectsList?.items || []}
            isLoading={projectLoading}
          />

          {!!projects.length && (
            <div className="flex w-full items-center justify-end">
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
