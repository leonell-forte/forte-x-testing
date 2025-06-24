import { z } from "zod";

import { datoClient } from "@/lib/axios/datocms-client";
import { LoginCopy, UserData } from "@/lib/types/auth";
import { ProfileType } from "@/lib/types/profile";
import { LoginReturnType } from "@/lib/types/users";
import { formatInvitationCode } from "@/lib/utils";

import { api } from "../lib/axios/interceptor";
import { cookie } from "../lib/hooks";
import { login, password, signup } from "../lib/validators/auth";

class AuthService {
  private getPlatform(): "mobile" | "web" {
    const userAgent = navigator.userAgent || navigator.vendor;
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent
      );
    return isMobile ? "mobile" : "web";
  }

  async login(body: z.infer<typeof login.schema>): Promise<LoginReturnType> {
    const res = await api.post("/authentication/login", body);

    return res.data.data;
  }

  async getLatestTermsVersion() {
    try {
      const res = await datoClient.post("", {
        query: `
        query {
          term {
            terms {
              version
            }
          }
        }
      `,
      });

      return res.data.data.term.terms.pop().version;
    } catch (err) {
      return err;
    }
  }

  async getLoginCopy(): Promise<LoginCopy> {
    const res = await datoClient.post("", {
      query: `
      query {
        login {
          image {
            url
          }
          title
          description
        }
      }
    `,
    });

    return res.data.data.login;
  }

  async getSignupCopy(): Promise<LoginCopy> {
    const res = await datoClient.post("", {
      query: `
      query {
        signup {
          image {
            url
          }
          title
          description
        }
      }
    `,
    });

    return res.data.data.signup;
  }

  async signup(body: z.infer<typeof signup.schema>, code: string = "") {
    const termsVersion = await this.getLatestTermsVersion();

    let data = {
      ...body,
      hasAgreedToTerms: body.agreeTerms ? true : false,
      invitationCode: formatInvitationCode(code),
      signUpSource: this.getPlatform(),
      termsVersion: termsVersion,
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

  async resetPassword(values: z.infer<typeof password.schema>, email: string) {
    const response = await api.put("/authentication/forget-password", {
      ...values,

      email,
    });

    return response;
  }

  async getProfileByInvitation(code: string): Promise<UserData> {
    const response = await api.get(`/authentication/profile/${code}`);

    return response.data.data;
  }

  async getRefreshedToken() {
    const refreshToken = cookie.get("refresh_token");

    const email = cookie.get("token-email");

    const res = await api.post("authentication/refresh-token", {
      refreshToken,
      email,
    });

    return res.data.data;
  }

  async verifyCode(sessionToken: string, code: string) {
    const res = await api.post("/authentication/verify", {
      sessionToken,
      code,
    });
    return res.data.data;
  }

  async resendOtp(sessionToken: string) {
    const res = await api.get(`authentication/resend-otp/${sessionToken}`);
    return res.data.data;
  }
}

const authService = new AuthService();

export default authService;
