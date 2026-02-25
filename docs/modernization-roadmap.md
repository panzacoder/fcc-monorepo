# FCC Monorepo — Modernization Roadmap

Local planning reference. All phases tracked as GitHub issues with `modernization` label.

---

## Status Overview

| Phase  | Issue                                                             | Title                                    | Status                                                                    |
| ------ | ----------------------------------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------- |
| 0      | [#97](https://github.com/panzacoder/fcc-monorepo/issues/97)       | Triage Open PRs & Establish Baseline     | Done                                                                      |
| 1      | [#98](https://github.com/panzacoder/fcc-monorepo/issues/98)       | Security Hardening                       | Done ([PR #115](https://github.com/panzacoder/fcc-monorepo/pull/115))     |
| **2**  | [**#99**](https://github.com/panzacoder/fcc-monorepo/issues/99)   | **Developer Experience & CI Foundation** | **Done** ([PR #116](https://github.com/panzacoder/fcc-monorepo/pull/116)) |
| **3**  | [**#100**](https://github.com/panzacoder/fcc-monorepo/issues/100) | **State Management Remediation**         | **Done** ([PR #118](https://github.com/panzacoder/fcc-monorepo/pull/118)) |
| **4**  | [**#101**](https://github.com/panzacoder/fcc-monorepo/issues/101) | **Data Layer Modernization**             | **Done** ([PR #119](https://github.com/panzacoder/fcc-monorepo/pull/119)) |
| **5**  | [**#102**](https://github.com/panzacoder/fcc-monorepo/issues/102) | **Testing Foundation**                   | **Done** ([PR #120](https://github.com/panzacoder/fcc-monorepo/pull/120)) |
| **6**  | [**#103**](https://github.com/panzacoder/fcc-monorepo/issues/103) | **TypeScript Strictness**                | **Done** (branch: `chore/gh-103/phase6-typescript-strictness`)            |
| 7      | [#104](https://github.com/panzacoder/fcc-monorepo/issues/104)     | Screen Decomposition & Cleanup           | Blocked by Phase 6                                                        |
| 8A     | [#105](https://github.com/panzacoder/fcc-monorepo/issues/105)     | Expo SDK 50 → 55                         | Ready (Phase 2 done)                                                      |
| **8B** | [**#106**](https://github.com/panzacoder/fcc-monorepo/issues/106) | **Next.js 14 → 16**                      | **Done** (branch: `chore/gh-106/nextjs-upgrade`)                          |
| 8C     | [#107](https://github.com/panzacoder/fcc-monorepo/issues/107)     | Redux → Zustand                          | Ready (Phase 3 done)                                                      |
| 8D     | [#108](https://github.com/panzacoder/fcc-monorepo/issues/108)     | Navigation Strategy (Solito)             | Ready (Phase 4 done)                                                      |
| 8E-F   | [#109](https://github.com/panzacoder/fcc-monorepo/issues/109)     | Replace moment-timezone & lodash         | Ready (Phase 2 done)                                                      |
| 8G     | [#110](https://github.com/panzacoder/fcc-monorepo/issues/110)     | Storybook 7 → 10                         | Ready (Phase 2 done)                                                      |
| 8H     | [#111](https://github.com/panzacoder/fcc-monorepo/issues/111)     | NativeWind → Uniwind + TW4               | Blocked by Phase 8A                                                       |
| 9      | [#112](https://github.com/panzacoder/fcc-monorepo/issues/112)     | Web App Buildout                         | Blocked by Phases 1-8                                                     |
| Future | [#114](https://github.com/panzacoder/fcc-monorepo/issues/114)     | Realtime Data Capabilities               | Ready (Phase 4 done)                                                      |

---

## Phase 2: Developer Experience & CI Foundation

**Goal**: Establish infrastructure that makes all subsequent work safer and faster.

**Dependency**: Phase 1 (merged via PR #115)

### 2A. GitHub Actions CI — `.github/workflows/ci.yml`

- [ ] Lint: `yarn workspace next-app lint`
- [ ] Type check: `tsc --noEmit`
- [ ] Format check: `prettier --check .`
- [ ] Web build: `yarn web:build`
- [ ] Storybook build: `yarn web:sb:build`

### 2B. Strengthen ESLint

- [ ] `no-console: warn` (flags 389 console.log calls)
- [ ] `@typescript-eslint/no-explicit-any: warn` (flags ~600 `: any` usages)
- [ ] `no-restricted-imports` for direct `store` imports (force hooks)
- [ ] Set to `warn` initially, tighten to `error` as code is cleaned

### 2C. Fix StateLoader Cross-Platform

- [ ] Create `.web.ts` / `.native.ts` variants of `packages/app/redux/stateLoader.ts`
- [ ] Native: `AsyncStorage`, Web: `localStorage`
- [ ] Current code uses bare `localStorage` which crashes silently on React Native

### 2D. Update turbo.json

- [ ] Add `lint`, `typecheck`, `test` pipelines alongside existing `build`

---

## Stale PR Context (Preserved in Issues)

| Original PR | Context Issue                                               | Summary                                    |
| ----------- | ----------------------------------------------------------- | ------------------------------------------ |
| #91         | [#94](https://github.com/panzacoder/fcc-monorepo/issues/94) | Navigation and address bug fixes (WIP)     |
| #92         | [#95](https://github.com/panzacoder/fcc-monorepo/issues/95) | Messaging bugs                             |
| #83         | [#96](https://github.com/panzacoder/fcc-monorepo/issues/96) | Firebase Cloud Messaging (FCM) integration |

---

## Scope Policy

**GH issue tasks are acceptance criteria.** Each phase's GH issue defines what must be delivered before the branch can merge. Items cannot be scoped out, deferred, or skipped without updating the GH issue, this roadmap, and getting explicit user approval. Planning sessions that propose cutting scope must flag it as a scope change, not silently omit it.

---

## Phase 1-5 Audit Findings (2026-02-23)

Full audit of all completed phases against their GH issue acceptance criteria.

**Fixed in this audit:**

- **Phase 3 (3C.1)**: `signUp/screen.tsx` had module-level `let selectedAddress` and function-level `let userPhone` — both refactored to `useRef`. Fixes shared/stale state bugs across remounts.

**Documented — no action needed now:**

- **Phase 1 (1A-3)**: "Investigate if API session token can replace stored credentials" — no documentation of investigation. App still stores email+password (securely via expo-secure-store). This is a research item that may inform the future auth migration (see `.claude/future-exploration.md`). No code fix needed.
- **Phase 2 (2A-6)**: Storybook CI build commented out — pre-existing `expo-secure-store`/`@unimodules/core` webpack incompatibility. Tracked for Phase 8G (GH #110).
- **Phase 5**: NativeWind transform config not yet needed (all tests are data-layer). Will be required when UI component tests are added.

**Bookkeeping**: PR #115 referenced `Closes #95` instead of `Closes #98`. Issue #98 was closed manually as COMPLETED — no action needed.

---

## Phase 8B Completion Notes (2026-02-25)

**Next.js upgraded 14.1.3 → 16.1.6** in two incremental steps (14→15, 15→16). React 18 retained — Next.js 16 peer deps accept `^18.2.0`, avoiding conflict with Expo SDK 50.

**Breaking changes addressed:**

- `middleware.ts` → `proxy.ts`, export `middleware` → `proxy` (v16 deprecation)
- `next lint` removed in v16 — lint script changed to `eslint .` (ESLint already available via root devDeps)
- `experimental.forceSwcTransforms` removed (no longer needed)
- Turbopack is default bundler in v16 — `--webpack` flag added to dev/build scripts (custom webpack config for react-native-web alias and font loading)
- `rewrites()` guard added for undefined `BASE_URL` (v15 validates destinations strictly)
- `tsconfig.json`: `jsx` changed from `preserve` to `react-jsx` (mandated by v16)

**No code changes needed in app routes or components** — the app doesn't use async request APIs (`cookies`, `headers`, `params`, `searchParams`), `next/font`, `legacyBehavior` on links, or any other deprecated patterns.

**Future considerations:**

- Turbopack migration: currently using `--webpack` flag. When `@expo/next-adapter` is updated or replaced, migrate webpack config to `turbopack.resolveAlias` and remove `--webpack` flag
- React 19: coordinate with Phase 8A (Expo SDK upgrade). `react-native-web` warns about deprecated `unmountComponentAtNode` and `render` imports from `react-dom` — will break on React 19
- `@expo/next-adapter` v6.0.0 is unchanged since 2022 — evaluate whether it's still needed or can be replaced with manual config

---

## Phase 6 Completion Notes (2026-02-23)

**`strict: true` enabled** in root `tsconfig.json`. Individual strict flags consolidated. 362 pre-existing errors remain (from earlier-batched files that need further typing, primarily `addEdit*` screens and `addEditFacility`/`addEditIncident`).

**21-batch execution plan** in `docs/plans/2026-02-23-phase6-typescript-strictness-plan.md`:

- Batches 1-5: Core flags, redux, catch variables, data types
- Batches 6-9: Data layer `Record<string, unknown>` → proper types
- Batches 10-11: UI components
- Batches 12-19: Feature screens (507 → ~0 `any` in modified files)
- Batch 20: `strictFunctionTypes` enabled + 14 function variance fixes
- Batch 21: `noImplicitAny` enabled + 50 implicit `any` fixes + `strict: true` flip

**Key patterns established:**

- `ComponentProps<typeof Component>['propName']` for callback type bridging under `strictFunctionTypes`
- `NoteDisplayData` / `ReminderDisplayData` interfaces in UI components with all-optional fields for broad compatibility
- `MutationFor<T>` utility type in `data/types.d.ts`
- Local interfaces in feature screens when data layer types don't fully model API responses

**362 remaining errors** are predominantly:

- `string | undefined` not assignable to `string` (strictNullChecks in addEdit\* forms)
- `{}` not assignable to specific types (untyped address/state objects in addEditFacility/addEditIncident)
- Missing properties on `FacilityDetailsResponse` (needs data layer type update)
- These should be addressed as part of Phase 7 (Screen Decomposition) or a dedicated cleanup pass

---

## Notes

- Sensitive long-term exploration tracked separately (see `git stash list` for `.future-exploration.md`).
- Backend team has visibility on this repo — keep GH issues focused on frontend modernization only.
- **EAS/Expo builds not yet in CI** — current pipeline covers web only (lint, typecheck, format, Next.js build). Add EAS Build CI after Expo SDK upgrade (Phase 8A, GH #105).
- **PR convention**: always include `Closes #<issue>` in PR body for auto-closing. Consider adding a PR template.
- **Node 24** set across CI, Vercel, `.mise.toml`, and `.nvmrc` as of Phase 2.
- **Redux persistence debouncing** tracked in [#117](https://github.com/panzacoder/fcc-monorepo/issues/117) — full store serialized on every dispatch with no debounce.
- **`no-restricted-imports` for store** upgraded to `error` as of Phase 3. Only `provider/redux/index.tsx` has an eslint-disable (legitimate Provider usage).
- **RBAC handling needs review**: API responses include `domainObjectPrivileges` (server-driven RBAC) parsed by `utils/getUserPemissions.tsx` (note: filename typo). Current usage is untyped (`useRef<any>`) and inconsistent across screens. Should be typed as a shared `DomainPrivileges` type in the data layer and potentially extracted into a `usePermissions` hook during Phase 7.
- **Phase 4 delivered 17 data modules**: appointments, auth, caregivers, circle, dashboard, doctors, events, facilities, incidents, locations, medical-devices, messages, payment, prescriptions, profile, transportation + base. All follow `types.ts/api.ts/hooks.ts/index.ts` pattern. Zero CallPostService calls remain in features/ui.
- **Phase 4 type safety gaps** (to address in Phase 6): `AuthHeader = any` and `data?: any` in `data/base.ts`, `Record<string, unknown>` used as params and return types across **all 14 domain modules** (~150+ instances, not just transportation/profile as originally noted), `profile/types.ts` has 8 interfaces with `[key: string]: any` index signatures (effectively untyped), `dashboard/types.ts` has 5 explicit `any` usages including `domainObjectPrivileges: any` despite `DomainPrivileges` type existing. These match pre-migration type safety — not regressions — but the scope is larger than originally documented.
- **QueryClient SSR concern**: Fixed in PR #119 — `QueryClient` now instantiated inside component via `useState(makeQueryClient)`. No longer a risk for Next.js SSR.
