import type { Preview } from "@storybook/react-vite";
import { withThemeByDataAttribute } from "@storybook/addon-themes";
import "../src/styles/fonts.css";
import "../src/styles/index.css";
import "../src/styles/base.css";

const preview: Preview = {
  parameters: {
    layout: "padded",
    controls: {
      matchers: {
        color: /(background|color)$/i,
      },
    },
    options: {
      storySort: {
        order: [
          "Foundations",
          "Core",
          ["Wordmark", "Icon", "Button", "IconButton"],
          "Forms",
          "Status",
          "Ticketing",
        ],
      },
    },
  },
  decorators: [
    // Switches the design-system theme the same way an app does: data-theme on <html>.
    withThemeByDataAttribute({
      themes: { "Stage (dark)": "dark", "Paper (light)": "paper" },
      defaultTheme: "Stage (dark)",
      attributeName: "data-theme",
    }),
  ],
};

export default preview;
