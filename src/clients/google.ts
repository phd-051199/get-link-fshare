import { customsearch } from "@googleapis/customsearch";
import { ggConfig } from "../config";

export const search = async (query: string) => {
  const customSearch = customsearch("v1");
  let results;

  if (query) {
    const result = await customSearch.cse.siterestrict.list({
      ...ggConfig,
      q: `${query} site:fshare.vn`,
    });
    results = result.data.items;
  }

  return results || [];
};
