import Buttons from "./Buttons";
import InputFields from "./InputFields";
import Checkboxes from "./Checkboxes";
import RadioButtons from "./RadioButtons";
import SwitchButtons from "./SwitchButtons";
import Tags from "./Tags";
import PaginationComponent from "./PaginationComponent";
import TableComponent from "./TableComponent";
import DialogueComponent from "./DialogueComponent";
import DropdownFields from "./DropdownFields";
import HorizontalScroller from "../../components/ui/horizontal-scroller";

const ComponentsPage = () => {
  return (
    <div className="p-10 space-y-10 overflow-scroll h-screen">
      <Buttons />

      <InputFields />

      <DropdownFields />

      <div className="flex flex-wrap gap-10">
        <Checkboxes />

        <RadioButtons />

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
