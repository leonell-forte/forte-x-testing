import { ModeToggle } from "@/components/mode-toggle";

import AvatarDemo from "./components/Avatar.demo";
import BadgeDemo from "./components/Badge.demo";
import BallChartDemo from "./components/BallChart.demo";
import ButtonDemo from "./components/Button.demo";
import ColorPalette from "./components/ColorPallete.demo";
import FormDemo from "./components/Form.demo";
import LineChartDemo from "./components/LineChart.demo";
import ModalDemo from "./components/Modal.demo";
import PieChartDemo from "./components/PieChart.demo";
import TableDemo from "./components/Table.demo";
import ToastDemo from "./components/Toast.demo";

export default function Playground() {
  return (
    <section className="playground from-primary/70 via-accent/60 to-secondary/80 dark:from-primary/60 dark:via-accent/50 dark:to-secondary/70 flex min-h-screen items-center justify-center bg-gradient-to-br">
      <div className="container mx-auto space-y-4 px-6 py-12">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Demo</h1>
          <ModeToggle />
        </div>
        <ColorPalette />

        <div className="flex flex-wrap gap-4 md:flex-nowrap">
          <ButtonDemo />
          <ModalDemo />
          <ToastDemo />
          <BadgeDemo />
        </div>

        <TableDemo />
        <FormDemo />
        <BallChartDemo />
        <div className="flex flex-wrap gap-4 md:flex-nowrap">
          <AvatarDemo />
          <PieChartDemo />
          <LineChartDemo />
        </div>
      </div>
    </section>
  );
}
