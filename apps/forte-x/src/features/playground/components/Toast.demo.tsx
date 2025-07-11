import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { toast } from "@repo/ui/components/sonner";
import { format } from "date-fns";

export default function ToastDemo() {
  const today = new Date();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Toast</CardTitle>
      </CardHeader>
      <CardContent>
        <Button
          onClick={() =>
            toast({
              title: "Event has been created",
              description: format(today, "iiii, MMMM dd, yyyy hh:mm a"),
              button: { label: "Undo", onClick: () => console.log("Undo") },
            })
          }
        >
          Open Toast
        </Button>
      </CardContent>
    </Card>
  );
}
