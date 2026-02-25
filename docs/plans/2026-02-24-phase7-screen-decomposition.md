# Phase 7: Screen Decomposition & Cleanup — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Break monolithic 500–1200 line screens into composable, testable components; fix file/directory typos; extract shared permission and modal patterns.

**Architecture:** Each priority screen is decomposed into `hooks/useXxxData.ts` (data + mutations) + `components/XxxSection.tsx` (UI sections) + slim `screen.tsx` (~100–150 lines, orchestration only). Shared cross-screen patterns (`usePermissions`, `useModal`) land in `packages/app/utils/` first so every subsequent decomposition can use them.

**Tech Stack:** React, TypeScript strict, TanStack Query, Redux, React Hook Form + Zod, NativeWind, Expo Router, Vitest

---

## Task 0: Audit Summary (Pre-Completed)

Audit was done before implementation. Findings are incorporated into tasks below. No new priority screens were discovered beyond those in GH #104.

**Anti-patterns found:**

- `auth/signUp/screen.tsx`: 3 `useForm` instances (one unused `formMethods`), dual `control`/`control1`, magic index `setAddressObject(value, 6)`
- 19 screens: identical `useRef<PrivilegeAction[]>([])` + `useEffect` RBAC pattern → Task 2
- `appointmentDetails` ≈ `eventDetails`: ~95% structural duplication → Tasks 4 & 5
- 17 explicit `any` types remaining (Firebase, Stripe, `useState` initializations)
- 42 commented-out `console.log` calls across features/ui

---

## Task 1: Typo Renames

Do these first; they're breaking changes that affect imports and expo-router paths. One commit per rename so each is independently revertable.

### 1A: `getUserPemissions.tsx` → `getUserPermissions.tsx`

**Files:**

- Rename: `packages/app/utils/getUserPemissions.tsx` → `packages/app/utils/getUserPermissions.tsx`
- Update imports in all referencing files (22 files — every feature screen + `ui/note/index.tsx`)

**Step 1: Rename the file**

```bash
git mv packages/app/utils/getUserPemissions.tsx packages/app/utils/getUserPermissions.tsx
```

**Step 2: Find all import sites**

```bash
grep -r "getUserPemissions" packages/ apps/ --include="*.ts" --include="*.tsx" -l
```

**Step 3: Update each import**
Replace: `from 'app/utils/getUserPemissions'`
With: `from 'app/utils/getUserPermissions'`

**Step 4: Verify no typo remains**

```bash
grep -r "getUserPemissions" packages/ apps/ --include="*.ts" --include="*.tsx"
# Expected: no output
```

**Step 5: Typecheck**

```bash
npx tsc --noEmit
# Expected: same error count as before (348)
```

**Step 6: Commit**

```bash
git add -A
git commit -m "chore: rename getUserPemissions -> getUserPermissions"
```

---

### 1B: `curenMemberAddress/` → `currentMemberAddress/`

The `.ts` files inside were renamed in Phase 6 but the directory name still has the typo.

**Files:**

- Rename: `packages/app/redux/curenMemberAddress/` → `packages/app/redux/currentMemberAddress/`
- Update import in `packages/app/redux/rootReducer.ts`

**Step 1: Rename directory**

```bash
git mv packages/app/redux/curenMemberAddress packages/app/redux/currentMemberAddress
```

**Step 2: Find all import sites**

```bash
grep -r "curenMemberAddress" packages/ apps/ --include="*.ts" --include="*.tsx" -l
```

**Step 3: Update imports**
Replace: `from '../curenMemberAddress/...` (in rootReducer and any other importers)
With: `from '../currentMemberAddress/...`

**Step 4: Verify**

```bash
grep -r "curenMemberAddress" packages/ apps/ --include="*.ts" --include="*.tsx"
# Expected: no output
```

**Step 5: Typecheck + Commit**

```bash
npx tsc --noEmit
git add -A
git commit -m "chore: rename curenMemberAddress -> currentMemberAddress"
```

---

### 1C: `subcriptionAction.ts` → `subscriptionAction.ts`

**Files:**

