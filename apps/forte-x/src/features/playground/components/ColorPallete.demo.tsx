import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";

type Color = {
  name: string;
  variable: string;
};

function ColorSwatch({ name, variable }: Color) {
  return (
    <div className="mb-3 flex items-center gap-4">
      <div
        className="h-10 w-10 rounded border shadow"
        style={{ background: `var(${variable})` }}
      />
      <div>
        <div className="text-sm">{name}</div>
        <div className="text-xs">{variable}</div>
      </div>
    </div>
  );
}

export default function ColorPalette() {
  const colors = [
    { name: "Background", variable: "--color-background" },
    { name: "Foreground", variable: "--color-foreground" },
    { name: "Card", variable: "--color-card" },
    { name: "Card Foreground", variable: "--color-card-foreground" },
    { name: "Popover", variable: "--color-popover" },
    { name: "Popover Foreground", variable: "--color-popover-foreground" },
    { name: "Primary", variable: "--color-primary" },
    { name: "Primary Foreground", variable: "--color-primary-foreground" },
    { name: "Secondary", variable: "--color-secondary" },
    { name: "Secondary Foreground", variable: "--color-secondary-foreground" },
    { name: "Muted", variable: "--color-muted" },
    { name: "Muted Foreground", variable: "--color-muted-foreground" },
    { name: "Accent", variable: "--color-accent" },
    { name: "Accent Foreground", variable: "--color-accent-foreground" },
    { name: "Destructive", variable: "--color-destructive" },
    {
      name: "Destructive Foreground",
      variable: "--color-destructive-foreground",
    },
    { name: "Success", variable: "--color-success" },
    { name: "Success Foreground", variable: "--color-success-foreground" },
    { name: "Warning", variable: "--color-warning" },
    { name: "Warning Foreground", variable: "--color-warning-foreground" },
    { name: "Info", variable: "--color-info" },
    { name: "Info Foreground", variable: "--color-info-foreground" },
    { name: "Border", variable: "--color-border" },
    { name: "Input", variable: "--color-input" },
    { name: "Ring", variable: "--color-ring" },
    { name: "Chart 1", variable: "--color-chart-1" },
    { name: "Chart 2", variable: "--color-chart-2" },
    { name: "Chart 3", variable: "--color-chart-3" },
    { name: "Chart 4", variable: "--color-chart-4" },
    { name: "Chart 5", variable: "--color-chart-5" },
    { name: "Chart 6", variable: "--color-chart-6" },
    { name: "Chart 7", variable: "--color-chart-7" },
    { name: "Chart 8", variable: "--color-chart-8" },
    { name: "Chart 9", variable: "--color-chart-9" },
    { name: "Chart 10", variable: "--color-chart-10" },
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Color Palette</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-x-8 sm:grid-cols-2 md:grid-cols-3">
        {colors.map((color) => (
          <ColorSwatch
            key={color.variable}
            name={color.name}
            variable={color.variable}
          />
        ))}
      </CardContent>
    </Card>
  );
}
