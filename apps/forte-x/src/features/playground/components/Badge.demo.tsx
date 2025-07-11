import { Badge } from "@repo/ui/components/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";

export default function BadgeDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Badges / Status Indicators</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <Badge variant="default">Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="info">Info</Badge>
      </CardContent>
    </Card>
  );
}
