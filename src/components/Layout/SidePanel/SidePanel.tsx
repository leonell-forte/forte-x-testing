import { MENUS } from "@/lib/constants";
import classNames from "classnames";
import Link from "next/link";
import React from "react";

const SidePanel = () => {
  return (
    <div className="w-[172px] rounded-r-[8px] bg-white bg-opacity-[30%] p-5">
      <ul className="space-y-2.5">
        {MENUS.map((item, index) => {
          const { name, link } = item;
          const active = index === 0;
          return (
            <Link key={index} href={link}>
              <li
                className={classNames(
                  "capitalize font-medium p-2.5",
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
