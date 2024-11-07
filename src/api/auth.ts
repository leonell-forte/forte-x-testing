import { z } from "zod";
import { login, signup } from "../lib/validators";
import { cookie } from "../lib/hooks";
import { api } from "../lib/axios/interceptor";
import axios from "axios";

class AuthService {
  async login(body: z.infer<typeof login.schema>) {
    const res = await api.post("/authentication/login", body);
    return res;
  }
  async signup(body: z.infer<typeof signup.schema>) {
    const res = await api.post("/authentication/signup", body);
    return res;
  }
  async logout() {
    cookie.remove("access_token", { path: "/" });
    window.location.href = "/";
  }
  async check() {
    await axios.get(`${process.env.REACT_APP_API_URL}/authentication/check`, {
      headers: {
        Authorization: `Bearer ${cookie.get("access_token")}`,
      },
    });
    window.location.href = "/users";
  }
}

const authService = new AuthService();
export default authService;
