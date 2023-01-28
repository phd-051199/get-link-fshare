import get from "lodash/get";
import { axios, searchFilmURL } from "../config";

export const search = async (filmName: string) => {
  const { data } = await axios.get("/", {
    baseURL: searchFilmURL,
    params: {
      feed: "timfsharejson",
      search: filmName,
    },
  });
  return data;
};

export const autoComplete = async (keyword: string) => {
  const { data } = await axios.get("/wp-json/dooplay/search/", {
    baseURL: searchFilmURL,
    params: {
      nonce: "c5a4c75c70",
      keyword,
    },
  });
  return Object.values(data).map((item) => get(item, "title"));
};
