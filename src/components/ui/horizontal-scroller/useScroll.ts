import { RefObject, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../lib/hooks";
import { setValue } from "../../../lib/slice/scroll";
import { useScroll as useFramerScroll } from "framer-motion";

interface IProp {
  container?: RefObject<HTMLDivElement>;
}

const useScroll = ({ container }: IProp) => {
  const dispatch = useAppDispatch();

  const { scrollValue } = useAppSelector((state) => state.scroll);

  const { scrollXProgress } = useFramerScroll({ container });

  useEffect(() => {
    if (container) {
      const unsubscribe = scrollXProgress.on("change", (val) => {
        dispatch(setValue(val * 100));
      });

      return () => {
        unsubscribe();
        dispatch(setValue(0));
      };
    }
  }, [scrollXProgress, dispatch]);

  const setScrollValue = (value: number) => {
    dispatch(setValue(value));
  };

  useEffect(() => {
    dispatch(setValue(0));
  }, [dispatch]);

  return { scrollValue, setScrollValue };
};

export default useScroll;
