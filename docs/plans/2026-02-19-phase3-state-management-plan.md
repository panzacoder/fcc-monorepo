# Phase 3: State Management Remediation — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace all direct Redux store imports with React-Redux hooks so components properly re-render on state changes, and move module-level mutable state into component scope.

**Architecture:** File-by-file refactoring across 57 files. Each file gets all three fixes (getState → useAppSelector, dispatch → useAppDispatch, module-level let → useState/useRef) in one pass. Single PR with logically grouped commits.

**Tech Stack:** React-Redux 9 typed hooks (`useAppSelector`, `useAppDispatch`), React (`useState`, `useRef`, `useCallback`), ESLint rule enforcement.

---

## Pre-Flight

### Task 0: Create branch and verify CI baseline

**Files:**

- None (git operations only)

**Step 1: Create feature branch**

```bash
git checkout main
git pull origin main
git checkout -b feature/100-state-management-remediation
```

**Step 2: Verify CI passes on clean branch**

```bash
yarn workspace next-app lint
yarn format --check
```

Expected: Both pass (Phase 2 established this baseline).

**Step 3: Count current ESLint store import warnings**

```bash
yarn workspace next-app lint 2>&1 | grep "no-restricted-imports" | wc -l
```

Record this number — it should reach 0 by end of this work.

---

## Group A: Utility / Non-Component Files (3 files)

These files can't use hooks. Refactor to accept values as parameters.

### Task 1: Refactor `packages/app/data/base.ts`

**Files:**

- Modify: `packages/app/data/base.ts`
- Modify: All callers of `fetchData` (search for `import.*from.*app/data/base`)

**Step 1: Refactor `fetchData` to accept header as parameter**

In `packages/app/data/base.ts`:

- Remove `import store from 'app/redux/store'`
- Change the function signature to accept `header` as a parameter instead of reading from `store.getState().headerState.header` on line 25
- The header object is passed through to API calls

**Step 2: Update all callers**

Every file that calls `fetchData(...)` must now pass `header` as the first argument. These callers are React components that should already have `header` from `useAppSelector` (or will after their own refactoring). If a caller doesn't have `header` yet, add `useAppSelector` to get it.

**Step 3: Verify**

```bash
yarn workspace next-app lint 2>&1 | grep "data/base"
```

Expected: No restricted import warnings for this file.

**Step 4: Commit**

```bash
git add packages/app/data/base.ts
git commit -m "refactor: remove direct store import from data/base.ts (3A)"
```

---

### Task 2: Refactor `packages/app/data/static.ts`

**Files:**

- Modify: `packages/app/data/static.ts`

**Step 1: Remove store import and accept dispatch as parameter**

- Remove `import store from 'app/redux/store'`
- `fetchStaticData` calls `store.dispatch(staticDataAction.setStaticData(staticData))` on line 59
- Change signature to accept a `dispatch` function parameter
- Replace `store.dispatch(...)` with `dispatch(...)`

**Step 2: Update callers**

Callers should pass `dispatch` from `useAppDispatch()`.

**Step 3: Commit**

```bash
git add packages/app/data/static.ts
git commit -m "refactor: remove direct store import from data/static.ts (3A/3B)"
```

---

### Task 3: Refactor `packages/app/ui/utils.ts`

**Files:**

- Modify: `packages/app/ui/utils.ts`

**Step 1: Refactor `getTimezoneName` to accept state values as parameters**

- Remove `import store from '../redux/store'`
- The function reads `store.getState().userProfileState.header.address` (line 173) and `store.getState().currentMemberAddress.currentMemberAddress` (line 176)
- Add parameters for these values: `userAddress` and `memberAddress`
- Update callers to pass these from `useAppSelector`

**Step 2: Commit**

```bash
git add packages/app/ui/utils.ts
git commit -m "refactor: remove direct store import from ui/utils.ts (3A)"
```

---

## Group B: Provider / Auth Files (2 files)

### Task 4: Refactor `packages/app/provider/auth-guard.tsx`

**Files:**

- Modify: `packages/app/provider/auth-guard.tsx`

**Step 1: Replace store.dispatch with useAppDispatch**

- Remove `import store from 'app/redux/store'`
- Add `import { useAppDispatch } from 'app/redux/hooks'`
- Inside the component: `const dispatch = useAppDispatch()`
- Replace `store.dispatch(resetStore())` (line 15) with `dispatch(resetStore())`

**Step 2: Commit**

```bash
git add packages/app/provider/auth-guard.tsx
git commit -m "refactor: use useAppDispatch in auth-guard (3B)"
```

