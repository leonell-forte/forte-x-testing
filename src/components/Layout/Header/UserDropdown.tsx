import { useQuery } from "@tanstack/react-query";
import authService from "api/auth";
import organizationService from "api/organization";
import { motion } from "framer-motion";
import { MouseEvent, useMemo, useRef, useState } from "react";
import { HiUser } from "react-icons/hi2";

import arrow from "assets/images/icons/chevron.svg";

import { useOutsideClick } from "lib/hooks";
import { ProfileType } from "lib/types/profile";

import ViewProfileDialogue from "./ViewProfileDialogue";

interface IProp {
  user: ProfileType;
}

const UserDropdown = ({ user }: IProp) => {
  const [showModal, setShowModal] = useState(false);

  const { data: organizationList } = useQuery({
    queryKey: ["organizations"],

    queryFn: () => organizationService.list({ page: 1, listAll: true }),
  });

  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    authService.logout();
  };

  const dropdownRef = useRef(null);

  const organizations = useMemo(
    () => organizationList?.items || [],

    [organizationList]
  );

  useOutsideClick(dropdownRef, () => setShowDropdown(false));

  const handleViewProfile = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    setShowModal(true);

    setShowDropdown(false);
  };

  return (
    <>
      {showModal && user && (
        <ViewProfileDialogue
          organizations={organizations}
          userId={user.id.toString()}
          isVisible={showModal}
          handleClose={() => {
            setShowModal(false);
          }}
        />
      )}

      <div ref={dropdownRef} className="relative z-30">
        <button
          onClick={() => setShowDropdown((prev) => !prev)}
          className="group hidden h-[37px] w-[184px] cursor-pointer items-center justify-between overflow-hidden rounded-[50px] bg-white bg-opacity-[30%] pl-1.5 pr-4 transition-all duration-500 hover:bg-panel md:flex"
        >
          <div className="flex items-center gap-2.5">
            <div className="-ml-1.5 flex h-[37px] w-[37px] flex-shrink-0 items-center rounded-full bg-mint">
              <HiUser className="m-auto h-auto w-6" />
            </div>

            <div className="hidden w-full items-center md:flex">
              <p className="max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap text-forest-green transition duration-500 group-hover:text-white">
                {user?.firstName}
              </p>
            </div>
          </div>

          <div className="flex-shrink-0 cursor-pointer px-1.5">
            <img alt="arrow" src={arrow} />
          </div>
        </button>

        <motion.ul
          initial={{ height: 0 }}
          animate={
            showDropdown
              ? { opacity: 1, height: 102 }
              : { height: 0, opacity: 0 }
          }
          transition={{ type: "spring", duration: 0.4, bounce: 0 }}
          className="absolute left-0 top-12 w-full overflow-hidden rounded-[4px] bg-white p-2.5 shadow-md backdrop-blur-lg"
        >
          <button onClick={handleViewProfile} className="w-full text-left">
            <li className="flex items-center p-2 text-black transition duration-500 hover:text-mint">
              Profile
            </li>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full text-left"
          >
            <li className="flex items-center rounded-[8px] p-2 text-black transition duration-500 hover:text-mint">
              Logout
            </li>
          </button>
        </motion.ul>
      </div>
    </>
  );
};

export default UserDropdown;
