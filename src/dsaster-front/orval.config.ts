import { defineConfig } from "orval";

const searchCommit = "5bf069d4ba5c5534722738ea158019b16b21d951";

export default defineConfig({
  search: {
    input: {
      target:
        "https://raw.githubusercontent.com/DSaster-Error200-LLC" +
        `/DSaster-SearchService/${searchCommit}` +
        "/src/dsaster-search/openapi/openapi.json",
    },
    output: {
      target: "./api/search.ts",
      httpClient: "axios",
    },
  },
});
