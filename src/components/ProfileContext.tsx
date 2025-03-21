import { useQuery } from "@tanstack/react-query";
import { ReactNode, createContext, useContext } from "react";

import { api } from "lib/axios/interceptor";
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
}

const ProfileContext = createContext<IProfileContext | undefined>(undefined);

function ProfileProvider({ children }: { children: ReactNode }) {
  const { isLoading, data: profile } = useFetchProfile();
  if (isLoading || !profile)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );

  return (
    <ProfileContext.Provider value={{ profile }}>
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
