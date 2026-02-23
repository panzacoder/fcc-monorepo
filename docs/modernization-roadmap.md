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
| **4**  | [**#101**](https://github.com/panzacoder/fcc-monorepo/issues/101) | **Data Layer Modernization**             | **Done** (branch `fix/gh-101/phase4-data-layer`, pending PR)              |
| **5**  | [**#102**](https://github.com/panzacoder/fcc-monorepo/issues/102) | **Testing Foundation**                   | **Ready** (Phase 4 done)                                                  |
| 6      | [#103](https://github.com/panzacoder/fcc-monorepo/issues/103)     | TypeScript Strictness                    | Blocked by Phase 5                                                        |
| 7      | [#104](https://github.com/panzacoder/fcc-monorepo/issues/104)     | Screen Decomposition & Cleanup           | Blocked by Phase 6                                                        |
| 8A     | [#105](https://github.com/panzacoder/fcc-monorepo/issues/105)     | Expo SDK 50 → 55                         | Ready (Phase 2 done)                                                      |
| 8B     | [#106](https://github.com/panzacoder/fcc-monorepo/issues/106)     | Next.js 14 → 16                          | Ready (Phase 2 done)                                                      |
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
