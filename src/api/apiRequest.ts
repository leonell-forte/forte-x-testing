import { api } from "../lib/axios/interceptor";

class ApiRequest {
  async get(endpoint: string) {
    try {
      const res = await api.get(endpoint);
      return res.data;
    } catch (err) {
      throw err;
    }
  }

  async post(endpoint: string, body: any, headers?: any) {
    try {
      const res = await api.post(endpoint, body, headers);
      return res.data;
    } catch (err) {
      throw err;
    }
  }

  async patch(endpoint: string, body: any, headers: any) {
    try {
      const res = await api.patch(endpoint, body, headers);
      return res.data;
    } catch (err) {
      throw err;
    }
  }
}

const apiRequest = new ApiRequest();
export default apiRequest;
