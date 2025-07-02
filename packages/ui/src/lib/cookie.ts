import Cookies from "universal-cookie";
import type { StateStorage } from "zustand/middleware";

export const cookie = new Cookies();

const cookieStorage: StateStorage = {
  getItem: (name: string) => {
    return cookie.get(name) ?? null;
  },
  setItem: (name: string, value: string) => {
    cookie.set(name, value, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    });
  },
  removeItem: (name: string) => {
    cookie.remove(name);
  },
};

export default cookieStorage;
