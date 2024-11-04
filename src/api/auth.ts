import { z } from "zod";
import { login, signup } from "../lib/validators";
import apiRequest from "./apiRequest";
import { cookie } from "../lib/hooks";

class AuthService {
  async login(body: z.infer<typeof login.schema>) {
    const res = await apiRequest.post("/authentication/login", body);
    return res;
  }
  async signup(body: z.infer<typeof signup.schema>) {
    const res = await apiRequest.post("/authentication/signup", body);
    return res;
  }
  async logout() {
    cookie.remove("access_token", { path: "/" });
    window.location.href = "/";
  }
}

const authService = new AuthService();
export default authService;
