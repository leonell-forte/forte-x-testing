import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";

export default function AvatarDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Avatar</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-12">
        <div className="space-y-3">
          <h3 className="text-sm">Group Stacked</h3>
          <div className="flex items-center -space-x-2">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage src="https://github.com/nextui-org.png" />
              <AvatarFallback>OP</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage src="https://github.com/nextui-org.png" />
              <AvatarFallback>OP</AvatarFallback>
            </Avatar>
          </div>
        </div>
        <div className="space-y-3">
          <h3 className="text-sm">Image not loaded</h3>
          <div className="flex items-center -space-x-2">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.pngerror" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
