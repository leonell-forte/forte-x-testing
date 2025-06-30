import { Tabs, TabsList, TabsTrigger } from "@/components/tabs";
import ProjectCard from "@/features/projects/components/ProjectCard";

const ProjectsPage = () => {
  return (
    <div className="space-y-6 p-10">
      <h2 className="text-2xl font-bold">Projects</h2>
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

      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <ProjectCard key={index} />
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;
