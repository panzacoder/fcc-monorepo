# Phase 2: Developer Experience & CI Foundation — Design

**GH Issue:** [#99](https://github.com/panzacoder/fcc-monorepo/issues/99)
**Branch:** `chore/99-phase2-dx-ci`
**Depends on:** Phase 1 (merged via PR #115)

---

## 2A + 2D: GitHub Actions CI + Turbo Pipelines

CI and turbo are designed together — CI runs turbo commands that fan out across workspaces.

### turbo.json Pipelines

Add `lint` and `typecheck` pipelines alongside existing `build`:

- `lint` — runs each workspace's `lint` script
- `typecheck` — runs `tsc --noEmit` per workspace
- `build` — already exists (Next.js outputs)

### CI Workflow (`.github/workflows/ci.yml`)

**Triggers:** PRs to `main` + pushes to `main`

**Setup:** `checkout` → `setup-node` (v20) → `yarn install` with dependency caching

**Jobs (parallel):**

1. `lint` — `turbo run lint`
2. `typecheck` — `turbo run typecheck`
3. `format` — `prettier --check .` (repo-wide, not per-workspace)
4. `build` — `turbo run build` (Next.js build)
5. `build-storybook` — `yarn web:sb:build`

No test job yet (Phase 5).

### Per-Workspace Scripts

Each workspace gets `lint` and `typecheck` scripts in its `package.json`:

- `apps/next` — `lint` already exists (`next lint`), add `typecheck`
- `apps/expo` — add `lint` (`eslint .`) and `typecheck` (`tsc --noEmit`)
- `packages/app` — add `lint` (`eslint .`) and `typecheck` (`tsc --noEmit`)

---

## 2B: ESLint Expansion

### Current State

Single `.eslintrc.js` at root extending `next`. Only `apps/next` is linted.

### Changes

**Root `.eslintrc.js`** — add rules (all `warn` level):

- `no-console: warn` (flags 389 console.log calls)
- `@typescript-eslint/no-explicit-any: warn` (flags ~600 `: any` usages)
- `no-restricted-imports` — warn on direct imports from `app/redux/store` (force hooks)

**Per-workspace configs:**

- `apps/expo/.eslintrc.js` — extends root, adds React Native specifics
- `packages/app/.eslintrc.js` — extends root

**New dependencies (root):**

- `@typescript-eslint/eslint-plugin`
- `@typescript-eslint/parser`

All rules set to `warn` — visibility into tech debt, not enforcement. Tighten to `error` as code is cleaned in future phases.

---

## 2C: StateLoader Cross-Platform

### Current State

Single `stateLoader.ts` using `localStorage` directly — web-only, crashes on React Native.

### Changes

Split into platform variants (both async for consistent interface):

- `stateLoader.ts` — shared types/interface
- `stateLoader.web.ts` — `localStorage` wrapped in async
- `stateLoader.native.ts` — `@react-native-async-storage/async-storage`

**Interface:**

- `loadState(): Promise<State>`
- `saveState(state: State): Promise<void>`
- `initializeState(): State`

**Consumer update:** `packages/app/redux/store.ts` updated to `await` store hydration (runs once at startup).

`AsyncStorage` already installed in `apps/expo` — no new dependency needed.
