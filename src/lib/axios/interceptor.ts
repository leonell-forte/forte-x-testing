import axios from "axios";
import { cookie } from "../hooks";

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    Accept: "application/json",
    Authorization: `Bearer ${cookie.get("access_token")}`,
  },
});
