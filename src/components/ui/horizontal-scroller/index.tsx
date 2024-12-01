import Slider from "@mui/material/Slider";
import useScroll from "./useScroll";

const HorizontalScroller = () => {
  const { scrollValue, setScrollValue } = useScroll({});

  return (
    <div className="px-[50px] w-full bg-[#D9D9D9]/20 flex items-center h-2 rounded-[8px]">
      <Slider
        aria-label="Volume"
        value={scrollValue}
        max={90}
        onChange={(e, value) => setScrollValue(value as number)}
        className="cursor-default pointer-events-none"
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
