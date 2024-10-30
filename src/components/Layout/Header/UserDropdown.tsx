import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useOutsideClick } from "../../../lib/hooks";
import arrow from "../../../assets/images/icons/arrow.svg";

const UserDropdown = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  const dropdownRef = useRef(null);

  useOutsideClick(dropdownRef, () => setShowDropdown(false));

  return (
    <div ref={dropdownRef} className="relative z-50">
      <button
        onClick={() => setShowDropdown((prev) => !prev)}
        className="w-[184px] h-[42px] rounded-[50px] bg-white bg-opacity-[30%] flex justify-between items-center pl-1.5 pr-4 cursor-pointer hover:brightness-[.8] transition-all"
      >
        <div className="flex gap-1.5">
          <div className="w-[28px] h-[28px] rounded-full bg-[#D9D9D9]"></div>
          <div className="flex items-center px-2">
            <p className="text-forest-green font-medium">Leonell</p>
          </div>
        </div>
        <div className="px-1.5 cursor-pointer">
          <img alt="arrow" src={arrow} />
        </div>
      </button>
      <motion.ul
        initial={{ height: 0 }}
        animate={
          showDropdown
            ? { opacity: 1, height: "fit-content" }
            : { height: 0, opacity: 0 }
        }
        transition={{ type: "spring", duration: 0.4, bounce: 0 }}
        className="absolute top-12 left-0 rounded-[4px] bg-white w-full overflow-hidden"
      >
        <Link to="/">
          <li className="text-black py-1.5 px-2.5 hover:bg-grey transition-all">
            Profile
          </li>
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full text-left"
        >
          <li className="text-black py-1.5 px-2.5 hover:bg-grey transition-all">
            Log out
          </li>
        </button>
      </motion.ul>
    </div>
  );
};

export default UserDropdown;
