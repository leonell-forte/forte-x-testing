import Button from "components/ui/button";

const Buttons = () => {
  return (
    <div>
      <p className="mb-2 text-2xl font-semibold uppercase text-white">
        buttons
      </p>
      <div className="flex flex-wrap gap-4">
        <Button buttonType="primary">Button</Button>
        <Button buttonType="secondary">Button</Button>
        <Button buttonType="tertiary">Button</Button>
        <Button buttonType="primary" active>
          Button
        </Button>
        <Button buttonType="secondary" active>
          Button
        </Button>
        <Button buttonType="tertiary" active>
          Button
        </Button>
      </div>
    </div>
  );
};

export default Buttons;
