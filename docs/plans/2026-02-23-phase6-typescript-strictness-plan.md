# Phase 6: TypeScript Strictness — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan.

**Goal:** Enable `strict: true` in tsconfig by progressively fixing all type errors.

**Architecture:** Enable zero-impact flags first, then fix files in dependency order (core → data → ui → features). Each batch stays under ~2500 lines of source to avoid context limits.

**Tech Stack:** TypeScript, Vitest (run tests between batches)

---

## Execution Strategy

Batches 1-5 are mechanical — subagents can execute without brainstorming.
Batches 6-13 are the `: any` / `Record<string, unknown>` bulk work.
Batch 14 is the final flag flip.

**Between every batch:** run `yarn workspace next-app typecheck` and `npx vitest run` to verify no regressions.

---

## Batch 1: Free Flags + tsconfig Cleanup (0 errors expected)

**Goal:** Enable 4 strict flags that produce zero errors, fix tsconfig divergence.

**Files:**

- Modify: `tsconfig.json`
- Modify: `apps/next/tsconfig.json`

**Changes:**

1. Add to root `tsconfig.json` compilerOptions:
   - `"strictBindCallApply": true`
   - `"strictPropertyInitialization": true`
   - `"noImplicitThis": true`
   - `"alwaysStrict": true`
2. Add `"noUncheckedIndexedAccess": true` to `apps/next/tsconfig.json` (align with root)
3. Verify: `yarn workspace next-app typecheck` passes

**Commit:** `chore: enable 4 zero-impact strict flags, align next tsconfig`

---

## Batch 2: .js → .ts Conversions + Redux `: any` (~11 files, ~300 lines)

**Goal:** Convert 4 remaining .js files and fix 7 redux `: any` usages.

**Files:**

- Convert: `redux/curenMemberAddress/currentMemberAddressAction.js` → `.ts`
- Convert: `redux/curenMemberAddress/currentMemberAddressReducer.js` → `.ts`
- Convert: `redux/curenMemberAddress/currentMemberAddressTypes.js` → `.ts`
- Convert: `utils/testIDs.js` → `.ts`
- Fix: `redux/rootReducer.ts` (1 any)
- Fix: `redux/header/headerReducer.ts` (1 any)
- Fix: `redux/header/headerAction.ts` (1 any)
- Fix: `redux/memberNames/memberNamesReducer.tsx` (1 any)
- Fix: `redux/memberNames/memberNamesAction.tsx` (1 any)
- Fix: `redux/messageList/messageListReducer.tsx` (1 any)
- Fix: `redux/messageList/messageListAction.tsx` (1 any)

**Commit:** `chore: convert .js files to .ts, fix redux :any types`

---

## Batch 3: `useUnknownInCatchVariables` + Enable Flag (~15 catch blocks)

**Goal:** Type all `catch` blocks, then enable the flag.

**Steps:**

1. Grep for `catch (` across packages/app (excluding tests)
2. Add `unknown` type annotation and narrow with `instanceof Error`
3. Enable `"useUnknownInCatchVariables": true` in root tsconfig
4. Verify typecheck passes

**Commit:** `chore: type catch blocks, enable useUnknownInCatchVariables`

---

## Batch 4: Core Data Types (~4 files, ~400 lines)

**Goal:** Fix foundational types that cascade to all modules.

**Files:**

- Modify: `data/base.ts` — `AuthHeader = any` → proper type, `data?: any` → typed
- Modify: `data/types.d.ts` (3 any) — shared response types
- Modify: `data/static.ts` (1 any)
- Modify: `data/states.ts` (1 any)

**Note:** The `AuthHeader` type needs to match what redux `headerState.header` actually contains. Read `redux/header/headerReducer.ts` and the login response to determine shape. `data?: any` in fetchData needs a `Record<string, unknown>` or generic constraint.

**Commit:** `chore: type AuthHeader, fetchData params, and shared data types`

---

## Batch 5: Data Modules — Light (5 modules, ~10 files, ~500 lines)