- Rename: `packages/app/redux/userSubscription/subcriptionAction.ts` → `packages/app/redux/userSubscription/subscriptionAction.ts`
- Update import in `packages/app/redux/rootReducer.ts`

**Step 1: Rename**

```bash
git mv packages/app/redux/userSubscription/subcriptionAction.ts \
        packages/app/redux/userSubscription/subscriptionAction.ts
```

**Step 2: Update rootReducer.ts** — change the import path from `./userSubscription/subcriptionAction` to `./userSubscription/subscriptionAction`

**Step 3: Verify + typecheck + commit**

```bash
grep -r "subcriptionAction" packages/ apps/ --include="*.ts" --include="*.tsx"
# Expected: no output
npx tsc --noEmit
git add -A
git commit -m "chore: rename subcriptionAction -> subscriptionAction"
```

---

### 1D: `caregiersList/` → `caregiversList/`

Note: `apps/expo/app/(authenticated)/circles/caregiversList.tsx` is already correctly spelled (expo route file). Only the feature package directory has the typo.

**Files:**

- Rename: `packages/app/features/caregiersList/` → `packages/app/features/caregiversList/`
- Update import in `apps/expo/app/(authenticated)/circles/caregiversList.tsx`
- Search for any Next.js route referencing the old path

**Step 1: Rename**

```bash
git mv packages/app/features/caregiersList packages/app/features/caregiversList
```

**Step 2: Find import sites**

```bash
grep -r "caregiersList" packages/ apps/ --include="*.ts" --include="*.tsx" -l
```

**Step 3: Update imports** — change `from 'app/features/caregiersList/screen'` to `from 'app/features/caregiversList/screen'`

**Step 4: Verify + typecheck + commit**

```bash
grep -r "caregiersList" packages/ apps/ --include="*.ts" --include="*.tsx"
# Expected: no output
npx tsc --noEmit
git add -A
git commit -m "chore: rename caregiersList -> caregiversList"
```

---

### 1E: `refreFriend/` → `referFriend/`

Note: `apps/expo/app/(termsAndPolicy)/referFriend.tsx` is already correctly spelled. Only the feature package directory has the typo.

**Files:**

- Rename: `packages/app/features/refreFriend/` → `packages/app/features/referFriend/`
- Update any imports referencing the old path

**Step 1: Rename**

```bash
git mv packages/app/features/refreFriend packages/app/features/referFriend
```

**Step 2–4: Same pattern as 1D**

```bash
grep -r "refreFriend" packages/ apps/ --include="*.ts" --include="*.tsx" -l
# Update imports
grep -r "refreFriend" packages/ apps/ --include="*.ts" --include="*.tsx"
# Expected: no output
npx tsc --noEmit
git add -A
git commit -m "chore: rename refreFriend -> referFriend"
```

---

## Task 2: Extract `usePermissions()` Hook

Replace the `useRef<PrivilegeAction[]>([]) + useEffect` RBAC pattern used in 19 screens with a typed, reusable hook. Do this before decomposing priority screens so sections can use it directly.

**Files:**

- Create: `packages/app/utils/usePermissions.ts`
- Create: `packages/app/__tests__/utils/usePermissions.test.ts`
- Modify: 19 screens (listed in step 4)

**Current pattern in every screen:**

```tsx
const xxxPrivilegesRef = useRef<PrivilegeAction[]>([])
// in useEffect:
xxxPrivilegesRef.current = data?.domainObjectPrivileges?.Xxx ?? []
// in callbacks:
const { createPermission } = getUserPermission(xxxPrivilegesRef.current)
```

**Target pattern:**

```tsx
const xxxPrivileges = usePermissions(data?.domainObjectPrivileges, 'Xxx')
// in callbacks:
const { createPermission } = getUserPermission(xxxPrivileges)
```

**Step 1: Write the failing test**

Create `packages/app/__tests__/utils/usePermissions.test.ts`:

