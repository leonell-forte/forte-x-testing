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

const Tooltip = styled(
  ({ className, arrow = true, ...props }: TooltipProps) => (
    <Prim
      {...props}
      arrow={arrow}
      slots={{
        transition: Zoom,
      }}
      slotProps={{
        popper: {
          style: {
            zIndex: 41,
          },
        },
      }}
      classes={{ popper: className }}
    />
  )
)(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    color: "white",
    boxShadow: theme.shadows[1],
    fontSize: 14,
    borderRadius: 4,
    borderColor: "transparent",
    padding: "6px 8px",
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: "rgba(0, 0, 0, 0.5)",
  },
  [`& .${tooltipClasses.popper}`]: {
    zIndex: "50",
  },
}));

export { AlertIcon, Tooltip };
