import { axios, fsApiUrl, getFolderURL } from "../config";
import { fshareFactory } from "../factory";
import { global } from "../shared";
import { setCookie } from "../config/axios";
import { HttpStatusCode } from "axios";

export const FshareClient = () => {
  const login = async (account: fshareFactory.FshareAccount) => {
    const { data } = await axios.post(fsApiUrl.login, account);
    setCookie(data);
    return data;
  };

  const refreshToken = async () => {
    const { data } = await axios.post(fsApiUrl.refreshToken, {
      token: global.token,
    });
    setCookie(data);
    return data;
  };

  const getFile = async (file: fshareFactory.FshareFile) => {
    const { data } = await axios.post(
      fsApiUrl.download,
      {
        ...file,
        token: global.token,
        zipflag: 0,
      },
      { validateStatus: (status) => status !== HttpStatusCode.Created }
    );
    return data;
  };

  const getFolder = async (code: string) => {
    const { data } = await axios.get(fsApiUrl.getFolder, {
      baseURL: getFolderURL,
      params: {
        linkcode: code,
        sort: "type,name",
      },
    });
    return data;
  };

  return {
    login,
    refreshToken,
    getFile,
    getFolder,
  };
};