**Goal:** Replace `Record<string, unknown>` with proper types in small modules.

**Modules (sorted by count ascending):**

- `data/dashboard/` (1 R<s,u> in api, 5 any in types)
- `data/messages/` (3 R<s,u>: 1 types, 2 api)
- `data/prescriptions/` (5 R<s,u>: 2 types, 3 api)
- `data/caregivers/` (7 R<s,u>: 2 types, 5 api)
- `data/circle/` (5 R<s,u>: 5 types)

**Pattern:** For each module, read `types.ts` and `api.ts`, replace `Record<string, unknown>` params with specific param interfaces, and `fetchData<Record<string, unknown>>` with specific response types. Use the existing `types.ts` interfaces as starting points — many already have partial type definitions.

**Commit:** `chore: type dashboard, messages, prescriptions, caregivers, circle data modules`

---

## Batch 6: Data Modules — Medium (4 modules, ~8 files, ~600 lines)

**Modules:**

- `data/locations/` (10 R<s,u>: 4 types, 6 api)
- `data/incidents/` (11 R<s,u>: 4 types, 7 api)
- `data/facilities/` (13 R<s,u>: 6 types, 7 api)
- `data/doctors/` (14 R<s,u>: 7 types, 7 api)

**Commit:** `chore: type locations, incidents, facilities, doctors data modules`

---

## Batch 7: Data Modules — Heavy (5 modules, ~10 files, ~1000 lines)

**Modules:**

- `data/payment/` (15 R<s,u>: 9 types, 6 api + 2 any in types)
- `data/auth/` (15 R<s,u> in types)
- `data/medical-devices/` (16 R<s,u>: 5 types, 11 api)
- `data/profile/` (18 R<s,u>: 4 types, 14 api + 8 `[key: string]: any` interfaces)
- `data/events/` (19 R<s,u>: 8 types, 11 api)

**Note:** `profile/types.ts` has 8 interfaces with `[key: string]: any` — these need actual property definitions based on API usage in feature screens.

**Commit:** `chore: type payment, auth, medical-devices, profile, events data modules`

---

## Batch 8: Data Modules — Heaviest + hooks (2 modules, ~5 files, ~600 lines)

**Modules:**

- `data/transportation/` (38 R<s,u>: 18 types, 20 api)
- `data/appointments/` (22 R<s,u>: 5 types, 16 api, 1 hooks)

**Commit:** `chore: type transportation and appointments data modules`

---

## Batch 9: utils/ + redux stateLoader (~5 files, ~400 lines)

**Files:**

- Fix: `utils/getUserPemissions.tsx` (1 any)
- Fix: `utils/timer.tsx` (3 any)
- Fix: `redux/stateLoader.ts` (3 R<s,u>)
- Fix: `redux/stateLoader.native.ts` (1 R<s,u>)

**Commit:** `chore: type utils and stateLoader`

---

## Batch 10: ui/ Components — Light (~13 files, 1-5 any each, ~1500 lines)

**Files (grouped by proximity):**

- `ui/tabs-header/index.tsx` (5)
- `ui/circleCard/index.tsx` (3)
- `ui/PtsDropdown.tsx` (2)
- `ui/cardViews/index.tsx` (2)
- `ui/cardview/index.tsx` (2)
- `ui/sharedContactList/index.tsx` (1)
- `ui/PtsNameInitials.tsx` (1)
- `ui/PtsComboBox/index.tsx` (1)
- `ui/PtsBackHeader.tsx` (1)
- `ui/newCirclesList/index.tsx` (1)
- `ui/form-fields/address-fields.tsx` (1)
- `ui/addMessageThread/index.tsx` (1)
- `ui/addEditReminder/index.tsx` (1)

**Commit:** `chore: type ui components (light batch)`

---

## Batch 11: ui/ Components — Heavy (~7 files, 7-18 any each, ~2000 lines)

**Files:**

