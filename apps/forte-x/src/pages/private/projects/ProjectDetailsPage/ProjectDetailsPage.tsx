import { Tabs, TabsList, TabsTrigger } from "@repo/ui/components/tabs";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const ProjectDetailsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const match = location.pathname.match(/\/projects\/[^/]+\/([^/]+)/);
  const currentTab = match?.[1] || "overview";

  const handleTabChange = (value: string) => {
    navigate(value);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Projects Details</h2>
      <Tabs
        defaultValue={currentTab}
        value={currentTab}
        onValueChange={handleTabChange}
        className="space-y-5"
      >
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="providers">Providers</TabsTrigger>
          <TabsTrigger value="finances">Finances</TabsTrigger>
          <TabsTrigger value="case-studies">Case Studies</TabsTrigger>
        </TabsList>
        <div className="flex-1 outline-none">
          <Outlet />
        </div>
      </Tabs>
    </div>
  );
};

export default ProjectDetailsPage;
