"use client";

import classNames from "classnames";
import Image from "next/image";
import React, { InputHTMLAttributes, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useOutsideClick } from "@/lib/hooks";

interface IDropdownProp extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  options: {
    label: string;
    value: string | number;
  }[];
  handleSelect?: (value: string | number) => void;
}

const Dropdown = ({
  className,
  options,
  handleSelect,
  ...props
}: IDropdownProp) => {
  const [showList, setShowList] = useState(false);

  const dropdownRef = useRef(null);

  useOutsideClick(dropdownRef, () => setShowList(false));

  return (
    <div
      ref={dropdownRef}
      className={classNames(
        "relative h-[56px] w-full rounded-[8px] border border-white px-4 flex items-center justify-between",
        className
      )}
      onClick={() => setShowList((prev) => !prev)}
    >
      <input
        type="text"
        className="bg-transparent border-none outline-none w-[90%] placeholder:text-white/50"
        {...props}
      />
      <button className="px-1.5">
        <Image
          width={12}
          height={12}
          alt="arrow"
          src="/images/icons/arrow.svg"
        />
      </button>

      <motion.ul
        initial={{ opacity: 0 }}
        animate={showList ? { opacity: 1 } : { opacity: 0 }}
        transition={{ type: "spring", duration: 0.2, bounce: 0 }}
        className="absolute top-16 left-0 rounded-[4px] bg-white w-full overflow-hidden shadow-md"
      >
        {options.map((item, index) => {
          const { label, value } = item;
          return (
            <button
              onClick={() => handleSelect!(value)}
              key={index}
              className="w-full text-left"
            >
              <li className="text-black py-1.5 px-2.5 hover:bg-grey transition-all">
                {label}
              </li>
            </button>
          );
        })}
      </motion.ul>
    </div>
  );
};

export default Dropdown;
