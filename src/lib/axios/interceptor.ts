import axios from "axios";

import { publicRoutes } from "lib/routes";

import { cookie } from "../hooks";

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,

  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    const token = cookie.get("access_token");

    if (token) {
      // Add the token to the request headers
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    console.log(error);

    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    // console.log(response);

    return response;
  },
  function (error) {
    console.log(error);

    if (
      error.status === 401 &&
      !publicRoutes.includes(window.location.pathname)
      // prevents from redirecting to login page if using a public route
    ) {
      window.location.href = "/";
    }

    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);