```ts
import { renderHook } from '@testing-library/react-hooks'
import { usePermissions } from 'app/utils/usePermissions'
import type { DomainPrivileges } from 'app/data/types.d'

describe('usePermissions', () => {
  it('returns empty array when domainObjectPrivileges is undefined', () => {
    const { result } = renderHook(() =>
      usePermissions(undefined, 'Appointment')
    )
    expect(result.current).toEqual([])
  })

  it('returns permissions for a matching key', () => {
    const privileges: DomainPrivileges = {
      Appointment: ['Read', 'Create']
    }
    const { result } = renderHook(() =>
      usePermissions(privileges, 'Appointment')
    )
    expect(result.current).toEqual(['Read', 'Create'])
  })

  it('tries keys in order and returns first match', () => {
    const privileges: DomainPrivileges = {
      IncidentNote: ['Read']
    }
    const { result } = renderHook(() =>
      usePermissions(privileges, 'INCIDENTNOTE', 'IncidentNote')
    )
    expect(result.current).toEqual(['Read'])
  })

  it('returns empty array when no key matches', () => {
    const privileges: DomainPrivileges = { Other: ['Read'] }
    const { result } = renderHook(() =>
      usePermissions(privileges, 'Appointment')
    )
    expect(result.current).toEqual([])
  })
})
```

**Step 2: Run test to confirm it fails**

```bash
npx vitest run packages/app/__tests__/utils/usePermissions.test.ts
# Expected: FAIL — cannot find module 'app/utils/usePermissions'
```

**Step 3: Implement the hook**

Create `packages/app/utils/usePermissions.ts`:

```ts
import { useMemo } from 'react'
import type { DomainPrivileges, PrivilegeAction } from 'app/data/types.d'

export function usePermissions(
  domainObjectPrivileges: DomainPrivileges | null | undefined,
  ...keys: string[]
): PrivilegeAction[] {
  return useMemo(() => {
    if (!domainObjectPrivileges) return []
    for (const key of keys) {
      const privs = domainObjectPrivileges[key]
      if (privs?.length) return privs
    }
    return []
  }, [domainObjectPrivileges]) // eslint-disable-line react-hooks/exhaustive-deps
}
```

**Step 4: Run test to confirm it passes**

```bash
npx vitest run packages/app/__tests__/utils/usePermissions.test.ts
# Expected: PASS (4 tests)
```

**Step 5: Migrate all 19 screens**

Screens using the pattern (search to confirm full list):

```bash
grep -r "useRef<PrivilegeAction" packages/app/features/ --include="*.tsx" -l
```

For each screen, the migration is:

1. Remove the `useRef<PrivilegeAction[]>([])` declarations
2. Remove the `xxxPrivilegesRef.current = ...` assignments in useEffect
3. Add `const xxxPrivileges = usePermissions(data?.domainObjectPrivileges, 'Xxx')` at the hook call site
4. Replace `xxxPrivilegesRef.current` → `xxxPrivileges` in all callbacks
5. Add `import { usePermissions } from 'app/utils/usePermissions'`
6. Remove `import type { PrivilegeAction } from 'app/data/types.d'` if no longer needed

Multi-key example (messages screen — tried MESSAGETHREAD then MessageThread):

```tsx
const messagePrivileges = usePermissions(
  threadsData?.domainObjectPrivileges,
  'MESSAGETHREAD',
  'MessageThread'
)
```

**Step 6: Typecheck**

```bash
npx tsc --noEmit
# Expected: same or fewer errors (removed useRef<any> casts)
```

**Step 7: Commit**

```bash
git add -A
git commit -m "feat: extract usePermissions() hook, migrate 19 screens"
```

---

## Task 3: Extract `useModal()` Hook

Replace repeated `useState(false)` + toggle + data state combos with a typed modal hook.

**Files:**

- Create: `packages/app/utils/useModal.ts`
- Create: `packages/app/__tests__/utils/useModal.test.ts`

**Current pattern (repeated in every detail screen):**

```tsx
const [isAddNote, setIsAddNote] = useState(false)
const [noteData, setNoteData] = useState<Partial<NoteItem>>({})
// open: setIsAddNote(true); setNoteData(item)
// close: setIsAddNote(false); setNoteData({})
```

**Target pattern:**

```tsx
const noteModal = useModal<NoteItem>()
// open: noteModal.open(item)
// close: noteModal.close()
// render: noteModal.isOpen, noteModal.data
```

