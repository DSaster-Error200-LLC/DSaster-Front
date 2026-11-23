# @dsaster/ui

The [Ticket DSaster design system](https://claude.ai/artifact/22RectHgNCVgSiKYGmPEfa)
as a React component library: design tokens, thirteen components and the
icon set, shared by every Ticket DSaster front end.

The design system artifact is the source of truth for tokens, voice and
component usage. This package implements it; it does not redefine it. When the
two disagree, fix the package.

## Contents

| Path                                | What                                                                                                    |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `tokens.json`                       | Verbatim copy of the design system's `project/tokens.json`.                                             |
| `src/styles/tokens.css`             | Generated. Every token as a CSS custom property, both themes, plus `.ds-<type-style>` classes.          |
| `src/styles/components.css`         | Component styles (`.ds-*`), inside `@layer components`.                                                 |
| `src/styles/index.css`              | `tokens.css` + `components.css`: the one stylesheet most apps load (`@dsaster/ui/styles.css`).          |
| `src/styles/tailwind.css`           | Generated. Tailwind CSS v4 bridge: `@theme inline` colour, font and shadow mappings and type utilities. |
| `src/styles/base.css`               | Opt-in page defaults (body font, colour, margin) for apps without their own reset.                      |
| `src/styles/fonts.css`              | Opt-in Google Fonts import (Archivo, Archivo Black, JetBrains Mono).                                    |
| `src/components/*.tsx`              | The components. Props mirror the design system's `components/index.d.ts`.                               |
| `src/components/internal/icons.tsx` | Generated. The twenty bundled Lucide icons (v0.460.0, ISC).                                             |
| `scripts/build-tokens.ts`           | Regenerates `tokens.css` and `tailwind.css` from `tokens.json`.                                         |
| `src/components/*.stories.tsx`      | Storybook stories, one file per component plus `Foundations` (tokens).                                  |
| `.storybook/`                       | Storybook config: React + Vite, docs, a11y checks, and a Stage/Paper theme switcher.                    |

## Components

Core: `Wordmark`, `Icon`, `Button`, `IconButton`, `TextField`, `Checkbox`,
`Badge`, `Notice`.
Ticketing: `EventCard`, `QuantityStepper`, `PriceRow`, `StepIndicator`,
`TabBar`. Plus `formatMoney(amount, currency = "EUR", locale = "en-IE")`.

Each component's guidelines live in the design system under
`project/components/<Name>/README.md`; the props are documented in the TSX
files. Compared with the design system's bundle this package adds a few
optional props for translation only: `fromLabel` on `EventCard`,
`decrementLabel` / `incrementLabel` on `QuantityStepper`, `completedLabel` on
`StepIndicator`.

`TextField`, `QuantityStepper` and `TabBar` are client components (they use
hooks). The rest render on the server; add the client boundary yourself where
you pass event handlers.

## Using it from the Next.js app

The app already does all of this; it is listed so another consumer can repeat it.

1. Depend on the package. In this repository it is a pnpm workspace package:
   `"@dsaster/ui": "workspace:*"`, with `packages/*` listed in
   `pnpm-workspace.yaml`. From another repository, point the dependency at a
   published version, a git URL, or a git submodule checkout
   (`"@dsaster/ui": "file:./vendor/dsaster-ui"`). The package ships TypeScript
   source, so a Next.js consumer lists it in `transpilePackages`; Vite consumers
   need nothing.
2. Load the styles once, in the Tailwind entry stylesheet so the bridge is
   processed by Tailwind:

   ```css
   @import "tailwindcss";
   @import "@dsaster/ui/styles.css";
   @import "@dsaster/ui/tailwind.css";
   ```

   Without Tailwind, import `@dsaster/ui/styles.css` (and optionally
   `@dsaster/ui/base.css`) from the app shell.

3. Provide the fonts. Either import `@dsaster/ui/fonts.css` (Google Fonts), or
   self-host with `next/font` and point the design-system variables at them:

   ```css
   :root {
     --font-display: var(--font-archivo-black), "Archivo Black", sans-serif;
     --font-sans: var(--font-archivo), "Archivo", sans-serif;
     --font-mono: var(--font-jetbrains-mono), "JetBrains Mono", monospace;
   }
   ```

4. Pick a theme. The default is the dark `stage` theme. Set
   `<html data-theme="paper">` for the light alternate (receipts, printable
   tickets, or an app that is still light).

```tsx
import { Button, EventCard, Notice } from "@dsaster/ui";

<Notice tone="warning" title="Tickets held for 9:42">
  Finish checkout before the timer runs out.
</Notice>
<Button size="lg" block iconRight="chevron-right">Continue to payment</Button>
```

## Tokens in app code

Use the design-system names, never raw values:

- CSS: `background: var(--surface-100); color: var(--ink); padding: var(--space-4); border-radius: var(--radius-md);`
- Tailwind utilities (via `tailwind.css`): `bg-surface-100 text-ink border-line-strong font-display shadow-sheet text-heading-m text-mono-m`.
  Spacing and radii keep their design-system scale, so use the variable
  syntax: `p-(--space-4)`, `gap-(--space-5)`, `rounded-(--radius-lg)`.
- Plain classes (no Tailwind): `.ds-heading-m`, `.ds-body-s`, `.ds-mono-m`, …

## Keeping it in sync with the design system

1. Copy the artifact's `project/tokens.json` over `tokens.json`.
2. Run `pnpm --filter @dsaster/ui tokens` from `src/dsaster-front/` (or
   `pnpm tokens` inside this folder). This rewrites `src/styles/tokens.css` and
   `src/styles/tailwind.css`.
3. Port component changes from `project/components/bundle.js` and
   `project/components/bundle.css` by hand (class prefix `ad-` there is `ds-`
   here), keeping `index.d.ts` prop names.

## Storybook

Every component and the token foundations can be browsed in Storybook. From
`src/dsaster-front/`:

```bash
pnpm storybook
```

opens http://localhost:6006. The toolbar's theme switcher flips `data-theme`
on the preview between Stage (dark) and Paper (light), exactly as an app does.
Each component page has autodocs with live controls, and the a11y addon reports
contrast and ARIA issues per story.

`pnpm build-storybook` writes a static site to `packages/ui/storybook-static/`
(git-ignored) that can be published anywhere static files are served.

Stories live next to their component as `<Name>.stories.tsx`; add one for every
new component and a story per documented state.

## Checks

From `src/dsaster-front/` the usual `pnpm lint`, `pnpm format`, `pnpm test` and
`pnpm build` already cover this package, stories included. Standalone:

```bash
pnpm typecheck
pnpm test
pnpm build-storybook
```

## Extracting it into its own repository

The package has no dependency on the app: no `@/` alias, no Next.js imports,
relative forward imports only, and its own `tsconfig.json`, `vitest.config.mts`
and scripts. To split it out, move this folder to a new repository (or add it
back as a git submodule under `src/dsaster-front/packages/ui`), keep the
`workspace:*` dependency if it stays a workspace package, or replace it with a
git URL or published version otherwise.
