import HorizontalScroller from "@/components/ui/horizontal-scroller";

import Buttons from "./Buttons";
import Checkboxes from "./Checkboxes";
import DialogueComponent from "./DialogueComponent";
import DropdownFields from "./DropdownFields";
import InputFields from "./InputFields";
import PaginationComponent from "./PaginationComponent";
import SwitchButtons from "./SwitchButtons";
import TableComponent from "./TableComponent";
import Tags from "./Tags";

const ComponentsPage = () => {
  return (
    <div className="h-screen space-y-10 overflow-scroll p-10">
      <Buttons />

      <InputFields />

      <DropdownFields />

      <div className="flex flex-wrap gap-10">
        <Checkboxes />

        <SwitchButtons />

        <Tags />

        <PaginationComponent />
      </div>

      <TableComponent />

      <DialogueComponent />

      <HorizontalScroller />
    </div>
  );
};

export default ComponentsPage;