**Step 1: Write the failing test**

Create `packages/app/__tests__/utils/useModal.test.ts`:

```ts
import { renderHook, act } from '@testing-library/react-hooks'
import { useModal } from 'app/utils/useModal'

describe('useModal', () => {
  it('starts closed with no data', () => {
    const { result } = renderHook(() => useModal<{ id: number }>())
    expect(result.current.isOpen).toBe(false)
    expect(result.current.data).toBeNull()
  })

  it('opens with data', () => {
    const { result } = renderHook(() => useModal<{ id: number }>())
    act(() => result.current.open({ id: 42 }))
    expect(result.current.isOpen).toBe(true)
    expect(result.current.data).toEqual({ id: 42 })
  })

  it('closes and clears data', () => {
    const { result } = renderHook(() => useModal<{ id: number }>())
    act(() => result.current.open({ id: 42 }))
    act(() => result.current.close())
    expect(result.current.isOpen).toBe(false)
    expect(result.current.data).toBeNull()
  })

  it('toggle flips isOpen', () => {
    const { result } = renderHook(() => useModal())
    act(() => result.current.toggle())
    expect(result.current.isOpen).toBe(true)
    act(() => result.current.toggle())
    expect(result.current.isOpen).toBe(false)
  })
})
```

**Step 2: Run test to confirm it fails**

```bash
npx vitest run packages/app/__tests__/utils/useModal.test.ts
# Expected: FAIL — cannot find module 'app/utils/useModal'
```

**Step 3: Implement**

Create `packages/app/utils/useModal.ts`:

```ts
import { useState, useCallback } from 'react'

export interface ModalState<T> {
  isOpen: boolean
  data: T | null
  open: (data: T) => void
  close: () => void
  toggle: () => void
}

export function useModal<T = void>(): ModalState<T> {
  const [isOpen, setIsOpen] = useState(false)
  const [data, setData] = useState<T | null>(null)

  const open = useCallback((d: T) => {
    setData(d)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setData(null)
  }, [])

  const toggle = useCallback(() => setIsOpen((v) => !v), [])

  return { isOpen, data, open, close, toggle }
}
```

**Step 4: Run test to confirm it passes**

```bash
npx vitest run packages/app/__tests__/utils/useModal.test.ts
# Expected: PASS (4 tests)
```

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add useModal() hook"
```

Note: `useModal` adoption in the priority screens is part of Tasks 4–7. Don't migrate all existing screens now — just create the hook so decompositions can use it.

---

## Task 4: Decompose `appointmentDetails/screen.tsx`

Target: 1268 lines → `screen.tsx` ≤ 150 lines (orchestration only).

**Files:**

- Create: `packages/app/features/appointmentDetails/hooks/useAppointmentDetailsData.ts`
- Create: `packages/app/features/appointmentDetails/components/AppointmentNotesSection.tsx`
- Create: `packages/app/features/appointmentDetails/components/AppointmentRemindersSection.tsx`
- Create: `packages/app/features/appointmentDetails/components/AppointmentTransportationSection.tsx`
- Modify: `packages/app/features/appointmentDetails/screen.tsx`

### 4A: Extract `useAppointmentDetailsData` hook

This hook owns all TanStack Query calls and mutation logic currently living in `screen.tsx`.

**Step 1: Create the hook file**

Create `packages/app/features/appointmentDetails/hooks/useAppointmentDetailsData.ts`:

```ts
import {
  useAppointmentDetails as useAppointmentDetailsQuery,
  useDeleteAppointment,
  useCreateAppointmentNote,
  useUpdateAppointmentNote,
  useDeleteAppointmentNote,
  useCreateAppointmentReminder,
  useUpdateAppointmentReminder,
  useDeleteAppointmentReminder,
  useUpdateAppointmentStatus,
  useSendCalendarInvite
} from 'app/data/appointments'
import {
  useCreateMessageThread,
  useThreadParticipants
} from 'app/data/messages'
import {
  useDeleteTransportation,
  useResendTransportationRequest,
  useCancelTransportationRequest
} from 'app/data/transportation'
import { useAllMemberDetails } from 'app/data/circle'
import { useAppSelector } from 'app/redux/hooks'
import { usePermissions } from 'app/utils/usePermissions'