---

### Task 5: Refactor `packages/app/provider/redux/index.tsx`

**Files:**

- Modify: `packages/app/provider/redux/index.tsx`

**Step 1: Audit**

This file imports `store` to pass to `<Provider store={store}>`. This is the one legitimate use of the store import — the Redux Provider needs the store object directly. **Keep this import as-is** but add an ESLint disable comment:

```tsx
// eslint-disable-next-line no-restricted-imports -- Redux Provider requires the store object
import store, { hydrateStore } from 'app/redux/store'
```

**Step 2: Commit**

```bash
git add packages/app/provider/redux/index.tsx
git commit -m "refactor: add eslint-disable for legitimate store import in Provider (3A)"
```

---

## Group C: Auth & Splash — Heavy Dispatch Files (2 files)

These files have many `store.dispatch()` calls but no `store.getState()`.

### Task 6: Refactor `packages/app/features/auth/login/screen.tsx`

**Files:**

- Modify: `packages/app/features/auth/login/screen.tsx`

**Step 1: Replace all store.dispatch calls with useAppDispatch**

- Remove `import store from 'app/redux/store'`
- Add `import { useAppDispatch } from 'app/redux/hooks'`
- Inside component: `const dispatch = useAppDispatch()`
- Replace all `store.dispatch(...)` calls (lines 73-96, ~6 dispatch calls) with `dispatch(...)`

**Step 2: Commit**

```bash
git add packages/app/features/auth/login/screen.tsx
git commit -m "refactor: use useAppDispatch in login screen (3B)"
```

---

### Task 7: Refactor `packages/app/features/splash/screen.tsx`

**Files:**

- Modify: `packages/app/features/splash/screen.tsx`

**Step 1: Replace all store.dispatch calls with useAppDispatch**

- Remove `import store from 'app/redux/store'`
- Add `import { useAppDispatch } from 'app/redux/hooks'`
- Inside component: `const dispatch = useAppDispatch()`
- Replace all `await store.dispatch(...)` calls (lines 177-210, ~6 dispatch calls) with `await dispatch(...)`

**Step 2: Move module-level let into component**

- Move `let notificationData = {} as any` (line 25) inside the component
- This stores Firebase notification data captured at startup — use `useRef` since it's set in callbacks and doesn't need to trigger re-renders:
  ```tsx
  const notificationDataRef = useRef<any>({})
  ```
- Update all reads/writes of `notificationData` to use `notificationDataRef.current`

**Step 3: Commit**

```bash
git add packages/app/features/splash/screen.tsx
git commit -m "refactor: use hooks in splash screen (3B/3C)"
```

---

## Group D: Shared UI Components (10 files)

### Task 8: Refactor `packages/app/ui/PtsBackHeader.tsx`

**Files:**

- Modify: `packages/app/ui/PtsBackHeader.tsx`

**Step 1: Replace store.getState with useAppSelector**

- Remove `import store from 'app/redux/store'`
- Add `import { useAppSelector } from 'app/redux/hooks'`
- Replace `const user = store.getState().userProfileState.header` (line 9) with:
  ```tsx
  const user = useAppSelector((state) => state.userProfileState.header)
  ```

**Step 2: Commit**

```bash
git add packages/app/ui/PtsBackHeader.tsx
git commit -m "refactor: use useAppSelector in PtsBackHeader (3A)"
```

---

### Task 9: Refactor `packages/app/ui/PtsNameInitials.tsx`

**Files:**

- Modify: `packages/app/ui/PtsNameInitials.tsx`

**Step 1: Replace store.getState**

- Replace `let memberNamesList: any = store.getState().memberNames.memberNamesList` (line 11) with:
  ```tsx
  const memberNamesList: any = useAppSelector(
    (state) => state.memberNames.memberNamesList
  )
  ```

**Step 2: Commit**

```bash
git add packages/app/ui/PtsNameInitials.tsx
git commit -m "refactor: use useAppSelector in PtsNameInitials (3A)"
```

---

### Task 10: Refactor `packages/app/ui/tabs-header/index.tsx`

**Files:**

- Modify: `packages/app/ui/tabs-header/index.tsx`

**Step 1: Replace both store.getState calls**

- Replace lines 47-48:
  ```tsx
  const user = useAppSelector((state) => state.userProfileState.header)
  const header = useAppSelector((state) => state.headerState.header)
  ```

**Step 2: Commit**

```bash
git add packages/app/ui/tabs-header/index.tsx
git commit -m "refactor: use useAppSelector in TabsHeader (3A)"
```

