import {
  Tooltip as Prim,
  TooltipProps,
  Zoom,
  styled,
  tooltipClasses,
} from "@mui/material";

function AlertIcon() {
  return (
    <div className="flex size-6 items-center justify-center rounded-full bg-[#4A1515]">
      <span className="font-bold text-white">!</span>
    </div>
  );
}

const Tooltip = styled(({ className, ...props }: TooltipProps) => (
  <Prim
    {...props}
    arrow
    slots={{
      transition: Zoom,
    }}
    slotProps={{
      popper: {
        style: {
          zIndex: 35,
        },
      },
    }}
    classes={{ popper: className }}
  />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 14,
    borderRadius: 4,
    borderColor: "transparent",
    padding: "6px 8px",
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.white,
  },
  [`& .${tooltipClasses.popper}`]: {
    zIndex: "50",
  },
}));

export { AlertIcon, Tooltip };
