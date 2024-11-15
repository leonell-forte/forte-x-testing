import { z } from "zod";
import { login, signup } from "../lib/validators/auth";
import { cookie } from "../lib/hooks";
import { api } from "../lib/axios/interceptor";
import axios from "axios";

class AuthService {
  async login(body: z.infer<typeof login.schema>) {
    const res = await api.post("/authentication/login", body);

    return res;
  }

  async signup(body: z.infer<typeof signup.schema>) {
    let data = { ...body, hasAgreedToTerms: body.agreeTerms ? true : false };

    delete data.agreeTerms;

    const res = await api.post("/authentication/signup", data);

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

  async getProfile() {
    const response = await api.get(`/authentication/profile`);

    return response.data.data;
  }
}

const authService = new AuthService();

export default authService;
