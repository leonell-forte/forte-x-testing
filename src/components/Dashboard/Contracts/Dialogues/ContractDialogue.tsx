import Input from "../../../../components/ui/input";
import Dialogue from "../../../../components/ui/dialogue/dialogue";
import add from "../../../../assets/images/icons/add.svg";

const ContractDialogue = () => {
  return (
    <Dialogue isVisible handleClose={() => {}} title="Add contract">
      <form action="">
        <div className="flex items-start gap-4">
          <label htmlFor="" className="pt-4 min-w-[120px]">
            Parties
          </label>

          <Input placeholder="Organization name" />
        </div>
        <div className="flex items-start gap-4">
          <label htmlFor="" className="pt-4 min-w-[120px]">
            Parties
          </label>

          <Input placeholder="Organization name" />
        </div>
        <div className="flex items-start gap-4">
          <label htmlFor="" className="pt-4 min-w-[120px]">
            Parties
          </label>

          <Input placeholder="Organization name" />
        </div>
        <div className="flex items-start gap-4">
          <label htmlFor="" className="pt-4 min-w-[120px]">
            Parties
          </label>

          <Input placeholder="Organization name" />
        </div>
        <div className="flex items-start gap-4">
          <label htmlFor="" className="pt-4 min-w-[120px]">
            Parties
          </label>

          <Input placeholder="Organization name" />
        </div>

        <div className="flex items-center gap-[38.75px]">
          <div className="flex items-start gap-4">
            <label htmlFor="" className="pt-4 min-w-[120px]">
              Parties
            </label>

            <Input placeholder="Organization name" />
          </div>
          <div className="flex items-start gap-4">
            <label htmlFor="" className="pt-4 min-w-[120px]">
              Parties
            </label>

            <Input placeholder="Organization name" />
          </div>
        </div>

        <div className="flex items-start gap-4">
          <label htmlFor="" className="pt-4 min-w-[120px]">
            Parties
          </label>

          <Input placeholder="Organization name" />

          <button
            type="button"
            className="!w-8 !h-8 bg-white rounded-full flex-shrink-0 text-forest-green flex items-center justify-center hover:scale-[1.05] transition-all hover:opacity-80"
          >
            <img src={add} alt="" />
          </button>
        </div>
      </form>
    </Dialogue>
  );
};

export default ContractDialogue;
