import axios from "axios";
import Cookie from "universal-cookie";

const cookie = new Cookie();

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    Accept: "application/json",
    Authorization: `Bearer ${cookie.get("access_token")}`,
  },
});
