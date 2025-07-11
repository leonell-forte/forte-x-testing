import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";

import StudentsTable from "@/components/playground/StudentsTable";

export default function TableDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Table</CardTitle>
      </CardHeader>
      <CardContent>
        <StudentsTable />
      </CardContent>
    </Card>
  );
}
