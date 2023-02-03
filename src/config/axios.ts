import axios, { HttpStatusCode } from "axios";
import set from "lodash/set";
import { baseURL, fsApiUrl, fsConfig } from ".";
import { refreshToken } from "../controllers/fshare";
import { fshareFactory } from "../factory";
import { global } from "../shared";

const instance = axios.create({
  baseURL,
});

instance.defaults.headers.common = {
  "User-Agent": fsConfig.userAgent,
  "Content-Type": "application/json",
};

instance.interceptors.request.use((config) => {
  if (config.method === "post" && config.url !== fsApiUrl.download) {
    config.data["app_key"] = fsConfig.appKey;
  }
  return config;
});

instance.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response.status === HttpStatusCode.Created &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const data = await refreshToken();
      originalRequest.data = setNewToken(originalRequest.data, data.token);
      return instance(originalRequest);
    }
    return Promise.reject(error);
  }
);

export const setCookie = (data: fshareFactory.FshareAuth) => {
  set(global, "token", data.token);
  instance.defaults.headers.common.Cookie = `session_id=${data.session_id}`;
};

export const setNewToken = (data: string, token: string) => {
  const body = JSON.parse(data);
  set(body, "token", token);
  return JSON.stringify(body);
};

export { instance };
