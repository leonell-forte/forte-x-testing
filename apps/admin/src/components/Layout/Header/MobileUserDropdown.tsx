import { useEffect } from "react";
import { HiUser } from "react-icons/hi2";
import { HiOutlineChevronUpDown as Chevron } from "react-icons/hi2";

import authService from "@/api/auth";
import { useProfile } from "@/components/ProfileContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu/DropdownMenu";
import useOrganizationList from "@/lib/common/lists/useOrganizationList";

import { showProfileModal } from "./ViewProfileDialogue";

const MobileUserDropdown = () => {
  const { profile } = useProfile();

  const { rawList: organizations, handleSearchOrg } = useOrganizationList({});

  useEffect(() => {
    if (profile.organization) handleSearchOrg(profile.organization);
  }, [profile.organization, handleSearchOrg]);

  const handleLogout = () => authService.logout();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="group flex w-full cursor-pointer items-center gap-2 overflow-hidden rounded p-3 pl-1.5 pr-4 transition-all duration-500 hover:bg-white hover:bg-opacity-[30%]">
            <div className="bg-mint ml-1 flex flex-shrink-0 items-center rounded-full p-1">
              <HiUser className="m-auto h-auto w-5" />
            </div>

            <div className="max-w-[122px] flex-shrink text-left">
              <p className="truncate text-sm">
                {profile?.firstName} {profile?.lastName}
              </p>
              <p className="truncate text-xs">{profile?.email}</p>
            </div>
            <div className="w-full flex-shrink-0">
              <Chevron className="h-auto w-6" />
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="top" sideOffset={12}>
          <DropdownMenuItem
            onClick={() =>
              showProfileModal({
                userId: profile.id,
                organizations: organizations?.items,
              })
            }
          >
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default MobileUserDropdown;
