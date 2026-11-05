/**
 * Generates src/styles/tokens.css and src/styles/tailwind.css from tokens.json.
 *
 * tokens.json is copied verbatim from the Ticket DSaster design system
 * (https://claude.ai/artifact/22RectHgNCVgSiKYGmPEfa). Run `pnpm tokens`
 * after updating it; never edit the generated files by hand.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { format } from "prettier";

type ThemedValue = Readonly<Record<string, string>>;

interface Token {
  readonly name: string;
  readonly value: string | ThemedValue;
  readonly usage?: string;
}

interface TokenFamily {
  readonly tokens: readonly Token[];
}

interface TypeStyle {
  readonly name: string;
  readonly fontSize: string;
  readonly lineHeight?: string | number;
  readonly fontWeight?: number | string;
  readonly letterSpacing?: string;
  readonly family?: string;
}

interface TypeGroup {
  readonly name: string;
  readonly family: string;
  readonly styles: readonly TypeStyle[];
}

interface Tokens {
  readonly name: string;
  readonly color: {
    readonly themes: readonly { readonly id: string; readonly name: string }[];
    readonly tokens: readonly Token[];
  };
  readonly type: {
    readonly families: Readonly<Record<string, string>>;
    readonly groups: readonly TypeGroup[];
  };
  readonly spacing: TokenFamily;
  readonly radius: TokenFamily;
  readonly shadow?: TokenFamily;
}

const packageDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const tokens = JSON.parse(
  readFileSync(resolve(packageDir, "tokens.json"), "utf8"),
) as Tokens;

const firstTheme = tokens.color.themes[0].id;

/** A token's value for a theme; a theme without its own value inherits the first theme's. */
function themed(token: Token, themeId: string): string {
  if (typeof token.value === "string") return token.value;
  return token.value[themeId] ?? token.value[firstTheme];
}

/** Resolves `{other-token}` aliases to `var(--other-token)`. */
function cssValue(value: string): string {
  return value.replace(/^\{([A-Za-z0-9_.-]+)\}$/, "var(--$1)");
}

function declarations(list: readonly Token[], themeId: string): string {
  return list
    .map((token) => `--${token.name}: ${cssValue(themed(token, themeId))};`)
    .join("\n");
}

function typeStyleBody(style: TypeStyle, family: string): string {
  const lines = [
    `font-family: var(--font-${family});`,
    `font-size: ${style.fontSize};`,
  ];
  if (style.lineHeight !== undefined) {
    lines.push(`line-height: ${String(style.lineHeight)};`);
  }
  if (style.fontWeight !== undefined) {
    lines.push(`font-weight: ${String(style.fontWeight)};`);
  }
  if (style.letterSpacing !== undefined) {
    lines.push(`letter-spacing: ${style.letterSpacing};`);
  }
  if (family === "mono") {
    lines.push("font-variant-numeric: tabular-nums;");
  }
  return lines.join("\n");
}

const typeStyles = tokens.type.groups.flatMap((group) =>
  group.styles.map((style) => ({
    name: style.name,
    body: typeStyleBody(style, style.family ?? group.family),
  })),
);

const shadowTokens = tokens.shadow?.tokens ?? [];
const themedTokens = [...tokens.color.tokens, ...shadowTokens];
const otherThemes = tokens.color.themes.slice(1);

const themeBlocks = otherThemes
  .map(
    (theme) => `
[data-theme="${theme.id}"] {
${declarations(themedTokens, theme.id)}
}`,
  )
  .join("\n");

const fontFamilies = Object.entries(tokens.type.families)
  .map(([key, stack]) => `--font-${key}: ${stack};`)
  .join("\n");

const typeClasses = typeStyles
  .map((style) => `.ds-${style.name} {\n${style.body}\n}`)
  .join("\n");

const tokensCss = `
/* ${tokens.name} — generated from tokens.json by scripts/build-tokens.ts. Do not edit. */

/* Colour and shadow, per theme. The first theme ("${firstTheme}") is the default. */
:root,
[data-theme="${firstTheme}"] {
${declarations(themedTokens, firstTheme)}
}
${themeBlocks}

/* Space, shape and type families. */
:root {
${declarations(tokens.spacing.tokens, firstTheme)}
${declarations(tokens.radius.tokens, firstTheme)}
${fontFamilies}
}

/* Type styles, as classes for apps without Tailwind. */
@layer components {
${typeClasses}
}
`;

const themeColors = tokens.color.tokens
  .map((token) => `--color-${token.name}: var(--${token.name});`)
  .join("\n");

const themeFonts = Object.keys(tokens.type.families)
  .map((key) => `--font-${key}: var(--font-${key});`)
  .join("\n");

const themeShadows = shadowTokens
  .map((token) => `--${token.name}: var(--${token.name});`)
  .join("\n");

const typeUtilities = typeStyles
  .map((style) => `@utility text-${style.name} {\n${style.body}\n}`)
  .join("\n");

const tailwindCss = `
/* ${tokens.name} — Tailwind CSS v4 bridge, generated from tokens.json by scripts/build-tokens.ts. Do not edit.
   Import after tokens.css so utilities such as bg-surface-100, text-ink, border-line-strong,
   font-display and text-heading-m resolve to the design-system custom properties. */
@theme inline {
${themeColors}
${themeFonts}
${themeShadows}
}

${typeUtilities}
`;

async function write(file: string, css: string): Promise<void> {
  const target = resolve(packageDir, "src/styles", file);
  writeFileSync(target, await format(css.trimStart(), { parser: "css" }));
  console.log(`wrote ${target}`);
}

await write("tokens.css", tokensCss);
await write("tailwind.css", tailwindCss);
