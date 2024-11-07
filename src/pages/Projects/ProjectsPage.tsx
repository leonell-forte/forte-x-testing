import { useCallback, useMemo, useState } from "react";
import Button from "../../components/ui/button";
import SearchInput from "../../components/ui/search-input";
import Table from "../../components/ui/table";
import Pagination from "../../components/ui/pagination";
import pencil from "../../assets/images/icons/pencil.svg";
import bin from "../../assets/images/icons/bin.svg";
import { filterBySearch } from "../../lib/utils";
import { IProject } from "./types";
import ProjectDialogue from "../../components/Dashboard/Projects/Dialogues/ProjectDialogue";

const ProjectsPage = () => {
  const [modal, setModal] = useState<"project" | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);

  const filteredList: IProject[] = useMemo(() => {
    return filterBySearch(TABLE_DATA as any, search);
  }, [search]);

  const slicedTableData = useCallback(() => {
    const start = (page - 1) * 10;
    const end = start + 10;
    return filteredList.slice(start, end);
  }, [page, filteredList]);

  const handleEditUser = (item: IProject) => {
    setModal("project");
    setSelectedProject(item);
  };

  return (
    <>
      <ProjectDialogue
        project={selectedProject}
        isVisible={modal === "project"}
        handleClose={() => setModal(null)}
      />
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
              {slicedTableData().map((item, bodyIndex) => {
                const { project, partner, outcome, contract, beneficiary } =
                  item;
                return (
                  <Table.Row key={bodyIndex}>
                    <Table.Data>{project}</Table.Data>
                    <Table.Data>{partner}</Table.Data>
                    <Table.Data>{outcome}</Table.Data>
                    <Table.Data>{contract}</Table.Data>
                    <Table.Data>{beneficiary}</Table.Data>
                    <Table.Data>
                      <Button
                        eventName="Edit User"
                        id={project}
                        buttonType="default"
                        type="button"
                        onClick={() => handleEditUser(item)}
                        className="p-[3px]"
                      >
                        <img alt="pencil" src={pencil} />
                      </Button>
                      <Button
                        eventName="Edit User"
                        id={project}
                        buttonType="default"
                        type="button"
                        //   onClick={() => handleEditUser(item)}
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

          <div className="flex justify-end">
            <Pagination
              page={page}
              onPageChange={(val) => setPage(val)}
              total={TABLE_DATA.length}
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

const TABLE_DATA: IProject[] = [
  {
    project: "Project 1",
    partner: "Partner 1",
    outcome: "Lorem ipsum  Lorem ipsum ",
    contract: "Contract 1",
    beneficiary: "Contract 1",
  },
  {
    project: "Project 1",
    partner: "Partner 1",
    outcome: "Lorem ipsum  Lorem ipsum ",
    contract: "Contract 1",
    beneficiary: "Contract 1",
  },
  {
    project: "Project 1",
    partner: "Partner 1",
    outcome: "Lorem ipsum  Lorem ipsum ",
    contract: "Contract 1",
    beneficiary: "Contract 1",
  },
  {
    project: "Project 1",
    partner: "Partner 1",
    outcome: "Lorem ipsum  Lorem ipsum ",
    contract: "Contract 1",
    beneficiary: "Contract 1",
  },
];
