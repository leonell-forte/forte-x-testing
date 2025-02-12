import authService from "api/auth";
import axios from "axios";

import { cookie } from "../hooks";

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: { Accept: "application/json" },
});

let refreshPromise: Promise<string> | null = null;
let refreshSubscribers: ((token: string) => void)[] = [];

const onTokenRefreshed = (newToken: string) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

api.interceptors.request.use(
  (config) => {
    const token = cookie.get("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401
      // !originalRequest._retry &&
      // !publicRoutes.includes(window.location.pathname)
    ) {
      originalRequest._retry = true;

      if (!refreshPromise) {
        refreshPromise = authService
          .getRefreshedToken()
          .then((newToken) => {
            cookie.set("access_token", newToken, { path: "/" });
            api.defaults.headers["Authorization"] = `Bearer ${newToken}`;
            onTokenRefreshed(newToken);
            return newToken;
          })
          .catch((refreshError) => {
            console.error("Token refresh failed", refreshError);
            cookie.remove("access_token", { path: "/" });
            cookie.remove("refresh_token", { path: "/" });
            window.location.href = "/"; // Or redirect to login
            return Promise.reject({ ...refreshError, config: originalRequest }); // Propagate the error
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      return refreshPromise
        .then((newToken) => {
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return api(originalRequest);
        })
        .catch((refreshError) => Promise.reject(refreshError)); // Propagate refresh errors to subsequent calls
    }

    return Promise.reject(error);
  }
);
