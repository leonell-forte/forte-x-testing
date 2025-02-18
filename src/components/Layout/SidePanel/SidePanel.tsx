"use client";

import classNames from "classnames";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

import close from "assets/images/icons/close.svg";

import { MENUS } from "lib/constants";
import { useAppDispatch, useAppSelector, useScreenSize } from "lib/hooks";
import { IsAuthorized } from "lib/role-permissions";
import { setShowSidePanel } from "lib/slice/layout";

const SidePanel = () => {
  const dispatch = useAppDispatch();

  const { isMobile, isTablet } = useScreenSize();

  const { showSidePanel } = useAppSelector((state) => state.layout);

  const { pathname } = useLocation();

  const handleClose = () => {
    dispatch(setShowSidePanel(false));
  };

  const variants = {
    true: { left: 0 },

    false: { left: !isMobile && !isTablet ? 0 : "-100%" },
  };

  const filteredMenu = useMemo(
    () => MENUS.filter((item) => IsAuthorized(item.permissions)),
    []
  );

  return (
    <motion.div
      initial={variants[showSidePanel.toString() as "true" | "false"]}
      animate={variants[showSidePanel.toString() as "true" | "false"]}
      transition={{ type: "spring", duration: 0.7, bounce: 0 }}
      className="absolute left-0 top-0 z-30 h-full w-[250px] rounded-[8px] bg-panel p-5 backdrop-blur-md backdrop-brightness-[60%] lg:relative lg:h-auto lg:w-[172px] lg:backdrop-blur-0 lg:backdrop-brightness-100"
    >
      <ul className="space-y-2.5">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 block lg:hidden"
        >
          <img src={close} alt="" />
        </button>

        {filteredMenu.map((item, index) => {
          const { name, link } = item;

          const active = pathname.includes(link);

          return (
            <Link
              key={index}
              to={link}
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
            >
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
