import { api } from "@/lib/axios/interceptor";

class UserService {
  async list() {
    const res = await api.get("/users");
    return res;
  }
}
