"use client";

import classNames from "classnames";
import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo } from "react";
import { RxHamburgerMenu as Burger } from "react-icons/rx";
import { Link, useLocation } from "react-router-dom";

import { MENUS } from "lib/constants";
import { useAppDispatch, useAppSelector, useScreenSize } from "lib/hooks";
import { IsAuthorized } from "lib/role-permissions";
import { setShowSidePanel } from "lib/slice/layout";

import MobileUserDropdown from "../Header/MobileUserDropdown";

const SidePanel = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();

  const { isMobile, isTablet } = useScreenSize();

  const { showSidePanel } = useAppSelector((state) => state.layout);

  const { pathname } = useLocation();

  const handleClose = useCallback(
    () => dispatch(setShowSidePanel(false)),
    [dispatch]
  );

  const variants = {
    true: { left: 0 },

    false: { left: !isMobile && !isTablet ? 0 : "-100%" },
  };

  const filteredMenu = useMemo(
    () => MENUS.filter((item) => IsAuthorized(item.permissions)),
    []
  );

  useEffect(() => {
    handleClose();
  }, [location.pathname, handleClose]);

  return (
    <motion.div
      initial={variants[showSidePanel.toString() as "true" | "false"]}
      animate={variants[showSidePanel.toString() as "true" | "false"]}
      transition={{ type: "spring", duration: 0.7, bounce: 0 }}
      className="lg:max-h-auto fixed left-0 top-0 z-20 h-full max-h-screen w-[250px] rounded-r-lg border-transparent bg-panel p-5 backdrop-blur-md backdrop-brightness-[60%] lg:relative lg:h-auto lg:w-[172px] lg:rounded-lg lg:backdrop-blur-0 lg:backdrop-brightness-100"
    >
      <button
        onClick={handleClose}
        className="absolute right-4 top-4 block lg:hidden"
      >
        <Burger className="h-auto w-4" />
      </button>
      <div className="flex h-full flex-col justify-between">
        <div className="space-y-6 lg:space-y-0">
          <img
            alt="logo"
            src="/logo.png"
            className="mt-2 block max-w-[100px] px-2.5 lg:hidden"
          />
          <ul className="space-y-2.5">
            {filteredMenu.map((item, index) => {
              const { name, link } = item;

              const active = pathname.includes(link);

              return (
                <Link key={index} to={link}>
                  <li
                    className={classNames(
                      "px-2.5 py-3 text-lg capitalize transition-all lg:py-2.5 lg:text-base",

                      active ? "text-mint" : "hover:text-mint/70"
                    )}
                  >
                    {name}
                  </li>
                </Link>
              );
            })}
          </ul>
        </div>

        <div className="mb-2 block w-full md:hidden">
          <MobileUserDropdown />
        </div>
      </div>
    </motion.div>
  );
};

export default SidePanel;
