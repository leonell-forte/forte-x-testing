import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useOutsideClick } from "../../../lib/hooks";
import arrow from "../../../assets/images/icons/chevron.svg";
import authService from "../../../api/auth";
import { IUser } from "../../../pages/Users/types";
import organizationService from "../../../api/organization";
import { useQuery } from "@tanstack/react-query";
import ViewProfileDialogue from "./ViewProfileDialogue";

interface IProp {
  user: IUser;
}

const UserDropdown = ({ user }: IProp) => {
  const [showModal, setShowModal] = useState(false);

  const { data: organizationList } = useQuery({
    queryKey: ["organizations"],

    queryFn: () => organizationService.list(1, true),
  });

  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    authService.logout();
  };

  const dropdownRef = useRef(null);

  const organizations = useMemo(
    () => organizationList?.items || [],

    [organizationList],
  );

  useOutsideClick(dropdownRef, () => setShowDropdown(false));

  const handleViewProfile = () => {
    setShowModal(true);

    setShowDropdown(false);
  };

  return (
    <>
      {user && (
        <ViewProfileDialogue
          organizations={organizations}
          userId={user.id}
          isVisible={showModal}
          handleClose={() => {
            setShowModal(false);
          }}
        />
      )}

      <div
        ref={dropdownRef}
        className="relative z-40"
      >
        <button
          onClick={() => setShowDropdown((prev) => !prev)}
          className="w-[80px] sm:w-[184px] h-[42px] rounded-[50px] bg-white bg-opacity-[30%] flex justify-between items-center pl-1.5 pr-4 cursor-pointer hover:brightness-[.8] transition-all"
        >
          <div className="flex gap-1.5">
            <div className="w-[28px] h-[28px] rounded-full bg-[#D9D9D9]"></div>

            <div className="sm:flex items-center px-2 hidden">
              <p className="text-forest-green font-medium">{user?.firstName}</p>
            </div>
          </div>

          <div className="px-1.5 cursor-pointer">
            <img
              alt="arrow"
              src={arrow}
            />
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
          <button
            onClick={handleViewProfile}
            className="w-full text-left"
          >
            <li className="text-black py-1.5 px-2.5 hover:bg-grey transition-all">
              Profile
            </li>
          </button>

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
    </>
  );
};

export default UserDropdown;
