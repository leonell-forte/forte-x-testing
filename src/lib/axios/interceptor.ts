import authService from "api/auth";
import axios from "axios";

import { publicRoutes } from "lib/routes";

import { cookie } from "../hooks";

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: { Accept: "application/json" },
});

// Track token refresh state
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Function to store failed requests and retry after getting new token
const onTokenRefreshed = (newToken: string) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

// Function to add requests to the queue
const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// Request Interceptor: Attach Access Token to Requests
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

// Response Interceptor: Handle 401 Errors
api.interceptors.response.use(
  (response) => response, // Pass successful responses
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !publicRoutes.includes(window.location.pathname)
    ) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const newToken = await authService.getRefreshedToken();
          if (newToken) {
            cookie.set("access_token", newToken);
            api.defaults.headers["Authorization"] = `Bearer ${newToken}`;
            onTokenRefreshed(newToken);
          }
        } catch (refreshError) {
          console.error("Token refresh failed", refreshError);
          cookie.remove("access_token");
          cookie.remove("refresh_token");
          window.location.href = "/";
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      // Queue the request until token is refreshed
      return new Promise((resolve) => {
        addRefreshSubscriber((newToken: string) => {
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          resolve(api(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);
