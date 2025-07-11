import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";

export default function ButtonDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Buttons</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <Button variant="default">Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </CardContent>
    </Card>
  );
}
