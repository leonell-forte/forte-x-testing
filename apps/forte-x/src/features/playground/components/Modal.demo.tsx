import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { useModal } from "@repo/ui/components/dialog";

export function showSampleModal(name: string) {
  useModal.getState().open({
    component: <SampleModal name={name} />,
    title: "Title",
  });
}

function SampleModal({ name }: { name: string }) {
  return (
    <div className="flex h-[400px] flex-col items-center justify-center">
      <h1>Modal Content</h1>
      <p className="text-sm">{name}</p>
    </div>
  );
}

export default function ModalDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Modal</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={() => showSampleModal("John Doe")}>Open Modal</Button>
      </CardContent>
    </Card>
  );
}
