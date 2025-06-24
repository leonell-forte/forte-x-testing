import authService from "@/api/auth";
import axios from "axios";
import { add } from "date-fns";

import { cookie } from "../hooks";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { Accept: "application/json" },
});

// Single refresh promise to prevent multiple refresh calls
let refreshPromise: Promise<string> | null = null;
// Queue for subscribers waiting for token refresh
let refreshSubscribers: ((token: string) => void)[] = [];

const onTokenRefreshed = (newToken: string) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

// Request interceptor adds token to all requests
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

// Response interceptor handles 401 errors and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401) {
      originalRequest._retry = true;

      // Initialize refresh token process if not already in progress
      if (!refreshPromise) {
        refreshPromise = authService
          .getRefreshedToken()
          .then((newToken) => {
            cookie.set("access_token", newToken, {
              path: "/",
              expires: add(new Date(), { hours: 2 }),
            });

            api.defaults.headers["Authorization"] = `Bearer ${newToken}`;

            onTokenRefreshed(newToken);

            return newToken;
          })
          .catch((refreshError) => {
            // Handle refresh failure by clearing tokens and redirecting
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

      // Wait for token refresh and retry original request
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
