import { cn } from "lib/utils";

type Props = {
  label: string;
  value?: string | number;
  isActive?: boolean;
};

export default function Tile({ label, value, isActive }: Props) {
  return (
    <div
      className={cn(
        "flex max-h-[70px] w-full flex-col gap-y-2.5 overflow-hidden rounded-3 px-4 py-3 transition-all duration-500",
        isActive ? "bg-[#30F1FF80]/50" : "bg-[#30F1FF80]/15 backdrop-blur"
      )}
    >
      <p className="truncate text-ellipsis text-[12px] font-light uppercase leading-[16px]">
        {label}
      </p>
      <p
        className={cn(
          "text-[24px] font-light leading-[20px]",
          value === undefined
            ? "h-5 w-12 animate-pulse rounded bg-white/80"
            : ""
        )}
      >
        {value}
      </p>
    </div>
  );
}
