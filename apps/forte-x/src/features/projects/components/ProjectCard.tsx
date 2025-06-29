import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/card";

const ProjectCard = () => {
  return (
    <Card className="flex flex-row">
      <CardHeader className="w-80">
        <CardTitle>Project Title</CardTitle>
        <CardDescription>Q1 2024 - Q3 2025</CardDescription>
        {/* <CardAction>Card Action</CardAction> */}
      </CardHeader>
      <CardContent className="grid w-full grid-cols-5 items-center gap-4">
        <div>
          <CardTitle>3000</CardTitle>
          <CardDescription>students</CardDescription>
        </div>
        <div className="flex">
          {Array.from({ length: 4 }).map((_, index) => (
            <Avatar key={index} className="-ml-2">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          ))}
        </div>
      </CardContent>
      {/* <CardContent>
        <p>Card Content</p>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter> */}
    </Card>
  );
};

export default ProjectCard;
