import { defineConfig } from "orval";

const searchCommit = "650b15eedc243e834b771d18d2a79b37dfa9023d";

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
