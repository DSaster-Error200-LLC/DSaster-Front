<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project Structure & Environment

- **Working Directory**: The git repository root is `DSaster-Front`, but the entire Next.js application, configs, and dependencies reside in `src/dsaster-front/`. Always run commands with `src/dsaster-front/` as the working directory.

## Essential Commands

- `pnpm dev`: Start Next.js development server with Turbopack.
- `pnpm lint`: Run ESLint.
- `pnpm format:check`: Check code formatting with Prettier.
- `pnpm format`: Auto-format codebase with Prettier.
- `pnpm exec tsc --noEmit`: Run TypeScript type-checker without building.
- `pnpm build`: Production build (Next.js 16 App Router + Turbopack + TypeScript check).
- `pnpm test`: Run the Vitest test suite.
- `pnpm api`: Regenerate OpenAPI clients using Orval.
- `pnpm storybook`: Browse the `@dsaster/ui` components and tokens in Storybook (port 6006); `pnpm build-storybook` writes a static site to `packages/ui/storybook-static/`.

### Pre-commit / CI Verification Order

Before committing or creating a PR, run the following checks and ensure all pass with zero errors:

1. `pnpm build`
2. `pnpm lint`
3. `pnpm format`
4. `pnpm format:check`
5. `pnpm test`

## Code & Framework Conventions

- **No Backwards Relative Imports**: `**/../**` imports are forbidden by ESLint (`@typescript-eslint/no-restricted-imports`). Always use the `@/*` path alias mapping to the project root (e.g., `@/app/...`, `@/api/...`).
- **Next.js 16 App Router**:
  - Route parameters (`params`, `searchParams`) in page and layout components are asynchronous Promises and must be awaited.
  - Server components are the default; mark interactive components with `"use client"`.
  - Next.js docs are available locally in `node_modules/next/dist/docs/`.
- **React 19 & Component Typing**:
  - Component props must be typed as `Readonly<Props>` with `readonly` properties to satisfy `@eslint-react/eslint-plugin`.
  - `TODO` comments are allowed and encouraged for incomplete work; `sonarjs/todo-tag` is configured to warn so they do not fail CI.
- **Styling (Tailwind CSS v4)**:
  - Uses Tailwind CSS v4 via `@import "tailwindcss";` in `app/globals.css` (no `tailwind.config.js`).
  - Design-system utilities come from `@dsaster/ui/tailwind.css` (imported in `app/globals.css`): colours `surface-000`, `surface-100`, `surface-200`, `line`, `line-strong`, `ink`, `ink-muted`, `brand`, `brand-hover`, `on-brand`, `brand-text`, `accent`, `on-accent`, `success`, `success-soft`, `warning`, `warning-soft`, `danger`, `danger-soft`, `focus`; families `font-sans`, `font-mono`; type styles `text-display-xl`, `text-heading-m`, `text-body`, `text-label`, `text-mono-m`, …; spacing and radii via `p-(--space-4)`, `rounded-(--radius-md)`.
  - Every screen is built from `@dsaster/ui` components and these utilities; there is no app-level palette or font. `app/globals.css` only maps the `next/font` families onto `--font-display`, `--font-sans` and `--font-mono` and sets the body defaults (`bg-surface-000 text-ink font-sans`).
  - The app runs the design system's default dark `stage` theme (no `data-theme` on `<html>`); set `data-theme="paper"` on a subtree only for light surfaces such as printable tickets.
  - Navigation that must stay a link (`next/link`) but look like a `Button` uses `app/components/ButtonLink.tsx`, which applies the package's `ds-btn` classes.

## Design System & Component Library

- UI follows the **Ticket DSaster** design system: https://claude.ai/artifact/22RectHgNCVgSiKYGmPEfa. Read its `project/README.md` before building UI; it is the source of truth for tokens, voice and component usage. Component specs: `project/components/<Name>/README.md`.
- The design system is implemented as the pnpm workspace package `packages/ui` (`@dsaster/ui`), consumed by the app with `import { Button } from "@dsaster/ui"`. Read `packages/ui/README.md` before adding or changing components.
- Use the design-system token names as CSS custom properties (`var(--surface-000)`, `var(--ink)`, `var(--brand)`, `var(--space-4)`, `var(--radius-md)`); never hard-code colours.
- `packages/ui/tokens.json` is a verbatim copy of the design system's tokens. After updating it run `pnpm --filter @dsaster/ui tokens`; `src/styles/tokens.css` and `src/styles/tailwind.css` are generated, never edited by hand. `src/components/internal/icons.tsx` is generated from the design system's icon bundle.
- Every component has a Storybook story beside it (`src/components/<Name>.stories.tsx`); add or update stories with the component, one story per documented state.
- The package must stay framework-agnostic and self-contained (no `@/` alias, no Next.js imports, relative forward imports only) so it can be extracted into its own repository or git submodule unchanged.
- `pnpm lint`, `pnpm format`, `pnpm test` and `pnpm build` run from `src/dsaster-front/` already cover `packages/ui`.

## Generated API Clients

- API client code under `api/` is automatically generated by Orval (`pnpm api`) from backend OpenAPI schemas.
- Do not edit generated API clients manually.
- `api/**` is ignored by ESLint and Prettier, but tracked in git.

## Git & PR Conventions

- **Branch Naming**: `{type}/#n` where `n` is the issue number:
  - Feature: `feat/#n` (e.g., `feat/#123`)
  - Bugfix: `fix/#n`
  - Task: `task/#n`
- **Commit Messages**: Follow Conventional Commits format (e.g., `feat: ...`, `fix: ...`, `chore: ...`).
- **PR Target**: Always target pull requests to `main`.
