import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/tabs";

import CaseStudies from "./CaseStudies";
import Finances from "./Finances";
import Overview from "./Overview";
import Providers from "./Providers";
import Students from "./Students";

const ProjectDetailsPage = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Projects Details</h2>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="providers">Providers</TabsTrigger>
          <TabsTrigger value="finances">Finances</TabsTrigger>
          <TabsTrigger value="case-studies">Case Studies</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Overview />
        </TabsContent>
        <TabsContent value="students">
          <Students />
        </TabsContent>
        <TabsContent value="providers">
          <Providers />
        </TabsContent>
        <TabsContent value="finances">
          <Finances />
        </TabsContent>
        <TabsContent value="case-studies">
          <CaseStudies />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectDetailsPage;
