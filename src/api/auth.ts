import axios from "axios";
import { z } from "zod";

import { api } from "../lib/axios/interceptor";
import { cookie } from "../lib/hooks";
import { login, password, signup } from "../lib/validators/auth";

class AuthService {
  async login(body: z.infer<typeof login.schema>) {
    const res = await api.post("/authentication/login", body);

    return res;
  }

  async signup(body: z.infer<typeof signup.schema>, code: string = "") {
    let data = {
      ...body,

      hasAgreedToTerms: body.agreeTerms ? true : false,

      invitationCode: code,
    };

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

  async forgotPassword(email: string) {
    const response = await api.post("/authentication/forget-password", {
      email,
    });

    return response;
  }

  async resetPassword(values: z.infer<typeof password.schema>) {
    const otp = sessionStorage.getItem("otp");

    const response = await api.put("/authentication/forget-password", {
      ...values,

      otp,
    });

    return response;
  }
}

const authService = new AuthService();

export default authService;
