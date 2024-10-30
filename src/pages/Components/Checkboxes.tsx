import Checkbox from "../../components/ui/checkbox";

const Checkboxes = () => {
  return (
    <div>
      <p className="text-2xl text-white font-semibold uppercase mb-2">
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
