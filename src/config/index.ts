import { config } from "dotenv";
config();

export const PORT = process.env.PORT || 8080;
export const ORIGIN = process.env.ORIGIN || true;

export const fsConfig = {
  email: process.env.EMAIL,
  password: process.env.PASSWORD,
  appKey: process.env.APP_KEY,
  userAgent: process.env.USER_AGENT,
};

export const baseURL = "https://api.fshare.vn/api";
export const getFolderURL = "https://www.fshare.vn/api/v3";
export const searchFilmURL = "https://thuvienhd.com";

export const fsApiUrl = {
  login: "user/login",
  refreshToken: "user/refreshToken",
  download: "session/download",
  getFolder: "files/folder",
};

export const ggConfig = {
  auth: process.env.GG_API_KEY,
  cx: process.env.GG_CX,
  start: 0,
  num: 10,
};

export { instance as axios } from "./axios";
