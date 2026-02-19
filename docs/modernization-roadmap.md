# FCC Monorepo — Modernization Roadmap

Local planning reference. All phases tracked as GitHub issues with `modernization` label.

---

## Status Overview

| Phase  | Issue                                                           | Title                                    | Status                                                                    |
| ------ | --------------------------------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------- |
| 0      | [#97](https://github.com/panzacoder/fcc-monorepo/issues/97)     | Triage Open PRs & Establish Baseline     | Done                                                                      |
| 1      | [#98](https://github.com/panzacoder/fcc-monorepo/issues/98)     | Security Hardening                       | Done ([PR #115](https://github.com/panzacoder/fcc-monorepo/pull/115))     |
| **2**  | [**#99**](https://github.com/panzacoder/fcc-monorepo/issues/99) | **Developer Experience & CI Foundation** | **Done** ([PR #116](https://github.com/panzacoder/fcc-monorepo/pull/116)) |
| 3      | [#100](https://github.com/panzacoder/fcc-monorepo/issues/100)   | State Management Remediation             | Blocked by Phase 2                                                        |
| 4      | [#101](https://github.com/panzacoder/fcc-monorepo/issues/101)   | Data Layer Modernization                 | Blocked by Phase 3                                                        |
| 5      | [#102](https://github.com/panzacoder/fcc-monorepo/issues/102)   | Testing Foundation                       | Blocked by Phase 2, 4                                                     |
| 6      | [#103](https://github.com/panzacoder/fcc-monorepo/issues/103)   | TypeScript Strictness                    | Blocked by Phase 4, 5                                                     |
| 7      | [#104](https://github.com/panzacoder/fcc-monorepo/issues/104)   | Screen Decomposition & Cleanup           | Blocked by Phase 3, 4, 6                                                  |
| 8A     | [#105](https://github.com/panzacoder/fcc-monorepo/issues/105)   | Expo SDK 50 → 55                         | Blocked by Phase 2                                                        |
| 8B     | [#106](https://github.com/panzacoder/fcc-monorepo/issues/106)   | Next.js 14 → 16                          | Blocked by Phase 2                                                        |
| 8C     | [#107](https://github.com/panzacoder/fcc-monorepo/issues/107)   | Redux → Zustand                          | Blocked by Phase 3                                                        |
| 8D     | [#108](https://github.com/panzacoder/fcc-monorepo/issues/108)   | Navigation Strategy (Solito)             | Blocked by Phase 4                                                        |
| 8E-F   | [#109](https://github.com/panzacoder/fcc-monorepo/issues/109)   | Replace moment-timezone & lodash         | Blocked by Phase 2                                                        |
| 8G     | [#110](https://github.com/panzacoder/fcc-monorepo/issues/110)   | Storybook 7 → 10                         | Blocked by Phase 2                                                        |
| 8H     | [#111](https://github.com/panzacoder/fcc-monorepo/issues/111)   | NativeWind → Uniwind + TW4               | Blocked by Phase 8A                                                       |
| 9      | [#112](https://github.com/panzacoder/fcc-monorepo/issues/112)   | Web App Buildout                         | Blocked by Phases 1-8                                                     |
| Future | [#114](https://github.com/panzacoder/fcc-monorepo/issues/114)   | Realtime Data Capabilities               | Blocked by Phase 4                                                        |

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

## Notes

- Sensitive long-term exploration tracked separately (see `git stash list` for `.future-exploration.md`).
- Backend team has visibility on this repo — keep GH issues focused on frontend modernization only.
- **EAS/Expo builds not yet in CI** — current pipeline covers web only (lint, typecheck, format, Next.js build). Add EAS Build CI after Expo SDK upgrade (Phase 8A, GH #105).
- **PR convention**: always include `Closes #<issue>` in PR body for auto-closing. Consider adding a PR template.
- **Node 24** set across CI, Vercel, `.mise.toml`, and `.nvmrc` as of Phase 2.
