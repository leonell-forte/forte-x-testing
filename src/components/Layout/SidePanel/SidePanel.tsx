"use client";

import classNames from "classnames";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

import close from "assets/images/icons/close.svg";

import { MENUS } from "lib/constants";
import { useAppDispatch, useAppSelector, useScreenSize } from "lib/hooks";
import { setShowSidePanel } from "lib/slice/layout";

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
      className="absolute left-0 top-0 z-40 h-full w-[90vw] rounded-r-[8px] bg-white bg-opacity-[30%] p-5 backdrop-blur-md backdrop-brightness-[60%] md:relative md:h-auto md:w-[172px] md:backdrop-blur-0 md:backdrop-brightness-100"
    >
      <ul className="space-y-2.5">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 block md:hidden"
        >
          <img src={close} alt="" />
        </button>

        {MENUS.map((item, index) => {
          const { name, link } = item;

          const active = pathname.includes(link);

          return (
            <Link key={index} to={link}>
              <li
                className={classNames(
                  "p-2.5 font-medium capitalize transition-all",

                  active && "text-mint"
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