---

### Task 11: Refactor `packages/app/ui/cardViews/index.tsx`

**Files:**

- Modify: `packages/app/ui/cardViews/index.tsx`

**Step 1: Replace store.getState**

- Replace `let memberNamesList: any = store.getState().memberNames.memberNamesList` (line 14) with `const` + `useAppSelector`

**Step 2: Commit**

```bash
git add packages/app/ui/cardViews/index.tsx
git commit -m "refactor: use useAppSelector in CardView (3A)"
```

---

### Task 12: Refactor `packages/app/ui/circleCard/index.tsx`

**Files:**

- Modify: `packages/app/ui/circleCard/index.tsx`

**Step 1: Replace store.getState**

- Same pattern as Task 11 — replace `memberNamesList` read (line 14)

**Step 2: Commit**

```bash
git add packages/app/ui/circleCard/index.tsx
git commit -m "refactor: use useAppSelector in CircleCard (3A)"
```

---

### Task 13: Refactor `packages/app/ui/addEditNote/index.tsx`

**Files:**

- Modify: `packages/app/ui/addEditNote/index.tsx`

**Step 1: Replace store.getState**

- Replace `const staticData: any = store.getState().staticDataState.staticData` (line 25)

**Step 2: Move module-level let**

- Move `let occurance: any = ''` (line 18) into the component body as a local variable (it's set inside the component and only used there). Use a simple `let` inside the function body since it's derived on each render — or `useState` if it's set asynchronously.

**Step 3: Commit**

```bash
git add packages/app/ui/addEditNote/index.tsx
git commit -m "refactor: use hooks in addEditNote (3A/3C)"
```

---

### Task 14: Refactor `packages/app/ui/addEditTransport/index.tsx`

**Files:**

- Modify: `packages/app/ui/addEditTransport/index.tsx`

**Step 1: Replace all store.getState calls**

- Replace lines 51-53, 62 (4 getState calls) with `useAppSelector`

**Step 2: Move module-level lets**

- Move `let countryIndex = -1` (line 39) and `let stateIndex = -1` (line 40) into component as `useRef` (they're index trackers set in loops, not display state):
  ```tsx
  const countryIndexRef = useRef(-1)
  const stateIndexRef = useRef(-1)
  ```

**Step 3: Commit**

```bash
git add packages/app/ui/addEditTransport/index.tsx
git commit -m "refactor: use hooks in addEditTransport (3A/3C)"
```

---

### Task 15: Refactor `packages/app/ui/location/index.tsx`

**Files:**

- Modify: `packages/app/ui/location/index.tsx`

**Step 1: Replace store.getState**

- Replace `const header = store.getState().headerState.header` (line 22)

**Step 2: Commit**

```bash
git add packages/app/ui/location/index.tsx
git commit -m "refactor: use useAppSelector in Location (3A)"
```

---

### Task 16: Refactor `packages/app/ui/locationDetails/index.tsx`

**Files:**

- Modify: `packages/app/ui/locationDetails/index.tsx`

**Step 1: Replace store.getState calls**

- Replace `staticData` (line 40) and `memberAddress` (line 41-42) reads

**Step 2: Move 7 module-level lets into component**

Lines 30-36: `statesListFull`, `statesList`, `timezonesList`, `timeZoneListFull`, `countryIndex`, `stateIndex`, `timeZoneIndex`

This is a shared UI component — module-level state here is especially dangerous. The list arrays should be `useRef` (populated from API, don't trigger re-renders themselves). The index trackers should also be `useRef`.

```tsx
const statesListFullRef = useRef<any[]>([])
const statesListRef = useRef<Array<{ id: number; title: string }>>([])
const timezonesListRef = useRef<Array<{ id: number; title: string }>>([])
const timeZoneListFullRef = useRef<any[]>([])
const countryIndexRef = useRef(-1)
const stateIndexRef = useRef(-1)
const timeZoneIndexRef = useRef(-1)
```

Update all reads/writes to use `.current`.

**Step 3: Commit**

```bash
git add packages/app/ui/locationDetails/index.tsx
git commit -m "refactor: use hooks in locationDetails (3A/3C)"
```

---

### Task 17: Refactor `packages/app/ui/transportation/index.tsx`

**Files:**

- Modify: `packages/app/ui/transportation/index.tsx`

**Step 1: Replace store.getState**

- Replace `const header = store.getState().headerState.header` (line 36)

**Step 2: Commit**

```bash
git add packages/app/ui/transportation/index.tsx
git commit -m "refactor: use useAppSelector in Transportation (3A)"
```

---

### Task 18: Refactor `packages/app/ui/PtsDateTimePicker/index.tsx`

**Files:**

- Modify: `packages/app/ui/PtsDateTimePicker/index.tsx`

**Step 1: Move module-level lets into component**

Lines 15-16: `let selectedTime: any = new Date()` and `let selectedDate: any = new Date()` — these are overwritten on every render and are dangerous if multiple picker instances exist.

Move into component as `useRef`:

```tsx
const selectedTimeRef = useRef<any>(new Date())
const selectedDateRef = useRef<any>(new Date())
```

**Note:** This file does NOT import the store — it's 3C only.

**Step 2: Commit**

```bash
git add packages/app/ui/PtsDateTimePicker/index.tsx
git commit -m "refactor: move module-level lets into component in PtsDateTimePicker (3C)"
```

---

## Group E: Feature Screens — getState Only (30+ files)

These all follow the same pattern: replace `store.getState()` with `useAppSelector`, and move any module-level `let` into the component. I'll list them grouped by feature area with the specific changes needed.

### Task 19: Refactor home screen

**Files:**

- Modify: `packages/app/features/home/screen.tsx`

**Step 1: Replace getState + dispatch**

- Replace `memberNamesList` (lines 63-64), `header` (line 67), `user` (line 68) with `useAppSelector`
- Replace `store.dispatch(memberNamesAction.setMemberNames(...))` (lines 74, 118) with `dispatch(...)`

**Step 2: Commit**

```bash
git add packages/app/features/home/screen.tsx
git commit -m "refactor: use hooks in home screen (3A/3B)"
```

---

### Task 20: Refactor circles screens (3 files)

**Files:**

- Modify: `packages/app/features/circles/screen.tsx`
- Modify: `packages/app/features/circles/create/modal.tsx`
- Modify: `packages/app/features/circleDetails/screen.tsx`

**Step 1: circles/screen.tsx**

- Replace `memberNamesList` (line 44), `header` (line 45) with `useAppSelector`
- Replace `store.dispatch(...)` (lines 88, 102) with `dispatch(...)`

**Step 2: circles/create/modal.tsx**

- Replace `header` (line 26) with `useAppSelector`

**Step 3: circleDetails/screen.tsx**

- Replace `header` (line 25), `userDetails` (line 27) with `useAppSelector`
- Replace `store.dispatch(...)` (lines 96-100) with `dispatch(...)`

**Step 4: Commit**

```bash
git add packages/app/features/circles/ packages/app/features/circleDetails/
git commit -m "refactor: use hooks in circles screens (3A/3B)"
```

---

### Task 21: Refactor createCircle screen

**Files:**

- Modify: `packages/app/features/createCircle/screen.tsx`

**Step 1: Replace getState**

- Replace `header` (line 79) with `useAppSelector`

**Step 2: Move 4 module-level lets**

Lines 36-39: `email`, `fullName`, `timeZoneId`, `selectedAddress` — these are form state. Move into the component:

- `email` and `fullName`: `useRef` (set in callbacks, read for API submission)
- `timeZoneId`: `useRef` (set in address callback)
- `selectedAddress`: `useRef` (set in LocationDetails callback)

**Step 3: Commit**

```bash
git add packages/app/features/createCircle/
git commit -m "refactor: use hooks in createCircle screen (3A/3C)"
```

---

### Task 22: Refactor messages & noteMessage screens (3 files)

**Files:**

- Modify: `packages/app/features/messages/screen.tsx`
- Modify: `packages/app/features/noteMessage/screen.tsx`
- Modify: `packages/app/features/notificationNoteMessage/screen.tsx`

**Step 1: messages/screen.tsx**

- Replace `header` (line 29), `memberNamesList` (line 30) with `useAppSelector`
- Replace `store.dispatch(...)` (line 379) with `dispatch(...)` (line 176 is already commented out — leave as-is)

**Step 2: noteMessage/screen.tsx**

- Replace `header` (line 60), `userDetails` (line 61), `messageList` (line 194) with `useAppSelector`
- Replace `store.dispatch(...)` (lines 119, 151) with `dispatch(...)`

**Step 3: notificationNoteMessage/screen.tsx**

- Replace `header` (line 45), `userDetails` (line 46), `messageList` (line 102) with `useAppSelector`
- Replace `store.dispatch(...)` (line 78) with `dispatch(...)`

**Step 4: Commit**

```bash
git add packages/app/features/messages/ packages/app/features/noteMessage/ packages/app/features/notificationNoteMessage/
git commit -m "refactor: use hooks in messaging screens (3A/3B)"
```

---

### Task 23: Refactor consolidatedView screen

**Files:**

- Modify: `packages/app/features/consolidatedView/screen.tsx`

**Step 1: Replace getState**

- Replace `header` (line 50), `userDetails` (line 51) with `useAppSelector`

**Step 2: Move 15 module-level lets into component**

Lines 32-46. This is the biggest single refactor. Categorize:

**Filter state (triggers re-render when changed) → useState:**

- `selectedType` → `useState('All')`

**Date tracking (mutated frequently, drives API calls) → useState:**

- `fromDate` → `useState(getFullDateForCalendar(new Date(), 'YYYY-MM-DD'))`
- `toDate` → `useState(getFullDateForCalendar(new Date(), 'YYYY-MM-DD'))`
- `currentDate` → `useState(getFullDateForCalendar(new Date(), 'DD MMM YYYY'))`

**Derived week data (rebuilt on date changes, not displayed directly) → useRef:**

- `weekFirstLastDays` → `useRef([])`
- `weekDayListDates` → `useRef([])`
- `weekDayUtcDates` → `useRef([])`
- `weekDayList` → `useRef([])`

**Day lists (populated from API response, displayed in view) → useRef:**

- `listDayOne` through `listDaySeven` → `useRef([])` each

Update all reads/writes throughout the file.

**Step 3: Commit**

```bash
git add packages/app/features/consolidatedView/
git commit -m "refactor: use hooks in consolidatedView screen (3A/3C)"
```

---

### Task 24: Refactor appointment screens (3 files)

**Files:**

- Modify: `packages/app/features/appointmentsList/screen.tsx`
- Modify: `packages/app/features/appointmentDetails/screen.tsx`
- Modify: `packages/app/features/addEditAppointment/screen.tsx`

**Step 1: appointmentsList/screen.tsx**

- Replace `header` (line 65), `staticData` (line 67) with `useAppSelector`
- Move 6 module-level lets (lines 31-36) into component:
  - `appointmentPrivileges` → `useRef({})`
  - `selectedMonth`, `selectedYear`, `selectedType`, `doctorId`, `facilityId` → `useRef('All')` each (filter state set in callbacks)

**Step 2: appointmentDetails/screen.tsx**

- Replace `header` (line 60) with `useAppSelector`
- Move 3 module-level lets (lines 56-58) into component as `useRef({})`

**Step 3: addEditAppointment/screen.tsx**

- Replace `staticData` (line 49), `header` (line 65) with `useAppSelector`

**Step 4: Commit**

```bash
git add packages/app/features/appointmentsList/ packages/app/features/appointmentDetails/ packages/app/features/addEditAppointment/
git commit -m "refactor: use hooks in appointment screens (3A/3C)"
```

---

### Task 25: Refactor event screens (3 files)

**Files:**

- Modify: `packages/app/features/eventsList/screen.tsx`
- Modify: `packages/app/features/eventDetails/screen.tsx`
- Modify: `packages/app/features/addEditEvent/screen.tsx`

**Step 1: eventsList/screen.tsx**

- Replace `header` (line 50), `staticData` (line 51) with `useAppSelector`
- Move 3 lets (lines 31, 38-39): `eventsPrivileges` → `useRef({})`, `selectedMonth`/`selectedYear` → `useRef('All')`

**Step 2: eventDetails/screen.tsx**

- Replace `header` (line 70) with `useAppSelector`
- Move 3 lets (lines 47-49): `eventPrivileges`, `notePrivileges`, `transportationPrivileges` → `useRef({})`

**Step 3: addEditEvent/screen.tsx**

- Replace `header` (line 31) with `useAppSelector`

**Step 4: Commit**

```bash
git add packages/app/features/eventsList/ packages/app/features/eventDetails/ packages/app/features/addEditEvent/
git commit -m "refactor: use hooks in event screens (3A/3C)"
```

---

### Task 26: Refactor incident screens (3 files)

**Files:**

- Modify: `packages/app/features/incidentsList/screen.tsx`
- Modify: `packages/app/features/incidentDetails/screen.tsx`
- Modify: `packages/app/features/addEditIncident/screen.tsx`

**Step 1: incidentsList/screen.tsx**

- Replace `header` (line 41), `staticData` (line 42) with `useAppSelector`
- Move 3 lets (lines 25, 33-34): `incidentsPrivileges` → `useRef({})`, `selectedMonth`/`selectedYear` → `useRef('All')`

**Step 2: incidentDetails/screen.tsx**

- Replace `header` (line 54) with `useAppSelector`
- Move 2 lets (lines 41-42): `incidentPrivileges`, `notePrivileges` → `useRef({})`

**Step 3: addEditIncident/screen.tsx**

- Replace `header` (line 36), `staticData` (line 38) with `useAppSelector`
- Move 1 let (line 29): `incidentType` → `useRef('')`

**Step 4: Commit**

```bash
git add packages/app/features/incidentsList/ packages/app/features/incidentDetails/ packages/app/features/addEditIncident/
git commit -m "refactor: use hooks in incident screens (3A/3C)"
```

---

### Task 27: Refactor doctor screens (3 files)

**Files:**

- Modify: `packages/app/features/doctorsList/screen.tsx`
- Modify: `packages/app/features/doctorDetails/screen.tsx`
- Modify: `packages/app/features/addEditDoctor/screen.tsx`

**Step 1: doctorsList/screen.tsx**

- Replace `header` (line 27) with `useAppSelector`
- Move 1 let (line 19): `doctorPrivileges` → `useRef({})`

**Step 2: doctorDetails/screen.tsx**

- Replace `header` (line 38) with `useAppSelector`
- Move 1 let (line 36): `doctorPrivileges` → `useRef({})`

**Step 3: addEditDoctor/screen.tsx**

- Replace `staticData` (line 72), `header` (line 74) with `useAppSelector`
- Move 2 lets (lines 29, 67): `selectedAddress` → `useRef({...})`, `isDoctorActive` → `useRef(true)`

**Step 4: Commit**

```bash
git add packages/app/features/doctorsList/ packages/app/features/doctorDetails/ packages/app/features/addEditDoctor/
git commit -m "refactor: use hooks in doctor screens (3A/3C)"
```

---

### Task 28: Refactor facility screens (3 files)

**Files:**

- Modify: `packages/app/features/facilitiesList/screen.tsx`
- Modify: `packages/app/features/facilityDetails/screen.tsx`
- Modify: `packages/app/features/addEditFacility/screen.tsx`

**Step 1: facilitiesList/screen.tsx**

- Replace `header` (line 27) with `useAppSelector`
- Move 1 let (line 19): `facilityPrivileges` → `useRef({})`

**Step 2: facilityDetails/screen.tsx**

- Replace `header` (line 33) with `useAppSelector`
- Move 1 let (line 28): `facilityPrivileges` → `useRef({})`

**Step 3: addEditFacility/screen.tsx**

- Replace `staticData` (line 76), `header` (line 78) with `useAppSelector`
- Move 5 lets (lines 33-34, 71-73): `selectedType` → `useRef('')`, `selectedAddress` → `useRef({...})`, `isThisPharmacy` → `useRef(false)`, `isFacilityActive` → `useRef(true)`, `locationPhone` → `useRef('')`

**Step 4: Commit**

```bash
git add packages/app/features/facilitiesList/ packages/app/features/facilityDetails/ packages/app/features/addEditFacility/
git commit -m "refactor: use hooks in facility screens (3A/3C)"
```

---

### Task 29: Refactor prescription screens (3 files)

**Files:**

- Modify: `packages/app/features/prescriptionsList/screen.tsx`
- Modify: `packages/app/features/prescriptionDetails/screen.tsx`
- Modify: `packages/app/features/addEditPrescription/screen.tsx`

**Step 1: prescriptionsList/screen.tsx**

- Replace `header` (line 55), `staticData` (line 61) with `useAppSelector`
- Move 5 lets (lines 37-41): `prescriptionPrivileges` → `useRef({})`, `selectedType`/`selectedPrescriber`/`selectedPharmacy` → `useRef('All')`, `drugName` → `useRef('')`

**Step 2: prescriptionDetails/screen.tsx**

- Replace `header` (line 30) with `useAppSelector`
- Move 1 let (line 25): `prescriptionPrivileges` → `useRef({})`

**Step 3: addEditPrescription/screen.tsx**

- Replace `header` (line 42), `staticData` (line 96) with `useAppSelector`

**Step 4: Commit**

```bash
git add packages/app/features/prescriptionsList/ packages/app/features/prescriptionDetails/ packages/app/features/addEditPrescription/
git commit -m "refactor: use hooks in prescription screens (3A/3C)"
```

---

### Task 30: Refactor medical device screens (3 files)

**Files:**

- Modify: `packages/app/features/medicalDevicesList/screen.tsx`
- Modify: `packages/app/features/medicalDevicesDetails/screen.tsx`
- Modify: `packages/app/features/addEditMedicalDevice/screen.tsx`

**Step 1: medicalDevicesList/screen.tsx**

- Replace `header` (line 43), `staticData` (line 48) with `useAppSelector`
- Move 3 lets (lines 34-36): `selectedMonth`/`selectedYear` → `useRef('All')`, `medicalDevicesPrivileges` → `useRef({})`

**Step 2: medicalDevicesDetails/screen.tsx**

- Replace `header` (line 57) with `useAppSelector`
- Move 2 lets (lines 40-41): `medicalDevicePrivileges`, `notePrivileges` → `useRef({})`

**Step 3: addEditMedicalDevice/screen.tsx**

- Replace `staticData` (line 65), `header` (line 66) with `useAppSelector`
- Move 1 let (line 36): `doctorList` → `useRef([])`

**Step 4: Commit**

```bash
git add packages/app/features/medicalDevicesList/ packages/app/features/medicalDevicesDetails/ packages/app/features/addEditMedicalDevice/
git commit -m "refactor: use hooks in medical device screens (3A/3C)"
```

---

### Task 31: Refactor caregiver screens (3 files)

**Files:**

- Modify: `packages/app/features/caregiersList/screen.tsx`
- Modify: `packages/app/features/caregiverDetails/screen.tsx`
- Modify: `packages/app/features/addEditCaregiver/screen.tsx`

**Step 1: caregiersList/screen.tsx**

- Replace `header` (line 32) with `useAppSelector`
- Move 1 let (line 24): `caregiverPrivileges` → `useRef({})`

**Step 2: caregiverDetails/screen.tsx**

- Replace `header` (line 26) with `useAppSelector`
- Move 1 let (line 24): `caregiverPrivileges` → `useRef({})`

**Step 3: addEditCaregiver/screen.tsx**

- Replace `staticData` (line 54), `header` (line 55) with `useAppSelector`
- Move 3 lets (lines 33-34, 45): `profile` → `useRef('')`, `profileIndex` → `useRef(-1)`, `email` → `useRef('')`

**Step 4: Commit**

```bash
git add packages/app/features/caregiersList/ packages/app/features/caregiverDetails/ packages/app/features/addEditCaregiver/
git commit -m "refactor: use hooks in caregiver screens (3A/3C)"
```

---

### Task 32: Refactor remaining feature screens (7 files)

**Files:**

- Modify: `packages/app/features/plans/screen.tsx`
- Modify: `packages/app/features/payment/screen.tsx`
- Modify: `packages/app/features/profile/screen.tsx`
- Modify: `packages/app/features/editUserProfile/screen.tsx`
- Modify: `packages/app/features/editUserAddress/screen.tsx`
- Modify: `packages/app/features/memberProfile/screen.tsx`
- Modify: `packages/app/features/addEditLocation/screen.tsx`

**Step 1: plans/screen.tsx**

- Replace `header` (line 55), `userDetails` (line 58) with `useAppSelector`
- Move 1 let (line 44): `cardNumberWithoutDash` → `useRef('')`

**Step 2: payment/screen.tsx**

- Replace `header` (line 80), `userDetails` (line 81) with `useAppSelector`
- Replace all `store.dispatch(...)` (lines 253-276) with `dispatch(...)`
- Module-level lets for `StripeProvider`/`useStripe` (lines 45-46) are platform conditional imports at module level — these are NOT component state. Leave as-is since they're assigned once at module load, not reassigned in components.

**Step 3: profile/screen.tsx**

- Replace `header` (line 55), `userProfile` (line 56) with `useAppSelector`
- Move 1 let (line 53): `isShowRenewButton` → `useRef(false)`

**Step 4: editUserProfile/screen.tsx**

- Replace `user` (line 42), `header` (line 45) with `useAppSelector`
- Replace `store.dispatch(...)` (line 105) with `dispatch(...)`

**Step 5: editUserAddress/screen.tsx**

- Replace `header` (line 54) with `useAppSelector`
- Move 1 let (line 23): `selectedAddress` → `useRef({...})`

**Step 6: memberProfile/screen.tsx**

- Replace `header` (line 50) with `useAppSelector`

**Step 7: addEditLocation/screen.tsx**

- Replace `staticData` (line 55), `header` (line 57) with `useAppSelector`
- Move 2 lets (lines 51-52): `countryIndex`/`stateIndex` → `useRef(-1)`

**Step 8: Commit**

```bash
git add packages/app/features/plans/ packages/app/features/payment/ packages/app/features/profile/ packages/app/features/editUserProfile/ packages/app/features/editUserAddress/ packages/app/features/memberProfile/ packages/app/features/addEditLocation/
git commit -m "refactor: use hooks in remaining feature screens (3A/3B/3C)"
```

---

### Task 33: Refactor remaining screens (3 files)

**Files:**

- Modify: `packages/app/features/calendar/screen.tsx`
- Modify: `packages/app/features/refreFriend/screen.tsx`
- Modify: `packages/app/features/auth/signUp/screen.tsx`

**Step 1: calendar/screen.tsx**

- Replace `header` (line 27) with `useAppSelector`
- Move 1 let (line 21): `calendarPrivileges` → `useRef({})`

**Step 2: refreFriend/screen.tsx**

- Replace `header` (line 25) with `useAppSelector`

**Step 3: auth/signUp/screen.tsx**

- Move 1 let (line 28): `selectedAddress` → `useRef({...})`
- Note: Check if this file also imports store (it may only have the module-level let)

**Step 4: Commit**

```bash
git add packages/app/features/calendar/ packages/app/features/refreFriend/ packages/app/features/auth/signUp/
git commit -m "refactor: use hooks in calendar, referFriend, signUp screens (3A/3C)"
```

---

## Group F: Finalization

### Task 34: Tighten ESLint rule to error

**Files:**

- Modify: `.eslintrc.js`

**Step 1: Change no-restricted-imports severity**

Change the `no-restricted-imports` rule for `app/redux/store` from `warn` to `error`:

```js
'no-restricted-imports': ['error', {
  paths: [{
    name: 'app/redux/store',
    message: 'Use useAppSelector/useAppDispatch hooks from app/redux/hooks instead of importing store directly.'
  }]
}]
```

**Step 2: Verify lint passes**

```bash
yarn workspace next-app lint
```

Expected: 0 errors for `no-restricted-imports` (the only remaining import is in `provider/redux/index.tsx` which has an eslint-disable comment).

**Step 3: Run full CI check**

```bash
yarn format --check && yarn workspace next-app lint
```

Expected: All pass.

**Step 4: Commit**

```bash
git add .eslintrc.js
git commit -m "chore: tighten no-restricted-imports for store to error"
```

---

### Task 35: File persistence debouncing issue

**Files:**

- None (GitHub operations only)

**Step 1: Create GH issue**

```bash
gh issue create --title "[Performance] Add debouncing to Redux state persistence" \
  --body "## Problem

The store subscribes to all state changes and calls \`saveState()\` on every dispatch. The entire Redux state (all 10 slices) is serialized to localStorage/AsyncStorage on every single action with no debouncing or selective persistence.

## Suggested Fix

- Add debouncing (e.g., 500ms) to the \`store.subscribe()\` callback in \`packages/app/redux/store.ts\`
- Consider selective persistence — only persist slices that actually need to survive app restart (header, userProfile)

## Context

Discovered during Phase 3 (State Management Remediation). Not a correctness issue but a performance concern, especially on React Native where AsyncStorage writes are more expensive.

## Files

- \`packages/app/redux/store.ts\` (lines 11-13)" \
  --label "modernization,performance"
```

**Step 2: Update roadmap**

Add the new issue to the notes section of `docs/modernization-roadmap.md`.

**Step 3: Commit**

```bash
git add docs/modernization-roadmap.md
git commit -m "docs: add persistence debouncing issue reference to roadmap"
```

---

### Task 36: Update roadmap status

**Files:**

- Modify: `docs/modernization-roadmap.md`

**Step 1: Update Phase 3 status**

Change Phase 3 row from "Blocked by Phase 2" to "Done" with PR link. Update Phase 4 and 5 statuses since they were blocked by Phase 3/2 respectively.

**Step 2: Commit**

```bash
git add docs/modernization-roadmap.md
git commit -m "docs: update roadmap — mark Phase 3 done"
```

---

## Verification Checklist

After all tasks are complete:

- [ ] `yarn workspace next-app lint` passes with 0 errors
- [ ] `yarn format --check` passes
- [ ] No remaining `import store from 'app/redux/store'` except in `provider/redux/index.tsx`
- [ ] No remaining `store.getState()` calls in component files
- [ ] No remaining `store.dispatch()` calls in component files
- [ ] No module-level `let` declarations in feature/UI component files (except platform-conditional imports like `StripeProvider`)
- [ ] ESLint `no-restricted-imports` is set to `error`
- [ ] GH issue filed for persistence debouncing
