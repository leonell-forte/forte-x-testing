import { useEffect } from "react";
import { HiUser } from "react-icons/hi2";

import authService from "@/api/auth";
import arrow from "@/assets/images/icons/chevron.svg";
import { useProfile } from "@/components/ProfileContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu/DropdownMenu";
import useOrganizationList from "@/lib/common/lists/useOrganizationList";

import { showProfileModal } from "./ViewProfileDialogue";

const UserDropdown = () => {
  const { profile: user } = useProfile();

  const { rawList: organizations, handleSearchOrg } = useOrganizationList({});

  useEffect(() => {
    if (user?.organization) handleSearchOrg(user.organization);
  }, [user?.organization, handleSearchOrg]);

  const handleLogout = () => {
    authService.logout();
  };

  return (
    <>
      <div className="relative z-30">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="hover:bg-panel group hidden h-[37px] w-[184px] cursor-pointer items-center justify-between overflow-hidden rounded-[50px] bg-white bg-opacity-[30%] pl-1.5 pr-4 ring-white transition-all duration-500 focus:ring-2 md:flex">
              <div className="flex items-center gap-2.5">
                <div className="bg-mint -ml-1.5 flex h-[37px] w-[37px] flex-shrink-0 items-center rounded-full">
                  <HiUser className="m-auto h-auto w-6" />
                </div>

                <div className="hidden w-full items-center md:flex">
                  <p className="text-forest-green max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap transition duration-500 group-hover:text-white">
                    {user?.firstName}
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0 cursor-pointer px-1.5">
                <img alt="" src={arrow} />
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="bottom" sideOffset={4}>
            <DropdownMenuItem
              onClick={() =>
                showProfileModal({
                  userId: user.id,
                  organizations: organizations?.items,
                })
              }
            >
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};

export default UserDropdown;
