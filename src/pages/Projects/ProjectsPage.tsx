import { useCallback, useMemo, useState } from "react";
import Button from "../../components/ui/button";
import SearchInput from "../../components/ui/search-input";
import Table from "../../components/ui/table";
import Pagination from "../../components/ui/pagination";
import pencil from "../../assets/images/icons/pencil.svg";
import bin from "../../assets/images/icons/bin.svg";
import ProjectDialogue from "../../components/Dashboard/Projects/Dialogues/ProjectDialogue";
import { useQuery } from "@tanstack/react-query";
import projectService from "../../api/projects";
import { IProject } from "./types";
import DeleteDialogue from "../../components/Dashboard/Projects/Dialogues/DeleteDialogue";
import { useDebounce } from "../../lib/hooks";

const ProjectsPage = () => {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");

  const [debouncedSearch, setDebouncedSearch] = useState("");

  useDebounce(
    () => {
      setDebouncedSearch(search);
    },

    500,

    [search],
  );

  const { data: projectsList, isLoading: projectLoading } = useQuery({
    queryKey: ["projects", page, debouncedSearch],

    queryFn: () => projectService.list(page, debouncedSearch),
  });

  const projects: IProject[] = useMemo(
    () => projectsList?.items || [],

    [projectsList],
  );

  const [modal, setModal] = useState<"project" | "delete" | null>(null);

  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);

  const handleEditUser = (item: IProject) => {
    setModal("project");

    setSelectedProject(item);
  };

  const handleCloseModal = () => {
    setModal(null);

    setSelectedProject(null);
  };

  const renderModal = useCallback(() => {
    switch (modal) {
      case "project":
        return (
          <ProjectDialogue
            page={page}
            projectId={(selectedProject?.id || "") as string}
            isVisible={modal === "project"}
            handleClose={handleCloseModal}
          />
        );

      case "delete":
        return (
          <DeleteDialogue
            page={page}
            isVisible={modal === "delete"}
            project={selectedProject!}
            handleClose={handleCloseModal}
          />
        );
    }
  }, [modal, selectedProject, page]);

  return (
    <>
      {renderModal()}

      <div className="space-y-1.5">
        <div className="flex justify-between items-center gap-4">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-[286px]"
          />

          <Button
            eventName="Add User"
            onClick={() => setModal("project")}
          >
            Add project
          </Button>
        </div>

        <div className="space-y-[18px]">
          <Table.Container
            isEmpty={!projects.length}
            isLoading={projectLoading}
          >
            <Table.Head>
              <Table.Row>
                {TABLE_HEADER.map((key, headerIndex) => {
                  return <Table.Header key={headerIndex}>{key}</Table.Header>;
                })}

                <Table.Header></Table.Header>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {projects.map((item: IProject, bodyIndex: number) => {
                const { id, name, provider, outcomes } = item;
                return (
                  <Table.Row key={bodyIndex}>
                    <Table.Data>{name}</Table.Data>

                    <Table.Data>
                      {provider?.map((item) => item.name).join(", ") || "-"}
                    </Table.Data>

                    <Table.Data>
                      {outcomes?.map((item) => item.name).join(", ")}
                    </Table.Data>

                    <Table.Data>-</Table.Data>

                    <Table.Data>-</Table.Data>

                    <Table.Data>
                      <div className="flex justify-end">
                        <Button
                          eventName="Edit User"
                          // id={project}
                          buttonType="default"
                          type="button"
                          onClick={() => handleEditUser(item)}
                          className="p-[3px]"
                        >
                          <img
                            alt="pencil"
                            src={pencil}
                          />
                        </Button>

                        <Button
                          eventName="Edit User"
                          id={id.toString()}
                          buttonType="default"
                          type="button"
                          onClick={() => {
                            setModal("delete");
                            setSelectedProject(item);
                          }}
                          className="p-[3px]"
                        >
                          <img
                            alt="pencil"
                            src={bin}
                          />
                        </Button>
                      </div>
                    </Table.Data>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Container>

          <div className="flex justify-end absolute bottom-4 right-2">
            <Pagination
              page={page}
              onPageChange={(val) => setPage(val)}
              total={projectsList?.totalSize}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectsPage;

const TABLE_HEADER = [
  "Projects",
  "Partners",
  "Outcomes",
  "Contracts",
  "Beneficiaries",
];
