import axios from "axios";

const DATOCMS_TOKEN = process.env.REACT_APP_DATOCMS_TOKEN;
const DATOCMS_URL = process.env.REACT_APP_DATOCMS_API_URL;
const DATOCMS_ENV = process.env.REACT_APP_ENVIRONMENT;

export const datoClient = axios.create({
  baseURL: DATOCMS_URL,

  headers: {
    Authorization: `Bearer ${DATOCMS_TOKEN}`,

    "Content-Type": "application/json",

    "X-Environment": DATOCMS_ENV || "main",

    Accept: "application/json",
  },
});

// Add a request interceptor
datoClient.interceptors.request.use(
  function (config) {
    // Do something before the request is sent
    return config;
  },

  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
datoClient.interceptors.response.use(
  function (response) {
    // Any status code that lies within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },

  function (error) {
    // Any status codes that fall outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);
