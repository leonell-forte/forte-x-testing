import Checkbox from "@/components/ui/checkbox";

const Checkboxes = () => {
  return (
    <div>
      <p className="mb-2 text-2xl font-semibold uppercase text-white">
        Checkboxes
      </p>
      <div className="gap-4">
        <Checkbox checked />
        <Checkbox />
        <Checkbox disabled />
        <Checkbox disabled checked />
      </div>
    </div>
  );
};

export default Checkboxes;