export function useAppointmentDetailsData(
  header: string,
  appointmentId: number
) {
  const { data, isLoading, refetch } = useAppointmentDetailsQuery(
    header,
    appointmentId
  )

  const appointmentPrivileges = usePermissions(
    data?.domainObjectPrivileges,
    'Appointment'
  )
  const notePrivileges = usePermissions(
    data?.domainObjectPrivileges,
    'APPOINTMENTNOTE',
    'AppointmentNote'
  )
  const transportPrivileges = usePermissions(
    data?.domainObjectPrivileges,
    'Transportation'
  )

  return {
    data,
    isLoading,
    refetch,
    appointmentPrivileges,
    notePrivileges,
    transportPrivileges,
    // mutations
    deleteAppointment: useDeleteAppointment(header),
    createNote: useCreateAppointmentNote(header),
    updateNote: useUpdateAppointmentNote(header),
    deleteNote: useDeleteAppointmentNote(header),
    createReminder: useCreateAppointmentReminder(header),
    updateReminder: useUpdateAppointmentReminder(header),
    deleteReminder: useDeleteAppointmentReminder(header),
    updateStatus: useUpdateAppointmentStatus(header),
    sendCalendarInvite: useSendCalendarInvite(header),
    createMessageThread: useCreateMessageThread(header),
    deleteTransportation: useDeleteTransportation(header),
    resendTransportation: useResendTransportationRequest(header),
    cancelTransportation: useCancelTransportationRequest(header),
    allMemberDetails: useAllMemberDetails(header),
    threadParticipants: useThreadParticipants
  }
}
```

**Step 2: Typecheck after creating hook**

```bash
npx tsc --noEmit
```

**Step 3: Commit hook**

```bash
git add packages/app/features/appointmentDetails/hooks/
git commit -m "feat: extract useAppointmentDetailsData hook"
```

### 4B: Extract `AppointmentNotesSection`

Move the notes list + add/edit/delete modal logic out of screen.tsx.

**Step 1: Create component**

Create `packages/app/features/appointmentDetails/components/AppointmentNotesSection.tsx`.

Read `packages/app/features/appointmentDetails/screen.tsx` to identify:

- All JSX in the notes conditional block (search for `isShowNotes`)
- The `createMessageThread`, `editNote`, `deleteNote`, `messageThreadClicked` callbacks
- The `notesList`, `isAddNote`, `noteData` state

The component receives these as props. Example shape:

```tsx
interface AppointmentNotesSectionProps {
  appointmentId: number
  notesList: NoteItem[]
  notePrivileges: PrivilegeAction[]
  createNote: MutationFor<CreateAppointmentNoteInput>
  updateNote: MutationFor<UpdateAppointmentNoteInput>
  deleteNote: MutationFor<DeleteAppointmentNoteInput>
  createMessageThread: MutationFor<CreateMessageThreadInput>
  onRefetch: () => void
}
```

Use `useModal<NoteItem>()` for the add/edit modal state instead of separate `isAddNote`/`noteData` state.

**Step 2: Typecheck**

```bash
npx tsc --noEmit
```

**Step 3: Wire into screen.tsx** — replace the notes block in screen.tsx with `<AppointmentNotesSection ... />`

**Step 4: Typecheck again + commit**

```bash
npx tsc --noEmit
git add packages/app/features/appointmentDetails/
git commit -m "feat: extract AppointmentNotesSection component"
```

### 4C: Extract `AppointmentRemindersSection`

Same pattern as 4B for the reminders block.

- Identifies `isShowReminder`, `isAddRemider`, `reminderData`, `remindersList` state
- Callbacks: `editReminder`, `deleteReminder`
- Use `useModal<ReminderItem>()` for modal state

**Steps:** Same as 4B. Commit: `feat: extract AppointmentRemindersSection component`

### 4D: Extract `AppointmentTransportationSection`

Same pattern for the transportation block.

- Identifies `isShowTransportation`, `isAddTransportation`, `transportationData`, `transportationList` state
- Callbacks: deletion, resend, cancel, add transport
- Use `useModal<TransportItem>()` for modal state

**Steps:** Same as 4B. Commit: `feat: extract AppointmentTransportationSection component`

### 4E: Slim down `screen.tsx`

After extracting the 3 sections and the data hook, screen.tsx should:

- Declare `useAppointmentDetailsData(header, appointmentId)`
- Declare `useModal` for message thread
- Render `<AppointmentNotesSection>`, `<AppointmentRemindersSection>`, `<AppointmentTransportationSection>`, and the main details view
- Target: ≤ 200 lines

**Step 1: Read current screen.tsx** to identify any remaining state/logic not yet moved

**Step 2: Move remaining callbacks** into appropriate sections or the data hook

**Step 3: Typecheck**

```bash
npx tsc --noEmit
# Errors should be same or fewer
```

**Step 4: Commit**

```bash
git add packages/app/features/appointmentDetails/
git commit -m "refactor: slim appointmentDetails screen to orchestration only"
```

---

## Task 5: Decompose `eventDetails/screen.tsx`

`eventDetails` mirrors `appointmentDetails` almost exactly (no transportation section). Follow the same pattern as Task 4.

**Files:**

- Create: `packages/app/features/eventDetails/hooks/useEventDetailsData.ts`
- Create: `packages/app/features/eventDetails/components/EventNotesSection.tsx`
- Create: `packages/app/features/eventDetails/components/EventRemindersSection.tsx`
- Modify: `packages/app/features/eventDetails/screen.tsx`

**Step 1: Read `eventDetails/screen.tsx`** to identify the exact data hooks and mutations used (they differ from appointments — events use `useEventDetails`, `useCreateEventNote`, etc.)

**Step 2–4: Follow Task 4 sub-task pattern** (hooks → sections → slim screen)

**Each sub-extract gets its own commit:**

```bash
git commit -m "feat: extract useEventDetailsData hook"
git commit -m "feat: extract EventNotesSection component"
git commit -m "feat: extract EventRemindersSection component"
git commit -m "refactor: slim eventDetails screen to orchestration only"
```

---

## Task 6: Decompose `consolidatedView/screen.tsx`

This screen is structurally different — heavy date logic, week/day view switching, filter form. Decompose by concern.

**Files:**

- Create: `packages/app/features/consolidatedView/hooks/useConsolidatedViewData.ts`
- Create: `packages/app/features/consolidatedView/hooks/useWeekView.ts`
- Create: `packages/app/features/consolidatedView/components/ActivityFilterForm.tsx`
- Modify: `packages/app/features/consolidatedView/screen.tsx`

**Step 1: Read `consolidatedView/screen.tsx`** in full to understand:

- The 7 parallel `listDayXRef` objects and date range logic
- The week vs day view switching
- The filter form (Zod schema, fields)
- All TanStack Query calls

**Step 2: Extract `useConsolidatedViewData`** — all data fetching, no UI state

**Step 3: Extract `useWeekView`** — the 7-day parallel refs, date range calculations, navigation (prev/next week)

**Step 4: Extract `ActivityFilterForm`** — the filter modal and its Zod schema

**Step 5: Slim screen.tsx** to orchestration: use the 3 hooks/components, render view switcher

**Commits:**

```bash
git commit -m "feat: extract useConsolidatedViewData hook"
git commit -m "feat: extract useWeekView hook"
git commit -m "feat: extract ActivityFilterForm component"
git commit -m "refactor: slim consolidatedView screen to orchestration only"
```

---

## Task 7: Decompose `profile/screen.tsx`

**Files:**

- Create: `packages/app/features/profile/hooks/useProfileData.ts`
- Create: `packages/app/features/profile/components/` (sections TBD after reading)
- Modify: `packages/app/features/profile/screen.tsx`

**Step 1: Read `profile/screen.tsx`** in full to understand the structure before writing any code.

**Step 2: Identify natural section boundaries** (similar to appointmentDetails — likely: personal info, addresses, caregiver info, emergency contacts)

**Step 3: Extract data hook + section components** following the same pattern as Tasks 4–5.

**Commits:** One per extracted piece + final slim-down commit.

---

## Task 8: Clean up `auth/signUp/screen.tsx`

Fix the 3 anti-patterns identified in Task 0.

**File:** `packages/app/features/auth/signUp/screen.tsx`

### 8A: Remove unused `formMethods`

**Step 1: Read `signUp/screen.tsx`** lines 126–145 to confirm `formMethods` is indeed unused.

**Step 2: Delete the unused `useForm` call** (line 126 area):

```tsx
// DELETE this entire line:
const formMethods = useForm<Schema>({ ... })
```

**Step 3: Typecheck**

```bash
npx tsc --noEmit
```

**Step 4: Commit**

```bash
git add packages/app/features/auth/signUp/screen.tsx
git commit -m "fix: remove unused formMethods from signUp"
```

### 8B: Unify dual `useForm` into single form

Currently has `control` (main user fields) and `control1` (address fields) as separate `useForm` instances.

**Step 1: Read the full signUp screen** to understand both schemas and what each `control` manages.

**Step 2: Merge schemas** into a single Zod schema with nested `address` object (the `AddressFormData` type already exists at line 28).

**Step 3: Replace** `control` + `control1` with single `useForm<MergedSchema>()`.

**Step 4: Update JSX** — all `control={control1}` → `control={control}` with correct field paths.

**Step 5: Typecheck + commit**

```bash
npx tsc --noEmit
git add packages/app/features/auth/signUp/screen.tsx
git commit -m "refactor: unify signUp dual useForm into single form"
```

### 8C: Remove magic index from `setAddressObject`

`setAddressObject(value, 6)` uses `6` as a magic number for the address field index.

**Step 1: Read `setAddressObject` implementation** (line 182 area) to understand what index 6 means.

**Step 2: Replace the index** with a named constant or refactor to use the field name directly via RHF's `setValue`.

**Step 3: Typecheck + commit**

```bash
npx tsc --noEmit
git add packages/app/features/auth/signUp/screen.tsx
git commit -m "fix: remove magic index from signUp setAddressObject"
```

---

## Task 9: Fix Remaining Explicit `any` Types

17 explicit `any` usages remaining after Phase 6. These are concentrated in 6 files.

**Step 1: Find all remaining instances**

```bash
grep -rn ": any\b\|as any\b" packages/app/features/ packages/app/ui/ \
  --include="*.tsx" --include="*.ts"
