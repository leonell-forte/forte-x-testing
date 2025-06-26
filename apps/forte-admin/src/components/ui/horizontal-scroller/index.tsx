import Slider from "@mui/material/Slider";

import useScroll from "./useScroll";

const HorizontalScroller = () => {
  const { scrollValue, setScrollValue } = useScroll({});

  if (scrollValue === 100) return null;

  return (
    <div className="mx-4 flex h-2 w-full items-center rounded-[8px] bg-[#D9D9D9]/20 px-10">
      <Slider
        aria-label="Volume"
        value={scrollValue}
        max={90}
        onChange={(e, value) => setScrollValue(value as number)}
        className="pointer-events-none cursor-default"
        sx={{
          "& .MuiSlider-thumb": {
            backgroundColor: "white",
            width: 100,
            height: 10,
            borderRadius: 0,
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
            },
          },
          "& .MuiSlider-track": {
            opacity: 0,
          },
          "& .MuiSlider-rail": {
            opacity: 0,
          },
        }}
      />
    </div>
  );
};

export default HorizontalScroller;
