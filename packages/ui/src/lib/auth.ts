import cookieStorage from "./cookie";

export function isAuthenticated() {
  return !!cookieStorage.getItem("token");
}

export function login(token: string) {
  cookieStorage.setItem("token", token);
}

export function logout() {
  cookieStorage.removeItem("token");
}