```

**Step 2: Fix by file**

| File                             | Count | Fix                                                          |
| -------------------------------- | ----- | ------------------------------------------------------------ |
| `home/screen.tsx`                | 4     | Mutation param casts → use specific mutation input types     |
| `noteMessage/screen.tsx`         | 3     | Firebase message handler → type the Firebase message payload |
| `payment/screen.tsx`             | 2     | Stripe provider + error handler → `unknown` + type narrowing |
| `prescriptionDetails/screen.tsx` | 2     | `useState<Type>({}) as any` → `useState<Partial<Type>>({})`  |
| `memberProfile/screen.tsx`       | 2     | Same pattern                                                 |
| `caregiverDetails/screen.tsx`    | 2     | Same pattern                                                 |

**Step 3: Typecheck after each file**

```bash
npx tsc --noEmit
```

**Step 4: Commit**

```bash
git add -A
git commit -m "fix: remove remaining explicit any types"
```

---

## Task 10: Remove Commented `console.log` Calls

42 commented-out `console.log` calls across features and UI.

**Step 1: Find all instances**

```bash
grep -rn "// console\.log\|//console\.log" packages/app/features/ packages/app/ui/ \
  --include="*.tsx" --include="*.ts"
```

**Step 2: Delete each commented line** — these are dead code, not documentation.

**Step 3: Add ESLint rule** to prevent future accumulation. In the ESLint config (check which file — likely `apps/next/.eslintrc.js` or `packages/app/.eslintrc.js`):

```js
'no-console': 'warn'
```

**Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove commented console.log calls, add no-console lint rule"
```

