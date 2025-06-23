import { useQuery } from "@tanstack/react-query";
import { ReactNode, createContext, useContext, useMemo } from "react";

import { api } from "lib/axios/interceptor";
import { OrgTypes } from "lib/types/organizations";
import { IUser } from "lib/types/users";

import { queryClient } from "./QueryProvider";
import Spinner from "./ui/spinner/spinner";

const queryUrl = "/authentication/profile";

const refreshProfile = () => {
  queryClient.invalidateQueries({ queryKey: [queryUrl] });
};

function useFetchProfile() {
  return useQuery({
    queryKey: [queryUrl],
    queryFn: async function ({ signal }) {
      return await api.get<{ data: IUser }>(queryUrl, {
        signal,
      });
    },
    select: (res) => res?.data?.data,
    placeholderData: (previous) => previous,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}

interface IProfileContext {
  profile: IUser;
  isProviderUser: boolean;
  isFunderUser: boolean;
  isForteUser: boolean;
  isReadonly: boolean;
}

const ProfileContext = createContext<IProfileContext | undefined>(undefined);

function ProfileProvider({ children }: { children: ReactNode }) {
  const { isLoading, data: profile } = useFetchProfile();

  const { isProviderUser, isFunderUser, isForteUser, orgType } = useMemo(() => {
    if (isLoading) return "";
    const type = profile?.role?.split(".")[0];
    if (type === "provider")
      return {
        isProviderUser: true,
        isFunderUser: false,
        isForteUser: false,
        orgType: "provider",
      };
    if (type === "funder")
      return {
        isProviderUser: false,
        isFunderUser: true,
        isForteUser: false,
        orgType: "funder",
      };
    return {
      isProviderUser: false,
      isFunderUser: false,
      isForteUser: true,
      orgType: "forte",
    };
  }, [profile?.role, isLoading]) as {
    isProviderUser: boolean;
    isFunderUser: boolean;
    isForteUser: boolean;
    orgType: OrgTypes;
  };

  if (isLoading || !profile)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );

  return (
    <ProfileContext.Provider
      value={{
        profile: { ...profile, orgType },
        isForteUser,
        isFunderUser,
        isProviderUser,
        isReadonly: !!profile?.role?.includes("read-only"),
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) throw new Error("Not used inside profile provider!");
  return context;
}

export { ProfileProvider, useProfile, refreshProfile };
