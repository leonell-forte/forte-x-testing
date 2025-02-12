import { z } from "zod";

import { UserData } from "lib/types/auth";
import { ProfileType } from "lib/types/profile";
import { LoginReturnType } from "lib/types/users";
import { formatInvitationCode } from "lib/utils";

import { api } from "../lib/axios/interceptor";
import { cookie } from "../lib/hooks";
import { login, password, signup } from "../lib/validators/auth";

class AuthService {
  async login(body: z.infer<typeof login.schema>): Promise<LoginReturnType> {
    const res = await api.post("/authentication/login", body);

    return res.data.data;
  }

  async signup(body: z.infer<typeof signup.schema>, code: string = "") {
    let data = {
      ...body,

      hasAgreedToTerms: body.agreeTerms ? true : false,

      invitationCode: formatInvitationCode(code),
    };

    delete data.agreeTerms;

    const res = await api.post("/authentication/signup", data);

    return res;
  }

  async googleSignup(code: string) {
    const response = await api.post(
      `/authentication/signup-google/${formatInvitationCode(code)}`
    );

    return response;
  }

  async logout() {
    cookie.remove("access_token", { path: "/" });

    cookie.remove("refresh_token", { path: "/" });

    window.location.href = "/";
  }

  async check() {
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate async delay
    const token = cookie.get("access_token");
    if (token) {
      window.location.href = "/users";
      return true;
    }
  }

  async getProfile(): Promise<ProfileType> {
    if (!cookie.get("access_token")) throw new Error();

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

  async getProfileByInvitation(code: string): Promise<UserData> {
    const response = await api.get(`/authentication/profile/${code}`);

    return response.data.data;
  }

  async getRefreshedToken() {
    const refreshToken = cookie.get("refresh_token");

    const email = cookie.get("user-email");

    const res = await api.post("authentication/refresh-token", {
      refreshToken,
      email,
    });

    return res.data.data;
  }
}

const authService = new AuthService();

export default authService;