---

## Task 11: Fix Remaining TypeScript Errors

348 errors remain from Phase 6 (pre-existing, not regressions). Concentrated in `addEdit*` screens and UI components.

**Step 1: Get current error breakdown**

```bash
npx tsc --noEmit 2>&1 | grep "^packages/" | sed 's/([0-9]*,[0-9]*).*//' | sort | uniq -c | sort -rn | head -20
```

**Step 2: Fix highest-count files first**

Priority order from audit:

1. `addEditFacility/screen.tsx` (12 errors) — undefined chaining on `FacilityDetailsResponse.facility`
2. `addEditEvent/screen.tsx` (10 errors) — strictNullChecks on state assignments
3. `addEditCaregiver/screen.tsx` (6 errors) — undefined property access
4. `locationDetails/index.tsx` (6 errors) — undefined property chains
5. `transportation/index.tsx` (7 errors) — empty string to enum/icon assignments
6. `addEditAppointment/screen.tsx` (5 errors) — dropdown callback type variance
7. `addEditDoctor/screen.tsx` (5 errors) — ref type mismatch

**Step 3: Common fix patterns**

For `string | undefined` not assignable to `string`:

```tsx
// Before:
const name = data.name // string | undefined
someFunc(name) // expects string
// After:
const name = data.name ?? ''
someFunc(name)
```

