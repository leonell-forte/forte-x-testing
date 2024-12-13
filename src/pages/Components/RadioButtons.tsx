import RadioGroup from "components/ui/radio-group";

const RadioButtons = () => {
  return (
    <div>
      <p className="mb-2 text-2xl font-semibold uppercase text-white">
        Radio Groups
      </p>
      <div className="flex flex-col gap-4">
        <RadioGroup items={["Item 1", "Item 2", "Item 3"]} />
        <RadioGroup
          className="grid w-fit grid-cols-3"
          items={["Item 1", "Item 2", "Item 3", "Item 4", "Item 5", "Item 6"]}
        />
        <RadioGroup
          className="flex flex-col"
          items={["Item 1", "Item 2", "Item 3"]}
        />
      </div>
    </div>
  );
};

export default RadioButtons;
