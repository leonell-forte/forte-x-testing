import { ReactComponent as Funnel } from "assets/images/icons/funnel.svg";

import useProjectList from "lib/common/lists/useProjectList";
import { findLabelFromOptions } from "lib/utils";

import Dropdown from "components/ui/dropdown";

import { useDashboardState } from "./useDashboardState";

const DashboardFilter = () => {
  const { project, setProject } = useDashboardState();
  const { projects, isLoading, searchProjectValue, handleSearchProject } =
    useProjectList({
      pageSize: 100,
    });

  return (
    <div>
      <Dropdown
        leadingIcon={<Funnel fill="white" />}
        enableSearch
        options={[
          ...(!searchProjectValue
            ? [{ label: "All projects", value: "" }, ...projects]
            : projects),
        ]}
        onChange={(e) => handleSearchProject(e.target.value)}
        value={
          project
            ? findLabelFromOptions(projects, project.value)
            : "All projects"
        }
        handleSelect={(value) => {
          if (!value) {
            setProject(null);
            return;
          }
          const label = findLabelFromOptions(
            projects,
            value as string
          ) as string;
          setProject({ value: value as string, label });
        }}
        loading={isLoading}
      />
    </div>
  );
};

export default DashboardFilter;