For `{}` not assignable to specific type:

```tsx
// Before:
const [address, setAddress] = useState({})
// After:
const [address, setAddress] = useState<Partial<AddressType>>({})
```

For empty string to icon union:

```tsx
// Before:
const icon = ''
// After:
const icon: IconName | null = null
```

**Step 4: Typecheck after each file**

```bash
npx tsc --noEmit 2>&1 | grep "^packages/" | wc -l
```

**Step 5: Commit per file or per batch**

```bash
git commit -m "fix: resolve TypeScript errors in addEdit screens"
```

---

## Final Verification

**Step 1: Full typecheck — target 0 errors in modified files, global count ≤ 200**

```bash
npx tsc --noEmit 2>&1 | grep "^packages/" | wc -l
```

**Step 2: ESLint**

```bash
yarn workspace next-app lint
```

**Step 3: Confirm all GH #104 acceptance criteria are met**

| Criterion                    | Check                                                                                                                        |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Task 0 audit complete        | ✓ documented above                                                                                                           |
| Decompose appointmentDetails | `wc -l packages/app/features/appointmentDetails/screen.tsx` ≤ 200                                                            |
| Decompose eventDetails       | `wc -l packages/app/features/eventDetails/screen.tsx` ≤ 200                                                                  |
| Decompose consolidatedView   | `wc -l packages/app/features/consolidatedView/screen.tsx` ≤ 200                                                              |
| Decompose profile            | `wc -l packages/app/features/profile/screen.tsx` ≤ 200                                                                       |
| Clean up signUp              | No dual useForm, no magic indices, no unused formMethods                                                                     |
| useModal() hook              | `packages/app/utils/useModal.ts` exists, tests pass                                                                          |
| Typo renames (all 5)         | `grep -r "getUserPemissions\|caregiersList\|refreFriend\|curenMemberAddress\|subcriptionAction" packages/ apps/` → no output |

**Step 4: Update roadmap doc and memory**

Update `docs/modernization-roadmap.md`:

- Phase 7 status: `Done (PR #xxx)`
- Add Phase 7 completion notes (hooks extracted, typos fixed, error count)

---

## Notes for Executor

- **Read before touching**: Always read the full target file before extracting. Screen structures vary even when they look similar.
- **One file at a time**: Each decomposition task modifies one large file. Don't refactor adjacent files unless directly required.
- **Typecheck after every commit**: Run `npx tsc --noEmit` before each commit. If error count increases, investigate before proceeding.
- **`useModal` not mandatory everywhere**: Tasks 4–7 should use it, but don't force-migrate screens that aren't being decomposed (Task 9 scope).
- **Tasks 9–11 are from the audit**: The GH issue says "address screens surfaced by Task 0." These are the surfaced items. They are in scope.
- **Test infra note**: The project has Vitest. The test setup file (`test/setup.ts`) is missing — if `npx vitest run` fails on setup, check `packages/app/vitest.config.ts` and create the setup file with the minimum needed (likely just `import '@testing-library/jest-dom'`).
