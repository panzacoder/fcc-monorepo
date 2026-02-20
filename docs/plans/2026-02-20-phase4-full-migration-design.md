# Phase 4: Full CallPostService Migration — Design

**Goal:** Eliminate all ~119 CallPostService calls across 54 files, replacing them with TanStack Query hooks from typed data modules.

**Branch:** `fix/gh-101/phase4-data-layer` (continuing existing work)

## Current State

- 10 data modules built: appointments, auth, caregivers, doctors, events, facilities, incidents, medical-devices, messages, prescriptions
- 2 screens migrated as proof-of-concept: appointmentsList, appointmentDetails (partial — 6 CallPostService calls remain)
- 1 legacy circle module exists (raw functions, no hooks pattern)

## Execution Model

Domain-first waves. Each wave: (1) augment/build data modules as needed, (2) migrate all screens in that domain via parallel subagents. One commit per file.

## Wave Plan

### Wave 1 — Simple Existing Modules (12 screens)

Hooks already exist. Straightforward list/detail/addEdit pattern.

| Domain        | Screens                                                     | Est. CallPostService calls |
| ------------- | ----------------------------------------------------------- | -------------------------- |
| Doctors       | doctorsList, doctorDetails, addEditDoctor                   | 6                          |
| Facilities    | facilitiesList, facilityDetails, addEditFacility            | 6                          |
| Caregivers    | caregiersList, caregiverDetails, addEditCaregiver           | 6                          |
| Prescriptions | prescriptionsList, prescriptionDetails, addEditPrescription | 6                          |

**Module augmentation:** Check each module has hooks for all endpoints used by its screens. Add missing hooks before dispatching screen agents.

### Wave 2 — Complex Existing Modules (6 screens)

Hooks exist but detail screens are large with notes/reminders/messaging sub-operations.

| Domain    | Screens                                         | Est. CallPostService calls |
| --------- | ----------------------------------------------- | -------------------------- |
| Incidents | incidentsList, incidentDetails, addEditIncident | 8                          |
| Events    | eventsList, eventDetails, addEditEvent          | 13                         |

**Note:** eventDetails and incidentDetails follow the same pattern as appointmentDetails — notes CRUD, reminders CRUD, transportation, message threads. Cross-domain calls (messaging, transportation) stay as CallPostService until Wave 5.

### Wave 3 — Medical Devices + Messages + Auth (11 screens)

| Domain          | Screens                                                              | Est. CallPostService calls |
| --------------- | -------------------------------------------------------------------- | -------------------------- |
| Medical Devices | medicalDevicesList, medicalDevicesDetails, addEditMedicalDevice      | 11                         |
| Messages        | messages, noteMessage, notificationNoteMessage                       | 9                          |
| Auth            | login, signUp, verification, forgot-password-form, set-password-form | 6                          |

**Module augmentation:** Messages module may need additional hooks (GET_MEMBER_THREADS, GET_THREAD, UPDATE_MESSAGE_THREAD, UPDATE_THREAD_PARTICIPANTS). Auth module may need hooks for all auth operations.

### Wave 4 — New Modules: Circle + Profile (8 screens)

Build two new data modules, then migrate screens.

| Domain           | Screens                                                    | Est. CallPostService calls |
| ---------------- | ---------------------------------------------------------- | -------------------------- |
| Circle (rebuild) | circles, circleDetails, createCircle, circles/create/modal | 11                         |
| Profile (new)    | profile, editUserProfile, editUserAddress, memberProfile   | 14                         |

**New modules:**

- `packages/app/data/circle/` — rebuild with hooks pattern (types.ts, api.ts, hooks.ts, index.ts)
- `packages/app/data/profile/` — new module for user profile, subscriptions, account mgmt, referrals

**Note:** `refreFriend` uses REFER_FRIEND which maps to profile domain.

### Wave 5 — New Modules: Payment, Locations, Transportation, Dashboard (8 screens + 5 UI components)

Build four new data modules, then migrate screens and UI components.

| Domain               | Files                                  | Est. CallPostService calls |
| -------------------- | -------------------------------------- | -------------------------- |
| Payment (new)        | payment, plans                         | 6                          |
| Dashboard (new)      | home, calendar, consolidatedView       | 9                          |
| Locations (new)      | addEditLocation, ui/locationDetails    | 3                          |
| Transportation (new) | ui/addEditTransport, ui/transportation | 8+                         |
| Other                | refreFriend, splash, ui/tabs-header    | 3                          |

**New modules:**

- `packages/app/data/payment/` — plans, cards, subscriptions
- `packages/app/data/dashboard/` — home data, calendar, consolidated view, transportation approvals
- `packages/app/data/locations/` — doctor/facility locations, states/timezones
- `packages/app/data/transportation/` — requests, approvals, reminders (appointments & events)

### Wave 6 — Finish appointmentDetails + Final Sweep

Migrate the 6 remaining CallPostService calls in appointmentDetails using hooks from modules built in earlier waves (messaging, transportation, calendar invite, member details).

Final verification: `grep -r CallPostService packages/app/features/ packages/app/ui/` returns zero results.

## Data Module Pattern

Every module follows the established pattern:

```
packages/app/data/<domain>/
  types.ts    — TypeScript interfaces for params and responses
  api.ts      — Typed async functions wrapping fetchData<T>
  hooks.ts    — TanStack Query hooks (useQuery for reads, useMutation for writes)
  index.ts    — Barrel re-exports
```

## Per-Screen Migration Pattern

1. Replace CallPostService + URL constant imports with hook imports
2. Replace useCallback data-fetching functions with useQuery hooks
3. Replace imperative mutation functions with useMutation hooks
4. Add useEffect to process query data (privileges, lists, etc.)
5. Derive isLoading from hook isPending/isLoading states
6. Preserve all existing behavior: navigation, alerts, state updates

## Success Criteria

- Zero CallPostService calls in `packages/app/features/` and `packages/app/ui/`
- All existing navigation, alerts, and state management preserved
- Lint passes: `yarn workspace next-app lint`
