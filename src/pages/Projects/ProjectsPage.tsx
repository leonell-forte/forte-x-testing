import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { BiSlider as SliderIcon } from "react-icons/bi";
import { TbFilterX as FilterIcon } from "react-icons/tb";

import { ReactComponent as Add } from "assets/images/icons/add.svg";

import useOrganizationList from "lib/common/lists/useOrganizationList";
import useProjectList from "lib/common/lists/useProjectList";
import { usePage } from "lib/hooks";
import {
  Funders,
  IsAuthorized,
  Projects,
  Providers,
} from "lib/role-permissions";
import { IProject, ProjectFilter } from "lib/types/projects";
import { findLabelFromOptions } from "lib/utils";

import { showProjectDialogue } from "components/Dashboard/Projects/Dialogues/ProjectDialogue";
import ProjectsTable from "components/tables/Projects";
import Button from "components/ui/button";
import Dialogue from "components/ui/dialogue/dialogue";
import Dropdown from "components/ui/dropdown";
import Pagination from "components/ui/pagination";
import SearchInput from "components/ui/search-input";

type ProjectsPageProps = {
  hideHeader?: boolean;
  funderId?: string;
};

const ProjectsPage = ({ hideHeader = false, funderId }: ProjectsPageProps) => {
  const { page, setPage } = usePage();

  const initialFilter = {
    funder: funderId || "",
  };

  const [filters, setFilters] = useState<ProjectFilter>(initialFilter);

  const {
    projects,
    isLoading: projectLoading,
    rawList: projectsList,
    handleSearchProject,
    searchProjectValue,
  } = useProjectList({
    key: [page, filters, funderId || ""],
    page,
    filter: filters,
  });

  const [modal, setModal] = useState<"project" | "filter" | null>(null);

  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);

  const handleCloseModal = () => {
    setModal(null);

    setSelectedProject(null);

    setPage(1);
  };

  const renderModal = useCallback(() => {
    switch (modal) {
      case "filter":
        return (
          <Dialogue
            hideClose
            title="Filters"
            isVisible={modal === "filter"}
            handleClose={handleCloseModal}
          >
            <div className="space-y-6">
              <Filters
                filters={filters}
                setFilters={setFilters}
                initialFilter={initialFilter}
              />
              <div className="flex justify-end gap-2">
                <Button
                  buttonType="secondary"
                  onClick={() => {
                    setFilters(initialFilter);
                  }}
                >
                  Clear
                </Button>
                <Button onClick={handleCloseModal}>Apply</Button>
              </div>
            </div>
          </Dialogue>
        );
    }
    // eslint-disable-next-line
  }, [modal, selectedProject]);

  return (
    <>
      {renderModal()}

      <div className="flex h-full flex-col space-y-2.5">
        <div className="space-y-5">
          {!hideHeader && (
            <div className="flex flex-col items-start justify-between gap-2.5 sm:flex-row">
              <p className="text-[24px] font-semibold">Projects</p>
              {IsAuthorized([Projects.CREATE]) && (
                <Button
                  className="w-full sm:w-auto"
                  eventName="Add Project"
                  onClick={() => showProjectDialogue({})}
                >
                  <Add height={14} />
                  Add project
                </Button>
              )}
            </div>
          )}

          {!!projectsList?.items.length && (
            <div className="flex w-full items-center gap-2 md:w-auto">
              <div className="w-full md:w-auto">
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
              {!funderId && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setModal("filter");
                    }}
                    className="group flex-shrink-0 md:hidden"
                  >
                    <SliderIcon className="h-auto w-6 transition-all group-hover:fill-mint" />
                  </button>
                  <div className="hidden md:block">
                    <Filters
                      initialFilter={initialFilter}
                      filters={filters}
                      setFilters={setFilters}
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div className="flex h-full flex-col justify-between gap-4">
          <ProjectsTable
            funderId={Number(funderId)}
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

type IFilterProps = {
  filters: ProjectFilter;

  setFilters: Dispatch<SetStateAction<ProjectFilter>>;

  initialFilter: ProjectFilter;
};

const Filters = ({ filters, setFilters, initialFilter }: IFilterProps) => {
  const { setPage } = usePage();

  const {
    organizations,
    isLoading: orgLoading,
    handleSearchOrg,
  } = useOrganizationList({
    key: ["filter"],
    filters: { type: "funder" },
    enabled: IsAuthorized([Providers.LIST, Funders.LIST]),
    pageSize: 100,
  });

  return (
    <div className="flex w-full items-center gap-3">
      {IsAuthorized([Providers.LIST, Funders.LIST]) && (
        <Dropdown
          loading={orgLoading}
          options={organizations}
          placeholder="Funder"
          className="xl:w-[166px]"
          value={findLabelFromOptions(organizations, filters.funder)}
          handleSelect={(val) => {
            setPage(1);
            setFilters((prev) => ({
              ...prev,
              funder: val as string,
            }));
          }}
          enableSearch
          onChange={(e) => handleSearchOrg(e.target.value)}
        />
      )}
      <button
        onClick={() => setFilters(initialFilter)}
        className="flex-shrink-0"
      >
        <FilterIcon className="h-auto w-5 fill-white transition-all group-hover:fill-mint group-hover:stroke-mint" />
      </button>
    </div>
  );
};
