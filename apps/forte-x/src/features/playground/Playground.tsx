import { ModeToggle } from "@/components/mode-toggle";

import BadgeDemo from "./components/Badge.demo";
import BallChartDemo from "./components/BallChart.demo";
import ButtonDemo from "./components/Button.demo";
import ColorPalette from "./components/ColorPallete.demo";
import FormDemo from "./components/Form.demo";
import ModalDemo from "./components/Modal.demo";
import TableDemo from "./components/Table.demo";
import ToastDemo from "./components/Toast.demo";

export default function Playground() {
  return (
    <section className="playground">
      <div className="container mx-auto space-y-4 px-6 py-12">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Playground</h1>
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
      </div>
    </section>
  );
}
