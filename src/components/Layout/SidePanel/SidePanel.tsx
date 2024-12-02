"use client";

import { MENUS } from "../../../lib/constants";
import classNames from "classnames";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import close from "../../../assets/images/icons/close.svg";
import {
  useAppDispatch,
  useAppSelector,
  useScreenSize,
} from "../../../lib/hooks";
import { setShowSidePanel } from "../../../lib/slice/layout";

const SidePanel = () => {
  const dispatch = useAppDispatch();

  const { isMobile } = useScreenSize();

  const { showSidePanel } = useAppSelector((state) => state.layout);

  const { pathname } = useLocation();

  const handleClose = () => {
    dispatch(setShowSidePanel(false));
  };

  const variants = {
    true: { left: 0 },

    false: { left: !isMobile ? 0 : "-100%" },
  };

  return (
    <motion.div
      initial={variants[showSidePanel.toString() as "true" | "false"]}
      animate={variants[showSidePanel.toString() as "true" | "false"]}
      transition={{ type: "spring", duration: 0.7, bounce: 0 }}
      className="absolute h-full md:h-auto left-0 top-0 md:relative w-[90vw] md:w-[172px] rounded-r-[8px] bg-white bg-opacity-[30%] backdrop-blur-md md:backdrop-blur-0 backdrop-brightness-[60%] md:backdrop-brightness-100 p-5 z-40"
    >
      <ul className="space-y-2.5">
        <button
          onClick={handleClose}
          className="block md:hidden absolute top-4 right-4"
        >
          <img
            src={close}
            alt=""
          />
        </button>

        {MENUS.map((item, index) => {
          const { name, link } = item;

          const active = pathname.includes(link);

          return (
            <Link
              key={index}
              to={link}
            >
              <li
                className={classNames(
                  "capitalize font-medium p-2.5 transition-all",

                  active && "text-mint",
                )}
              >
                {name}
              </li>
            </Link>
          );
        })}
      </ul>
    </motion.div>
  );
};

export default SidePanel;