- `ui/utils.ts` (18 any)
- `ui/transportation/index.tsx` (15)
- `ui/locationDetails/index.tsx` (15)
- `ui/expandableCalendarView/index.tsx` (11)
- `ui/addEditTransport/index.tsx` (10)
- `ui/addEditNote/index.tsx` (7)
- `ui/location/index.tsx` (7)

**Commit:** `chore: type ui components (heavy batch)`

---

## Batch 12: Features — Light (~20 files, 1-5 any each, ~2500 lines)

**Files:**

- `features/auth/login/screen.tsx` (1)
- `features/auth/forgot-password/set-password-form.tsx` (1)
- `features/auth/forgot-password/forgot-password-form.tsx` (1)
- `features/auth/signUp/screen.tsx` (5)
- `features/splash/screen.tsx` (4)
- `features/calendar/screen.tsx` (1)
- `features/profile/screen.tsx` (2)
- `features/createCircle/screen.tsx` (2)
- `features/editUserProfile/screen.tsx` (1)
- `features/editUserAddress/screen.tsx` (1)
- `features/refreFriend/screen.tsx` (1)
- `features/circleDetails/screen.tsx` (3)
- `features/circleDetails/today-card.tsx` (1)
- `features/circleDetails/circle-summary-card.tsx` (1)
- `features/circles/create/modal.tsx` (1)
- `features/addEditPrescription/calendar-view.tsx` (1)
- `features/facilityDetails/screen.tsx` (4)
- `features/addEditEvent/screen.tsx` (4)
- `features/addEditCaregiver/screen.tsx` (4)
- `features/notificationNoteMessage/screen.tsx` (5)

**Commit:** `chore: type feature screens (light batch)`

---

## Batch 13: Features — Medium A (~5 files, 5-9 any each, ~2100 lines)

**Files:**

- `features/doctorsList/screen.tsx` (5, 204 lines)
- `features/doctorDetails/screen.tsx` (5, 582 lines)
- `features/facilitiesList/screen.tsx` (5, 207 lines)
- `features/medicalDevicesList/screen.tsx` (5, 332 lines)
- `features/incidentsList/screen.tsx` (5, 347 lines)
- `features/caregiersList/screen.tsx` (7, 276 lines)
- `features/addEditDoctor/screen.tsx` (7, 461 lines)

**Commit:** `chore: type feature screens (medium A — lists and details)`

---

## Batch 14: Features — Medium B (~5 files, 8-10 any each, ~2200 lines)

**Files:**

- `features/addEditIncident/screen.tsx` (8, 320 lines)
- `features/addEditMedicalDevice/screen.tsx` (9, 289 lines)
- `features/eventsList/screen.tsx` (9, 519 lines)
- `features/addEditPrescription/screen.tsx` (10, 404 lines)
- `features/prescriptionsList/screen.tsx` (10, 468 lines)
- `features/addEditFacility/screen.tsx` (6, 441 lines)

**Commit:** `chore: type feature screens (medium B — forms and lists)`

---

## Batch 15: Features — Medium C (~4 files, 12-14 any each, ~2200 lines)

**Files:**

- `features/messages/screen.tsx` (12, 402 lines)
- `features/appointmentsList/screen.tsx` (12, 656 lines)
- `features/addEditLocation/screen.tsx` (13, 451 lines)
- `features/incidentDetails/screen.tsx` (13, 535 lines)

**Commit:** `chore: type feature screens (medium C)`

---

## Batch 16: Features — Heavy A (~3 files, 14-15 any each, ~1700 lines)

**Files:**

- `features/noteMessage/screen.tsx` (14, 587 lines)
- `features/addEditAppointment/screen.tsx` (14, 530 lines)
- `features/payment/screen.tsx` (15, 538 lines)

**Commit:** `chore: type feature screens (heavy A)`

---

## Batch 17: Features — Heavy B (~3 files, 15-17 any each, ~1700 lines)

**Files:**

