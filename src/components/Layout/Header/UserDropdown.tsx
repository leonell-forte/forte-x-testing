import Image from "next/image";
import React from "react";

const UserDropdown = () => {
  return (
    <div className="w-[184px] h-[42px] rounded-[50px] bg-white bg-opacity-[30%] flex justify-between items-center pl-1.5 pr-4">
      <div className="flex gap-1.5">
        <div className="w-[28px] h-[28px] rounded-full bg-[#D9D9D9]"></div>
        <div className="flex items-center px-2">
          <p className="text-forest-green font-medium">Leonell</p>
        </div>
      </div>
      <button className="px-1.5">
        <Image
          width={12}
          height={12}
          alt="arrow"
          src="/images/icons/arrow.svg"
        />
      </button>
    </div>
  );
};

export default UserDropdown;
