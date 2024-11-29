import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../lib/hooks";
import { setValue } from "../../../lib/slice/scroll";

const useScroll = () => {
  const dispatch = useAppDispatch();

  const { scrollValue } = useAppSelector((state) => state.scroll);

  const setScrollValue = (value: number) => {
    dispatch(setValue(value));
  };

  useEffect(() => {
    dispatch(setValue(0));
  }, [dispatch]);

  return { scrollValue, setScrollValue };
};

export default useScroll;
