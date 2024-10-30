"use client";

import { MENUS } from "../../../lib/constants";
import classNames from "classnames";
import { Link, useLocation } from "react-router-dom";

const SidePanel = () => {
  const { pathname } = useLocation();

  return (
    <div className="w-[172px] rounded-r-[8px] bg-white bg-opacity-[30%] p-5">
      <ul className="space-y-2.5">
        {MENUS.map((item, index) => {
          const { name, link } = item;
          const active = pathname === link;
          return (
            <Link key={index} to={link}>
              <li
                className={classNames(
                  "capitalize font-medium p-2.5 transition-all",
                  active && "text-mint"
                )}
              >
                {name}
              </li>
            </Link>
          );
        })}
      </ul>
    </div>
  );
};

export default SidePanel;
