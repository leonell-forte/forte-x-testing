import { Button } from "@repo/ui/components/button";
import { Tabs, TabsList, TabsTrigger } from "@repo/ui/components/tabs";
import { Link, useNavigate } from "react-router-dom";

import ProjectCard from "@/features/projects/components/ProjectCard";

const ProjectsPage = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Projects</h2>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <p>Filter By</p>
          <Tabs defaultValue="current" className="w-[400px]">
            <TabsList>
              <TabsTrigger value="current">Current</TabsTrigger>
              <TabsTrigger value="past">Past Projects</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
            {/* <TabsContent value="current"></TabsContent>
          <TabsContent value="past"></TabsContent>
          <TabsContent value="all"></TabsContent> */}
          </Tabs>
        </div>
        <Button onClick={() => navigate("/projects/add")}>Add Project</Button>
      </div>

      <div className="flex flex-col gap-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Link to={`/projects/${index}`} key={index}>
            <ProjectCard />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;
