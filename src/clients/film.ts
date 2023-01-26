import { axios, searchFilmURL } from "../config";

export const search = async (filmName: string) => {
  const { data } = await axios.get("/", {
    baseURL: searchFilmURL,
    params: {
      feed: "timfsharejson",
      search: filmName,
    },
  });
  return data.data;
};