- `features/home/screen.tsx` (15, 672 lines)
- `features/circles/screen.tsx` (16, 476 lines)
- `features/plans/screen.tsx` (17, 558 lines)

**Commit:** `chore: type feature screens (heavy B)`

---

## Batch 18: Features — Heaviest (~3 files, 19-28 any each, ~2700 lines)

**Files:**

- `features/consolidatedView/screen.tsx` (19, 820 lines)
- `features/medicalDevicesDetails/screen.tsx` (22, 730 lines)
- `features/appointmentDetails/screen.tsx` (28, 1128 lines)

**Commit:** `chore: type feature screens (heaviest)`

---

## Batch 19: Features — Second Heaviest (~1 file, 25 any, 915 lines)

**Files:**

- `features/eventDetails/screen.tsx` (25, 915 lines)

**Note:** Split from Batch 18 to keep context manageable. eventDetails + appointmentDetails together would be ~2050 lines with 53 any's — too much for one pass.

**Commit:** `chore: type eventDetails screen`

---

## Batch 20: `strictFunctionTypes` + Enable Flag (~20-50 errors)

**Goal:** Enable `strictFunctionTypes`, fix resulting errors.

**Steps:**

1. Enable flag in root tsconfig
2. Run typecheck, collect errors
3. Fix function type mismatches (likely in callback props and event handlers)
4. May need to adjust some TanStack Query generic parameters

**Commit:** `chore: enable strictFunctionTypes, fix type mismatches`

---

## Batch 21: `noImplicitAny` + `strict: true` (Final)

**Goal:** Enable `noImplicitAny`, fix any remaining errors, then flip to `strict: true`.

**Steps:**

1. Enable `noImplicitAny` in root tsconfig
2. Run typecheck — at this point, most `: any` should already be fixed from batches 2-19
3. Fix any remaining implicit `any` (callback parameters, destructured props, etc.)
4. Replace individual strict flags with `strict: true`
5. Remove redundant `strictNullChecks: true` and `noUncheckedIndexedAccess: true` (kept separately since they predate strict)
6. Final verification: typecheck + tests + lint + format

**Commit:** `feat: enable strict TypeScript — all strict flags active`

---

## Summary

| Batch | Scope                      | Files         | Est. `: any` / R<s,u> | Needs Brainstorm?    |
| ----- | -------------------------- | ------------- | --------------------- | -------------------- |
| 1     | Free flags + tsconfig      | 2             | 0                     | No                   |
| 2     | .js→.ts + redux            | ~11           | 7 any                 | No                   |
| 3     | useUnknownInCatchVariables | ~15 locations | ~15                   | No                   |
| 4     | Core data types            | 4             | 5 any                 | **Yes** (AuthHeader) |
| 5     | Data light                 | ~10           | 21 R<s,u>             | No                   |
| 6     | Data medium                | ~8            | 48 R<s,u>             | No                   |
| 7     | Data heavy                 | ~10           | 83 R<s,u> + 10 any    | **Maybe** (profile)  |
| 8     | Data heaviest              | ~5            | 60 R<s,u>             | No                   |
| 9     | utils + stateLoader        | ~5            | 4 any + 4 R<s,u>      | No                   |
| 10    | ui/ light                  | ~13           | 22 any                | No                   |
| 11    | ui/ heavy                  | ~7            | 83 any                | No                   |
| 12    | features light             | ~20           | 44 any                | No                   |
| 13    | features med A             | ~7            | 39 any                | No                   |
| 14    | features med B             | ~6            | 52 any                | No                   |
| 15    | features med C             | ~4            | 50 any                | No                   |
| 16    | features heavy A           | ~3            | 43 any                | No                   |
| 17    | features heavy B           | ~3            | 48 any                | No                   |
| 18    | features heaviest          | ~3            | 69 any                | **Maybe**            |
| 19    | eventDetails               | ~1            | 25 any                | No                   |
| 20    | strictFunctionTypes        | varies        | ~35                   | No                   |
| 21    | noImplicitAny + strict     | varies        | remainder             | No                   |
