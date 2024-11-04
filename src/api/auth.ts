import { z } from "zod";
import { login, signup } from "../lib/validators";
import { cookie } from "../lib/hooks";
import { api } from "../lib/axios/interceptor";

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
}

const authService = new AuthService();
export default authService;
