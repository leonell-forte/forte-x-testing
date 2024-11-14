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
import organizationService from "../../api/organization";
import { IProject } from "./types";
import Spinner from "../../components/ui/spinner/spinner";
import DeleteDialogue from "../../components/Dashboard/Projects/Dialogues/DeleteDialogue";

const ProjectsPage = () => {
  const [page, setPage] = useState(1);

  const { data: projectsList, isLoading: projectLoading } = useQuery({
    queryKey: ["projects", page],
    queryFn: () => projectService.list(page),
  });

  const { data: organizationList } = useQuery({
    queryKey: ["organizations"],
    queryFn: () => organizationService.list(page, true),
  });

  const organizations = useMemo(
    () => organizationList?.items || [],
    [organizationList]
  );

  const projects = useMemo(() => projectsList?.items || [], [projectsList]);

  const [modal, setModal] = useState<"project" | "delete" | null>(null);
  const [search, setSearch] = useState("");
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
            organizations={organizations}
            project={selectedProject}
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
  }, [modal, organizations, selectedProject, page]);

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
          <Button eventName="Add User" onClick={() => setModal("project")}>
            Add Project
          </Button>
        </div>

        <div className="space-y-[18px]">
          {projectLoading ? (
            <div className="w-full h-[500px] flex items-center justify-center">
              <Spinner />
            </div>
          ) : (
            <Table.Container>
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
                      <Table.Data>{provider.name}</Table.Data>
                      <Table.Data>
                        {outcomes.map((item) => item.name).join(", ")}
                      </Table.Data>
                      <Table.Data>-</Table.Data>
                      <Table.Data>-</Table.Data>
                      <Table.Data>
                        <Button
                          eventName="Edit User"
                          // id={project}
                          buttonType="default"
                          type="button"
                          onClick={() => handleEditUser(item)}
                          className="p-[3px]"
                        >
                          <img alt="pencil" src={pencil} />
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
                          <img alt="pencil" src={bin} />
                        </Button>
                      </Table.Data>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table.Container>
          )}

          <div className="flex justify-end">
            <Pagination
              page={page}
              onPageChange={(val) => setPage(val)}
              total={projects.length}
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
  "Partner",
  "Outcomes",
  "Contracts",
  "Beneficiaries",
];
